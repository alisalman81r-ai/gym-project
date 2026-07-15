import { Card } from "@/components/ui";
import type { Feature } from "@/types";

export interface FeatureCardProps {
	feature: Feature;
}

/** One "Why Choose Us" tile — used by FeaturesSection. */
export function FeatureCard({ feature }: FeatureCardProps) {
	const { icon: Icon, title, description } = feature;

	return (
		<Card>
			<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
				<Icon size={26} />
			</div>
			<h3 className="mb-2 font-display text-lg font-semibold text-text">{title}</h3>
			<p className="text-sm text-text-muted">{description}</p>
		</Card>
	);
}
