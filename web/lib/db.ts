import Database from "better-sqlite3";
import path from "node:path";

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

db.exec(`
	CREATE TABLE IF NOT EXISTS contact_submissions (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT NOT NULL,
		phone TEXT,
		interest TEXT NOT NULL,
		message TEXT NOT NULL,
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
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);
`);
