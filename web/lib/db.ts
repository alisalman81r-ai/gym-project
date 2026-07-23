import Database from "better-sqlite3";
import path from "node:path";
import { seedProductsIfEmpty, seedGalleryIfEmpty, seedBlogIfEmpty } from "@/lib/seed";

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

// Adds `status`/`admin_reply`/`replied_at` to databases created before
// these columns existed -- CREATE TABLE IF NOT EXISTS above only applies
// to fresh databases.
for (const table of ["contact_submissions", "supplement_orders"]) {
	const columns = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
	const columnNames = columns.map((column) => column.name);
	if (!columnNames.includes("status")) {
		db.exec(`ALTER TABLE ${table} ADD COLUMN status TEXT NOT NULL DEFAULT 'new'`);
	}
	if (!columnNames.includes("admin_reply")) {
		db.exec(`ALTER TABLE ${table} ADD COLUMN admin_reply TEXT`);
	}
	if (!columnNames.includes("replied_at")) {
		db.exec(`ALTER TABLE ${table} ADD COLUMN replied_at TEXT`);
	}
	// Links this row to the visitor's live-chat conversation (see
	// lib/store/chat.ts) so an admin reply here also lands in their
	// chat widget, not just their inbox.
	if (!columnNames.includes("chat_conversation_id")) {
		db.exec(`ALTER TABLE ${table} ADD COLUMN chat_conversation_id INTEGER REFERENCES chat_conversations(id)`);
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

	CREATE TABLE IF NOT EXISTS memberships (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
		plan_id TEXT NOT NULL,
		plan_name TEXT NOT NULL,
		price REAL NOT NULL,
		customer_name TEXT NOT NULL,
		customer_email TEXT NOT NULL,
		customer_phone TEXT,
		stripe_customer_id TEXT,
		stripe_subscription_id TEXT,
		stripe_checkout_session_id TEXT,
		status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'past_due', 'canceled', 'incomplete', 'rejected')),
		current_period_end TEXT,
		created_at TEXT NOT NULL DEFAULT (datetime('now')),
		updated_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
	CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
	CREATE INDEX IF NOT EXISTS idx_cart_items_cart_key ON cart_items(cart_key);
	CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
	CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
	CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);
	CREATE INDEX IF NOT EXISTS idx_memberships_subscription ON memberships(stripe_subscription_id);
`);

// `memberships.status` originally had no 'rejected' option in its CHECK
// constraint -- SQLite can't ALTER a CHECK constraint in place, so an
// existing table from before this is migrated by recreating it. Only
// runs once (no-ops once the stored schema already mentions 'rejected').
const membershipsSchema = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'memberships'").get() as
	| { sql: string }
	| undefined;
if (membershipsSchema && !membershipsSchema.sql.includes("'rejected'")) {
	db.exec(`
		CREATE TABLE memberships_new (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
			plan_id TEXT NOT NULL,
			plan_name TEXT NOT NULL,
			price REAL NOT NULL,
			customer_name TEXT NOT NULL,
			customer_email TEXT NOT NULL,
			customer_phone TEXT,
			stripe_customer_id TEXT,
			stripe_subscription_id TEXT,
			stripe_checkout_session_id TEXT,
			status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'past_due', 'canceled', 'incomplete', 'rejected')),
			current_period_end TEXT,
			created_at TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at TEXT NOT NULL DEFAULT (datetime('now'))
		);
		INSERT INTO memberships_new SELECT id, user_id, plan_id, plan_name, price, customer_name, customer_email, customer_phone,
			stripe_customer_id, stripe_subscription_id, stripe_checkout_session_id, status, current_period_end, created_at, updated_at
			FROM memberships;
		DROP TABLE memberships;
		ALTER TABLE memberships_new RENAME TO memberships;
		CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);
		CREATE INDEX IF NOT EXISTS idx_memberships_subscription ON memberships(stripe_subscription_id);
	`);
}

// ============================================================
// In-app notifications for logged-in customers (e.g. "your
// membership was approved") -- surfaced via the bell in the Navbar.
// ============================================================
db.exec(`
	CREATE TABLE IF NOT EXISTS notifications (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		type TEXT NOT NULL,
		title TEXT NOT NULL,
		body TEXT,
		link TEXT,
		is_read INTEGER NOT NULL DEFAULT 0,
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
`);

// ============================================================
// Live chat (visitor <-> admin) -- visitors are identified by an
// anonymous cookie (see lib/chatSession.ts), same pattern as the
// cart's cart_key, so no account/login is required to chat.
// ============================================================
db.exec(`
	CREATE TABLE IF NOT EXISTS chat_conversations (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		visitor_key TEXT NOT NULL UNIQUE,
		visitor_name TEXT,
		visitor_email TEXT,
		status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
		created_at TEXT NOT NULL DEFAULT (datetime('now')),
		updated_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE TABLE IF NOT EXISTS chat_messages (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		conversation_id INTEGER NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
		sender TEXT NOT NULL CHECK (sender IN ('visitor', 'admin')),
		body TEXT NOT NULL,
		read_by_admin INTEGER NOT NULL DEFAULT 0,
		read_by_visitor INTEGER NOT NULL DEFAULT 0,
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id);
	CREATE INDEX IF NOT EXISTS idx_chat_conversations_visitor_key ON chat_conversations(visitor_key);
`);

// ============================================================
// Gallery -- the public /gallery grid, editable from the admin
// panel (add/delete images). Seeded once from the original static
// constants so a fresh database keeps the same starting photos.
// ============================================================
db.exec(`
	CREATE TABLE IF NOT EXISTS gallery_images (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		url TEXT NOT NULL,
		alt TEXT NOT NULL DEFAULT '',
		caption TEXT,
		sort_order INTEGER NOT NULL DEFAULT 0,
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);
`);

// ============================================================
// Journal (blog) -- the public /blog articles, editable from the
// admin panel. `body` holds the article paragraphs joined by blank
// lines; the store splits them back into an array on read. Seeded
// once from the original static constants.
// ============================================================
db.exec(`
	CREATE TABLE IF NOT EXISTS blog_posts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		slug TEXT NOT NULL UNIQUE,
		title TEXT NOT NULL,
		category TEXT NOT NULL,
		excerpt TEXT NOT NULL,
		body TEXT NOT NULL,
		author TEXT NOT NULL,
		date TEXT NOT NULL,
		read_time TEXT NOT NULL,
		image_src TEXT NOT NULL,
		image_alt TEXT NOT NULL DEFAULT '',
		created_at TEXT NOT NULL DEFAULT (datetime('now')),
		updated_at TEXT NOT NULL DEFAULT (datetime('now'))
	);
`);

// Tracks whether an admin has opened an order yet -- drives the "new
// orders" badge in AdminTopbar. Added after the orders table shipped, so
// existing rows are backfilled as already-seen (only orders placed from
// now on should light up the badge); new rows default to 0 (unseen).
{
	const orderColumns = (db.prepare("PRAGMA table_info(orders)").all() as Array<{ name: string }>).map((c) => c.name);
	if (!orderColumns.includes("admin_seen")) {
		db.exec("ALTER TABLE orders ADD COLUMN admin_seen INTEGER NOT NULL DEFAULT 0");
		db.exec("UPDATE orders SET admin_seen = 1");
	}
}

seedProductsIfEmpty(db);
seedGalleryIfEmpty(db);
seedBlogIfEmpty(db);
