import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/customerAuth";
import { listNotificationsForUser, getUnreadCount, markAllRead, markOneRead } from "@/lib/store/notifications";

/** Powers the notification bell in the Navbar -- logged-in customers only. */
export async function GET() {
	const customer = await getCurrentCustomer();
	if (!customer) return NextResponse.json({ authenticated: false });

	return NextResponse.json({
		authenticated: true,
		notifications: listNotificationsForUser(customer.id),
		unreadCount: getUnreadCount(customer.id),
	});
}

/** Mark one notification (body: { id }) or all (no body / no id) as read. */
export async function POST(request: Request) {
	const customer = await getCurrentCustomer();
	if (!customer) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

	const body = await request.json().catch(() => ({}));
	if (body.id) {
		markOneRead(customer.id, Number(body.id));
	} else {
		markAllRead(customer.id);
	}

	return NextResponse.json({
		notifications: listNotificationsForUser(customer.id),
		unreadCount: getUnreadCount(customer.id),
	});
}
