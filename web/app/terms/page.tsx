import type { Metadata } from "next";
import { Navbar, Footer, BackToTop, Container } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import { siteConfig } from "@/constants/site";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
	title: "Terms of Service",
	description: `Terms of service for ${siteConfig.name}.`,
	path: "/terms",
});

export default function TermsPage() {
	return (
		<>
			<Navbar />
			<main>
				<PageHeader title="Terms of Service" subtitle="Last updated: July 2026" compact />

				<section className="py-20">
					<Container>
						<div className="mx-auto max-w-2xl space-y-6 text-text-muted">
							<p>
								This is placeholder terms-of-service text for demonstration purposes and has not been
								reviewed by legal counsel. Replace this page with real terms drafted for your
								jurisdiction before {siteConfig.name} accepts real memberships.
							</p>
							<h2 className="font-display text-xl font-semibold text-text">Membership</h2>
							<p>
								Membership tiers, pricing, and included benefits are described on the{" "}
								<a href="/membership" className="text-primary hover:underline">
									Membership page
								</a>{" "}
								and are subject to change with notice to current members.
							</p>
							<h2 className="font-display text-xl font-semibold text-text">Cancellations</h2>
							<p>
								Memberships may be paused or cancelled per the terms outlined at signup. Contact the
								front desk or use the{" "}
								<a href="/contact" className="text-primary hover:underline">
									contact form
								</a>{" "}
								to request either.
							</p>
							<h2 className="font-display text-xl font-semibold text-text">Facility Use</h2>
							<p>
								Members agree to follow posted facility rules and coach guidance for their own safety
								and the safety of others.
							</p>
						</div>
					</Container>
				</section>
			</main>
			<Footer />
			<BackToTop />
		</>
	);
}
