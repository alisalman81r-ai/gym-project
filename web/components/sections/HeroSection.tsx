"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { Button } from "@/components/ui";
import { useCountUp } from "@/hooks/useCountUp";
import { siteConfig } from "@/constants/site";

const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/**
 * Quick-glance numbers distinct from the dedicated StatsSection
 * further down the page (different metrics, so the two sections
 * don't just repeat each other) -- both reuse the same
 * `useCountUp` hook.
 */
const HERO_STATS = [
	{ label: "Years Legacy", value: 12 },
	{ label: "Elite Members", value: 3200 },
	{ label: "Weekly Classes", value: 40 },
	{ label: "Master Coaches", value: 18 },
];

function HeroStat({ label, value }: { label: string; value: number }) {
	const { ref, value: count } = useCountUp(value);

	return (
		<div ref={ref} className="flex flex-col items-center gap-1">
			<span className="font-display text-2xl font-bold text-primary">
				{count.toLocaleString("en-US")}
				<span>+</span>
			</span>
			<span className="text-xs uppercase tracking-wider text-text-muted">{label}</span>
		</div>
	);
}

/**
 * Full-viewport brand intro. `priority` + `fill` since this image
 * is the page's LCP element. Currently pointed at a hand-drawn SVG
 * placeholder (public/images/hero/hero-main.svg) -- drop a real
 * photo at that path (or update the `src` below) and remove
 * `unoptimized` once it's a raster format.
 */
export function HeroSection() {
	return (
		<section className="relative flex min-h-screen items-center overflow-hidden pt-32 pb-20">
			<Image
				src="/images/hero/hero-main.svg"
				alt="Members training on the strength floor at Iron Elite Fitness Club"
				fill
				priority
				unoptimized
				sizes="100vw"
				className="-z-20 object-cover"
			/>
			<div
				aria-hidden
				className="absolute inset-0 -z-10 bg-gradient-to-b from-background/55 via-background/78 to-background"
			/>

			<Container>
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="mx-auto max-w-3xl text-center"
				>
					<motion.p variants={itemVariants} className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
						Welcome to {siteConfig.name}
					</motion.p>

					<motion.h1 variants={itemVariants} className="font-display text-5xl font-bold text-text sm:text-6xl lg:text-7xl">
						{siteConfig.tagline}
					</motion.h1>

					<motion.p variants={itemVariants} className="mx-auto mt-6 max-w-xl text-lg text-text-muted">
						{siteConfig.description}
					</motion.p>

					<motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center justify-center gap-4">
						<Button href="/contact" size="lg">
							Book a Tour
						</Button>
						<Button href="/classes" variant="secondary" size="lg">
							Explore Classes
						</Button>
					</motion.div>

					<motion.div
						variants={itemVariants}
						className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-8 border-t border-border pt-8 sm:grid-cols-4"
					>
						{HERO_STATS.map((stat) => (
							<HeroStat key={stat.label} {...stat} />
						))}
					</motion.div>
				</motion.div>
			</Container>
		</section>
	);
}
