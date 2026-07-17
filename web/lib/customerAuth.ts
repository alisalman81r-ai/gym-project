import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "node:crypto";
import { db } from "@/lib/db";
import type { CustomerUser } from "@/types";

/**
 * Separate cookie/secret from the admin session (lib/auth.ts) -- a
 * shopper and the site admin are different trust boundaries, so a
 * leaked/expired one must never imply anything about the other.
 */
export const CUSTOMER_SESSION_COOKIE = "customer_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function getSecret(): string {
	const secret = process.env.CUSTOMER_SESSION_SECRET;
	if (!secret) throw new Error("CUSTOMER_SESSION_SECRET is not set.");
	return secret;
}

function sign(payload: string): string {
	return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function isTokenValid(token: string | undefined | null): { userId: number } | null {
	if (!token) return null;
	const [userIdRaw, expiresAtRaw, signature] = token.split(".");
	const userId = Number(userIdRaw);
	const expiresAt = Number(expiresAtRaw);
	if (!userId || !expiresAt || !signature || Date.now() > expiresAt) return null;

	const expected = Buffer.from(sign(`${userId}.${expiresAt}`));
	const actual = Buffer.from(signature);
	if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

	return { userId };
}

export function hashPassword(password: string): string {
	const salt = randomBytes(16).toString("hex");
	const derived = scryptSync(password, salt, 64).toString("hex");
	return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
	const [salt, hash] = stored.split(":");
	if (!salt || !hash) return false;
	const derived = scryptSync(password, salt, 64);
	const expected = Buffer.from(hash, "hex");
	return derived.length === expected.length && timingSafeEqual(derived, expected);
}

export async function createCustomerSession(userId: number): Promise<void> {
	const expiresAt = Date.now() + SESSION_TTL_MS;
	const cookieStore = await cookies();
	cookieStore.set(CUSTOMER_SESSION_COOKIE, `${userId}.${expiresAt}.${sign(`${userId}.${expiresAt}`)}`, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		expires: new Date(expiresAt),
	});
}

export async function destroyCustomerSession(): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.delete(CUSTOMER_SESSION_COOKIE);
}

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

export async function getCurrentCustomer(): Promise<CustomerUser | null> {
	const cookieStore = await cookies();
	const session = isTokenValid(cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value);
	if (!session) return null;

	const row = db.prepare("SELECT * FROM users WHERE id = ?").get(session.userId) as UserRow | undefined;
	if (!row || row.is_blocked) return null;

	return rowToUser(row);
}

export async function requireCustomer(): Promise<CustomerUser> {
	const customer = await getCurrentCustomer();
	if (!customer) redirect("/account/login");
	return customer;
}
