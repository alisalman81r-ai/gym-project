import Database from "better-sqlite3";
import path from "node:path";
import { seedProductsIfEmpty } from "@/lib/seed";

/**
 * Local SQLite file, not a hosted service -- fits a practice project
 * with no deployment target. Kept out of git (see .gitignore); the
 * schema below recreates itself on first run in a fresh checkout.
 */
const dbPath = path.join(process.cwd(), "data", "app.db");

declare global {
	var __db: Database.Database | undefined;
}

export const db = globalThis.__db ?? new Database(dbPath);
if (process.env.NODE_ENV !== "production") globalThis.__db = db;

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
	CREATE TABLE IF NOT EXISTS contact_submissions (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT NOT NULL,
		phone TEXT,
		interest TEXT NOT NULL,
		message TEXT NOT NULL,
		status TEXT NOT NULL DEFAULT 'new',
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE TABLE IF NOT EXISTS supplement_orders (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		supplement_id TEXT NOT NULL,
		supplement_name TEXT NOT NULL,
		quantity INTEGER NOT NULL DEFAULT 1,
		name TEXT NOT NULL,
		email TEXT NOT NULL,
		phone TEXT,
		delivery_address TEXT NOT NULL,
		notes TEXT,
		status TEXT NOT NULL DEFAULT 'new',
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);
`);

// Adds `status` to databases created before this column existed --
// CREATE TABLE IF NOT EXISTS above only applies to fresh databases.
for (const table of ["contact_submissions", "supplement_orders"]) {
	const columns = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
	if (!columns.some((column) => column.name === "status")) {
		db.exec(`ALTER TABLE ${table} ADD COLUMN status TEXT NOT NULL DEFAULT 'new'`);
	}
}

// ============================================================
// E-commerce schema (products, cart, orders, accounts, etc.)
// ============================================================
db.exec(`
	CREATE TABLE IF NOT EXISTS categories (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		slug TEXT NOT NULL UNIQUE,
		name TEXT NOT NULL,
		product_type TEXT NOT NULL CHECK (product_type IN ('clothing', 'supplement'))
	);

	CREATE TABLE IF NOT EXISTS brands (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		slug TEXT NOT NULL UNIQUE,
		name TEXT NOT NULL
	);

	CREATE TABLE IF NOT EXISTS products (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		slug TEXT NOT NULL UNIQUE,
		name TEXT NOT NULL,
		product_type TEXT NOT NULL CHECK (product_type IN ('clothing', 'supplement')),
		category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
		brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL,
		description TEXT NOT NULL,
		price REAL NOT NULL,
		discount_price REAL,
		stock_quantity INTEGER NOT NULL DEFAULT 0,
		weight_or_flavor TEXT,
		featured INTEGER NOT NULL DEFAULT 0,
		status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
		rating_avg REAL NOT NULL DEFAULT 0,
		rating_count INTEGER NOT NULL DEFAULT 0,
		created_at TEXT NOT NULL DEFAULT (datetime('now')),
		updated_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE TABLE IF NOT EXISTS product_images (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
		url TEXT NOT NULL,
		sort_order INTEGER NOT NULL DEFAULT 0
	);

	CREATE TABLE IF NOT EXISTS product_sizes (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
		size TEXT NOT NULL
	);

	CREATE TABLE IF NOT EXISTS product_colors (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
		color TEXT NOT NULL
	);

	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		phone TEXT,
		password_hash TEXT NOT NULL,
		is_blocked INTEGER NOT NULL DEFAULT 0,
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE TABLE IF NOT EXISTS addresses (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		full_name TEXT NOT NULL,
		phone TEXT NOT NULL,
		address_line TEXT NOT NULL,
		city TEXT NOT NULL,
		postal_code TEXT NOT NULL,
		is_default INTEGER NOT NULL DEFAULT 0
	);

	CREATE TABLE IF NOT EXISTS cart_items (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		cart_key TEXT NOT NULL,
		product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
		size TEXT,
		color TEXT,
		quantity INTEGER NOT NULL DEFAULT 1,
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE TABLE IF NOT EXISTS wishlist_items (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
		created_at TEXT NOT NULL DEFAULT (datetime('now')),
		UNIQUE (user_id, product_id)
	);

	CREATE TABLE IF NOT EXISTS coupons (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		code TEXT NOT NULL UNIQUE,
		type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
		value REAL NOT NULL,
		expires_at TEXT,
		usage_limit INTEGER,
		used_count INTEGER NOT NULL DEFAULT 0,
		active INTEGER NOT NULL DEFAULT 1,
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE TABLE IF NOT EXISTS orders (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		order_number TEXT NOT NULL UNIQUE,
		user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
		customer_name TEXT NOT NULL,
		customer_email TEXT NOT NULL,
		customer_phone TEXT NOT NULL,
		address_line TEXT NOT NULL,
		city TEXT NOT NULL,
		postal_code TEXT NOT NULL,
		subtotal REAL NOT NULL,
		discount REAL NOT NULL DEFAULT 0,
		coupon_code TEXT,
		shipping_cost REAL NOT NULL DEFAULT 0,
		total REAL NOT NULL,
		payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'stripe')),
		payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
		status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled')),
		courier_name TEXT,
		tracking_number TEXT,
		estimated_delivery_date TEXT,
		created_at TEXT NOT NULL DEFAULT (datetime('now')),
		updated_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE TABLE IF NOT EXISTS order_items (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
		product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
		product_name TEXT NOT NULL,
		price REAL NOT NULL,
		quantity INTEGER NOT NULL,
		size TEXT,
		color TEXT,
		subtotal REAL NOT NULL
	);

	CREATE TABLE IF NOT EXISTS payments (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
		method TEXT NOT NULL,
		provider_ref TEXT,
		amount REAL NOT NULL,
		status TEXT NOT NULL DEFAULT 'pending',
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE TABLE IF NOT EXISTS reviews (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
		user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
		customer_name TEXT NOT NULL,
		rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
		comment TEXT NOT NULL,
		image_url TEXT,
		approved INTEGER NOT NULL DEFAULT 0,
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
	CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
	CREATE INDEX IF NOT EXISTS idx_cart_items_cart_key ON cart_items(cart_key);
	CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
	CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
`);

seedProductsIfEmpty(db);
