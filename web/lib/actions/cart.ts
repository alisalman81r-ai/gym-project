"use server";

import { revalidatePath } from "next/cache";
import {
	getOrCreateCartKey,
	addCartItem,
	updateCartItemQuantity,
	removeCartItem,
	setAppliedCouponCode,
	getAppliedCouponCode,
	getCartSummary,
} from "@/lib/store/cart";
import { validateCouponForCheckout } from "@/lib/store/coupons";

export interface CartActionResult {
	error?: string;
}

export async function addToCartAction(
	productId: number,
	quantity: number,
	size: string | null,
	color: string | null
): Promise<CartActionResult> {
	if (quantity < 1) return { error: "Quantity must be at least 1." };
	const cartKey = await getOrCreateCartKey();
	addCartItem(cartKey, productId, quantity, size, color);
	revalidatePath("/cart");
	revalidatePath("/checkout");
	return {};
}

export async function updateCartItemQuantityAction(itemId: number, quantity: number): Promise<void> {
	const cartKey = await getOrCreateCartKey();
	updateCartItemQuantity(cartKey, itemId, quantity);
	revalidatePath("/cart");
	revalidatePath("/checkout");
}

export async function removeCartItemAction(itemId: number): Promise<void> {
	const cartKey = await getOrCreateCartKey();
	removeCartItem(cartKey, itemId);
	revalidatePath("/cart");
	revalidatePath("/checkout");
}

export interface CouponActionResult {
	success: boolean;
	message: string;
}

export async function applyCouponAction(_prevState: CouponActionResult | undefined, formData: FormData): Promise<CouponActionResult> {
	const code = String(formData.get("code") ?? "").trim();
	if (!code) return { success: false, message: "Enter a coupon code." };

	const cartKey = await getOrCreateCartKey();
	const summary = await getCartSummary(cartKey, null);
	const result = validateCouponForCheckout(code, summary.subtotal);

	if (!result.valid) return { success: false, message: result.message };

	await setAppliedCouponCode(code.toUpperCase());
	revalidatePath("/cart");
	revalidatePath("/checkout");
	return { success: true, message: result.message };
}

export async function removeCouponAction(): Promise<void> {
	await setAppliedCouponCode(null);
	revalidatePath("/cart");
	revalidatePath("/checkout");
}

export async function getCurrentCouponCode(): Promise<string | null> {
	return getAppliedCouponCode();
}
