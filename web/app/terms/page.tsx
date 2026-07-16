import type { Metadata } from "next";
import { Navbar, Footer, BackToTop, Container } from "@/components/layout";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
	title: "Terms of Service",
	description: `Terms of service for ${siteConfig.name}.`,
};

export default function TermsPage() {
	return (
		<>
			<Navbar />
			<main>
				<section className="bg-secondary pb-16 pt-36 text-center">
					<Container>
						<h1 className="font-display text-3xl font-bold text-text sm:text-4xl">Terms of Service</h1>
						<p className="mt-2 text-sm text-text-subtle">Last updated: July 2026</p>
					</Container>
				</section>

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
