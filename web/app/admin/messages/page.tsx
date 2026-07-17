import { Container } from "@/components/layout";
import { db } from "@/lib/db";
import { setContactStatusAction, deleteContactAction, setOrderStatusAction, deleteOrderAction } from "./actions";

// Reads the database live on every request -- without this, Next.js
// would prerender it once at build time and it would never show
// submissions/orders created (or status changes made) afterward.
export const dynamic = "force-dynamic";

interface ContactRow {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	interest: string;
	message: string;
	status: string;
	created_at: string;
}

interface OrderRow {
	id: number;
	supplement_name: string;
	quantity: number;
	name: string;
	email: string;
	phone: string | null;
	delivery_address: string;
	notes: string | null;
	status: string;
	created_at: string;
}

function StatusBadge({ status }: { status: string }) {
	const isHandled = status === "handled";
	return (
		<span
			className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
				isHandled ? "bg-primary/10 text-primary" : "bg-error/10 text-error"
			}`}
		>
			{status}
		</span>
	);
}

/** Legacy contact-form / supplement-inquiry tables -- separate from the real orders table added later. */
export default async function AdminMessagesPage() {
	const contacts = db.prepare("SELECT * FROM contact_submissions ORDER BY id DESC").all() as ContactRow[];
	const orders = db.prepare("SELECT * FROM supplement_orders ORDER BY id DESC").all() as OrderRow[];

	return (
		<main className="py-16">
			<Container>
				<h1 className="mb-10 font-display text-3xl font-bold text-text">Contact &amp; Inquiry Messages</h1>

				<h2 className="mb-4 font-display text-xl font-semibold text-text">Contact Submissions ({contacts.length})</h2>
				<div className="mb-16 overflow-x-auto rounded-2xl border border-border">
					<table className="w-full min-w-[900px] border-collapse text-sm">
						<thead>
							<tr className="border-b border-border bg-secondary text-left text-text-muted">
								<th className="p-3">Date</th>
								<th className="p-3">Name</th>
								<th className="p-3">Email</th>
								<th className="p-3">Phone</th>
								<th className="p-3">Interest</th>
								<th className="p-3">Message</th>
								<th className="p-3">Status</th>
								<th className="p-3">Actions</th>
							</tr>
						</thead>
						<tbody>
							{contacts.length === 0 && (
								<tr>
									<td colSpan={8} className="p-4 text-center text-text-muted">
										No submissions yet.
									</td>
								</tr>
							)}
							{contacts.map((row) => {
								const nextStatus = row.status === "handled" ? "new" : "handled";
								const toggleAction = setContactStatusAction.bind(null, row.id, nextStatus);
								const removeAction = deleteContactAction.bind(null, row.id);
								return (
									<tr key={row.id} className="border-b border-border align-top">
										<td className="p-3 text-text-subtle">{row.created_at}</td>
										<td className="p-3 text-text">{row.name}</td>
										<td className="p-3 text-text-muted">{row.email}</td>
										<td className="p-3 text-text-muted">{row.phone ?? "—"}</td>
										<td className="p-3 text-text-muted">{row.interest}</td>
										<td className="p-3 text-text-muted">{row.message}</td>
										<td className="p-3">
											<StatusBadge status={row.status} />
										</td>
										<td className="p-3">
											<div className="flex flex-col gap-2">
												<form action={toggleAction}>
													<button
														type="submit"
														className="rounded-full border border-primary px-4 py-1.5 text-xs font-semibold text-text transition-colors hover:bg-primary hover:text-background"
													>
														Mark {nextStatus}
													</button>
												</form>
												<form action={removeAction}>
													<button type="submit" className="text-xs font-semibold text-error hover:underline">
														Delete
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

				<h2 className="mb-4 font-display text-xl font-semibold text-text">Supplement Order Inquiries ({orders.length})</h2>
				<div className="overflow-x-auto rounded-2xl border border-border">
					<table className="w-full min-w-[1000px] border-collapse text-sm">
						<thead>
							<tr className="border-b border-border bg-secondary text-left text-text-muted">
								<th className="p-3">Date</th>
								<th className="p-3">Product</th>
								<th className="p-3">Qty</th>
								<th className="p-3">Name</th>
								<th className="p-3">Email</th>
								<th className="p-3">Delivery Address</th>
								<th className="p-3">Notes</th>
								<th className="p-3">Status</th>
								<th className="p-3">Actions</th>
							</tr>
						</thead>
						<tbody>
							{orders.length === 0 && (
								<tr>
									<td colSpan={9} className="p-4 text-center text-text-muted">
										No inquiries yet.
									</td>
								</tr>
							)}
							{orders.map((row) => {
								const nextStatus = row.status === "handled" ? "new" : "handled";
								const toggleAction = setOrderStatusAction.bind(null, row.id, nextStatus);
								const removeAction = deleteOrderAction.bind(null, row.id);
								return (
									<tr key={row.id} className="border-b border-border align-top">
										<td className="p-3 text-text-subtle">{row.created_at}</td>
										<td className="p-3 text-text">{row.supplement_name}</td>
										<td className="p-3 text-text-muted">{row.quantity}</td>
										<td className="p-3 text-text-muted">{row.name}</td>
										<td className="p-3 text-text-muted">{row.email}</td>
										<td className="p-3 text-text-muted">{row.delivery_address}</td>
										<td className="p-3 text-text-muted">{row.notes ?? "—"}</td>
										<td className="p-3">
											<StatusBadge status={row.status} />
										</td>
										<td className="p-3">
											<div className="flex flex-col gap-2">
												<form action={toggleAction}>
													<button
														type="submit"
														className="rounded-full border border-primary px-4 py-1.5 text-xs font-semibold text-text transition-colors hover:bg-primary hover:text-background"
													>
														Mark {nextStatus}
													</button>
												</form>
												<form action={removeAction}>
													<button type="submit" className="text-xs font-semibold text-error hover:underline">
														Delete
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
