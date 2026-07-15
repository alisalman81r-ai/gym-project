"use client";

import { motion } from "framer-motion";
import { Button } from "./Button";
import { slideUp, VIEWPORT_ONCE } from "@/lib/animations";

export interface CtaBannerProps {
	eyebrow?: string;
	title: string;
	description?: string;
	primaryCta: { label: string; href: string };
	secondaryCta?: { label: string; href: string };
}

/** Full-width, gold-bordered closing band — reusable across every page. */
export function CtaBanner({ eyebrow, title, description, primaryCta, secondaryCta }: CtaBannerProps) {
	return (
		<motion.section
			variants={slideUp}
			initial="hidden"
			whileInView="visible"
			viewport={VIEWPORT_ONCE}
			className="relative mx-5 my-16 rounded-3xl border border-primary bg-[radial-gradient(circle_at_50%_0%,rgba(201,162,39,0.12),transparent_60%)] bg-secondary px-6 py-16 text-center sm:mx-8 sm:px-10"
		>
			{eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
			<h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">{title}</h2>
			{description && <p className="mx-auto mt-4 max-w-xl text-text-muted">{description}</p>}

			<div className="mt-8 flex flex-wrap items-center justify-center gap-4">
				<Button href={primaryCta.href} size="lg">
					{primaryCta.label}
				</Button>
				{secondaryCta && (
					<Button href={secondaryCta.href} variant="secondary" size="lg">
						{secondaryCta.label}
					</Button>
				)}
			</div>
		</motion.section>
	);
}
