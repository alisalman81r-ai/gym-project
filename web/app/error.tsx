"use client";

import { useEffect } from "react";
import { Navbar, Footer, Container } from "@/components/layout";
import { Button } from "@/components/ui";

/**
 * Route-level error boundary (Next.js requires this to be a
 * Client Component). Catches runtime errors thrown while
 * rendering a page so the user sees a recoverable, on-brand
 * screen instead of a blank page or the framework's raw overlay.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		// No error-reporting service wired up yet -- this is the spot to send it
		// (e.g. Sentry.captureException(error)) once one exists.
		console.error(error);
	}, [error]);

	return (
		<>
			<Navbar />
			<main className="flex min-h-[70vh] items-center justify-center py-24">
				<Container>
					<div className="mx-auto max-w-md text-center">
						<p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Something Went Wrong</p>
						<h1 className="font-display text-2xl font-semibold text-text">We hit a snag loading this page.</h1>
						<p className="mt-3 text-text-muted">
							Try again, or head back to the homepage. If this keeps happening, let us know through the{" "}
							<a href="/contact" className="text-primary hover:underline">
								contact page
							</a>
							.
						</p>
						<div className="mt-8 flex flex-wrap items-center justify-center gap-4">
							<Button onClick={reset}>Try Again</Button>
							<Button href="/" variant="secondary">
								Back to Home
							</Button>
						</div>
					</div>
				</Container>
			</main>
			<Footer />
		</>
	);
}
