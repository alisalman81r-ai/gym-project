import { Check } from "lucide-react";
import { Card, Badge, Button } from "@/components/ui";
import type { PricingPlan } from "@/types";

export interface PricingCardProps {
	plan: PricingPlan;
}

/** One membership tier — used by PricingSection. */
export function PricingCard({ plan }: PricingCardProps) {
	return (
		<Card featured={plan.isFeatured} className="relative flex flex-col text-center">
			{plan.isFeatured && (
				<Badge className="absolute -top-3.5 left-1/2 -translate-x-1/2">Most Popular</Badge>
			)}

			<h3 className="font-display text-xl font-semibold text-text">{plan.name}</h3>

			<p className="my-6 font-display text-4xl font-bold text-text">
				<span className="text-primary">${plan.price}</span>
				<span className="text-base font-normal text-text-muted">/{plan.period}</span>
			</p>

			<ul className="mb-8 flex-1 space-y-3 text-left">
				{plan.features.map((feature) => (
					<li key={feature} className="flex items-start gap-2 text-sm text-text-muted">
						<Check size={16} className="mt-0.5 shrink-0 text-primary" />
						{feature}
					</li>
				))}
			</ul>

			<Button href="/contact" variant={plan.isFeatured ? "primary" : "secondary"} className="w-full">
				Choose {plan.name}
			</Button>
		</Card>
	);
}
