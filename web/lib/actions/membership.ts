"use server";

import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/customerAuth";
import { createPendingMembership, setMembershipCheckoutSession } from "@/lib/store/memberships";
import { stripe, isStripeEnabled } from "@/lib/stripe";
import { PRICING_PLANS } from "@/constants/pricing";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface MembershipFormState {
	error?: string;
}

function getBaseUrl(): string {
	return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function joinMembershipAction(
	planId: string,
	_prevState: MembershipFormState | undefined,
	formData: FormData
): Promise<MembershipFormState> {
	const plan = PRICING_PLANS.find((candidate) => candidate.id === planId);
	if (!plan) return { error: "That membership plan doesn't exist." };

	if (!isStripeEnabled || !stripe) {
		return { error: "Online membership sign-up isn't available yet. Please use the contact form and we'll set you up." };
	}

	const customerName = String(formData.get("customerName") ?? "").trim();
	const customerEmail = String(formData.get("customerEmail") ?? "").trim();
	const customerPhone = String(formData.get("customerPhone") ?? "").trim();

	if (!customerName || !customerEmail || !EMAIL_PATTERN.test(customerEmail)) {
		return { error: "Please enter a valid name and email address." };
	}

	const customer = await getCurrentCustomer();
	const membershipId = createPendingMembership({
		userId: customer?.id ?? null,
		planId: plan.id,
		planName: plan.name,
		price: plan.price,
		customerName,
		customerEmail,
		customerPhone: customerPhone || null,
	});

	const session = await stripe.checkout.sessions.create({
		mode: "subscription",
		payment_method_types: ["card"],
		customer_email: customerEmail,
		line_items: [
			{
				price_data: {
					currency: "usd",
					product_data: { name: `${plan.name} Membership` },
					unit_amount: Math.round(plan.price * 100),
					recurring: { interval: "month" },
				},
				quantity: 1,
			},
		],
		success_url: `${getBaseUrl()}/membership/success/${membershipId}?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${getBaseUrl()}/membership`,
		metadata: { membershipId: String(membershipId), planId: plan.id },
	});

	setMembershipCheckoutSession(membershipId, session.id);

	if (session.url) redirect(session.url);
	return { error: "Could not start checkout. Please try again." };
}
