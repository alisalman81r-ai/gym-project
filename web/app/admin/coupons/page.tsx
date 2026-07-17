import Link from "next/link";
import { Container } from "@/components/layout";
import { Button } from "@/components/ui";
import { listCoupons } from "@/lib/store/coupons";
import { deleteCouponAction } from "./actions";

export const metadata = { title: "Manage Coupons" };

// Reads live usage counts -- must not be statically cached.
export const dynamic = "force-dynamic";

export default function AdminCouponsPage() {
	const coupons = listCoupons();

	return (
		<main className="py-16">
			<Container>
				<div className="mb-8 flex items-center justify-between">
					<h1 className="font-display text-3xl font-bold text-text">Coupons ({coupons.length})</h1>
					<Button href="/admin/coupons/new">Add Coupon</Button>
				</div>

				<div className="overflow-x-auto rounded-2xl border border-border">
					<table className="w-full min-w-[800px] border-collapse text-sm">
						<thead>
							<tr className="border-b border-border bg-secondary text-left text-text-muted">
								<th className="p-3">Code</th>
								<th className="p-3">Discount</th>
								<th className="p-3">Expiry</th>
								<th className="p-3">Usage</th>
								<th className="p-3">Status</th>
								<th className="p-3">Actions</th>
							</tr>
						</thead>
						<tbody>
							{coupons.length === 0 && (
								<tr>
									<td colSpan={6} className="p-4 text-center text-text-muted">
										No coupons yet.
									</td>
								</tr>
							)}
							{coupons.map((coupon) => {
								const removeAction = deleteCouponAction.bind(null, coupon.id);
								return (
									<tr key={coupon.id} className="border-b border-border align-top">
										<td className="p-3 font-semibold text-primary">{coupon.code}</td>
										<td className="p-3 text-text-muted">
											{coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value.toFixed(2)}`}
										</td>
										<td className="p-3 text-text-muted">{coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "No expiry"}</td>
										<td className="p-3 text-text-muted">
											{coupon.usedCount}
											{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
										</td>
										<td className="p-3">
											<span
												className={`rounded-full px-3 py-1 text-xs font-semibold ${
													coupon.active && !coupon.isExpired ? "bg-primary/10 text-primary" : "bg-error/15 text-error"
												}`}
											>
												{!coupon.active ? "Inactive" : coupon.isExpired ? "Expired" : "Active"}
											</span>
										</td>
										<td className="p-3">
											<div className="flex flex-col gap-2">
												<Link href={`/admin/coupons/${coupon.id}/edit`} className="text-xs font-semibold text-primary hover:underline">
													Edit
												</Link>
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
