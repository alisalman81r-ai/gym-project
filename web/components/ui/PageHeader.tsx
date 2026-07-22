"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { staggerContainer, slideUp } from "@/lib/animations";

export interface PageHeaderProps {
	eyebrow?: string;
	title: string;
	/** Plain text under the title (e.g. "Last updated: ..."), used instead of `eyebrow` on legal pages. */
	subtitle?: string;
	compact?: boolean;
}

const headerEntrance = staggerContainer(0.1, 0.05);

/**
 * The eyebrow + H1 banner every interior page opens with. Was
 * previously copy-pasted verbatim into 9 separate page.tsx files
 * (about/membership/trainers/classes/gallery/blog/contact/privacy/
 * terms) -- this is the single source now. Animates in immediately
 * (not `whileInView`) since it's always the first thing on the page,
 * matching HeroSection's language rather than the scroll-reveal one
 * every section below the fold uses.
 */
export function PageHeader({ eyebrow, title, subtitle, compact = false }: PageHeaderProps) {
	return (
		<section className={`relative overflow-hidden bg-secondary text-center pt-36 ${compact ? "pb-16" : "pb-20"}`}>
			<div
				aria-hidden
				className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]"
			/>
			<Container>
				<motion.div variants={headerEntrance} initial="hidden" animate="visible" className="relative">
					{eyebrow && (
						<motion.p variants={slideUp} className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
							{eyebrow}
						</motion.p>
					)}
					<motion.h1
						variants={slideUp}
						className={`font-display font-bold text-text ${compact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"}`}
					>
						{title}
					</motion.h1>
					{subtitle && (
						<motion.p variants={slideUp} className="mt-2 text-sm text-text-subtle">
							{subtitle}
						</motion.p>
					)}
				</motion.div>
			</Container>
		</section>
	);
}
