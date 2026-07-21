"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "./Button";
import { SUPPLEMENTS } from "@/constants/supplements";

export type InquiryType = "general" | "tour" | "membership" | "supplement";

export interface ContactFormProps {
	/** Preselects the inquiry-type dropdown -- e.g. Contact page CTAs can deep-link into "tour". */
	defaultInquiryType?: InquiryType;
}

interface FormErrors {
	name?: string;
	email?: string;
	message?: string;
	supplementId?: string;
	deliveryAddress?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Real client-side validation, posted to a real SQLite-backed API
 * route (see app/api/contact and app/api/supplement-orders). When
 * "Supplement Order" is selected, extra fields (product/quantity/
 * delivery address) appear and the submit posts to the orders
 * endpoint instead -- one form still serves every inquiry type
 * rather than near-duplicate forms per type.
 */
export function ContactForm({ defaultInquiryType = "general" }: ContactFormProps) {
	const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
	const [errors, setErrors] = useState<FormErrors>({});
	const [interest, setInterest] = useState<InquiryType>(defaultInquiryType);
	const isSupplementOrder = interest === "supplement";

	function validate(formData: FormData): FormErrors {
		const nextErrors: FormErrors = {};
		const name = String(formData.get("name") ?? "").trim();
		const email = String(formData.get("email") ?? "").trim();
		const message = String(formData.get("message") ?? "").trim();

		if (!name) nextErrors.name = "Please enter your name.";
		if (!email) nextErrors.email = "Please enter your email.";
		else if (!EMAIL_PATTERN.test(email)) nextErrors.email = "Please enter a valid email address.";

		if (isSupplementOrder) {
			const supplementId = String(formData.get("supplementId") ?? "").trim();
			const deliveryAddress = String(formData.get("deliveryAddress") ?? "").trim();
			if (!supplementId) nextErrors.supplementId = "Please choose a product.";
			if (!deliveryAddress) nextErrors.deliveryAddress = "Please add a delivery address.";
		} else if (!message) {
			nextErrors.message = "Please add a short message.";
		}

		return nextErrors;
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		const nextErrors = validate(formData);

		if (Object.keys(nextErrors).length > 0) {
			setErrors(nextErrors);
			setStatus("error");
			return;
		}

		setErrors({});
		setStatus("submitting");

		const name = String(formData.get("name") ?? "").trim();
		const email = String(formData.get("email") ?? "").trim();
		const phone = String(formData.get("phone") ?? "").trim();
		const message = String(formData.get("message") ?? "").trim();

		try {
			const response = isSupplementOrder
				? await fetch("/api/supplement-orders", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							supplementId: String(formData.get("supplementId") ?? "").trim(),
							quantity: Number(formData.get("quantity")) || 1,
							name,
							email,
							phone,
							deliveryAddress: String(formData.get("deliveryAddress") ?? "").trim(),
							notes: message,
						}),
					})
				: await fetch("/api/contact", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ name, email, phone, interest, message }),
					});

			if (!response.ok) throw new Error("Request failed");

			setStatus("success");
			form.reset();
			setInterest(defaultInquiryType);
		} catch {
			setStatus("error");
		}
	}

	if (status === "success") {
		return (
			<div className="flex flex-col items-center gap-3 rounded-2xl border border-primary/40 bg-primary/5 p-10 text-center">
				<CheckCircle2 className="text-primary" size={36} />
				<p className="font-display text-xl font-semibold text-text">Thanks &mdash; we&rsquo;ll be in touch shortly.</p>
				<p className="text-sm text-text-muted">A coach typically responds within one business day.</p>
				<Button variant="secondary" size="sm" onClick={() => setStatus("idle")}>
					Send another message
				</Button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-2xl border border-border bg-secondary p-8">
			<div className="grid gap-5 sm:grid-cols-2">
				<div className="flex flex-col gap-2">
					<label htmlFor="contact-name" className="text-sm font-semibold text-text-muted">
						Full Name
					</label>
					<input
						id="contact-name"
						name="name"
						type="text"
						placeholder="Jane Doe"
						aria-invalid={Boolean(errors.name)}
						aria-describedby={errors.name ? "contact-name-error" : undefined}
						className="rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
					/>
					{errors.name && (
						<p id="contact-name-error" className="text-xs text-error">
							{errors.name}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="contact-email" className="text-sm font-semibold text-text-muted">
						Email Address
					</label>
					<input
						id="contact-email"
						name="email"
						type="email"
						placeholder="you@example.com"
						aria-invalid={Boolean(errors.email)}
						aria-describedby={errors.email ? "contact-email-error" : undefined}
						className="rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
					/>
					{errors.email && (
						<p id="contact-email-error" className="text-xs text-error">
							{errors.email}
						</p>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="contact-phone" className="text-sm font-semibold text-text-muted">
					Phone Number <span className="text-text-subtle">(optional)</span>
				</label>
				<input
					id="contact-phone"
					name="phone"
					type="tel"
					placeholder="(555) 210-4488"
					className="rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="contact-interest" className="text-sm font-semibold text-text-muted">
					Interested In
				</label>
				<select
					id="contact-interest"
					name="interest"
					value={interest}
					onChange={(event) => setInterest(event.target.value as InquiryType)}
					className="rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
				>
					<option value="general">General Inquiry</option>
					<option value="tour">Booking a Tour</option>
					<option value="membership">Membership Plans</option>
					<option value="personal-training">Personal Training</option>
					<option value="supplement">Supplement Order &amp; Home Delivery</option>
				</select>
			</div>

			{isSupplementOrder && (
				<>
					<div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
						<div className="flex flex-col gap-2">
							<label htmlFor="contact-supplement" className="text-sm font-semibold text-text-muted">
								Product
							</label>
							<select
								id="contact-supplement"
								name="supplementId"
								defaultValue=""
								aria-invalid={Boolean(errors.supplementId)}
								className="rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
							>
								<option value="" disabled>
									Choose a product&hellip;
								</option>
								{SUPPLEMENTS.map((supplement) => (
									<option key={supplement.id} value={supplement.id}>
										{supplement.name} &mdash; ${supplement.price.toFixed(2)}
									</option>
								))}
							</select>
							{errors.supplementId && <p className="text-xs text-error">{errors.supplementId}</p>}
						</div>

						<div className="flex flex-col gap-2">
							<label htmlFor="contact-quantity" className="text-sm font-semibold text-text-muted">
								Quantity
							</label>
							<input
								id="contact-quantity"
								name="quantity"
								type="number"
								min={1}
								max={20}
								defaultValue={1}
								className="rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
							/>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<label htmlFor="contact-delivery-address" className="text-sm font-semibold text-text-muted">
							Delivery Address
						</label>
						<textarea
							id="contact-delivery-address"
							name="deliveryAddress"
							rows={2}
							placeholder="128 Riverside Ave, Apt 4B, Springfield"
							aria-invalid={Boolean(errors.deliveryAddress)}
							className="rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
						/>
						{errors.deliveryAddress && <p className="text-xs text-error">{errors.deliveryAddress}</p>}
					</div>
				</>
			)}

			<div className="flex flex-col gap-2">
				<label htmlFor="contact-message" className="text-sm font-semibold text-text-muted">
					{isSupplementOrder ? (
						<>
							Delivery Notes <span className="text-text-subtle">(optional)</span>
						</>
					) : (
						"Message"
					)}
				</label>
				<textarea
					id="contact-message"
					name="message"
					rows={isSupplementOrder ? 2 : 5}
					placeholder={isSupplementOrder ? "Apt number, gate code, preferred delivery time..." : "Tell us a bit about your goals..."}
					aria-invalid={Boolean(errors.message)}
					aria-describedby={errors.message ? "contact-message-error" : undefined}
					className="rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
				/>
				{errors.message && (
					<p id="contact-message-error" className="text-xs text-error">
						{errors.message}
					</p>
				)}
			</div>

			<Button type="submit" disabled={status === "submitting"} className="w-full">
				{status === "submitting" ? (
					<>
						<Loader2 className="animate-spin" size={16} /> Sending...
					</>
				) : isSupplementOrder ? (
					"Place Order"
				) : (
					"Send Message"
				)}
			</Button>

			{status === "error" && Object.keys(errors).length === 0 && (
				<p className="text-center text-sm text-error">Something went wrong. Please try again.</p>
			)}
		</form>
	);
}
