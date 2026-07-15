"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SectionTitleProps {
	eyebrow?: string;
	title: string;
	description?: string;
	align?: "center" | "left";
	className?: string;
}

/**
 * The eyebrow + heading (+ optional description) pattern used at
 * the top of nearly every section. Fades up into view once, the
 * moment that also cues each section's own reveal.
 */
export function SectionTitle({ eyebrow, title, description, align = "center", className }: SectionTitleProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.4 }}
			transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
			className={cn(
				"mx-auto mb-14 max-w-2xl",
				align === "center" ? "text-center" : "text-left mx-0",
				className
			)}
		>
			{eyebrow && (
				<p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
			)}
			<h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">{title}</h2>
			{description && <p className="mt-4 text-text-muted">{description}</p>}
		</motion.div>
	);
}
