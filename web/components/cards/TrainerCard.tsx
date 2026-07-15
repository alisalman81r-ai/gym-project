import { Card, Button } from "@/components/ui";
import type { Trainer } from "@/types";

export interface TrainerCardProps {
	trainer: Trainer;
}

/**
 * One coach — used by TrainersSection. The photo is a gradient
 * placeholder until real portraits are sourced; swap the `div`
 * below for a Next `<Image>` at that point.
 */
export function TrainerCard({ trainer }: TrainerCardProps) {
	return (
		<Card className="text-center">
			<div
				aria-hidden
				className="mb-5 aspect-[4/5] w-full rounded-lg bg-gradient-to-br from-secondary-light to-background"
			/>
			<h3 className="font-display text-lg font-semibold text-text">{trainer.name}</h3>
			<p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">{trainer.role}</p>
			<p className="mb-5 text-sm text-text-muted">{trainer.bio}</p>
			<Button variant="secondary" size="sm" className="w-full">
				View Profile
			</Button>
		</Card>
	);
}
