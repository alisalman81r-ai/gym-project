"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { placeOrderAction, type CheckoutFormState } from "@/lib/actions/checkout";

const initialState: CheckoutFormState = {};

export interface CheckoutDefaults {
	name: string;
	email: string;
	phone: string;
	addressLine: string;
	city: string;
	postalCode: string;
}

export interface CheckoutFormProps {
	isStripeEnabled: boolean;
	defaults: CheckoutDefaults;
}

const inputClasses =
	"w-full rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";

export function CheckoutForm({ isStripeEnabled, defaults }: CheckoutFormProps) {
	const [state, action, pending] = useActionState(placeOrderAction, initialState);

	return (
		<form action={action} className="space-y-5 rounded-2xl border border-border bg-secondary p-8">
			<div className="grid gap-5 sm:grid-cols-2">
				<div className="flex flex-col gap-2">
					<label htmlFor="customerName" className="text-sm font-semibold text-text-muted">
						Full Name
					</label>
					<input
						id="customerName"
						name="customerName"
						type="text"
						placeholder="Jane Doe"
						defaultValue={defaults.name}
						autoComplete="name"
						required
						className={inputClasses}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="customerEmail" className="text-sm font-semibold text-text-muted">
						Email Address
					</label>
					<input
						id="customerEmail"
						name="customerEmail"
						type="email"
						placeholder="you@example.com"
						defaultValue={defaults.email}
						autoComplete="email"
						required
						className={inputClasses}
					/>
				</div>
			</div>

			<div className="grid gap-5 sm:grid-cols-2">
				<div className="flex flex-col gap-2">
					<label htmlFor="customerPhone" className="text-sm font-semibold text-text-muted">
						Phone Number
					</label>
					<input
						id="customerPhone"
						name="customerPhone"
						type="tel"
						placeholder="(555) 210-4488"
						defaultValue={defaults.phone}
						autoComplete="tel"
						required
						className={inputClasses}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="city" className="text-sm font-semibold text-text-muted">
						City
					</label>
					<input
						id="city"
						name="city"
						type="text"
						placeholder="Springfield"
						defaultValue={defaults.city}
						autoComplete="address-level2"
						required
						className={inputClasses}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="addressLine" className="text-sm font-semibold text-text-muted">
					Complete Address
				</label>
				<textarea
					id="addressLine"
					name="addressLine"
					rows={2}
					placeholder="128 Riverside Ave, Apt 4B"
					defaultValue={defaults.addressLine}
					autoComplete="street-address"
					required
					className={inputClasses}
				/>
			</div>

			<div className="flex flex-col gap-2 sm:w-1/2">
				<label htmlFor="postalCode" className="text-sm font-semibold text-text-muted">
					Postal Code
				</label>
				<input
					id="postalCode"
					name="postalCode"
					type="text"
					placeholder="12345"
					defaultValue={defaults.postalCode}
					autoComplete="postal-code"
					required
					className={inputClasses}
				/>
			</div>

			<div>
				<p className="mb-2 text-sm font-semibold text-text-muted">Payment Method</p>
				<div className="flex flex-col gap-2">
					<label className="flex items-center gap-3 rounded-md border border-border px-4 py-3 text-sm text-text has-[:checked]:border-primary">
						<input type="radio" name="paymentMethod" value="cod" defaultChecked className="accent-primary" />
						Cash on Delivery
					</label>
					<label
						className={`flex items-center gap-3 rounded-md border px-4 py-3 text-sm ${
							isStripeEnabled ? "border-border text-text has-[:checked]:border-primary" : "border-border text-text-subtle opacity-60"
						}`}
					>
						<input type="radio" name="paymentMethod" value="stripe" disabled={!isStripeEnabled} className="accent-primary" />
						Pay by Card (Stripe){!isStripeEnabled && " — currently unavailable"}
					</label>
				</div>
			</div>

			{state?.error && <p className="text-sm text-error">{state.error}</p>}

			<Button type="submit" disabled={pending} className="w-full">
				{pending ? "Placing order..." : "Place Order"}
			</Button>
		</form>
	);
}
