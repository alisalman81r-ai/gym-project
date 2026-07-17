import { db } from "@/lib/db";
import type { Coupon } from "@/types";

interface CouponRow {
	id: number;
	code: string;
	type: "percentage" | "fixed";
	value: number;
	expires_at: string | null;
	usage_limit: number | null;
	used_count: number;
	active: number;
	created_at: string;
}

function rowToCoupon(row: CouponRow): Coupon {
	return {
		id: row.id,
		code: row.code,
		type: row.type,
		value: row.value,
		expiresAt: row.expires_at,
		usageLimit: row.usage_limit,
		usedCount: row.used_count,
		active: Boolean(row.active),
		createdAt: row.created_at,
	};
}

export interface CouponWithMeta extends Coupon {
	isExpired: boolean;
}

function withMeta(coupon: Coupon): CouponWithMeta {
	return { ...coupon, isExpired: coupon.expiresAt ? new Date(coupon.expiresAt) < new Date() : false };
}

function findValidCoupon(code: string): CouponRow | null {
	const row = db.prepare("SELECT * FROM coupons WHERE code = ? COLLATE NOCASE").get(code) as CouponRow | undefined;
	if (!row) return null;
	if (!row.active) return null;
	if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) return null;
	if (row.usage_limit !== null && row.used_count >= row.usage_limit) return null;
	return row;
}

function computeDiscount(row: CouponRow, subtotal: number): number {
	const raw = row.type === "percentage" ? (subtotal * row.value) / 100 : row.value;
	return Math.round(Math.min(raw, subtotal) * 100) / 100;
}

/** Returns 0 (no discount) for any invalid/expired/exhausted code, silently -- used for cart total display. */
export async function getActiveCouponDiscount(code: string, subtotal: number): Promise<number> {
	const row = findValidCoupon(code);
	if (!row) return 0;
	return computeDiscount(row, subtotal);
}

export interface CouponValidationResult {
	valid: boolean;
	discount: number;
	message: string;
}

/** Returns a user-facing reason on failure -- used by the "Apply coupon" action. */
export function validateCouponForCheckout(code: string, subtotal: number): CouponValidationResult {
	const row = db.prepare("SELECT * FROM coupons WHERE code = ? COLLATE NOCASE").get(code) as CouponRow | undefined;
	if (!row) return { valid: false, discount: 0, message: "That coupon code doesn't exist." };
	if (!row.active) return { valid: false, discount: 0, message: "That coupon is no longer active." };
	if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
		return { valid: false, discount: 0, message: "That coupon has expired." };
	}
	if (row.usage_limit !== null && row.used_count >= row.usage_limit) {
		return { valid: false, discount: 0, message: "That coupon has reached its usage limit." };
	}
	return { valid: true, discount: computeDiscount(row, subtotal), message: "Coupon applied." };
}

export function incrementCouponUsage(code: string): void {
	db.prepare("UPDATE coupons SET used_count = used_count + 1 WHERE code = ? COLLATE NOCASE").run(code);
}

export function listCoupons(): CouponWithMeta[] {
	const rows = db.prepare("SELECT * FROM coupons ORDER BY created_at DESC").all() as CouponRow[];
	return rows.map(rowToCoupon).map(withMeta);
}

export function getCouponById(id: number): Coupon | null {
	const row = db.prepare("SELECT * FROM coupons WHERE id = ?").get(id) as CouponRow | undefined;
	return row ? rowToCoupon(row) : null;
}

export interface CouponInput {
	code: string;
	type: "percentage" | "fixed";
	value: number;
	expiresAt: string | null;
	usageLimit: number | null;
	active: boolean;
}

export function createCoupon(input: CouponInput): void {
	db.prepare(
		"INSERT INTO coupons (code, type, value, expires_at, usage_limit, active) VALUES (?, ?, ?, ?, ?, ?)"
	).run(input.code.toUpperCase(), input.type, input.value, input.expiresAt, input.usageLimit, input.active ? 1 : 0);
}

export function updateCoupon(id: number, input: CouponInput): void {
	db.prepare(
		"UPDATE coupons SET code = ?, type = ?, value = ?, expires_at = ?, usage_limit = ?, active = ? WHERE id = ?"
	).run(input.code.toUpperCase(), input.type, input.value, input.expiresAt, input.usageLimit, input.active ? 1 : 0, id);
}

export function deleteCoupon(id: number): void {
	db.prepare("DELETE FROM coupons WHERE id = ?").run(id);
}
