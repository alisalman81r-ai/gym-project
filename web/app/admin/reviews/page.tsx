import Link from "next/link";
import { Container } from "@/components/layout";
import { listReviewsForAdmin } from "@/lib/store/reviews";
import { approveReviewAction, deleteReviewAction } from "./actions";

export const metadata = { title: "Manage Reviews" };

// Reads live review moderation queue -- must not be statically cached.
export const dynamic = "force-dynamic";

export default function AdminReviewsPage() {
	const reviews = listReviewsForAdmin();

	return (
		<main className="py-16">
			<Container>
				<h1 className="mb-8 font-display text-3xl font-bold text-text">Reviews ({reviews.length})</h1>

				{reviews.length === 0 ? (
					<p className="text-text-muted">No reviews yet.</p>
				) : (
					<div className="space-y-4">
						{reviews.map((review) => {
							const approveAction = approveReviewAction.bind(null, review.id);
							const removeAction = deleteReviewAction.bind(null, review.id);
							return (
								<div key={review.id} className="rounded-2xl border border-border bg-secondary p-6">
									<div className="mb-2 flex flex-wrap items-center justify-between gap-2">
										<div>
											<Link href={`/shop/${review.productSlug}`} className="font-semibold text-primary hover:underline">
												{review.productName}
											</Link>
											<p className="text-xs text-text-subtle">
												{review.customerName} — {review.rating} star{review.rating > 1 ? "s" : ""} — {review.createdAt}
											</p>
										</div>
										<span
											className={`rounded-full px-3 py-1 text-xs font-semibold ${
												review.approved ? "bg-primary/10 text-primary" : "bg-error/15 text-error"
											}`}
										>
											{review.approved ? "Approved" : "Pending"}
										</span>
									</div>
									<p className="mb-4 text-sm text-text-muted">{review.comment}</p>
									<div className="flex gap-4">
										{!review.approved && (
											<form action={approveAction}>
												<button type="submit" className="text-sm font-semibold text-primary hover:underline">
													Approve
												</button>
											</form>
										)}
										<form action={removeAction}>
											<button type="submit" className="text-sm font-semibold text-error hover:underline">
												Delete
											</button>
										</form>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</Container>
		</main>
	);
}
