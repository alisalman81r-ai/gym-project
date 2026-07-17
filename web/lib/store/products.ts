import { db } from "@/lib/db";
import type { Product, ProductType } from "@/types";

interface ProductRow {
	id: number;
	slug: string;
	name: string;
	product_type: ProductType;
	category_id: number | null;
	category_name: string | null;
	brand_id: number | null;
	brand_name: string | null;
	description: string;
	price: number;
	discount_price: number | null;
	stock_quantity: number;
	weight_or_flavor: string | null;
	featured: number;
	status: "active" | "inactive";
	rating_avg: number;
	rating_count: number;
	created_at: string;
}

function attachRelations(rows: ProductRow[]): Product[] {
	if (rows.length === 0) return [];
	const ids = rows.map((row) => row.id);
	const placeholders = ids.map(() => "?").join(",");

	const images = db
		.prepare(`SELECT id, product_id, url, sort_order FROM product_images WHERE product_id IN (${placeholders}) ORDER BY sort_order ASC`)
		.all(...ids) as Array<{ id: number; product_id: number; url: string; sort_order: number }>;
	const sizes = db
		.prepare(`SELECT product_id, size FROM product_sizes WHERE product_id IN (${placeholders})`)
		.all(...ids) as Array<{ product_id: number; size: string }>;
	const colors = db
		.prepare(`SELECT product_id, color FROM product_colors WHERE product_id IN (${placeholders})`)
		.all(...ids) as Array<{ product_id: number; color: string }>;

	return rows.map((row) => ({
		id: row.id,
		slug: row.slug,
		name: row.name,
		productType: row.product_type,
		categoryId: row.category_id,
		categoryName: row.category_name,
		brandId: row.brand_id,
		brandName: row.brand_name,
		description: row.description,
		price: row.price,
		discountPrice: row.discount_price,
		stockQuantity: row.stock_quantity,
		weightOrFlavor: row.weight_or_flavor,
		featured: Boolean(row.featured),
		status: row.status,
		ratingAvg: row.rating_avg,
		ratingCount: row.rating_count,
		createdAt: row.created_at,
		images: images
			.filter((image) => image.product_id === row.id)
			.map((image) => ({ id: image.id, url: image.url, sortOrder: image.sort_order })),
		sizes: sizes.filter((size) => size.product_id === row.id).map((size) => size.size),
		colors: colors.filter((color) => color.product_id === row.id).map((color) => color.color),
	}));
}

export type ProductSort = "newest" | "price_asc" | "price_desc" | "popularity";

export interface ProductFilters {
	productType?: ProductType;
	categoryId?: number;
	brandId?: number;
	search?: string;
	sort?: ProductSort;
	featuredOnly?: boolean;
	includeInactive?: boolean;
	page?: number;
	pageSize?: number;
}

const SORT_CLAUSES: Record<ProductSort, string> = {
	newest: "p.created_at DESC",
	price_asc: "COALESCE(p.discount_price, p.price) ASC",
	price_desc: "COALESCE(p.discount_price, p.price) DESC",
	popularity: "p.rating_count DESC, p.rating_avg DESC",
};

export function listProducts(filters: ProductFilters = {}): { products: Product[]; total: number } {
	const conditions: string[] = [];
	const params: Array<string | number> = [];

	if (!filters.includeInactive) {
		conditions.push("p.status = 'active'");
	}
	if (filters.productType) {
		conditions.push("p.product_type = ?");
		params.push(filters.productType);
	}
	if (filters.categoryId) {
		conditions.push("p.category_id = ?");
		params.push(filters.categoryId);
	}
	if (filters.brandId) {
		conditions.push("p.brand_id = ?");
		params.push(filters.brandId);
	}
	if (filters.search) {
		conditions.push("(p.name LIKE ? OR p.description LIKE ?)");
		const like = `%${filters.search}%`;
		params.push(like, like);
	}
	if (filters.featuredOnly) {
		conditions.push("p.featured = 1");
	}

	const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
	const orderClause = SORT_CLAUSES[filters.sort ?? "newest"];

	const { count } = db
		.prepare(`SELECT COUNT(*) as count FROM products p ${whereClause}`)
		.get(...params) as { count: number };

	const pageSize = filters.pageSize ?? 24;
	const page = filters.page ?? 1;
	const offset = (page - 1) * pageSize;

	const rows = db
		.prepare(
			`SELECT p.*, c.name as category_name, b.name as brand_name
			 FROM products p
			 LEFT JOIN categories c ON p.category_id = c.id
			 LEFT JOIN brands b ON p.brand_id = b.id
			 ${whereClause}
			 ORDER BY ${orderClause}
			 LIMIT ? OFFSET ?`
		)
		.all(...params, pageSize, offset) as ProductRow[];

	return { products: attachRelations(rows), total: count };
}

export function getProductBySlug(slug: string, includeInactive = false): Product | null {
	const row = db
		.prepare(
			`SELECT p.*, c.name as category_name, b.name as brand_name
			 FROM products p
			 LEFT JOIN categories c ON p.category_id = c.id
			 LEFT JOIN brands b ON p.brand_id = b.id
			 WHERE p.slug = ? ${includeInactive ? "" : "AND p.status = 'active'"}`
		)
		.get(slug) as ProductRow | undefined;

	if (!row) return null;
	return attachRelations([row])[0];
}

export function getProductById(id: number): Product | null {
	const row = db
		.prepare(
			`SELECT p.*, c.name as category_name, b.name as brand_name
			 FROM products p
			 LEFT JOIN categories c ON p.category_id = c.id
			 LEFT JOIN brands b ON p.brand_id = b.id
			 WHERE p.id = ?`
		)
		.get(id) as ProductRow | undefined;

	if (!row) return null;
	return attachRelations([row])[0];
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
	const rows = db
		.prepare(
			`SELECT p.*, c.name as category_name, b.name as brand_name
			 FROM products p
			 LEFT JOIN categories c ON p.category_id = c.id
			 LEFT JOIN brands b ON p.brand_id = b.id
			 WHERE p.status = 'active' AND p.id != ? AND p.product_type = ?
			 ORDER BY (p.category_id = ?) DESC, p.rating_count DESC
			 LIMIT ?`
		)
		.all(product.id, product.productType, product.categoryId, limit) as ProductRow[];

	return attachRelations(rows);
}

export interface CategoryRow {
	id: number;
	slug: string;
	name: string;
	productType: ProductType;
}

export function getCategories(productType?: ProductType): CategoryRow[] {
	const rows = productType
		? (db.prepare("SELECT * FROM categories WHERE product_type = ? ORDER BY name ASC").all(productType) as Array<{
				id: number;
				slug: string;
				name: string;
				product_type: ProductType;
			}>)
		: (db.prepare("SELECT * FROM categories ORDER BY name ASC").all() as Array<{
				id: number;
				slug: string;
				name: string;
				product_type: ProductType;
			}>);

	return rows.map((row) => ({ id: row.id, slug: row.slug, name: row.name, productType: row.product_type }));
}

export interface BrandRow {
	id: number;
	slug: string;
	name: string;
}

export function getBrands(): BrandRow[] {
	return db.prepare("SELECT * FROM brands ORDER BY name ASC").all() as BrandRow[];
}

function slugify(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

export function ensureCategory(name: string, productType: ProductType): number {
	const slug = slugify(name);
	db.prepare("INSERT OR IGNORE INTO categories (slug, name, product_type) VALUES (?, ?, ?)").run(slug, name, productType);
	const row = db.prepare("SELECT id FROM categories WHERE slug = ? AND product_type = ?").get(slug, productType) as {
		id: number;
	};
	return row.id;
}

export function ensureBrand(name: string): number {
	const slug = slugify(name);
	db.prepare("INSERT OR IGNORE INTO brands (slug, name) VALUES (?, ?)").run(slug, name);
	const row = db.prepare("SELECT id FROM brands WHERE slug = ?").get(slug) as { id: number };
	return row.id;
}

export interface ProductInput {
	name: string;
	productType: ProductType;
	categoryName: string;
	brandName: string;
	description: string;
	price: number;
	discountPrice: number | null;
	stockQuantity: number;
	weightOrFlavor: string | null;
	featured: boolean;
	status: "active" | "inactive";
	images: string[];
	sizes: string[];
	colors: string[];
}

export function createProduct(input: ProductInput): number {
	const categoryId = ensureCategory(input.categoryName, input.productType);
	const brandId = ensureBrand(input.brandName);
	const baseSlug = slugify(input.name);
	let slug = baseSlug;
	let suffix = 1;
	while (db.prepare("SELECT 1 FROM products WHERE slug = ?").get(slug)) {
		slug = `${baseSlug}-${++suffix}`;
	}

	const result = db
		.prepare(
			`INSERT INTO products
				(slug, name, product_type, category_id, brand_id, description, price, discount_price, stock_quantity, weight_or_flavor, featured, status)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		)
		.run(
			slug,
			input.name,
			input.productType,
			categoryId,
			brandId,
			input.description,
			input.price,
			input.discountPrice,
			input.stockQuantity,
			input.weightOrFlavor,
			input.featured ? 1 : 0,
			input.status
		);

	const productId = Number(result.lastInsertRowid);
	replaceProductRelations(productId, input.images, input.sizes, input.colors);
	return productId;
}

export function updateProduct(id: number, input: ProductInput): void {
	const categoryId = ensureCategory(input.categoryName, input.productType);
	const brandId = ensureBrand(input.brandName);

	db.prepare(
		`UPDATE products SET
			name = ?, product_type = ?, category_id = ?, brand_id = ?, description = ?, price = ?,
			discount_price = ?, stock_quantity = ?, weight_or_flavor = ?, featured = ?, status = ?, updated_at = datetime('now')
		 WHERE id = ?`
	).run(
		input.name,
		input.productType,
		categoryId,
		brandId,
		input.description,
		input.price,
		input.discountPrice,
		input.stockQuantity,
		input.weightOrFlavor,
		input.featured ? 1 : 0,
		input.status,
		id
	);

	replaceProductRelations(id, input.images, input.sizes, input.colors);
}

function replaceProductRelations(productId: number, images: string[], sizes: string[], colors: string[]): void {
	db.prepare("DELETE FROM product_images WHERE product_id = ?").run(productId);
	db.prepare("DELETE FROM product_sizes WHERE product_id = ?").run(productId);
	db.prepare("DELETE FROM product_colors WHERE product_id = ?").run(productId);

	const insertImage = db.prepare("INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)");
	images.forEach((url, index) => insertImage.run(productId, url, index));

	const insertSize = db.prepare("INSERT INTO product_sizes (product_id, size) VALUES (?, ?)");
	sizes.forEach((size) => insertSize.run(productId, size));

	const insertColor = db.prepare("INSERT INTO product_colors (product_id, color) VALUES (?, ?)");
	colors.forEach((color) => insertColor.run(productId, color));
}

export function deleteProduct(id: number): void {
	db.prepare("DELETE FROM products WHERE id = ?").run(id);
}

export function adjustStock(productId: number, delta: number): void {
	db.prepare("UPDATE products SET stock_quantity = MAX(0, stock_quantity + ?) WHERE id = ?").run(delta, productId);
}

export const LOW_STOCK_THRESHOLD = 5;

export function getLowStockProducts(limit = 10): Product[] {
	const rows = db
		.prepare(
			`SELECT p.*, c.name as category_name, b.name as brand_name
			 FROM products p
			 LEFT JOIN categories c ON p.category_id = c.id
			 LEFT JOIN brands b ON p.brand_id = b.id
			 WHERE p.stock_quantity <= ? AND p.status = 'active'
			 ORDER BY p.stock_quantity ASC
			 LIMIT ?`
		)
		.all(LOW_STOCK_THRESHOLD, limit) as ProductRow[];

	return attachRelations(rows);
}
