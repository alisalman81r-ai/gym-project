"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { joinMembershipAction, type MembershipFormState } from "@/lib/actions/membership";

const initialState: MembershipFormState = {};
const inputClasses =
	"w-full rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";

export interface MembershipJoinFormProps {
	planId: string;
	isStripeEnabled: boolean;
}

export function MembershipJoinForm({ planId, isStripeEnabled }: MembershipJoinFormProps) {
	const boundAction = joinMembershipAction.bind(null, planId);
	const [state, formAction, pending] = useActionState(boundAction, initialState);

	return (
		<form action={formAction} className="space-y-5 rounded-2xl border border-border bg-secondary p-8">
			<div className="flex flex-col gap-2">
				<label htmlFor="customerName" className="text-sm font-semibold text-text-muted">
					Full Name
				</label>
				<input id="customerName" name="customerName" type="text" autoComplete="name" required className={inputClasses} />
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="customerEmail" className="text-sm font-semibold text-text-muted">
					Email Address
				</label>
				<input id="customerEmail" name="customerEmail" type="email" autoComplete="email" required className={inputClasses} />
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="customerPhone" className="text-sm font-semibold text-text-muted">
					Phone Number <span className="text-text-subtle">(optional)</span>
				</label>
				<input id="customerPhone" name="customerPhone" type="tel" autoComplete="tel" className={inputClasses} />
			</div>

			{!isStripeEnabled && (
				<p className="rounded-md border border-primary/30 bg-primary/5 p-3 text-sm text-text-muted">
					Online sign-up isn't live yet — submitting will let you know to contact us directly instead.
				</p>
			)}

			{state?.error && <p className="text-sm text-error">{state.error}</p>}

			<Button type="submit" disabled={pending} className="w-full">
				{pending ? "Redirecting to payment..." : "Continue to Payment"}
			</Button>
		</form>
	);
}
