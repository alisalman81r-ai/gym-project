import { Card, Button, RevealImage } from "@/components/ui";
import type { Trainer } from "@/types";

export interface TrainerCardProps {
	trainer: Trainer;
}

/**
 * One coach — used by TrainersSection (home) and /trainers. `trainer.image`
 * currently points at a hand-drawn SVG placeholder (public/images/trainers/);
 * swap that file for a real portrait and nothing here needs to change.
 */
export function TrainerCard({ trainer }: TrainerCardProps) {
	return (
		<Card className="group text-center">
			<div className="relative mb-5 aspect-[4/5] w-full overflow-hidden rounded-lg">
				<RevealImage
					src={trainer.image.src}
					alt={trainer.image.alt}
					fill
					sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
					className="object-cover object-top group-hover:scale-105"
				/>
			</div>
			<h3 className="font-display text-lg font-semibold text-text">{trainer.name}</h3>
			<p className="text-xs font-bold uppercase tracking-wider text-primary">{trainer.role}</p>
			<p className="mb-3 text-xs text-text-subtle">{trainer.experience}</p>
			<p className="mb-5 text-sm text-text-muted">{trainer.bio}</p>
			<Button href={`/trainers/${trainer.id}`} variant="secondary" size="sm" className="w-full">
				View Profile
			</Button>
		</Card>
	);
}
