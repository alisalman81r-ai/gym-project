import { db } from "@/lib/db";
import type { Membership, MembershipStatus } from "@/types";

interface MembershipRow {
	id: number;
	user_id: number | null;
	plan_id: string;
	plan_name: string;
	price: number;
	customer_name: string;
	customer_email: string;
	customer_phone: string | null;
	stripe_customer_id: string | null;
	stripe_subscription_id: string | null;
	status: MembershipStatus;
	current_period_end: string | null;
	created_at: string;
}

function rowToMembership(row: MembershipRow): Membership {
	return {
		id: row.id,
		userId: row.user_id,
		planId: row.plan_id,
		planName: row.plan_name,
		price: row.price,
		customerName: row.customer_name,
		customerEmail: row.customer_email,
		customerPhone: row.customer_phone,
		stripeCustomerId: row.stripe_customer_id,
		stripeSubscriptionId: row.stripe_subscription_id,
		status: row.status,
		currentPeriodEnd: row.current_period_end,
		createdAt: row.created_at,
	};
}

export interface CreatePendingMembershipInput {
	userId: number | null;
	planId: string;
	planName: string;
	price: number;
	customerName: string;
	customerEmail: string;
	customerPhone: string | null;
}

export function createPendingMembership(input: CreatePendingMembershipInput): number {
	const result = db
		.prepare(
			`INSERT INTO memberships (user_id, plan_id, plan_name, price, customer_name, customer_email, customer_phone)
			 VALUES (?, ?, ?, ?, ?, ?, ?)`
		)
		.run(input.userId, input.planId, input.planName, input.price, input.customerName, input.customerEmail, input.customerPhone);
	return Number(result.lastInsertRowid);
}

export function setMembershipCheckoutSession(membershipId: number, sessionId: string): void {
	db.prepare("UPDATE memberships SET stripe_checkout_session_id = ? WHERE id = ?").run(sessionId, membershipId);
}

export interface ActivateMembershipInput {
	stripeCustomerId: string | null;
	stripeSubscriptionId: string | null;
	currentPeriodEnd: string | null;
}

export function activateMembership(membershipId: number, input: ActivateMembershipInput): void {
	db.prepare(
		`UPDATE memberships SET status = 'active', stripe_customer_id = ?, stripe_subscription_id = ?, current_period_end = ?, updated_at = datetime('now')
		 WHERE id = ?`
	).run(input.stripeCustomerId, input.stripeSubscriptionId, input.currentPeriodEnd, membershipId);
}

/** Manual admin override -- e.g. a comp membership or a pending application approved without Stripe checkout. */
export function approveMembershipManually(membershipId: number): void {
	db.prepare("UPDATE memberships SET status = 'active', updated_at = datetime('now') WHERE id = ?").run(membershipId);
}

export function rejectMembership(membershipId: number): void {
	db.prepare("UPDATE memberships SET status = 'rejected', updated_at = datetime('now') WHERE id = ?").run(membershipId);
}

export function updateMembershipStatusBySubscriptionId(
	subscriptionId: string,
	status: MembershipStatus,
	currentPeriodEnd: string | null
): void {
	db.prepare(
		"UPDATE memberships SET status = ?, current_period_end = ?, updated_at = datetime('now') WHERE stripe_subscription_id = ?"
	).run(status, currentPeriodEnd, subscriptionId);
}

export function getMembershipById(id: number): Membership | null {
	const row = db.prepare("SELECT * FROM memberships WHERE id = ?").get(id) as MembershipRow | undefined;
	return row ? rowToMembership(row) : null;
}

export function getMembershipsForUser(userId: number): Membership[] {
	const rows = db.prepare("SELECT * FROM memberships WHERE user_id = ? ORDER BY id DESC").all(userId) as MembershipRow[];
	return rows.map(rowToMembership);
}

export function listMemberships(): Membership[] {
	const rows = db.prepare("SELECT * FROM memberships ORDER BY id DESC").all() as MembershipRow[];
	return rows.map(rowToMembership);
}
