import { db } from "@/lib/db";
import type { CustomerAddress } from "@/types";

interface AddressRow {
	id: number;
	user_id: number;
	full_name: string;
	phone: string;
	address_line: string;
	city: string;
	postal_code: string;
	is_default: number;
}

function rowToAddress(row: AddressRow): CustomerAddress {
	return {
		id: row.id,
		fullName: row.full_name,
		phone: row.phone,
		addressLine: row.address_line,
		city: row.city,
		postalCode: row.postal_code,
		isDefault: Boolean(row.is_default),
	};
}

export function getAddressesForUser(userId: number): CustomerAddress[] {
	const rows = db
		.prepare("SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC")
		.all(userId) as AddressRow[];
	return rows.map(rowToAddress);
}

export interface AddressInput {
	fullName: string;
	phone: string;
	addressLine: string;
	city: string;
	postalCode: string;
	isDefault: boolean;
}

export function addAddress(userId: number, input: AddressInput): void {
	const run = db.transaction(() => {
		if (input.isDefault) {
			db.prepare("UPDATE addresses SET is_default = 0 WHERE user_id = ?").run(userId);
		}
		db.prepare(
			"INSERT INTO addresses (user_id, full_name, phone, address_line, city, postal_code, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)"
		).run(userId, input.fullName, input.phone, input.addressLine, input.city, input.postalCode, input.isDefault ? 1 : 0);
	});
	run();
}

export function deleteAddress(id: number, userId: number): void {
	db.prepare("DELETE FROM addresses WHERE id = ? AND user_id = ?").run(id, userId);
}

export function setDefaultAddress(id: number, userId: number): void {
	const run = db.transaction(() => {
		db.prepare("UPDATE addresses SET is_default = 0 WHERE user_id = ?").run(userId);
		db.prepare("UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?").run(id, userId);
	});
	run();
}
