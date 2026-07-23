"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { ORDER_STATUS_LABELS } from "@/lib/orderStatus";
import type { StatusFormState } from "@/app/admin/orders/actions";
import type { OrderStatus } from "@/types";

const STATUS_OPTIONS: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"];

interface OrderStatusFormProps {
	/** Pre-bound with the order id -- (prevState, formData) => newState. */
	action: (prevState: StatusFormState | null, formData: FormData) => Promise<StatusFormState>;
	currentStatus: OrderStatus;
}

function SubmitButton({ dirty }: { dirty: boolean }) {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending || !dirty}
			className="rounded-full bg-gradient-to-br from-primary-light to-primary px-6 py-2 text-sm font-semibold text-background shadow-gold transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
		>
			{pending ? "Updating..." : "Update"}
		</button>
	);
}

/**
 * Controlled status picker. The previous version used an uncontrolled
 * <select defaultValue>, which after a server-action re-render could show
 * a value out of sync with what was saved and gave no confirmation the
 * click did anything -- so it felt broken. Here the select is controlled,
 * the button only enables when the value actually changed, and a success
 * message confirms the write.
 */
export function OrderStatusForm({ action, currentStatus }: OrderStatusFormProps) {
	const [state, formAction] = useActionState(action, null);
	const [selected, setSelected] = useState<OrderStatus>(currentStatus);

	// Re-sync when the server reports a new persisted status (its own submit,
	// or an update from elsewhere that revalidated this page).
	useEffect(() => {
		if (state?.status) setSelected(state.status);
	}, [state?.status]);
	useEffect(() => {
		setSelected(currentStatus);
	}, [currentStatus]);

	const dirty = selected !== currentStatus;

	return (
		<form action={formAction} className="space-y-3 rounded-2xl border border-border bg-secondary p-6">
			<h2 className="font-display text-lg font-semibold text-text">Update Status</h2>
			<p className="text-xs text-text-subtle">
				Current: <span className="font-semibold text-text">{ORDER_STATUS_LABELS[currentStatus]}</span>
			</p>
			<select
				name="status"
				value={selected}
				onChange={(event) => setSelected(event.target.value as OrderStatus)}
				className="w-full rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none"
			>
				{STATUS_OPTIONS.map((option) => (
					<option key={option} value={option}>
						{ORDER_STATUS_LABELS[option]}
					</option>
				))}
			</select>
			<SubmitButton dirty={dirty} />
			{state && (
				<p className={`flex items-center gap-1.5 text-xs font-semibold ${state.ok ? "text-primary" : "text-error"}`}>
					{state.ok ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
					{state.message}
				</p>
			)}
		</form>
	);
}
