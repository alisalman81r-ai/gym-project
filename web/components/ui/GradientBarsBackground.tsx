"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GradientBarsBackgroundProps {
	barCount?: number;
	className?: string;
}

/**
 * Ambient animated backdrop (vertical gold-to-transparent bars, pulsing
 * height at staggered offsets) for full-bleed pages like /admin/login --
 * ported from the 21st.dev "gradient bars background" concept but
 * recolored to the site's dark + gold palette instead of its default
 * rainbow presets. Heights are deterministic (not Math.random()) so
 * server and client markup match; disabled under prefers-reduced-motion
 * like every other animation on the site.
 */
export function GradientBarsBackground({ barCount = 15, className }: GradientBarsBackgroundProps) {
	const prefersReducedMotion = useReducedMotion();

	const bars = useMemo(
		() =>
			Array.from({ length: barCount }, (_, index) => ({
				id: index,
				baseHeight: 25 + ((index * 37) % 45),
				delay: (index % 7) * 0.15,
			})),
		[barCount]
	);

	return (
		<div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
			<div className="flex h-full w-full items-end justify-between gap-1 px-1">
				{bars.map((bar) => (
					<motion.div
						key={bar.id}
						className="flex-1 rounded-t-full bg-gradient-to-t from-primary via-primary/40 to-transparent"
						initial={{ height: `${bar.baseHeight}%` }}
						animate={
							prefersReducedMotion
								? { height: `${bar.baseHeight}%` }
								: { height: [`${bar.baseHeight}%`, `${Math.min(bar.baseHeight + 30, 95)}%`, `${bar.baseHeight}%`] }
						}
						transition={{
							duration: 4,
							delay: bar.delay,
							repeat: prefersReducedMotion ? 0 : Infinity,
							ease: "easeInOut",
						}}
					/>
				))}
			</div>
			{/* Fades the bars back into the page background so the form stays readable on top. */}
			<div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background" />
		</div>
	);
}
