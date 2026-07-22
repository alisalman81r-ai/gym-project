import Link from "next/link";
import { Users, ShoppingBag, DollarSign, Package, Clock, AlertTriangle } from "lucide-react";
import { Container } from "@/components/layout";
import { SalesChart } from "@/components/admin/SalesChart";
import { getDashboardStats, listOrders } from "@/lib/store/orders";
import { getLowStockProducts } from "@/lib/store/products";
import { ORDER_STATUS_LABELS } from "@/lib/orderStatus";
import { cn } from "@/lib/utils";

export const metadata = { title: "Admin Dashboard" };

// Reads live stats on every request -- must not be statically cached.
export const dynamic = "force-dynamic";

interface StatCardProps {
	label: string;
	value: string;
	icon: React.ComponentType<{ size?: number }>;
	/** Flags actionable counts (pending orders, low stock) so they stand out from neutral totals. */
	alert?: boolean;
}

function StatCard({ label, value, icon: Icon, alert }: StatCardProps) {
	return (
		<div className={cn("rounded-2xl border p-6", alert ? "border-error/40 bg-error/5" : "border-border bg-secondary")}>
			<div
				className={cn(
					"mb-3 flex h-10 w-10 items-center justify-center rounded-full",
					alert ? "bg-error/15 text-error" : "bg-primary/10 text-primary"
				)}
			>
				<Icon size={20} />
			</div>
			<p className="text-xs uppercase tracking-wider text-text-subtle">{label}</p>
			<p className={cn("mt-2 font-display text-2xl font-bold", alert ? "text-error" : "text-text")}>{value}</p>
		</div>
	);
}

export default function AdminDashboardPage() {
	const stats = getDashboardStats();
	const lowStock = getLowStockProducts();
	const { orders: recentOrders } = listOrders({ pageSize: 5 });

	return (
		<main className="py-16">
			<Container>
				<h1 className="mb-8 font-display text-3xl font-bold text-text">Dashboard</h1>

				<div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
					<StatCard label="Total Users" value={String(stats.totalUsers)} icon={Users} />
					<StatCard label="Total Orders" value={String(stats.totalOrders)} icon={ShoppingBag} />
					<StatCard label="Total Sales" value={`$${stats.totalSales.toFixed(2)}`} icon={DollarSign} />
					<StatCard label="Total Products" value={String(stats.totalProducts)} icon={Package} />
					<StatCard
						label="Pending Orders"
						value={String(stats.pendingOrders)}
						icon={Clock}
						alert={stats.pendingOrders > 0}
					/>
					<StatCard
						label="Low Stock Products"
						value={String(lowStock.length)}
						icon={AlertTriangle}
						alert={lowStock.length > 0}
					/>
				</div>

				<div className="mb-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
					<div className="rounded-2xl border border-border bg-secondary p-6">
						<h2 className="mb-4 font-display text-lg font-semibold text-text">Monthly Sales</h2>
						<SalesChart data={stats.monthlySales} />
					</div>

					<div className="rounded-2xl border border-border bg-secondary p-6">
						<h2 className="mb-4 font-display text-lg font-semibold text-text">Low Stock Alerts</h2>
						{lowStock.length === 0 ? (
							<p className="text-sm text-text-muted">All products are well stocked.</p>
						) : (
							<ul className="space-y-3">
								{lowStock.map((product) => (
									<li key={product.id} className="flex items-center justify-between text-sm">
										<Link href={`/admin/products/${product.id}/edit`} className="text-text hover:text-primary">
											{product.name}
										</Link>
										<span className="font-semibold text-error">{product.stockQuantity} left</span>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				<div className="rounded-2xl border border-border bg-secondary p-6">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="font-display text-lg font-semibold text-text">Recent Orders</h2>
						<Link href="/admin/orders" className="text-sm text-primary hover:underline">
							View All
						</Link>
					</div>
					{recentOrders.length === 0 ? (
						<p className="text-sm text-text-muted">No orders yet.</p>
					) : (
						<div className="space-y-3">
							{recentOrders.map((order) => (
								<Link
									key={order.id}
									href={`/admin/orders/${order.id}`}
									className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:border-primary/60"
								>
									<span className="text-text">
										{order.orderNumber} — {order.customerName}
									</span>
									<span className="flex items-center gap-3">
										<span
											className={cn(
												"rounded-full px-3 py-1 text-xs font-semibold",
												order.status === "cancelled" ? "bg-error/15 text-error" : "bg-primary/10 text-primary"
											)}
										>
											{ORDER_STATUS_LABELS[order.status]}
										</span>
										<span className="text-text-muted">${order.total.toFixed(2)}</span>
									</span>
								</Link>
							))}
						</div>
					)}
				</div>
			</Container>
		</main>
	);
}
