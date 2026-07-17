import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { markPaymentStatus, updateOrderStatus } from "@/lib/store/orders";

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
		const orderId = Number(session.metadata?.orderId);
		if (orderId) {
			markPaymentStatus(orderId, "paid", session.id);
			updateOrderStatus(orderId, "confirmed");
		}
	} else if (event.type === "checkout.session.expired") {
		const session = event.data.object as Stripe.Checkout.Session;
		const orderId = Number(session.metadata?.orderId);
		if (orderId) markPaymentStatus(orderId, "failed", session.id);
	}

	return NextResponse.json({ received: true });
}
