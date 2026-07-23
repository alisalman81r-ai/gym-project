import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";

/**
 * Anonymous visitor identity for live chat -- same cookie-based
 * approach as CART_COOKIE in lib/store/cart.ts, so a visitor can chat
 * without creating an account.
 */
export const CHAT_COOKIE = "chat_key";
const CHAT_COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

/** Read-only lookup for Server Components (which cannot set cookies). */
export async function getChatKeyReadonly(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get(CHAT_COOKIE)?.value ?? null;
}

/** Use from Route Handlers / Server Actions, which may set cookies. */
export async function getOrCreateChatKey(): Promise<string> {
	const cookieStore = await cookies();
	const existing = cookieStore.get(CHAT_COOKIE)?.value;
	if (existing) return existing;

	const key = randomBytes(16).toString("hex");
	cookieStore.set(CHAT_COOKIE, key, {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		maxAge: CHAT_COOKIE_MAX_AGE,
	});
	return key;
}
