import type { Metadata } from "next";
import { Navbar, Footer, BackToTop, Container } from "@/components/layout";
import { SectionTitle, CtaBanner, ComparisonTable, Accordion } from "@/components/ui";
import { PricingCard, FeatureCard } from "@/components/cards";
import { PRICING_PLANS } from "@/constants/pricing";
import { FAQ_ITEMS } from "@/constants/faq";
import { Leaf, Target, CalendarClock } from "lucide-react";
import type { Feature } from "@/types";

export const metadata: Metadata = {
	title: "Membership & Pricing",
	description: "Compare Iron Elite Fitness Club's Signature, Elite, and Private Club membership tiers.",
};

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
				<section className="bg-secondary pb-20 pt-36 text-center">
					<Container>
						<p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Membership</p>
						<h1 className="font-display text-4xl font-bold text-text sm:text-5xl">Choose Your Level of Elite</h1>
					</Container>
				</section>

				<section className="py-24">
					<Container>
						<div className="grid gap-6 md:grid-cols-3">
							{PRICING_PLANS.map((plan) => (
								<div key={plan.id} className={plan.isFeatured ? "md:scale-105" : undefined}>
									<PricingCard plan={plan} />
								</div>
							))}
						</div>
					</Container>
				</section>

				<section className="pb-24">
					<Container>
						<SectionTitle eyebrow="Side By Side" title="Compare Every Feature" />
						<ComparisonTable rows={COMPARISON_ROWS} />
					</Container>
				</section>

				<section className="bg-secondary py-24">
					<Container>
						<SectionTitle eyebrow="Beyond The Price Tag" title="Why Members Stay" />
						<div className="grid gap-6 sm:grid-cols-3">
							{WHY_MEMBERS_STAY.map((item) => (
								<FeatureCard key={item.id} feature={item} />
							))}
						</div>
					</Container>
				</section>

				<section id="faq" className="py-24">
					<Container>
						<SectionTitle eyebrow="Questions" title="Frequently Asked Questions" />
						<Accordion items={FAQ_ITEMS} />
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
