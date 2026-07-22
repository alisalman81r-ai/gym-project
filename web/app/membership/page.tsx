import type { Metadata } from "next";
import { Navbar, Footer, BackToTop, Container } from "@/components/layout";
import { SectionTitle, CtaBanner, ComparisonTable, Accordion, PageHeader, Reveal, RevealGroup, RevealItem } from "@/components/ui";
import { PricingCard, FeatureCard } from "@/components/cards";
import { PRICING_PLANS } from "@/constants/pricing";
import { FAQ_ITEMS } from "@/constants/faq";
import { Leaf, Target, CalendarClock } from "lucide-react";
import type { Feature } from "@/types";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
	title: "Membership & Pricing",
	description: "Compare Iron Elite Fitness Club's Signature, Elite, and Private Club membership tiers.",
	path: "/membership",
});

const WHY_MEMBERS_STAY: Feature[] = [
	{
		id: "recovery-lounge",
		title: "Recovery Lounge",
		description: "A private space to stretch, recover, and reset between sessions.",
		icon: Leaf,
	},
	{
		id: "1-1-coaching",
		title: "1:1 Coaching",
		description: "Every plan adjusts weekly based on your real progress, not a template.",
		icon: Target,
	},
	{
		id: "priority-booking",
		title: "Priority Booking",
		description: "Reserve your preferred classes and sessions before they fill up.",
		icon: CalendarClock,
	},
];

const COMPARISON_ROWS = [
	{ feature: "Gym floor access", signature: true, elite: true, privateClub: true },
	{ feature: "Group classes", signature: "2 / week", elite: "Unlimited", privateClub: "Unlimited" },
	{ feature: "Personal training sessions", signature: false as const, elite: "1 / month", privateClub: "4 / month" },
	{ feature: "Nutrition plan", signature: false as const, elite: true, privateClub: true },
	{ feature: "Priority class booking", signature: false as const, elite: false as const, privateClub: true },
	{ feature: "Recovery lounge access", signature: false as const, elite: false as const, privateClub: true },
];

export default function MembershipPage() {
	return (
		<>
			<Navbar />
			<main>
				<PageHeader eyebrow="Membership" title="Choose Your Level of Elite" />

				<section className="py-24">
					<Container>
						<RevealGroup className="grid gap-6 md:grid-cols-3">
							{PRICING_PLANS.map((plan) => (
								<RevealItem key={plan.id} className={plan.isFeatured ? "md:scale-105" : undefined}>
									<PricingCard plan={plan} />
								</RevealItem>
							))}
						</RevealGroup>
					</Container>
				</section>

				<section className="pb-24">
					<Container>
						<SectionTitle eyebrow="Side By Side" title="Compare Every Feature" />
						<Reveal>
							<ComparisonTable rows={COMPARISON_ROWS} />
						</Reveal>
					</Container>
				</section>

				<section className="bg-secondary py-24">
					<Container>
						<SectionTitle eyebrow="Beyond The Price Tag" title="Why Members Stay" />
						<RevealGroup className="grid gap-6 sm:grid-cols-3">
							{WHY_MEMBERS_STAY.map((item) => (
								<RevealItem key={item.id}>
									<FeatureCard feature={item} />
								</RevealItem>
							))}
						</RevealGroup>
					</Container>
				</section>

				<section id="faq" className="py-24">
					<Container>
						<SectionTitle eyebrow="Questions" title="Frequently Asked Questions" />
						<Reveal>
							<Accordion items={FAQ_ITEMS} />
						</Reveal>
					</Container>
				</section>

				<CtaBanner
					eyebrow="Ready?"
					title="Ready to Commit to Elite?"
					description="Book a tour to see the club first, or apply now if you're ready to start."
					primaryCta={{ label: "Book a Tour", href: "/contact" }}
					secondaryCta={{ label: "Apply Now", href: "/contact" }}
				/>
			</main>
			<Footer />
			<BackToTop />
		</>
	);
}
