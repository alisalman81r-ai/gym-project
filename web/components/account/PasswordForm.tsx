"use client";

import { useActionState, useRef, useEffect } from "react";
import { Button } from "@/components/ui";
import { changePasswordAction, type AccountFormState } from "@/lib/actions/account";

const initialState: AccountFormState = {};
const inputClasses =
	"w-full rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";

export function PasswordForm() {
	const [state, action, pending] = useActionState(changePasswordAction, initialState);
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (state?.success) formRef.current?.reset();
	}, [state]);

	return (
		<form ref={formRef} action={action} className="space-y-4 rounded-2xl border border-border bg-secondary p-6">
			<h2 className="font-display text-lg font-semibold text-text">Change Password</h2>

			<div className="flex flex-col gap-2">
				<label htmlFor="currentPassword" className="text-sm font-semibold text-text-muted">
					Current Password
				</label>
				<input
					id="currentPassword"
					name="currentPassword"
					type="password"
					autoComplete="current-password"
					required
					className={inputClasses}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="newPassword" className="text-sm font-semibold text-text-muted">
					New Password
				</label>
				<input
					id="newPassword"
					name="newPassword"
					type="password"
					autoComplete="new-password"
					minLength={8}
					required
					className={inputClasses}
				/>
			</div>

			{state?.error && <p className="text-sm text-error">{state.error}</p>}
			{state?.success && <p className="text-sm text-success">{state.success}</p>}

			<Button type="submit" disabled={pending}>
				{pending ? "Updating..." : "Update Password"}
			</Button>
		</form>
	);
}
