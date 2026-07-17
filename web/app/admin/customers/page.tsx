import Link from "next/link";
import { Container } from "@/components/layout";
import { listCustomers } from "@/lib/store/customers";
import { toggleBlockedAction } from "./actions";

export const metadata = { title: "Manage Customers" };

// Reads live customer/order data -- must not be statically cached.
export const dynamic = "force-dynamic";

interface CustomersPageProps {
	searchParams: Promise<{ q?: string }>;
}

export default async function AdminCustomersPage({ searchParams }: CustomersPageProps) {
	const params = await searchParams;
	const customers = listCustomers(params.q);

	return (
		<main className="py-16">
			<Container>
				<h1 className="mb-8 font-display text-3xl font-bold text-text">Customers ({customers.length})</h1>

				<form method="get" className="mb-6 flex gap-2">
					<input
						name="q"
						defaultValue={params.q ?? ""}
						placeholder="Search by name or email..."
						className="w-full max-w-sm rounded-md border border-border bg-secondary px-4 py-2 text-sm text-text focus:border-primary focus:outline-none"
					/>
					<button
						type="submit"
						className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-background"
					>
						Search
					</button>
				</form>

				<div className="overflow-x-auto rounded-2xl border border-border">
					<table className="w-full min-w-[800px] border-collapse text-sm">
						<thead>
							<tr className="border-b border-border bg-secondary text-left text-text-muted">
								<th className="p-3">Name</th>
								<th className="p-3">Email</th>
								<th className="p-3">Phone</th>
								<th className="p-3">Orders</th>
								<th className="p-3">Total Spent</th>
								<th className="p-3">Status</th>
								<th className="p-3">Actions</th>
							</tr>
						</thead>
						<tbody>
							{customers.length === 0 && (
								<tr>
									<td colSpan={7} className="p-4 text-center text-text-muted">
										No customers found.
									</td>
								</tr>
							)}
							{customers.map((customer) => {
								const toggleAction = toggleBlockedAction.bind(null, customer.id, !customer.isBlocked);
								return (
									<tr key={customer.id} className="border-b border-border align-top">
										<td className="p-3 text-text">{customer.name}</td>
										<td className="p-3 text-text-muted">{customer.email}</td>
										<td className="p-3 text-text-muted">{customer.phone ?? "—"}</td>
										<td className="p-3 text-text-muted">{customer.orderCount}</td>
										<td className="p-3 text-text-muted">${customer.totalSpent.toFixed(2)}</td>
										<td className="p-3">
											<span
												className={`rounded-full px-3 py-1 text-xs font-semibold ${
													customer.isBlocked ? "bg-error/15 text-error" : "bg-primary/10 text-primary"
												}`}
											>
												{customer.isBlocked ? "Blocked" : "Active"}
											</span>
										</td>
										<td className="p-3">
											<div className="flex flex-col gap-2">
												<Link href={`/admin/customers/${customer.id}/edit`} className="text-xs font-semibold text-primary hover:underline">
													Edit
												</Link>
												<form action={toggleAction}>
													<button type="submit" className="text-xs font-semibold text-error hover:underline">
														{customer.isBlocked ? "Unblock" : "Block"}
													</button>
												</form>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</Container>
		</main>
	);
}
