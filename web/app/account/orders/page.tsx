import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, Footer, Container } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import { requireCustomer } from "@/lib/customerAuth";
import { getOrdersForUser } from "@/lib/store/orders";
import { ORDER_STATUS_LABELS } from "@/lib/orderStatus";

export const metadata: Metadata = { title: "Order History", robots: { index: false, follow: false } };

// Reads the customer's live order history -- must not be statically cached.
export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
	const customer = await requireCustomer();
	const orders = getOrdersForUser(customer.id);

	return (
		<>
			<Navbar />
			<PageHeader eyebrow="My Account" title="Order History" />
			<main className="py-16">
				<Container>
					{orders.length === 0 ? (
						<p className="text-text-muted">You haven&rsquo;t placed any orders yet.</p>
					) : (
						<div className="space-y-6">
							{orders.map((order) => (
								<div key={order.id} className="rounded-2xl border border-border bg-secondary p-6">
									<div className="mb-4 flex flex-wrap items-center justify-between gap-2">
										<div>
											<p className="font-display font-semibold text-primary">{order.orderNumber}</p>
											<p className="text-xs text-text-subtle">{order.createdAt}</p>
										</div>
										<div className="flex items-center gap-3">
											<span
												className={`rounded-full px-3 py-1 text-xs font-semibold ${
													order.status === "cancelled" ? "bg-error/15 text-error" : "bg-primary/10 text-primary"
												}`}
											>
												{ORDER_STATUS_LABELS[order.status]}
											</span>
											<Link
												href={`/track-order?orderNumber=${order.orderNumber}&phone=${encodeURIComponent(order.customerPhone)}`}
												className="text-sm text-primary hover:underline"
											>
												Track
											</Link>
										</div>
									</div>
									<div className="space-y-2 border-t border-border pt-4 text-sm">
										{order.items.map((item) => (
											<div key={item.id} className="flex justify-between text-text-muted">
												<span>
													{item.productName} × {item.quantity}
												</span>
												<span className="text-text">${item.subtotal.toFixed(2)}</span>
											</div>
										))}
									</div>
									<div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold text-text">
										<span>Total</span>
										<span>${order.total.toFixed(2)}</span>
									</div>
								</div>
							))}
						</div>
					)}
				</Container>
			</main>
			<Footer />
		</>
	);
}
