"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps {
	children: React.ReactNode;
	className?: string;
	/** Adds the spring-based lift + border/shadow hover treatment. */
	hoverEffect?: boolean;
	/** Elevated, gold-bordered treatment (e.g. the recommended pricing plan). */
	featured?: boolean;
}

/**
 * Base container every card variant (Pricing, Trainer, Feature,
 * Class, Testimonial — see components/cards/) composes.
 * Deliberately content-agnostic: it only owns the box treatment,
 * never layout of what's inside. The lift on hover is a real
 * spring (Framer Motion), while border/shadow color still cross-
 * fades via a plain CSS transition — the color change doesn't
 * need physics, the lift does.
 */
export function Card({ children, className, hoverEffect = true, featured = false }: CardProps) {
	return (
		<motion.div
			whileHover={hoverEffect ? { y: -8 } : undefined}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
			className={cn(
				"rounded-2xl border p-8 transition-[border-color,box-shadow] duration-300",
				featured
					? "border-primary bg-gradient-to-b from-primary/10 to-secondary shadow-gold"
					: "border-border bg-secondary",
				hoverEffect && "hover:border-primary/60 hover:shadow-elevated",
				className
			)}
		>
			{children}
		</motion.div>
	);
}
