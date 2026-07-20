"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button, GradientBarsBackground } from "@/components/ui";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
	const [state, action, pending] = useActionState(loginAction, initialState);

	return (
		<main className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-background px-4">
			<GradientBarsBackground />

			<form
				action={action}
				className="relative z-10 w-full max-w-sm space-y-5 rounded-2xl border border-border bg-secondary p-8 shadow-elevated"
			>
				<h1 className="font-display text-2xl font-bold text-text">Admin Login</h1>

				<div className="flex flex-col gap-2">
					<label htmlFor="username" className="text-sm font-semibold text-text-muted">
						Username
					</label>
					<input
						id="username"
						name="username"
						type="text"
						autoComplete="username"
						required
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
						autoComplete="current-password"
						required
						className="rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
					/>
				</div>

				{state?.error && <p className="text-sm text-error">{state.error}</p>}

				<Button type="submit" disabled={pending} className="w-full">
					{pending ? "Signing in..." : "Sign In"}
				</Button>
			</form>

			<Link
				href="/"
				className="relative z-10 flex items-center gap-2 text-sm font-semibold text-text-muted transition-colors hover:text-text"
			>
				<ArrowLeft size={16} /> Back to Website
			</Link>
		</main>
	);
}
