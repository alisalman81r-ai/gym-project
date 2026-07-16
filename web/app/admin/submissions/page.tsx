import type { Metadata } from "next";
import { Navbar, Footer, Container } from "@/components/layout";
import { db } from "@/lib/db";

export const metadata: Metadata = {
	title: "Submissions",
	robots: { index: false, follow: false },
};

// Reads the database live on every request -- without this, Next.js
// would prerender it once at build time and it would never show
// submissions/orders created afterward.
export const dynamic = "force-dynamic";

interface ContactRow {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	interest: string;
	message: string;
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
	created_at: string;
}

/**
 * Internal, unauthenticated read-only view of the SQLite data behind
 * the Contact form and Supplement orders -- there's no login system
 * on this practice project, so this is not safe to expose if the
 * site is ever deployed publicly (blocked from robots.txt in the
 * meantime, but that's not real access control).
 */
export default function SubmissionsPage() {
	const contacts = db.prepare("SELECT * FROM contact_submissions ORDER BY id DESC").all() as ContactRow[];
	const orders = db.prepare("SELECT * FROM supplement_orders ORDER BY id DESC").all() as OrderRow[];

	return (
		<>
			<Navbar />
			<main className="py-24">
				<Container>
					<h1 className="mb-2 font-display text-3xl font-bold text-text">Submissions (Internal)</h1>
					<p className="mb-10 text-sm text-error">
						No authentication on this page -- do not deploy publicly without adding one.
					</p>

					<h2 className="mb-4 font-display text-xl font-semibold text-text">Contact Form ({contacts.length})</h2>
					<div className="mb-16 overflow-x-auto rounded-2xl border border-border">
						<table className="w-full min-w-[720px] border-collapse text-sm">
							<thead>
								<tr className="border-b border-border bg-secondary text-left text-text-muted">
									<th className="p-3">Date</th>
									<th className="p-3">Name</th>
									<th className="p-3">Email</th>
									<th className="p-3">Phone</th>
									<th className="p-3">Interest</th>
									<th className="p-3">Message</th>
								</tr>
							</thead>
							<tbody>
								{contacts.length === 0 && (
									<tr>
										<td colSpan={6} className="p-4 text-center text-text-muted">
											No submissions yet.
										</td>
									</tr>
								)}
								{contacts.map((row) => (
									<tr key={row.id} className="border-b border-border">
										<td className="p-3 text-text-subtle">{row.created_at}</td>
										<td className="p-3 text-text">{row.name}</td>
										<td className="p-3 text-text-muted">{row.email}</td>
										<td className="p-3 text-text-muted">{row.phone ?? "—"}</td>
										<td className="p-3 text-text-muted">{row.interest}</td>
										<td className="p-3 text-text-muted">{row.message}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<h2 className="mb-4 font-display text-xl font-semibold text-text">Supplement Orders ({orders.length})</h2>
					<div className="overflow-x-auto rounded-2xl border border-border">
						<table className="w-full min-w-[820px] border-collapse text-sm">
							<thead>
								<tr className="border-b border-border bg-secondary text-left text-text-muted">
									<th className="p-3">Date</th>
									<th className="p-3">Product</th>
									<th className="p-3">Qty</th>
									<th className="p-3">Name</th>
									<th className="p-3">Email</th>
									<th className="p-3">Delivery Address</th>
									<th className="p-3">Notes</th>
								</tr>
							</thead>
							<tbody>
								{orders.length === 0 && (
									<tr>
										<td colSpan={7} className="p-4 text-center text-text-muted">
											No orders yet.
										</td>
									</tr>
								)}
								{orders.map((row) => (
									<tr key={row.id} className="border-b border-border">
										<td className="p-3 text-text-subtle">{row.created_at}</td>
										<td className="p-3 text-text">{row.supplement_name}</td>
										<td className="p-3 text-text-muted">{row.quantity}</td>
										<td className="p-3 text-text-muted">{row.name}</td>
										<td className="p-3 text-text-muted">{row.email}</td>
										<td className="p-3 text-text-muted">{row.delivery_address}</td>
										<td className="p-3 text-text-muted">{row.notes ?? "—"}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Container>
			</main>
			<Footer />
		</>
	);
}
