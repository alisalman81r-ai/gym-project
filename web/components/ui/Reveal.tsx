"use client";

import { motion } from "framer-motion";
import { staggerContainer, slideUp, VIEWPORT_ONCE } from "@/lib/animations";

export interface RevealProps {
	children: React.ReactNode;
	className?: string;
}

/**
 * Generic single-block scroll reveal (fade + slide up once scrolled
 * into view). Exists so plain inline sections living directly in a
 * page.tsx -- rather than their own animated components/sections/
 * component -- can opt into the site's standard motion language
 * without the page itself becoming a Client Component (which would
 * break its `export const metadata`).
 */
export function Reveal({ children, className }: RevealProps) {
	return (
		<motion.div variants={slideUp} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE} className={className}>
			{children}
		</motion.div>
	);
}

export interface RevealGroupProps {
	children: React.ReactNode;
	className?: string;
	stagger?: number;
}

/** Staggers its direct `RevealItem` children in together -- for card grids and lists. */
export function RevealGroup({ children, className, stagger = 0.1 }: RevealGroupProps) {
	return (
		<motion.div
			variants={staggerContainer(stagger)}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT_ONCE}
			className={className}
		>
			{children}
		</motion.div>
	);
}

/** One staggered item inside a `RevealGroup` -- typically one grid cell in a `.map()`. */
export function RevealItem({ children, className }: RevealProps) {
	return (
		<motion.div variants={slideUp} className={className}>
			{children}
		</motion.div>
	);
}
