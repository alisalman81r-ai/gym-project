"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hasAdminSession } from "@/lib/auth";
import { addGalleryImage, deleteGalleryImage } from "@/lib/store/gallery";
import { saveUploadedImage, deleteUploadedImage, UploadError } from "@/lib/upload";

async function assertAdmin(): Promise<void> {
	if (!(await hasAdminSession())) redirect("/admin/login");
}

export interface GalleryFormState {
	error?: string;
	success?: boolean;
}

const MAX_CAPTION_LENGTH = 200;
const MAX_ALT_LENGTH = 200;

export async function addGalleryImageAction(
	_prevState: GalleryFormState | undefined,
	formData: FormData
): Promise<GalleryFormState> {
	await assertAdmin();

	const file = formData.get("image");
	const alt = String(formData.get("alt") ?? "").trim().slice(0, MAX_ALT_LENGTH);
	const caption = String(formData.get("caption") ?? "").trim().slice(0, MAX_CAPTION_LENGTH);

	if (!(file instanceof File) || file.size === 0) {
		return { error: "Please choose an image to upload." };
	}

	let url: string;
	try {
		url = await saveUploadedImage(file, "gallery");
	} catch (error) {
		return { error: error instanceof UploadError ? error.message : "Could not upload the image." };
	}

	addGalleryImage({
		url,
		alt: alt || "Iron Elite Fitness Club gallery photo",
		caption: caption || null,
	});

	revalidatePath("/admin/gallery");
	revalidatePath("/gallery");
	return { success: true };
}

export async function deleteGalleryImageAction(id: number): Promise<void> {
	await assertAdmin();
	const removed = deleteGalleryImage(id);
	if (removed) await deleteUploadedImage(removed.url);
	revalidatePath("/admin/gallery");
	revalidatePath("/gallery");
}
