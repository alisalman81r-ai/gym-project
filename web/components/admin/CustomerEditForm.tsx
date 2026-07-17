"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { updateCustomerAction, type CustomerFormState } from "@/app/admin/customers/actions";
import type { CustomerUser } from "@/types";

const initialState: CustomerFormState = {};
const inputClasses =
	"w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";

export function CustomerEditForm({ customer }: { customer: CustomerUser }) {
	const boundAction = updateCustomerAction.bind(null, customer.id);
	const [state, formAction, pending] = useActionState(boundAction, initialState);

	return (
		<form action={formAction} className="max-w-lg space-y-4 rounded-2xl border border-border bg-secondary p-8">
			<div className="flex flex-col gap-2">
				<label htmlFor="name" className="text-sm font-semibold text-text-muted">
					Full Name
				</label>
				<input id="name" name="name" type="text" defaultValue={customer.name} required className={inputClasses} />
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="email" className="text-sm font-semibold text-text-muted">
					Email Address
				</label>
				<input id="email" name="email" type="email" defaultValue={customer.email} required className={inputClasses} />
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="phone" className="text-sm font-semibold text-text-muted">
					Phone Number
				</label>
				<input id="phone" name="phone" type="tel" defaultValue={customer.phone ?? ""} className={inputClasses} />
			</div>

			{state?.error && <p className="text-sm text-error">{state.error}</p>}

			<Button type="submit" disabled={pending}>
				{pending ? "Saving..." : "Save Changes"}
			</Button>
		</form>
	);
}
