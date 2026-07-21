import { notFound } from "next/navigation";
import { Container } from "@/components/layout";
import { PrintInvoiceButton } from "@/components/admin/PrintInvoiceButton";
import { getOrderById } from "@/lib/store/orders";
import { ORDER_STATUS_LABELS } from "@/lib/orderStatus";
import { updateOrderStatusAction, assignTrackingAction } from "../actions";
import type { OrderStatus } from "@/types";

export const metadata = { title: "Order Detail" };

// Reads live order state -- must not be statically cached.
export const dynamic = "force-dynamic";

const STATUS_OPTIONS: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"];

interface OrderDetailPageProps {
	params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
	const { id } = await params;
	const order = getOrderById(Number(id));
	if (!order) notFound();

	return (
		<main className="py-16">
			<Container className="max-w-4xl">
				<div className="rounded-2xl border border-border bg-secondary p-8">
					<div className="mb-6 flex flex-wrap items-start justify-between gap-4">
						<div>
							<h1 className="font-display text-2xl font-bold text-text">Order {order.orderNumber}</h1>
							<p className="text-sm text-text-subtle">{order.createdAt}</p>
						</div>
						<div className="text-right text-sm text-text-muted">
							<p className="font-semibold text-text">{order.customerName}</p>
							<p>{order.customerEmail}</p>
							<p>{order.customerPhone}</p>
						</div>
					</div>

					<div className="mb-6 grid gap-4 sm:grid-cols-2">
						<div>
							<p className="text-xs uppercase tracking-wider text-text-subtle">Shipping Address</p>
							<p className="text-sm text-text-muted">
								{order.addressLine}, {order.city} {order.postalCode}
							</p>
						</div>
						<div className="sm:text-right">
							<p className="text-xs uppercase tracking-wider text-text-subtle">Payment Method</p>
							<p className="text-sm text-text-muted">
								{order.paymentMethod === "cod" ? "Cash on Delivery" : "Card (Stripe)"} — {order.paymentStatus}
							</p>
						</div>
					</div>

					<div className="space-y-2 border-t border-border pt-4">
						{order.items.map((item) => (
							<div key={item.id} className="flex justify-between text-sm">
								<span className="text-text-muted">
									{item.productName}
									{item.size || item.color ? ` (${[item.size, item.color].filter(Boolean).join(" / ")})` : ""} × {item.quantity}
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
								<span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
								<span>-${order.discount.toFixed(2)}</span>
							</div>
						)}
						<div className="flex justify-between text-text-muted">
							<span>Shipping</span>
							<span>{order.shippingCost === 0 ? "Free" : `$${order.shippingCost.toFixed(2)}`}</span>
						</div>
						<div className="flex justify-between border-t border-border pt-2 font-display text-base font-semibold text-text">
							<span>Total</span>
							<span>${order.total.toFixed(2)}</span>
						</div>
					</div>

					{(order.courierName || order.trackingNumber) && (
						<div className="mt-6 border-t border-border pt-4 text-sm text-text-muted">
							{order.courierName && <p>Courier: {order.courierName}</p>}
							{order.trackingNumber && <p>Tracking #: {order.trackingNumber}</p>}
							{order.estimatedDeliveryDate && <p>Estimated delivery: {order.estimatedDeliveryDate}</p>}
						</div>
					)}
				</div>

				<div className="no-print mt-8 grid gap-6 sm:grid-cols-2">
					<form action={updateOrderStatusAction.bind(null, order.id)} className="space-y-3 rounded-2xl border border-border bg-secondary p-6">
						<h2 className="font-display text-lg font-semibold text-text">Update Status</h2>
						<select
							name="status"
							defaultValue={order.status}
							className="w-full rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none"
						>
							{STATUS_OPTIONS.map((option) => (
								<option key={option} value={option}>
									{ORDER_STATUS_LABELS[option]}
								</option>
							))}
						</select>
						<button
							type="submit"
							className="rounded-full bg-gradient-to-br from-primary-light to-primary px-6 py-2 text-sm font-semibold text-background shadow-gold"
						>
							Update
						</button>
					</form>

					<form action={assignTrackingAction.bind(null, order.id)} className="space-y-3 rounded-2xl border border-border bg-secondary p-6">
						<h2 className="font-display text-lg font-semibold text-text">Assign Tracking</h2>
						<input
							name="courierName"
							defaultValue={order.courierName ?? ""}
							placeholder="Courier name"
							required
							className="w-full rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none"
						/>
						<input
							name="trackingNumber"
							defaultValue={order.trackingNumber ?? ""}
							placeholder="Tracking number"
							required
							className="w-full rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none"
						/>
						<input
							name="estimatedDeliveryDate"
							type="date"
							defaultValue={order.estimatedDeliveryDate ?? ""}
							className="w-full rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none"
						/>
						<button
							type="submit"
							className="rounded-full border border-primary px-6 py-2 text-sm font-semibold text-text transition-colors hover:bg-primary hover:text-background"
						>
							Save Tracking
						</button>
					</form>
				</div>

				<div className="no-print mt-6">
					<PrintInvoiceButton />
				</div>
			</Container>
		</main>
	);
}
