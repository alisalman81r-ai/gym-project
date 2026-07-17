"use server";

import { revalidatePath } from "next/cache";
import { getCurrentCustomer } from "@/lib/customerAuth";
import { createReview } from "@/lib/store/reviews";
import { getProductById } from "@/lib/store/products";
import { saveUploadedImage, UploadError } from "@/lib/upload";

export interface ReviewFormState {
	error?: string;
	success?: boolean;
}

export async function submitReviewAction(_prevState: ReviewFormState | undefined, formData: FormData): Promise<ReviewFormState> {
	const customer = await getCurrentCustomer();
	if (!customer) return { error: "Sign in to leave a review." };

	const productId = Number(formData.get("productId"));
	const rating = Number(formData.get("rating"));
	const comment = String(formData.get("comment") ?? "").trim();
	const image = formData.get("image");

	if (!productId || rating < 1 || rating > 5 || !comment) {
		return { error: "Please choose a rating and write a short review." };
	}

	let imageUrl: string | null = null;
	if (image instanceof File && image.size > 0) {
		try {
			imageUrl = await saveUploadedImage(image);
		} catch (error) {
			return { error: error instanceof UploadError ? error.message : "Could not upload the image." };
		}
	}

	createReview({ productId, userId: customer.id, customerName: customer.name, rating, comment, imageUrl });

	const product = getProductById(productId);
	if (product) revalidatePath(`/shop/${product.slug}`);

	return { success: true };
}
