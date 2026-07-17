import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminTokenValid } from "@/lib/auth";

/**
 * Optimistic cookie check gating /admin/* -- the real check happens
 * again in the page/Server Actions (see lib/auth.ts callers), since
 * Proxy alone is not sufficient defense (see Next's authentication guide).
 */
export function proxy(request: NextRequest) {
	if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();

	const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
	if (!isAdminTokenValid(token)) {
		return NextResponse.redirect(new URL("/admin/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
