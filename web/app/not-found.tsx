import { Navbar, Footer, Container } from "@/components/layout";
import { Button } from "@/components/ui";

/** Replaces Next's bare default 404 with an on-brand one. */
export default function NotFound() {
	return (
		<>
			<Navbar />
			<main className="flex min-h-[70vh] items-center justify-center py-24">
				<Container>
					<div className="mx-auto max-w-md text-center">
						<p className="font-display text-6xl font-bold text-primary">404</p>
						<h1 className="mt-4 font-display text-2xl font-semibold text-text">
							Even Elite Athletes Miss Sometimes.
						</h1>
						<p className="mt-3 text-text-muted">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
						<div className="mt-8 flex flex-wrap items-center justify-center gap-4">
							<Button href="/">Back to Home</Button>
							<Button href="/membership" variant="secondary">
								View Membership
							</Button>
						</div>
					</div>
				</Container>
			</main>
			<Footer />
		</>
	);
}
