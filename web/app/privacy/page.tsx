import type { Metadata } from "next";
import { Navbar, Footer, BackToTop, Container } from "@/components/layout";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
	title: "Privacy Policy",
	description: `Privacy policy for ${siteConfig.name}.`,
};

export default function PrivacyPage() {
	return (
		<>
			<Navbar />
			<main>
				<section className="bg-secondary pb-16 pt-36 text-center">
					<Container>
						<h1 className="font-display text-3xl font-bold text-text sm:text-4xl">Privacy Policy</h1>
						<p className="mt-2 text-sm text-text-subtle">Last updated: July 2026</p>
					</Container>
				</section>

				<section className="py-20">
					<Container>
						<div className="mx-auto max-w-2xl space-y-6 text-text-muted">
							<p>
								This is placeholder policy text for demonstration purposes and has not been reviewed by
								legal counsel. Replace this page with a real privacy policy drafted for your
								jurisdiction before {siteConfig.name} handles any real member data.
							</p>
							<h2 className="font-display text-xl font-semibold text-text">Information We Collect</h2>
							<p>
								When you submit an inquiry through our contact form, we collect the name, email
								address, phone number, and message you provide. We do not sell this information to
								third parties.
							</p>
							<h2 className="font-display text-xl font-semibold text-text">How We Use It</h2>
							<p>
								Information submitted through this site is used solely to respond to your inquiry,
								schedule a tour, or provide the membership information you requested.
							</p>
							<h2 className="font-display text-xl font-semibold text-text">Contact</h2>
							<p>Questions about this policy can be sent to hello@ironelitefitnessclub.com.</p>
						</div>
					</Container>
				</section>
			</main>
			<Footer />
			<BackToTop />
		</>
	);
}
