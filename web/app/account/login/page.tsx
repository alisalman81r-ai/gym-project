"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Navbar, Footer, Container } from "@/components/layout";
import { Button } from "@/components/ui";
import { loginAction, type AuthFormState } from "@/lib/actions/auth";

const initialState: AuthFormState = {};

export default function AccountLoginPage() {
	const [state, action, pending] = useActionState(loginAction, initialState);

	return (
		<>
			<Navbar />
			<main className="py-24">
				<Container className="flex justify-center">
					<form action={action} className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-secondary p-8">
						<h1 className="font-display text-2xl font-bold text-text">Sign In</h1>

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
								className="rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
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
								autoComplete="current-password"
								required
								className="rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
							/>
						</div>

						{state?.error && <p className="text-sm text-error">{state.error}</p>}

						<Button type="submit" disabled={pending} className="w-full">
							{pending ? "Signing in..." : "Sign In"}
						</Button>

						<p className="text-center text-sm text-text-muted">
							New here?{" "}
							<Link href="/account/register" className="text-primary hover:underline">
								Create an account
							</Link>
						</p>
					</form>
				</Container>
			</main>
			<Footer />
		</>
	);
}
