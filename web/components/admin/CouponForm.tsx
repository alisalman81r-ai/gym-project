"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import type { CouponFormState } from "@/app/admin/coupons/actions";
import type { Coupon } from "@/types";

const initialState: CouponFormState = {};
const inputClasses =
	"w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";

export interface CouponFormProps {
	action: (prevState: CouponFormState | undefined, formData: FormData) => Promise<CouponFormState>;
	coupon?: Coupon;
	submitLabel: string;
}

export function CouponForm({ action, coupon, submitLabel }: CouponFormProps) {
	const [state, formAction, pending] = useActionState(action, initialState);

	return (
		<form action={formAction} className="max-w-lg space-y-4 rounded-2xl border border-border bg-secondary p-8">
			<div className="flex flex-col gap-2">
				<label htmlFor="code" className="text-sm font-semibold text-text-muted">
					Coupon Code
				</label>
				<input id="code" name="code" type="text" defaultValue={coupon?.code} required className={`${inputClasses} uppercase`} />
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="flex flex-col gap-2">
					<label htmlFor="type" className="text-sm font-semibold text-text-muted">
						Discount Type
					</label>
					<select id="type" name="type" defaultValue={coupon?.type ?? "percentage"} className={inputClasses}>
						<option value="percentage">Percentage (%)</option>
						<option value="fixed">Fixed Amount ($)</option>
					</select>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="value" className="text-sm font-semibold text-text-muted">
						Value
					</label>
					<input id="value" name="value" type="number" step="0.01" min="0" defaultValue={coupon?.value} required className={inputClasses} />
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="flex flex-col gap-2">
					<label htmlFor="expiresAt" className="text-sm font-semibold text-text-muted">
						Expiry Date <span className="text-text-subtle">(optional)</span>
					</label>
					<input id="expiresAt" name="expiresAt" type="date" defaultValue={coupon?.expiresAt?.slice(0, 10) ?? ""} className={inputClasses} />
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="usageLimit" className="text-sm font-semibold text-text-muted">
						Usage Limit <span className="text-text-subtle">(optional)</span>
					</label>
					<input id="usageLimit" name="usageLimit" type="number" min="1" defaultValue={coupon?.usageLimit ?? ""} className={inputClasses} />
				</div>
			</div>

			<label className="flex items-center gap-2 text-sm text-text-muted">
				<input type="checkbox" name="active" defaultChecked={coupon?.active ?? true} className="accent-primary" /> Active
			</label>

			{state?.error && <p className="text-sm text-error">{state.error}</p>}

			<Button type="submit" disabled={pending}>
				{pending ? "Saving..." : submitLabel}
			</Button>
		</form>
	);
}
