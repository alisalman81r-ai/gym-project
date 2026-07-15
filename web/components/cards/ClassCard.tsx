import Image from "next/image";
import { Card } from "@/components/ui";
import type { GymClass } from "@/types";

export interface ClassCardProps {
	gymClass: GymClass;
}

/**
 * One training discipline tile — used by ClassesSection. Unlike
 * FeatureCard, this one carries a photo, which is why it's a
 * dedicated component rather than a reuse of FeatureCard.
 */
export function ClassCard({ gymClass }: ClassCardProps) {
	const { icon: Icon, title, description, image } = gymClass;

	return (
		<Card className="overflow-hidden p-0" hoverEffect>
			<div className="relative aspect-[4/3] w-full">
				<Image
					src={image.src}
					alt={image.alt}
					fill
					unoptimized
					sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
					className="object-cover"
				/>
				<div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg bg-background/80 text-primary backdrop-blur-sm">
					<Icon size={22} />
				</div>
			</div>
			<div className="p-6">
				<h3 className="mb-2 font-display text-lg font-semibold text-text">{title}</h3>
				<p className="text-sm text-text-muted">{description}</p>
			</div>
		</Card>
	);
}
