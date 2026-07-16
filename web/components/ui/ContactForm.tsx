"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "./Button";

export type InquiryType = "general" | "tour" | "membership";

export interface ContactFormProps {
	/** Preselects the inquiry-type dropdown -- e.g. Contact page CTAs can deep-link into "tour". */
	defaultInquiryType?: InquiryType;
}

interface FormErrors {
	name?: string;
	email?: string;
	message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Real client-side validation + a simulated submit (no backend
 * exists yet, so this doesn't send an actual email/CRM record --
 * wiring a real endpoint just means replacing the body of
 * `handleSubmit`'s try block). Serves all three inquiry types
 * (general / book a tour / membership) via one form rather than
 * three near-duplicate ones.
 */
export function ContactForm({ defaultInquiryType = "general" }: ContactFormProps) {
	const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
	const [errors, setErrors] = useState<FormErrors>({});

	function validate(formData: FormData): FormErrors {
		const nextErrors: FormErrors = {};
		const name = String(formData.get("name") ?? "").trim();
		const email = String(formData.get("email") ?? "").trim();
		const message = String(formData.get("message") ?? "").trim();

		if (!name) nextErrors.name = "Please enter your name.";
		if (!email) nextErrors.email = "Please enter your email.";
		else if (!EMAIL_PATTERN.test(email)) nextErrors.email = "Please enter a valid email address.";
		if (!message) nextErrors.message = "Please add a short message.";

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

		try {
			// No backend wired up yet -- replace with a real API call
			// (e.g. `await fetch("/api/contact", { method: "POST", body: formData })`)
			// once one exists.
			await new Promise((resolve) => setTimeout(resolve, 900));
			setStatus("success");
			form.reset();
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
						aria-invalid={Boolean(errors.name)}
						aria-describedby={errors.name ? "contact-name-error" : undefined}
						className="rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
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
						aria-invalid={Boolean(errors.email)}
						aria-describedby={errors.email ? "contact-email-error" : undefined}
						className="rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
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
					className="rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="contact-interest" className="text-sm font-semibold text-text-muted">
					Interested In
				</label>
				<select
					id="contact-interest"
					name="interest"
					defaultValue={defaultInquiryType}
					className="rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
				>
					<option value="general">General Inquiry</option>
					<option value="tour">Booking a Tour</option>
					<option value="membership">Membership Plans</option>
					<option value="personal-training">Personal Training</option>
				</select>
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="contact-message" className="text-sm font-semibold text-text-muted">
					Message
				</label>
				<textarea
					id="contact-message"
					name="message"
					rows={5}
					aria-invalid={Boolean(errors.message)}
					aria-describedby={errors.message ? "contact-message-error" : undefined}
					className="rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
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
