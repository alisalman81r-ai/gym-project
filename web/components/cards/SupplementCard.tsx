import { Card, RevealImage, Badge, Button } from "@/components/ui";
import type { Supplement } from "@/types";

export interface SupplementCardProps {
	supplement: Supplement;
}

/** One product tile on the Supplements page — showcase only, no cart (see /contact for ordering). */
export function SupplementCard({ supplement }: SupplementCardProps) {
	const { name, category, price, description, image } = supplement;

	return (
		<Card className="group overflow-hidden p-0" hoverEffect>
			<div className="relative aspect-[4/3] w-full overflow-hidden">
				<RevealImage
					src={image.src}
					alt={image.alt}
					fill
					sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
					className="object-cover group-hover:scale-105"
				/>
				<Badge tone="gold" className="absolute left-4 top-4">
					{category}
				</Badge>
			</div>
			<div className="flex flex-col gap-3 p-6">
				<div className="flex items-start justify-between gap-3">
					<h3 className="font-display text-lg font-semibold text-text">{name}</h3>
					<span className="whitespace-nowrap font-display text-lg font-semibold text-primary">${price.toFixed(2)}</span>
				</div>
				<p className="text-sm text-text-muted">{description}</p>
				<Button href="/contact?interest=supplement" variant="secondary" size="sm" className="mt-2 w-full">
					Inquire to Order
				</Button>
			</div>
		</Card>
	);
}
