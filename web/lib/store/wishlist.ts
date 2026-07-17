import { db } from "@/lib/db";
import type { Product } from "@/types";
import { getProductById } from "@/lib/store/products";

export function getWishlistProductIds(userId: number): number[] {
	const rows = db.prepare("SELECT product_id FROM wishlist_items WHERE user_id = ? ORDER BY id DESC").all(userId) as Array<{
		product_id: number;
	}>;
	return rows.map((row) => row.product_id);
}

export function getWishlist(userId: number): Product[] {
	return getWishlistProductIds(userId)
		.map((id) => getProductById(id))
		.filter((product): product is Product => product !== null);
}

export function isInWishlist(userId: number, productId: number): boolean {
	return Boolean(db.prepare("SELECT 1 FROM wishlist_items WHERE user_id = ? AND product_id = ?").get(userId, productId));
}

export function toggleWishlist(userId: number, productId: number): boolean {
	if (isInWishlist(userId, productId)) {
		db.prepare("DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?").run(userId, productId);
		return false;
	}
	db.prepare("INSERT OR IGNORE INTO wishlist_items (user_id, product_id) VALUES (?, ?)").run(userId, productId);
	return true;
}
