"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Navbar, Footer, Container } from "@/components/layout";
import { Button } from "@/components/ui";
import { registerAction, type AuthFormState } from "@/lib/actions/auth";

const initialState: AuthFormState = {};

export default function AccountRegisterPage() {
	const [state, action, pending] = useActionState(registerAction, initialState);

	return (
		<>
			<Navbar />
			<main className="py-24">
				<Container className="flex justify-center">
					<form action={action} className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-secondary p-8">
						<h1 className="font-display text-2xl font-bold text-text">Create an Account</h1>

						<div className="flex flex-col gap-2">
							<label htmlFor="name" className="text-sm font-semibold text-text-muted">
								Full Name
							</label>
							<input
								id="name"
								name="name"
								type="text"
								autoComplete="name"
								required
								className="rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
							/>
						</div>

						<div className="flex flex-col gap-2">
							<label htmlFor="email" className="text-sm font-semibold text-text-muted">
								Email Address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
							/>
						</div>

						<div className="flex flex-col gap-2">
							<label htmlFor="phone" className="text-sm font-semibold text-text-muted">
								Phone Number <span className="text-text-subtle">(optional)</span>
							</label>
							<input
								id="phone"
								name="phone"
								type="tel"
								autoComplete="tel"
								className="rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
							/>
						</div>

						<div className="flex flex-col gap-2">
							<label htmlFor="password" className="text-sm font-semibold text-text-muted">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="new-password"
								minLength={8}
								required
								className="rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
							/>
							<p className="text-xs text-text-subtle">At least 8 characters.</p>
						</div>

						{state?.error && <p className="text-sm text-error">{state.error}</p>}

						<Button type="submit" disabled={pending} className="w-full">
							{pending ? "Creating account..." : "Create Account"}
						</Button>

						<p className="text-center text-sm text-text-muted">
							Already have an account?{" "}
							<Link href="/account/login" className="text-primary hover:underline">
								Sign in
							</Link>
						</p>
					</form>
				</Container>
			</main>
			<Footer />
		</>
	);
}
