"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { updateProfileAction, type AccountFormState } from "@/lib/actions/account";

const initialState: AccountFormState = {};
const inputClasses =
	"w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";

export interface ProfileFormProps {
	name: string;
	email: string;
	phone: string;
}

export function ProfileForm({ name, email, phone }: ProfileFormProps) {
	const [state, action, pending] = useActionState(updateProfileAction, initialState);

	return (
		<form action={action} className="space-y-4 rounded-2xl border border-border bg-secondary p-6">
			<h2 className="font-display text-lg font-semibold text-text">Profile Details</h2>

			<div className="flex flex-col gap-2">
				<label htmlFor="name" className="text-sm font-semibold text-text-muted">
					Full Name
				</label>
				<input id="name" name="name" type="text" defaultValue={name} required className={inputClasses} />
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="email" className="text-sm font-semibold text-text-muted">
					Email Address
				</label>
				<input id="email" name="email" type="email" defaultValue={email} required className={inputClasses} />
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="phone" className="text-sm font-semibold text-text-muted">
					Phone Number
				</label>
				<input id="phone" name="phone" type="tel" defaultValue={phone} className={inputClasses} />
			</div>

			{state?.error && <p className="text-sm text-error">{state.error}</p>}
			{state?.success && <p className="text-sm text-success">{state.success}</p>}

			<Button type="submit" disabled={pending}>
				{pending ? "Saving..." : "Save Changes"}
			</Button>
		</form>
	);
}
