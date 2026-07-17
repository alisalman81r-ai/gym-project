"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { addAddressAction, type AddressFormState } from "@/lib/actions/account";

const initialState: AddressFormState = {};
const inputClasses =
	"w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";

export function AddressForm() {
	const [state, action, pending] = useActionState(addAddressAction, initialState);

	return (
		<form action={action} className="h-fit space-y-4 rounded-2xl border border-border bg-secondary p-6">
			<h2 className="font-display text-lg font-semibold text-text">Add Address</h2>

			<div className="flex flex-col gap-2">
				<label htmlFor="fullName" className="text-sm font-semibold text-text-muted">
					Full Name
				</label>
				<input id="fullName" name="fullName" type="text" required className={inputClasses} />
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="addr-phone" className="text-sm font-semibold text-text-muted">
					Phone
				</label>
				<input id="addr-phone" name="phone" type="tel" required className={inputClasses} />
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="addressLine" className="text-sm font-semibold text-text-muted">
					Address
				</label>
				<textarea id="addressLine" name="addressLine" rows={2} required className={inputClasses} />
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="addr-city" className="text-sm font-semibold text-text-muted">
					City
				</label>
				<input id="addr-city" name="city" type="text" required className={inputClasses} />
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="postalCode" className="text-sm font-semibold text-text-muted">
					Postal Code
				</label>
				<input id="postalCode" name="postalCode" type="text" required className={inputClasses} />
			</div>

			<label className="flex items-center gap-2 text-sm text-text-muted">
				<input type="checkbox" name="isDefault" className="accent-primary" /> Set as default address
			</label>

			{state?.error && <p className="text-sm text-error">{state.error}</p>}

			<Button type="submit" disabled={pending} className="w-full">
				{pending ? "Saving..." : "Save Address"}
			</Button>
		</form>
	);
}
