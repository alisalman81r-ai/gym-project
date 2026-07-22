"use client";

import { useRef } from "react";
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
 * Base container every card variant (Pricing, Trainer, Feature, Class,
 * Testimonial — see components/cards/) composes. Deliberately content-
 * agnostic: it only owns the box treatment, never layout of what's
 * inside. The lift on hover is a real spring (Framer Motion), while
 * border/shadow color still cross-fades via a plain CSS transition --
 * the color change doesn't need physics, the lift does.
 *
 * The hover glow tracks the cursor via CSS custom properties written
 * directly to the DOM node (not React state) so it stays smooth at
 * 60fps without a re-render per mousemove.
 */
export function Card({ children, className, hoverEffect = true, featured = false }: CardProps) {
	const cardRef = useRef<HTMLDivElement>(null);

	function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
		if (!hoverEffect || !cardRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		cardRef.current.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
		cardRef.current.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
	}

	return (
		<motion.div
			ref={cardRef}
			onMouseMove={handleMouseMove}
			whileHover={hoverEffect ? { y: -8 } : undefined}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
			className={cn(
				"group relative rounded-2xl border p-8 transition-[border-color,box-shadow] duration-300",
				featured
					? "border-primary bg-gradient-to-b from-primary/10 to-secondary shadow-gold"
					: "border-border bg-secondary",
				hoverEffect && "hover:border-primary/60 hover:shadow-elevated",
				className
			)}
		>
			{hoverEffect && (
				// Deliberately not clipped to the rounded corners: the radial
				// gradient's falloff (70% of a 240px circle) never reaches a
				// realistic card's actual corner pixels, and `overflow-hidden`
				// here would clip PricingCard's "Most Popular" badge, which is
				// positioned partially outside the card on purpose.
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					style={{
						background:
							"radial-gradient(240px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(201,162,39,0.12), transparent 70%)",
					}}
				/>
			)}
			<div className="relative z-10">{children}</div>
		</motion.div>
	);
}
