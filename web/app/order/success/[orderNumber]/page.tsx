import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Navbar, Footer, Container } from "@/components/layout";
import { Button } from "@/components/ui";
import { getOrderByNumber } from "@/lib/store/orders";

export const metadata: Metadata = { title: "Order Confirmed" };

// Reads the freshly created order live -- must not be statically cached.
export const dynamic = "force-dynamic";

interface OrderSuccessPageProps {
	params: Promise<{ orderNumber: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
	const { orderNumber } = await params;
	const order = getOrderByNumber(orderNumber);
	if (!order) notFound();

	return (
		<>
			<Navbar />
			<main className="py-24">
				<Container className="mx-auto max-w-2xl text-center">
					<CheckCircle2 className="mx-auto mb-6 text-primary" size={56} />
					<h1 className="mb-2 font-display text-3xl font-bold text-text">Order Confirmed</h1>
					<p className="mb-8 text-text-muted">Thank you, {order.customerName} — your order has been placed.</p>

					<div className="mb-8 rounded-2xl border border-border bg-secondary p-8 text-left">
						<div className="mb-6 flex flex-wrap items-center justify-between gap-2">
							<div>
								<p className="text-xs uppercase tracking-wider text-text-subtle">Order Number</p>
								<p className="font-display text-xl font-semibold text-primary">{order.orderNumber}</p>
							</div>
							<div className="text-right">
								<p className="text-xs uppercase tracking-wider text-text-subtle">Payment Method</p>
								<p className="text-text">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Card (Stripe)"}</p>
							</div>
						</div>

						<div className="space-y-3 border-t border-border pt-4">
							{order.items.map((item) => (
								<div key={item.id} className="flex justify-between text-sm">
									<span className="text-text-muted">
										{item.productName} × {item.quantity}
									</span>
									<span className="text-text">${item.subtotal.toFixed(2)}</span>
								</div>
							))}
						</div>

						<div className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
							<div className="flex justify-between text-text-muted">
								<span>Subtotal</span>
								<span>${order.subtotal.toFixed(2)}</span>
							</div>
							{order.discount > 0 && (
								<div className="flex justify-between text-primary">
									<span>Discount</span>
									<span>-${order.discount.toFixed(2)}</span>
								</div>
							)}
							<div className="flex justify-between text-text-muted">
								<span>Shipping</span>
								<span>{order.shippingCost === 0 ? "Free" : `$${order.shippingCost.toFixed(2)}`}</span>
							</div>
							<div className="flex justify-between font-display text-base font-semibold text-text">
								<span>Total</span>
								<span>${order.total.toFixed(2)}</span>
							</div>
						</div>
					</div>

					<div className="flex flex-col justify-center gap-3 sm:flex-row">
						<Button href={`/track-order?orderNumber=${order.orderNumber}`}>Track This Order</Button>
						<Button href="/shop" variant="secondary">
							Continue Shopping
						</Button>
					</div>
				</Container>
			</main>
			<Footer />
		</>
	);
}
