import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTotalUnreadCount as getChatUnreadCount } from "@/lib/store/chat";
import { LOW_STOCK_THRESHOLD } from "@/lib/store/products";

/**
 * One consolidated poll for every notification badge in AdminTopbar,
 * instead of a separate request per nav item. Each count reflects
 * items genuinely awaiting admin action, not just "recently added":
 *   - orders the admin hasn't opened yet (admin_seen = 0)
 *   - memberships awaiting a decision (see app/admin/memberships/actions.ts)
 *   - reviews awaiting moderation (approved = 0)
 *   - products at/under the low-stock threshold
 *   - unhandled contact/supplement-order inquiries
 *   - unread live-chat messages
 */
export async function GET() {
	if (!(await hasAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const newOrders = (db.prepare("SELECT COUNT(*) as count FROM orders WHERE admin_seen = 0").get() as { count: number })
		.count;
	const pendingMemberships = (
		db.prepare("SELECT COUNT(*) as count FROM memberships WHERE status IN ('pending', 'incomplete')").get() as {
			count: number;
		}
	).count;
	const pendingReviews = (db.prepare("SELECT COUNT(*) as count FROM reviews WHERE approved = 0").get() as { count: number })
		.count;
	const lowStockProducts = (
		db.prepare("SELECT COUNT(*) as count FROM products WHERE stock_quantity <= ? AND status = 'active'").get(
			LOW_STOCK_THRESHOLD
		) as { count: number }
	).count;
	const newContactSubmissions = (
		db.prepare("SELECT COUNT(*) as count FROM contact_submissions WHERE status = 'new'").get() as { count: number }
	).count;
	const newSupplementOrders = (
		db.prepare("SELECT COUNT(*) as count FROM supplement_orders WHERE status = 'new'").get() as { count: number }
	).count;

	return NextResponse.json({
		orders: newOrders,
		memberships: pendingMemberships,
		reviews: pendingReviews,
		products: lowStockProducts,
		messages: newContactSubmissions + newSupplementOrders,
		chat: getChatUnreadCount(),
	});
}
