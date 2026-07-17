"use server";

import { revalidatePath } from "next/cache";
import { getCurrentCustomer } from "@/lib/customerAuth";
import { toggleWishlist } from "@/lib/store/wishlist";

export interface WishlistActionResult {
	error?: string;
	requiresLogin?: boolean;
	inWishlist?: boolean;
}

export async function toggleWishlistAction(productId: number): Promise<WishlistActionResult> {
	const customer = await getCurrentCustomer();
	if (!customer) return { error: "Sign in to save items to your wishlist.", requiresLogin: true };

	const inWishlist = toggleWishlist(customer.id, productId);
	revalidatePath("/account/wishlist");
	return { inWishlist };
}
