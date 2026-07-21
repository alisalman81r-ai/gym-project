"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { applyCouponAction, removeCouponAction, type CouponActionResult } from "@/lib/actions/cart";

const initialState: CouponActionResult = { success: false, message: "" };

export function CouponForm({ appliedCode }: { appliedCode: string | null }) {
	const [state, action, pending] = useActionState(applyCouponAction, initialState);
	const router = useRouter();

	async function handleRemove() {
		await removeCouponAction();
		router.refresh();
	}

	if (appliedCode) {
		return (
			<div className="flex items-center justify-between rounded-md border border-primary/40 bg-primary/5 px-4 py-3 text-sm">
				<span className="text-text">
					Coupon <strong>{appliedCode}</strong> applied
				</span>
				<button type="button" onClick={handleRemove} className="text-error hover:underline">
					Remove
				</button>
			</div>
		);
	}

	return (
		<form action={action} className="flex flex-col gap-2">
			<div className="flex gap-2">
				<input
					name="code"
					placeholder="Coupon code"
					className="flex-1 rounded-md border border-border/80 bg-secondary-light px-4 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
				/>
				<Button type="submit" variant="secondary" size="sm" disabled={pending}>
					{pending ? "Applying..." : "Apply"}
				</Button>
			</div>
			{state?.message && <p className={state.success ? "text-xs text-success" : "text-xs text-error"}>{state.message}</p>}
		</form>
	);
}
