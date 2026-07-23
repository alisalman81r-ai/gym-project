import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES: Record<string, string> = {
	"image/jpeg": "jpg",
	"image/png": "png",
	"image/webp": "webp",
	"image/gif": "gif",
};
const MAX_SIZE_BYTES = 8 * 1024 * 1024;
// Guards the `subfolder` argument -- it becomes part of a filesystem path,
// so restrict it to a simple slug rather than trusting arbitrary input.
const SUBFOLDER_PATTERN = /^[a-z0-9-]+$/;

export class UploadError extends Error {}

/**
 * Saves into public/uploads/<subfolder>/ so Next serves it directly -- no
 * external image host for this project. `subfolder` groups uploads by
 * feature (e.g. "products", "gallery").
 */
export async function saveUploadedImage(file: File, subfolder = "products"): Promise<string> {
	if (!SUBFOLDER_PATTERN.test(subfolder)) throw new UploadError("Invalid upload folder.");
	const ext = ALLOWED_TYPES[file.type];
	if (!ext) throw new UploadError(`Unsupported image type: ${file.type || "unknown"}.`);
	if (file.size > MAX_SIZE_BYTES) throw new UploadError("Image is larger than 8MB.");

	const dir = path.join(UPLOAD_ROOT, subfolder);
	await mkdir(dir, { recursive: true });
	const filename = `${randomUUID()}.${ext}`;
	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(path.join(dir, filename), buffer);
	return `/uploads/${subfolder}/${filename}`;
}

/**
 * Removes a previously uploaded file from disk. Only touches paths under
 * /uploads/ (files this app created) -- seeded assets under /images/ are
 * left alone, and anything outside /uploads/ is ignored as a safety net.
 * Never throws: a missing file is fine, and cleanup failures shouldn't
 * block the DB delete that already succeeded.
 */
export async function deleteUploadedImage(url: string): Promise<void> {
	if (!url.startsWith("/uploads/")) return;
	const relative = url.replace(/^\/uploads\//, "");
	// Reject path traversal before joining.
	if (relative.includes("..")) return;
	const filePath = path.join(UPLOAD_ROOT, relative);
	try {
		await unlink(filePath);
	} catch {
		// Already gone or unreadable -- nothing to clean up.
	}
}
