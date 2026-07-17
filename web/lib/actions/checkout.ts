"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getOrCreateCartKey, getAppliedCouponCode, setAppliedCouponCode } from "@/lib/store/cart";
import { getCurrentCustomer } from "@/lib/customerAuth";
import { placeOrder, OrderError } from "@/lib/store/orders";
import { stripe, isStripeEnabled } from "@/lib/stripe";
import type { PaymentMethod } from "@/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface CheckoutFormState {
	error?: string;
}

function getBaseUrl(): string {
	return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function placeOrderAction(_prevState: CheckoutFormState | undefined, formData: FormData): Promise<CheckoutFormState> {
	const customerName = String(formData.get("customerName") ?? "").trim();
	const customerEmail = String(formData.get("customerEmail") ?? "").trim();
	const customerPhone = String(formData.get("customerPhone") ?? "").trim();
	const addressLine = String(formData.get("addressLine") ?? "").trim();
	const city = String(formData.get("city") ?? "").trim();
	const postalCode = String(formData.get("postalCode") ?? "").trim();
	const requestedMethod = String(formData.get("paymentMethod") ?? "cod");
	const paymentMethod: PaymentMethod = requestedMethod === "stripe" && isStripeEnabled ? "stripe" : "cod";

	if (
		!customerName ||
		!customerEmail ||
		!EMAIL_PATTERN.test(customerEmail) ||
		!customerPhone ||
		!addressLine ||
		!city ||
		!postalCode
	) {
		return { error: "Please fill in all required fields with a valid email address." };
	}

	const cartKey = await getOrCreateCartKey();
	const couponCode = await getAppliedCouponCode();
	const customer = await getCurrentCustomer();

	let result;
	try {
		result = placeOrder({
			cartKey,
			userId: customer?.id ?? null,
			customerName,
			customerEmail,
			customerPhone,
			addressLine,
			city,
			postalCode,
			paymentMethod,
			couponCode,
		});
	} catch (error) {
		if (error instanceof OrderError) return { error: error.message };
		throw error;
	}

	await setAppliedCouponCode(null);

	if (paymentMethod === "stripe" && stripe) {
		const session = await stripe.checkout.sessions.create({
			mode: "payment",
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						currency: "usd",
						product_data: { name: `Order ${result.orderNumber}` },
						unit_amount: Math.round(result.total * 100),
					},
					quantity: 1,
				},
			],
			success_url: `${getBaseUrl()}/order/success/${result.orderNumber}?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${getBaseUrl()}/checkout`,
			metadata: { orderId: String(result.orderId), orderNumber: result.orderNumber },
		});

		db.prepare("UPDATE payments SET provider_ref = ? WHERE order_id = ?").run(session.id, result.orderId);
		if (session.url) redirect(session.url);
	}

	redirect(`/order/success/${result.orderNumber}`);
}
