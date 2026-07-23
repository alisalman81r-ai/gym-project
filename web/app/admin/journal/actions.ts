"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hasAdminSession } from "@/lib/auth";
import { createBlogPost, updateBlogPost, deleteBlogPost, getBlogPostById, type BlogPostInput } from "@/lib/store/blog";
import { saveUploadedImage, deleteUploadedImage, UploadError } from "@/lib/upload";

async function assertAdmin(): Promise<void> {
	if (!(await hasAdminSession())) redirect("/admin/login");
}

export interface BlogFormState {
	error?: string;
}

/**
 * Builds the post input from the form, uploading a new image if one was
 * provided and otherwise falling back to `existingImage` (edit case).
 */
async function buildInput(
	formData: FormData,
	existingImage: string | null
): Promise<{ input: BlogPostInput } | { error: string }> {
	const title = String(formData.get("title") ?? "").trim();
	const category = String(formData.get("category") ?? "").trim();
	const excerpt = String(formData.get("excerpt") ?? "").trim();
	const body = String(formData.get("body") ?? "").trim();
	const author = String(formData.get("author") ?? "").trim();
	const date = String(formData.get("date") ?? "").trim();
	const readTime = String(formData.get("readTime") ?? "").trim();
	const imageAlt = String(formData.get("imageAlt") ?? "").trim();

	if (!title || !category || !excerpt || !body || !author || !date) {
		return { error: "Please fill in the title, category, excerpt, body, author, and date." };
	}

	const file = formData.get("image");
	let imageSrc = existingImage;
	if (file instanceof File && file.size > 0) {
		try {
			imageSrc = await saveUploadedImage(file, "blog");
		} catch (error) {
			return { error: error instanceof UploadError ? error.message : "Could not upload the cover image." };
		}
		// Replaced an uploaded image -- remove the old file.
		if (existingImage && existingImage !== imageSrc) await deleteUploadedImage(existingImage);
	}

	if (!imageSrc) {
		return { error: "Please add a cover image." };
	}

	return {
		input: { title, category, excerpt, body, author, date, readTime, imageSrc, imageAlt: imageAlt || title },
	};
}

export async function createBlogPostAction(_prevState: BlogFormState | undefined, formData: FormData): Promise<BlogFormState> {
	await assertAdmin();
	const result = await buildInput(formData, null);
	if ("error" in result) return { error: result.error };

	createBlogPost(result.input);
	revalidatePath("/admin/journal");
	revalidatePath("/blog");
	redirect("/admin/journal");
}

export async function updateBlogPostAction(
	id: number,
	_prevState: BlogFormState | undefined,
	formData: FormData
): Promise<BlogFormState> {
	await assertAdmin();
	const existing = getBlogPostById(id);
	if (!existing) return { error: "That post no longer exists." };

	const result = await buildInput(formData, existing.image.src);
	if ("error" in result) return { error: result.error };

	updateBlogPost(id, result.input);
	revalidatePath("/admin/journal");
	revalidatePath("/blog");
	revalidatePath(`/blog/${existing.slug}`);
	revalidatePath(`/admin/journal/${id}/edit`);
	redirect("/admin/journal");
}

export async function deleteBlogPostAction(id: number): Promise<void> {
	await assertAdmin();
	const removedImage = deleteBlogPost(id);
	if (removedImage) await deleteUploadedImage(removedImage);
	revalidatePath("/admin/journal");
	revalidatePath("/blog");
}
