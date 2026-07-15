import type { Variants } from "framer-motion";

/**
 * Shared Framer Motion primitives. Every section that reveals on
 * scroll or entrance should import from here rather than defining
 * its own `hidden`/`visible` variant object — before this file,
 * six section components each hand-rolled a near-identical stagger
 * variant, which is exactly the duplication this consolidates.
 *
 * Usage:
 *
 *   <motion.div variants={slideUp} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE}>
 *
 * For a staggered grid of children:
 *
 *   <motion.div variants={staggerContainer()} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE}>
 *     {items.map((item) => <motion.div key={item.id} variants={slideUp}>...</motion.div>)}
 *   </motion.div>
 */

/** The site's one motion curve — used everywhere so easing reads as one system. */
export const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

/** Standard "already scrolled past, don't replay" viewport config for `whileInView`. */
export const VIEWPORT_ONCE = { once: true, amount: 0.2 } as const;

export const fadeIn: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.7, ease: EASE_LUXURY } },
};

export const slideUp: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_LUXURY } },
};

/** Enters moving rightward, i.e. appears to slide in from the left. */
export const slideInLeft: Variants = {
	hidden: { opacity: 0, x: -24 },
	visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_LUXURY } },
};

/** Enters moving leftward, i.e. appears to slide in from the right. */
export const slideInRight: Variants = {
	hidden: { opacity: 0, x: 24 },
	visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_LUXURY } },
};

export const scaleIn: Variants = {
	hidden: { opacity: 0, scale: 0.96 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE_LUXURY } },
};

/**
 * Wraps a set of children so they reveal one after another rather
 * than all at once. Apply to the parent `motion.div`; each child
 * then just needs its own variant (usually `slideUp`).
 */
export function staggerContainer(staggerChildren = 0.1, delayChildren = 0): Variants {
	return {
		hidden: {},
		visible: { transition: { staggerChildren, delayChildren } },
	};
}
