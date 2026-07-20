import { Container } from "@/components/layout";
import { listMemberships } from "@/lib/store/memberships";

export const metadata = { title: "Memberships" };

// Reads live subscription status synced from Stripe webhooks -- must not be statically cached.
export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, string> = {
	active: "bg-primary/10 text-primary",
	pending: "border border-border text-text-muted",
	past_due: "bg-error/15 text-error",
	canceled: "bg-error/15 text-error",
	incomplete: "border border-border text-text-muted",
};

/** Read-only: membership lifecycle is Stripe-driven (see app/api/stripe/webhook), not manually edited here. */
export default function AdminMembershipsPage() {
	const memberships = listMemberships();

	return (
		<main className="py-16">
			<Container>
				<h1 className="mb-8 font-display text-3xl font-bold text-text">Memberships ({memberships.length})</h1>

				<div className="overflow-x-auto rounded-2xl border border-border">
					<table className="w-full min-w-[800px] border-collapse text-sm">
						<thead>
							<tr className="border-b border-border bg-secondary text-left text-text-muted">
								<th className="p-3">Customer</th>
								<th className="p-3">Plan</th>
								<th className="p-3">Price</th>
								<th className="p-3">Status</th>
								<th className="p-3">Renews / Ended</th>
								<th className="p-3">Joined</th>
							</tr>
						</thead>
						<tbody>
							{memberships.length === 0 && (
								<tr>
									<td colSpan={6} className="p-4 text-center text-text-muted">
										No memberships yet.
									</td>
								</tr>
							)}
							{memberships.map((membership) => (
								<tr key={membership.id} className="border-b border-border align-top">
									<td className="p-3 text-text">
										{membership.customerName}
										<br />
										<span className="text-xs text-text-subtle">{membership.customerEmail}</span>
									</td>
									<td className="p-3 text-text-muted">{membership.planName}</td>
									<td className="p-3 text-text-muted">${membership.price.toFixed(2)}/mo</td>
									<td className="p-3">
										<span
											className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
												STATUS_TONE[membership.status] ?? "border border-border text-text-muted"
											}`}
										>
											{membership.status.replace("_", " ")}
										</span>
									</td>
									<td className="p-3 text-text-subtle">
										{membership.currentPeriodEnd ? new Date(membership.currentPeriodEnd).toLocaleDateString() : "—"}
									</td>
									<td className="p-3 text-text-subtle">{membership.createdAt}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Container>
		</main>
	);
}
