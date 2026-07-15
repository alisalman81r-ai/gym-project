import { cn } from "@/lib/utils";

export interface CardProps {
	children: React.ReactNode;
	className?: string;
	/** Adds the lift/border/shadow hover treatment. Pure CSS — no JS needed. */
	hoverEffect?: boolean;
	/** Elevated, gold-bordered treatment (e.g. the recommended pricing plan). */
	featured?: boolean;
}

/**
 * Base container every card variant (Pricing, Trainer, Feature,
 * Testimonial — see components/cards/) composes. Deliberately
 * content-agnostic: it only owns the box treatment, never layout
 * of what's inside.
 */
export function Card({ children, className, hoverEffect = true, featured = false }: CardProps) {
	return (
		<div
			className={cn(
				"rounded-2xl border p-8 transition-all duration-300",
				featured
					? "border-primary bg-gradient-to-b from-primary/10 to-secondary shadow-gold"
					: "border-border bg-secondary",
				hoverEffect && "hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-elevated",
				className
			)}
		>
			{children}
		</div>
	);
}
