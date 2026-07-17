import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, Footer, Container } from "@/components/layout";
import { PageHeader, Button } from "@/components/ui";
import { requireCustomer } from "@/lib/customerAuth";
import { getOrdersForUser } from "@/lib/store/orders";
import { logoutAction } from "@/lib/actions/auth";
import { ORDER_STATUS_LABELS } from "@/lib/orderStatus";

export const metadata: Metadata = { title: "My Account", robots: { index: false, follow: false } };

// Reads the customer's live order history -- must not be statically cached.
export const dynamic = "force-dynamic";

export default async function AccountPage() {
	const customer = await requireCustomer();
	const orders = getOrdersForUser(customer.id).slice(0, 3);

	return (
		<>
			<Navbar />
			<PageHeader eyebrow="My Account" title={`Welcome back, ${customer.name.split(" ")[0]}`} />
			<main className="py-16">
				<Container>
					<div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						<Link href="/account/orders" className="rounded-2xl border border-border bg-secondary p-6 transition-colors hover:border-primary/60">
							<p className="font-display text-lg font-semibold text-text">Order History</p>
							<p className="mt-1 text-sm text-text-muted">View past orders</p>
						</Link>
						<Link href="/account/addresses" className="rounded-2xl border border-border bg-secondary p-6 transition-colors hover:border-primary/60">
							<p className="font-display text-lg font-semibold text-text">Saved Addresses</p>
							<p className="mt-1 text-sm text-text-muted">Manage delivery addresses</p>
						</Link>
						<Link href="/account/wishlist" className="rounded-2xl border border-border bg-secondary p-6 transition-colors hover:border-primary/60">
							<p className="font-display text-lg font-semibold text-text">Wishlist</p>
							<p className="mt-1 text-sm text-text-muted">Items you&rsquo;ve saved</p>
						</Link>
						<Link href="/account/profile" className="rounded-2xl border border-border bg-secondary p-6 transition-colors hover:border-primary/60">
							<p className="font-display text-lg font-semibold text-text">Profile Settings</p>
							<p className="mt-1 text-sm text-text-muted">Update details &amp; password</p>
						</Link>
					</div>

					<div className="mb-8 flex items-center justify-between">
						<h2 className="font-display text-xl font-semibold text-text">Recent Orders</h2>
						<form action={logoutAction}>
							<Button type="submit" variant="secondary" size="sm">
								Log Out
							</Button>
						</form>
					</div>

					{orders.length === 0 ? (
						<p className="text-text-muted">
							No orders yet.{" "}
							<Link href="/shop" className="text-primary hover:underline">
								Start shopping
							</Link>
							.
						</p>
					) : (
						<div className="space-y-4">
							{orders.map((order) => (
								<Link
									key={order.id}
									href="/account/orders"
									className="flex items-center justify-between rounded-xl border border-border bg-secondary p-5 transition-colors hover:border-primary/60"
								>
									<div>
										<p className="font-semibold text-text">{order.orderNumber}</p>
										<p className="text-xs text-text-subtle">{order.createdAt}</p>
									</div>
									<div className="text-right">
										<p className="text-sm text-text">{ORDER_STATUS_LABELS[order.status]}</p>
										<p className="font-semibold text-primary">${order.total.toFixed(2)}</p>
									</div>
								</Link>
							))}
						</div>
					)}
				</Container>
			</main>
			<Footer />
		</>
	);
}
