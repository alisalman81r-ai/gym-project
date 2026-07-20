import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { markPaymentStatus, updateOrderStatus } from "@/lib/store/orders";
import { activateMembership, updateMembershipStatusBySubscriptionId } from "@/lib/store/memberships";
import type { MembershipStatus } from "@/types";

function toIsoString(unixSeconds: number | null | undefined): string | null {
	return typeof unixSeconds === "number" ? new Date(unixSeconds * 1000).toISOString() : null;
}

/** Subscription's own period end, tolerating the field living either at the top level or per-item across SDK/API versions. */
function getCurrentPeriodEnd(subscription: Stripe.Subscription): number | null {
	const withTopLevel = subscription as Stripe.Subscription & { current_period_end?: number };
	if (typeof withTopLevel.current_period_end === "number") return withTopLevel.current_period_end;
	return subscription.items.data[0]?.current_period_end ?? null;
}

function mapSubscriptionStatus(status: Stripe.Subscription.Status): MembershipStatus {
	switch (status) {
		case "active":
		case "trialing":
			return "active";
		case "past_due":
			return "past_due";
		case "incomplete":
			return "incomplete";
		default:
			// incomplete_expired, canceled, unpaid, paused
			return "canceled";
	}
}

export async function POST(request: Request) {
	if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
		return NextResponse.json({ error: "Stripe is not configured." }, { status: 400 });
	}

	const signature = request.headers.get("stripe-signature");
	const body = await request.text();

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(body, signature ?? "", process.env.STRIPE_WEBHOOK_SECRET);
	} catch {
		return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
	}

	if (event.type === "checkout.session.completed") {
		const session = event.data.object as Stripe.Checkout.Session;

		if (session.mode === "subscription" && session.metadata?.membershipId) {
			const membershipId = Number(session.metadata.membershipId);
			const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;
			const customerId = typeof session.customer === "string" ? session.customer : null;

			let currentPeriodEnd: string | null = null;
			if (subscriptionId) {
				const subscription = await stripe.subscriptions.retrieve(subscriptionId);
				currentPeriodEnd = toIsoString(getCurrentPeriodEnd(subscription));
			}

			if (membershipId) {
				activateMembership(membershipId, { stripeCustomerId: customerId, stripeSubscriptionId: subscriptionId, currentPeriodEnd });
			}
		} else {
			const orderId = Number(session.metadata?.orderId);
			if (orderId) {
				markPaymentStatus(orderId, "paid", session.id);
				updateOrderStatus(orderId, "confirmed");
			}
		}
	} else if (event.type === "checkout.session.expired") {
		const session = event.data.object as Stripe.Checkout.Session;
		const orderId = Number(session.metadata?.orderId);
		if (orderId) markPaymentStatus(orderId, "failed", session.id);
	} else if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
		const subscription = event.data.object as Stripe.Subscription;
		const status = event.type === "customer.subscription.deleted" ? "canceled" : mapSubscriptionStatus(subscription.status);
		updateMembershipStatusBySubscriptionId(subscription.id, status, toIsoString(getCurrentPeriodEnd(subscription)));
	}

	return NextResponse.json({ received: true });
}
