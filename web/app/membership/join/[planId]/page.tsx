import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar, Footer, Container } from "@/components/layout";
import { PageHeader } from "@/components/ui";
import { MembershipJoinForm } from "@/components/membership/MembershipJoinForm";
import { PRICING_PLANS } from "@/constants/pricing";
import { isStripeEnabled } from "@/lib/stripe";
import { createMetadata } from "@/lib/metadata";

interface JoinPageProps {
	params: Promise<{ planId: string }>;
}

export function generateStaticParams() {
	return PRICING_PLANS.map((plan) => ({ planId: plan.id }));
}

export async function generateMetadata({ params }: JoinPageProps): Promise<Metadata> {
	const { planId } = await params;
	const plan = PRICING_PLANS.find((candidate) => candidate.id === planId);
	if (!plan) return {};

	return createMetadata({
		title: `Join — ${plan.name}`,
		description: `Sign up for the ${plan.name} membership at Iron Elite Fitness Club.`,
		path: `/membership/join/${plan.id}`,
	});
}

export default async function MembershipJoinPage({ params }: JoinPageProps) {
	const { planId } = await params;
	const plan = PRICING_PLANS.find((candidate) => candidate.id === planId);
	if (!plan) notFound();

	return (
		<>
			<Navbar />
			<PageHeader
				eyebrow="Join Iron Elite"
				title={`${plan.name} Membership`}
				subtitle={`$${plan.price}/${plan.period} — billed monthly, cancel anytime`}
			/>
			<main className="py-16">
				<Container className="mx-auto max-w-lg">
					<div className="mb-8 rounded-2xl border border-border bg-secondary p-6">
						<h2 className="mb-3 font-display text-lg font-semibold text-text">What's Included</h2>
						<ul className="space-y-2 text-sm text-text-muted">
							{plan.features.map((feature) => (
								<li key={feature} className="flex items-start gap-2">
									<span className="text-primary">&bull;</span>
									{feature}
								</li>
							))}
						</ul>
					</div>

					<MembershipJoinForm planId={plan.id} isStripeEnabled={isStripeEnabled} />
				</Container>
			</main>
			<Footer />
		</>
	);
}
