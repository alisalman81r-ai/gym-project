import { db } from "@/lib/db";
import type { CustomerUser } from "@/types";

interface UserRow {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	is_blocked: number;
	created_at: string;
}

function rowToUser(row: UserRow): CustomerUser {
	return {
		id: row.id,
		name: row.name,
		email: row.email,
		phone: row.phone,
		isBlocked: Boolean(row.is_blocked),
		createdAt: row.created_at,
	};
}

export interface CustomerWithStats extends CustomerUser {
	orderCount: number;
	totalSpent: number;
}

export function listCustomers(search?: string): CustomerWithStats[] {
	const where = search ? "WHERE u.name LIKE ? OR u.email LIKE ?" : "";
	const params = search ? [`%${search}%`, `%${search}%`] : [];

	const rows = db
		.prepare(
			`SELECT u.*,
				(SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as order_count,
				(SELECT COALESCE(SUM(total), 0) FROM orders o WHERE o.user_id = u.id AND o.status != 'cancelled') as total_spent
			 FROM users u
			 ${where}
			 ORDER BY u.created_at DESC`
		)
		.all(...params) as Array<UserRow & { order_count: number; total_spent: number }>;

	return rows.map((row) => ({ ...rowToUser(row), orderCount: row.order_count, totalSpent: row.total_spent }));
}

export function getCustomerById(id: number): CustomerUser | null {
	const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
	return row ? rowToUser(row) : null;
}

export function setCustomerBlocked(id: number, blocked: boolean): void {
	db.prepare("UPDATE users SET is_blocked = ? WHERE id = ?").run(blocked ? 1 : 0, id);
}

export interface CustomerUpdateInput {
	name: string;
	email: string;
	phone: string | null;
}

export function updateCustomer(id: number, input: CustomerUpdateInput): void {
	db.prepare("UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?").run(input.name, input.email, input.phone, id);
}
