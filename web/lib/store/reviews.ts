import { db } from "@/lib/db";
import type { Review } from "@/types";

interface ReviewRow {
	id: number;
	product_id: number;
	user_id: number | null;
	customer_name: string;
	rating: number;
	comment: string;
	image_url: string | null;
	approved: number;
	created_at: string;
}

function rowToReview(row: ReviewRow): Review {
	return {
		id: row.id,
		productId: row.product_id,
		userId: row.user_id,
		customerName: row.customer_name,
		rating: row.rating,
		comment: row.comment,
		imageUrl: row.image_url,
		approved: Boolean(row.approved),
		createdAt: row.created_at,
	};
}

export function getApprovedReviewsForProduct(productId: number): Review[] {
	const rows = db
		.prepare("SELECT * FROM reviews WHERE product_id = ? AND approved = 1 ORDER BY id DESC")
		.all(productId) as ReviewRow[];
	return rows.map(rowToReview);
}

export function listAllReviews(approvedOnly = false): Review[] {
	const rows = approvedOnly
		? (db.prepare("SELECT * FROM reviews WHERE approved = 1 ORDER BY id DESC").all() as ReviewRow[])
		: (db.prepare("SELECT * FROM reviews ORDER BY id DESC").all() as ReviewRow[]);
	return rows.map(rowToReview);
}

export interface ReviewWithProduct extends Review {
	productName: string;
	productSlug: string;
}

export function listReviewsForAdmin(): ReviewWithProduct[] {
	const rows = db
		.prepare(
			`SELECT r.*, p.name as product_name, p.slug as product_slug
			 FROM reviews r
			 JOIN products p ON p.id = r.product_id
			 ORDER BY r.approved ASC, r.id DESC`
		)
		.all() as Array<ReviewRow & { product_name: string; product_slug: string }>;

	return rows.map((row) => ({ ...rowToReview(row), productName: row.product_name, productSlug: row.product_slug }));
}

export interface ReviewInput {
	productId: number;
	userId: number | null;
	customerName: string;
	rating: number;
	comment: string;
	imageUrl: string | null;
}

export function createReview(input: ReviewInput): void {
	db.prepare(
		"INSERT INTO reviews (product_id, user_id, customer_name, rating, comment, image_url) VALUES (?, ?, ?, ?, ?, ?)"
	).run(input.productId, input.userId, input.customerName, input.rating, input.comment, input.imageUrl);
}

function recomputeProductRating(productId: number): void {
	const { avg, count } = db
		.prepare("SELECT COALESCE(AVG(rating), 0) as avg, COUNT(*) as count FROM reviews WHERE product_id = ? AND approved = 1")
		.get(productId) as { avg: number; count: number };
	db.prepare("UPDATE products SET rating_avg = ?, rating_count = ? WHERE id = ?").run(
		Math.round(avg * 10) / 10,
		count,
		productId
	);
}

export function approveReview(id: number): void {
	const row = db.prepare("SELECT product_id FROM reviews WHERE id = ?").get(id) as { product_id: number } | undefined;
	if (!row) return;
	db.prepare("UPDATE reviews SET approved = 1 WHERE id = ?").run(id);
	recomputeProductRating(row.product_id);
}

export function deleteReview(id: number): void {
	const row = db.prepare("SELECT product_id FROM reviews WHERE id = ?").get(id) as { product_id: number } | undefined;
	if (!row) return;
	db.prepare("DELETE FROM reviews WHERE id = ?").run(id);
	recomputeProductRating(row.product_id);
}
