import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Single hardcoded admin credential (env-configured), not a users table --
 * this is a solo-owner internal panel, not a multi-account system.
 * Session token is `${expiresAt}.${hmac}` so validity can be checked
 * without a database round-trip (used from Proxy on every /admin request).
 */
export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function sign(expiresAt: number): string {
	const secret = process.env.ADMIN_SESSION_SECRET;
	if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set.");
	return createHmac("sha256", secret).update(String(expiresAt)).digest("hex");
}

export function isAdminTokenValid(token: string | undefined | null): boolean {
	if (!token) return false;
	const [expiresAtRaw, signature] = token.split(".");
	const expiresAt = Number(expiresAtRaw);
	if (!expiresAt || !signature || Date.now() > expiresAt) return false;

	const expected = Buffer.from(sign(expiresAt));
	const actual = Buffer.from(signature);
	return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function checkAdminCredentials(username: string, password: string): boolean {
	return Boolean(username) && Boolean(password) && username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD;
}

export async function createAdminSession(): Promise<void> {
	const expiresAt = Date.now() + SESSION_TTL_MS;
	const cookieStore = await cookies();
	cookieStore.set(ADMIN_SESSION_COOKIE, `${expiresAt}.${sign(expiresAt)}`, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		expires: new Date(expiresAt),
	});
}

export async function destroyAdminSession(): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function hasAdminSession(): Promise<boolean> {
	const cookieStore = await cookies();
	return isAdminTokenValid(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}
