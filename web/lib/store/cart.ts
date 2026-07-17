import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import type { CartItem, CartSummary } from "@/types";
import { getActiveCouponDiscount } from "@/lib/store/coupons";

export const CART_COOKIE = "cart_key";
export const CART_COUPON_COOKIE = "cart_coupon";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

export const SHIPPING_FLAT_RATE = 6.99;
export const FREE_SHIPPING_THRESHOLD = 75;

/** Read-only lookup for Server Components (which cannot set cookies). */
export async function getCartKeyReadonly(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get(CART_COOKIE)?.value ?? null;
}

/** Use from Route Handlers / Server Actions, which may set cookies. */
export async function getOrCreateCartKey(): Promise<string> {
	const cookieStore = await cookies();
	const existing = cookieStore.get(CART_COOKIE)?.value;
	if (existing) return existing;

	const key = randomBytes(16).toString("hex");
	cookieStore.set(CART_COOKIE, key, {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		maxAge: CART_COOKIE_MAX_AGE,
	});
	return key;
}

export async function getAppliedCouponCode(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get(CART_COUPON_COOKIE)?.value ?? null;
}

export async function setAppliedCouponCode(code: string | null): Promise<void> {
	const cookieStore = await cookies();
	if (code) {
		cookieStore.set(CART_COUPON_COOKIE, code, { httpOnly: true, sameSite: "lax", path: "/", maxAge: CART_COOKIE_MAX_AGE });
	} else {
		cookieStore.delete(CART_COUPON_COOKIE);
	}
}

interface CartItemRow {
	id: number;
	product_id: number;
	size: string | null;
	color: string | null;
	quantity: number;
	name: string;
	slug: string;
	price: number;
	discount_price: number | null;
	stock_quantity: number;
	image_url: string | null;
}

async function loadCartRows(cartKey: string | null): Promise<CartItemRow[]> {
	if (!cartKey) return [];
	return db
		.prepare(
			`SELECT
				ci.id, ci.product_id, ci.size, ci.color, ci.quantity,
				p.name, p.slug, p.price, p.discount_price, p.stock_quantity,
				(SELECT url FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC LIMIT 1) as image_url
			 FROM cart_items ci
			 JOIN products p ON p.id = ci.product_id
			 WHERE ci.cart_key = ?
			 ORDER BY ci.id ASC`
		)
		.all(cartKey) as CartItemRow[];
}

async function buildSummary(rows: CartItemRow[], couponCode: string | null): Promise<CartSummary> {
	const items: CartItem[] = rows.map((row) => {
		const unitPrice = row.discount_price ?? row.price;
		return {
			id: row.id,
			productId: row.product_id,
			name: row.name,
			slug: row.slug,
			image: row.image_url,
			price: unitPrice,
			size: row.size,
			color: row.color,
			quantity: row.quantity,
			stockQuantity: row.stock_quantity,
			lineTotal: Math.round(unitPrice * row.quantity * 100) / 100,
		};
	});

	const subtotal = Math.round(items.reduce((sum, item) => sum + item.lineTotal, 0) * 100) / 100;
	const discount = couponCode ? await getActiveCouponDiscount(couponCode, subtotal) : 0;
	const discountedSubtotal = Math.max(0, subtotal - discount);
	const shippingCost = items.length === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
	const total = Math.round((discountedSubtotal + shippingCost) * 100) / 100;

	return { items, subtotal, discount, couponCode: discount > 0 ? couponCode : null, shippingCost, total };
}

export async function getCartSummary(cartKey: string | null, couponCode: string | null): Promise<CartSummary> {
	const rows = await loadCartRows(cartKey);
	return buildSummary(rows, couponCode);
}

export async function getCartItemCount(cartKey: string | null): Promise<number> {
	if (!cartKey) return 0;
	const { total } = db
		.prepare("SELECT COALESCE(SUM(quantity), 0) as total FROM cart_items WHERE cart_key = ?")
		.get(cartKey) as { total: number };
	return total;
}

export function addCartItem(cartKey: string, productId: number, quantity: number, size: string | null, color: string | null): void {
	const existing = db
		.prepare(
			"SELECT id, quantity FROM cart_items WHERE cart_key = ? AND product_id = ? AND size IS ? AND color IS ?"
		)
		.get(cartKey, productId, size, color) as { id: number; quantity: number } | undefined;

	const product = db.prepare("SELECT stock_quantity FROM products WHERE id = ?").get(productId) as
		| { stock_quantity: number }
		| undefined;
	const stock = product?.stock_quantity ?? 0;

	if (existing) {
		const nextQuantity = Math.min(stock, existing.quantity + quantity);
		db.prepare("UPDATE cart_items SET quantity = ? WHERE id = ?").run(nextQuantity, existing.id);
	} else {
		db.prepare("INSERT INTO cart_items (cart_key, product_id, size, color, quantity) VALUES (?, ?, ?, ?, ?)").run(
			cartKey,
			productId,
			size,
			color,
			Math.min(stock, quantity)
		);
	}
}

export function updateCartItemQuantity(cartKey: string, itemId: number, quantity: number): void {
	if (quantity <= 0) {
		removeCartItem(cartKey, itemId);
		return;
	}
	const row = db
		.prepare(
			`SELECT p.stock_quantity as stock FROM cart_items ci JOIN products p ON p.id = ci.product_id WHERE ci.id = ? AND ci.cart_key = ?`
		)
		.get(itemId, cartKey) as { stock: number } | undefined;
	if (!row) return;

	db.prepare("UPDATE cart_items SET quantity = ? WHERE id = ? AND cart_key = ?").run(
		Math.min(row.stock, quantity),
		itemId,
		cartKey
	);
}

export function removeCartItem(cartKey: string, itemId: number): void {
	db.prepare("DELETE FROM cart_items WHERE id = ? AND cart_key = ?").run(itemId, cartKey);
}

export function clearCart(cartKey: string): void {
	db.prepare("DELETE FROM cart_items WHERE cart_key = ?").run(cartKey);
}
