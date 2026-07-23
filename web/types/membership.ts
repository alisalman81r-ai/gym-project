export type MembershipStatus = "pending" | "active" | "past_due" | "canceled" | "incomplete" | "rejected";

export interface Membership {
	id: number;
	userId: number | null;
	planId: string;
	planName: string;
	price: number;
	customerName: string;
	customerEmail: string;
	customerPhone: string | null;
	stripeCustomerId: string | null;
	stripeSubscriptionId: string | null;
	status: MembershipStatus;
	currentPeriodEnd: string | null;
	createdAt: string;
}
