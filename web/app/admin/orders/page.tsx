import Link from "next/link";
import { Container } from "@/components/layout";
import { listOrders } from "@/lib/store/orders";
import { ORDER_STATUS_LABELS } from "@/lib/orderStatus";
import type { OrderStatus } from "@/types";

export const metadata = { title: "Manage Orders" };

// Reads live order state -- must not be statically cached.
export const dynamic = "force-dynamic";

const STATUS_OPTIONS: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"];

interface OrdersPageProps {
	searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
	const params = await searchParams;
	const status = STATUS_OPTIONS.includes(params.status as OrderStatus) ? (params.status as OrderStatus) : undefined;
	const { orders, total } = listOrders({ search: params.q, status, pageSize: 100 });

	return (
		<main className="py-16">
			<Container>
				<h1 className="mb-8 font-display text-3xl font-bold text-text">Orders ({total})</h1>

				<form method="get" className="mb-6 flex flex-wrap gap-3">
					<input
						name="q"
						defaultValue={params.q ?? ""}
						placeholder="Search order #, name, email, phone..."
						className="w-full max-w-sm rounded-md border border-border bg-secondary px-4 py-2 text-sm text-text focus:border-primary focus:outline-none"
					/>
					<select
						name="status"
						defaultValue={params.status ?? ""}
						className="rounded-md border border-border bg-secondary px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
					>
						<option value="">All Statuses</option>
						{STATUS_OPTIONS.map((option) => (
							<option key={option} value={option}>
								{ORDER_STATUS_LABELS[option]}
							</option>
						))}
					</select>
					<button
						type="submit"
						className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-background"
					>
						Filter
					</button>
				</form>

				<div className="overflow-x-auto rounded-2xl border border-border">
					<table className="w-full min-w-[900px] border-collapse text-sm">
						<thead>
							<tr className="border-b border-border bg-secondary text-left text-text-muted">
								<th className="p-3">Order #</th>
								<th className="p-3">Date</th>
								<th className="p-3">Customer</th>
								<th className="p-3">Total</th>
								<th className="p-3">Payment</th>
								<th className="p-3">Status</th>
								<th className="p-3">Actions</th>
							</tr>
						</thead>
						<tbody>
							{orders.length === 0 && (
								<tr>
									<td colSpan={7} className="p-4 text-center text-text-muted">
										No orders found.
									</td>
								</tr>
							)}
							{orders.map((order) => (
								<tr key={order.id} className="border-b border-border align-top">
									<td className="p-3 font-semibold text-primary">{order.orderNumber}</td>
									<td className="p-3 text-text-subtle">{order.createdAt}</td>
									<td className="p-3 text-text-muted">
										{order.customerName}
										<br />
										<span className="text-xs text-text-subtle">{order.customerEmail}</span>
									</td>
									<td className="p-3 text-text">${order.total.toFixed(2)}</td>
									<td className="p-3 text-text-muted">{order.paymentMethod === "cod" ? "COD" : "Stripe"}</td>
									<td className="p-3">
										<span
											className={`rounded-full px-3 py-1 text-xs font-semibold ${
												order.status === "cancelled" ? "bg-error/15 text-error" : "bg-primary/10 text-primary"
											}`}
										>
											{ORDER_STATUS_LABELS[order.status]}
										</span>
									</td>
									<td className="p-3">
										<Link href={`/admin/orders/${order.id}`} className="text-xs font-semibold text-primary hover:underline">
											View
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Container>
		</main>
	);
}
