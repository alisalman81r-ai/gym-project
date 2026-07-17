"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { submitReviewAction, type ReviewFormState } from "@/lib/actions/reviews";

const initialState: ReviewFormState = {};

export function ReviewForm({ productId }: { productId: number }) {
	const [state, action, pending] = useActionState(submitReviewAction, initialState);

	if (state?.success) {
		return (
			<p className="rounded-2xl border border-primary/40 bg-primary/5 p-6 text-sm text-text-muted">
				Thanks for your review — it will appear once approved.
			</p>
		);
	}

	return (
		<form action={action} className="space-y-4 rounded-2xl border border-border bg-secondary p-6">
			<input type="hidden" name="productId" value={productId} />

			<div>
				<label htmlFor="rating" className="mb-2 block text-sm font-semibold text-text-muted">
					Rating
				</label>
				<select
					id="rating"
					name="rating"
					defaultValue="5"
					className="rounded-md border border-border bg-background px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
				>
					{[5, 4, 3, 2, 1].map((value) => (
						<option key={value} value={value}>
							{value} star{value > 1 ? "s" : ""}
						</option>
					))}
				</select>
			</div>

			<div>
				<label htmlFor="comment" className="mb-2 block text-sm font-semibold text-text-muted">
					Your review
				</label>
				<textarea
					id="comment"
					name="comment"
					rows={4}
					required
					className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
				/>
			</div>

			<div>
				<label htmlFor="image" className="mb-2 block text-sm font-semibold text-text-muted">
					Photo <span className="text-text-subtle">(optional)</span>
				</label>
				<input id="image" name="image" type="file" accept="image/*" className="w-full text-sm text-text-muted" />
			</div>

			{state?.error && <p className="text-sm text-error">{state.error}</p>}

			<Button type="submit" disabled={pending}>
				{pending ? "Submitting..." : "Submit Review"}
			</Button>
		</form>
	);
}
