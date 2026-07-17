import type { Metadata } from "next";
import { Navbar, Footer, Container } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import { trackOrder } from "@/lib/store/orders";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STEPS } from "@/lib/orderStatus";

export const metadata: Metadata = { title: "Track Your Order" };

// Reads live order state -- must not be statically cached.
export const dynamic = "force-dynamic";

interface TrackOrderPageProps {
	searchParams: Promise<{ orderNumber?: string; phone?: string }>;
}

export default async function TrackOrderPage({ searchParams }: TrackOrderPageProps) {
	const params = await searchParams;
	const hasQuery = Boolean(params.orderNumber && params.phone);
	const order = hasQuery ? trackOrder(params.orderNumber!, params.phone!) : null;
	const currentStepIndex = order ? ORDER_STATUS_STEPS.indexOf(order.status) : -1;

	return (
		<>
			<Navbar />
			<PageHeader eyebrow="Order Tracking" title="Track Your Order" />
			<main className="py-16">
				<Container className="mx-auto max-w-xl">
					<form method="get" className="mb-10 space-y-4 rounded-2xl border border-border bg-secondary p-8">
						<div className="flex flex-col gap-2">
							<label htmlFor="orderNumber" className="text-sm font-semibold text-text-muted">
								Order ID
							</label>
							<input
								id="orderNumber"
								name="orderNumber"
								defaultValue={params.orderNumber ?? ""}
								required
								placeholder="ORD-20260716-A1B2C"
								className="rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label htmlFor="phone" className="text-sm font-semibold text-text-muted">
								Phone Number
							</label>
							<input
								id="phone"
								name="phone"
								defaultValue={params.phone ?? ""}
								required
								placeholder="The phone number used at checkout"
								className="rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
							/>
						</div>
						<button
							type="submit"
							className="w-full rounded-full bg-gradient-to-br from-primary-light to-primary px-6 py-3 text-sm font-semibold text-background shadow-gold"
						>
							Track Order
						</button>
					</form>

					{hasQuery && !order && (
						<p className="text-center text-error">No order found matching that Order ID and phone number.</p>
					)}

					{order && (
						<div className="rounded-2xl border border-border bg-secondary p-8">
							<div className="mb-6 flex items-center justify-between">
								<div>
									<p className="text-xs uppercase tracking-wider text-text-subtle">Order</p>
									<p className="font-display text-lg font-semibold text-primary">{order.orderNumber}</p>
								</div>
								<span
									className={`rounded-full px-3 py-1 text-xs font-semibold ${
										order.status === "cancelled" ? "bg-error/15 text-error" : "bg-primary/10 text-primary"
									}`}
								>
									{ORDER_STATUS_LABELS[order.status]}
								</span>
							</div>

							{order.status !== "cancelled" && (
								<div className="mb-6 flex items-center justify-between">
									{ORDER_STATUS_STEPS.map((step, index) => (
										<div key={step} className="flex flex-1 flex-col items-center gap-2 text-center">
											<div className={`h-3 w-3 rounded-full ${index <= currentStepIndex ? "bg-primary" : "bg-border"}`} />
											<span
												className={`text-[0.65rem] uppercase tracking-wide ${
													index <= currentStepIndex ? "text-text" : "text-text-subtle"
												}`}
											>
												{ORDER_STATUS_LABELS[step]}
											</span>
										</div>
									))}
								</div>
							)}

							<div className="space-y-2 text-sm text-text-muted">
								<p>
									<span className="text-text-subtle">Shipping to:</span> {order.addressLine}, {order.city} {order.postalCode}
								</p>
								{order.courierName && (
									<p>
										<span className="text-text-subtle">Courier:</span> {order.courierName}
									</p>
								)}
								{order.trackingNumber && (
									<p>
										<span className="text-text-subtle">Tracking #:</span> {order.trackingNumber}
									</p>
								)}
								{order.estimatedDeliveryDate && (
									<p>
										<span className="text-text-subtle">Estimated delivery:</span> {order.estimatedDeliveryDate}
									</p>
								)}
							</div>

							<div className="mt-6 space-y-3 border-t border-border pt-4">
								{order.items.map((item) => (
									<div key={item.id} className="flex justify-between text-sm">
										<span className="text-text-muted">
											{item.productName} × {item.quantity}
										</span>
										<span className="text-text">${item.subtotal.toFixed(2)}</span>
									</div>
								))}
							</div>
							<div className="mt-4 flex justify-between border-t border-border pt-4 font-display text-base font-semibold text-text">
								<span>Total</span>
								<span>${order.total.toFixed(2)}</span>
							</div>
						</div>
					)}
				</Container>
			</main>
			<Footer />
		</>
	);
}
