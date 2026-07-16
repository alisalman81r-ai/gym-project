"use client";

import { motion } from "framer-motion";
import { staggerContainer, slideUp, VIEWPORT_ONCE } from "@/lib/animations";
import type { TimelineEvent } from "@/types";

export interface TimelineProps {
	events: TimelineEvent[];
}

const listStagger = staggerContainer(0.15);

/** Vertical origin-story timeline — used on the About page. */
export function Timeline({ events }: TimelineProps) {
	return (
		<motion.ol
			variants={listStagger}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT_ONCE}
			className="relative mx-auto max-w-2xl border-l border-border pl-10"
		>
			{events.map((event, index) => (
				<motion.li key={event.year} variants={slideUp} className={index === events.length - 1 ? "" : "pb-10"}>
					<span
						aria-hidden
						className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-primary shadow-[0_0_0_4px_rgba(201,162,39,0.18)]"
					/>
					<span className="mb-1 block font-display text-xl font-bold text-primary">{event.year}</span>
					<p className="max-w-md text-text-muted">{event.text}</p>
				</motion.li>
			))}
		</motion.ol>
	);
}
