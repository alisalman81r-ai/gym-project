import { db } from "@/lib/db";

export interface GalleryImageRecord {
	id: number;
	url: string;
	alt: string;
	caption: string | null;
	sortOrder: number;
}

interface GalleryRow {
	id: number;
	url: string;
	alt: string;
	caption: string | null;
	sort_order: number;
}

function mapRow(row: GalleryRow): GalleryImageRecord {
	return { id: row.id, url: row.url, alt: row.alt, caption: row.caption, sortOrder: row.sort_order };
}

export function listGalleryImages(): GalleryImageRecord[] {
	const rows = db.prepare("SELECT * FROM gallery_images ORDER BY sort_order ASC, id ASC").all() as GalleryRow[];
	return rows.map(mapRow);
}

export function getGalleryImage(id: number): GalleryImageRecord | null {
	const row = db.prepare("SELECT * FROM gallery_images WHERE id = ?").get(id) as GalleryRow | undefined;
	return row ? mapRow(row) : null;
}

export interface NewGalleryImage {
	url: string;
	alt: string;
	caption: string | null;
}

/** New images append to the end of the grid (highest sort_order). */
export function addGalleryImage(input: NewGalleryImage): GalleryImageRecord {
	const { maxOrder } = db.prepare("SELECT COALESCE(MAX(sort_order), -1) as maxOrder FROM gallery_images").get() as {
		maxOrder: number;
	};
	const result = db
		.prepare("INSERT INTO gallery_images (url, alt, caption, sort_order) VALUES (?, ?, ?, ?)")
		.run(input.url, input.alt, input.caption, maxOrder + 1);
	const row = db.prepare("SELECT * FROM gallery_images WHERE id = ?").get(result.lastInsertRowid) as GalleryRow;
	return mapRow(row);
}

/** Returns the deleted record (so the caller can clean up its file), or null if it didn't exist. */
export function deleteGalleryImage(id: number): GalleryImageRecord | null {
	const existing = getGalleryImage(id);
	if (!existing) return null;
	db.prepare("DELETE FROM gallery_images WHERE id = ?").run(id);
	return existing;
}
