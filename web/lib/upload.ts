import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
const ALLOWED_TYPES: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
	"image/gif": "gif",
};
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

export class UploadError extends Error {}

/** Saves into public/ so Next serves it directly -- no external image host for this project. */
export async function saveUploadedImage(file: File): Promise<string> {
	const ext = ALLOWED_TYPES[file.type];
	if (!ext) throw new UploadError(`Unsupported image type: ${file.type || "unknown"}.`);
	if (file.size > MAX_SIZE_BYTES) throw new UploadError("Image is larger than 8MB.");

	await mkdir(UPLOAD_DIR, { recursive: true });
	const filename = `${randomUUID()}.${ext}`;
	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(path.join(UPLOAD_DIR, filename), buffer);
	return `/uploads/products/${filename}`;
}
