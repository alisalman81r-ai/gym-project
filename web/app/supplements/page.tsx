import type { Metadata } from "next";
import { Navbar, Footer, BackToTop, Container } from "@/components/layout";
import { PageHeader, CtaBanner } from "@/components/ui";
import { SupplementCard } from "@/components/cards";
import { SUPPLEMENTS } from "@/constants/supplements";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
	title: "Supplements",
	description: "Shop Iron Elite Fitness Club's supplement range — protein, performance, recovery, and wellness essentials, with home delivery.",
	path: "/supplements",
});

export default function SupplementsPage() {
	return (
		<>
			<Navbar />
			<main>
				<PageHeader
					eyebrow="Fuel Your Training"
					title="Supplements, Delivered to Your Door"
					subtitle="Member-trusted protein, performance, and recovery essentials — inquire below and we'll arrange home delivery."
				/>

				<section className="py-24">
					<Container>
						<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
							{SUPPLEMENTS.map((supplement) => (
								<SupplementCard key={supplement.id} supplement={supplement} />
							))}
						</div>
					</Container>
				</section>

				<CtaBanner
					eyebrow="How It Works"
					title="Order Today, Delivered This Week"
					description="This is a showcase of our range — to place an order, send us your product and address details and our front desk team will confirm delivery."
					primaryCta={{ label: "Inquire to Order", href: "/contact?interest=supplement" }}
				/>
			</main>
			<Footer />
			<BackToTop />
		</>
	);
}
