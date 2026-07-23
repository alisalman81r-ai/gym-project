import { db } from "@/lib/db";
import type { BlogPost } from "@/types";

interface BlogRow {
	id: number;
	slug: string;
	title: string;
	category: string;
	excerpt: string;
	body: string;
	author: string;
	date: string;
	read_time: string;
	image_src: string;
	image_alt: string;
}

/** Paragraphs are stored joined by blank lines; split them back into the array the pages render. */
function splitBody(body: string): string[] {
	return body
		.split(/\n\s*\n/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);
}

/**
 * Returns the public `BlogPost` shape (id as a string, nested image
 * object) so the existing BlogCard and blog pages consume it unchanged.
 * Admin routing derives the numeric id with `Number(post.id)`.
 */
function mapRow(row: BlogRow): BlogPost {
	return {
		id: String(row.id),
		slug: row.slug,
		title: row.title,
		category: row.category,
		excerpt: row.excerpt,
		body: splitBody(row.body),
		author: row.author,
		date: row.date,
		readTime: row.read_time,
		image: { src: row.image_src, alt: row.image_alt },
	};
}

/** Newest first -- the listing page treats the first post as the featured one. */
export function listBlogPosts(): BlogPost[] {
	const rows = db.prepare("SELECT * FROM blog_posts ORDER BY date DESC, id DESC").all() as BlogRow[];
	return rows.map(mapRow);
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
	const row = db.prepare("SELECT * FROM blog_posts WHERE slug = ?").get(slug) as BlogRow | undefined;
	return row ? mapRow(row) : null;
}

export function getBlogPostById(id: number): BlogPost | null {
	const row = db.prepare("SELECT * FROM blog_posts WHERE id = ?").get(id) as BlogRow | undefined;
	return row ? mapRow(row) : null;
}

export function getRelatedBlogPosts(excludeSlug: string, limit = 3): BlogPost[] {
	const rows = db
		.prepare("SELECT * FROM blog_posts WHERE slug != ? ORDER BY date DESC, id DESC LIMIT ?")
		.all(excludeSlug, limit) as BlogRow[];
	return rows.map(mapRow);
}

export interface BlogPostInput {
	title: string;
	category: string;
	excerpt: string;
	/** Raw multi-paragraph text (paragraphs separated by blank lines). */
	body: string;
	author: string;
	date: string;
	/** Blank => auto-estimated from the body word count. */
	readTime: string;
	imageSrc: string;
	imageAlt: string;
}

function slugify(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

/** Ensures the generated slug is unique, appending -2, -3, ... on collision (ignoring `exceptId` on edit). */
function uniqueSlug(base: string, exceptId?: number): string {
	const root = base || "post";
	let candidate = root;
	let suffix = 2;
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const row = db.prepare("SELECT id FROM blog_posts WHERE slug = ?").get(candidate) as { id: number } | undefined;
		if (!row || row.id === exceptId) return candidate;
		candidate = `${root}-${suffix++}`;
	}
}

function estimateReadTime(body: string): string {
	const words = body.trim().split(/\s+/).filter(Boolean).length;
	const minutes = Math.max(1, Math.round(words / 200));
	return `${minutes} min read`;
}

export function createBlogPost(input: BlogPostInput): number {
	const slug = uniqueSlug(slugify(input.title));
	const readTime = input.readTime.trim() || estimateReadTime(input.body);
	const result = db
		.prepare(`
			INSERT INTO blog_posts (slug, title, category, excerpt, body, author, date, read_time, image_src, image_alt)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`)
		.run(
			slug,
			input.title,
			input.category,
			input.excerpt,
			input.body,
			input.author,
			input.date,
			readTime,
			input.imageSrc,
			input.imageAlt
		);
	return Number(result.lastInsertRowid);
}

/** Slug stays fixed after creation so existing article URLs don't break. */
export function updateBlogPost(id: number, input: BlogPostInput): void {
	const readTime = input.readTime.trim() || estimateReadTime(input.body);
	db.prepare(`
		UPDATE blog_posts
		SET title = ?, category = ?, excerpt = ?, body = ?, author = ?, date = ?, read_time = ?, image_src = ?, image_alt = ?, updated_at = datetime('now')
		WHERE id = ?
	`).run(
		input.title,
		input.category,
		input.excerpt,
		input.body,
		input.author,
		input.date,
		readTime,
		input.imageSrc,
		input.imageAlt,
		id
	);
}

/** Returns the deleted post's image src (so the caller can clean up the file), or null if it didn't exist. */
export function deleteBlogPost(id: number): string | null {
	const row = db.prepare("SELECT image_src FROM blog_posts WHERE id = ?").get(id) as { image_src: string } | undefined;
	if (!row) return null;
	db.prepare("DELETE FROM blog_posts WHERE id = ?").run(id);
	return row.image_src;
}
