"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/layout";
import { Button, RevealImage } from "@/components/ui";
import { useCountUp } from "@/hooks/useCountUp";
import { staggerContainer, slideUp } from "@/lib/animations";
import { siteConfig } from "@/constants/site";

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

const heroEntrance = staggerContainer(0.12, 0.1);
const wordStagger = staggerContainer(0.08);

/**
 * Full-viewport brand intro. `priority` + `fill` since this image
 * is the page's LCP element. A slow, continuous Ken Burns zoom
 * (18s loop) keeps the background from feeling static without
 * distracting from the headline. Photo: George Pagan III on
 * Unsplash (see public/images/README.md for the full credit list).
 *
 * The background wrapper also carries a scroll-linked parallax drift
 * (via `useScroll`/`useTransform`, bound through `style` so it never
 * fights the Ken Burns `scale` animation on the same element -- one
 * targets `y`, the other `scale`), plus two slow-drifting ambient
 * glow orbs for depth, and a bottom scroll cue that fades in after
 * the entrance sequence finishes.
 */
export function HeroSection() {
	const sectionRef = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
	const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

	const words = siteConfig.tagline.split(" ");

	return (
		<section ref={sectionRef} className="relative flex min-h-screen items-center overflow-hidden pt-32 pb-20">
			<motion.div
				aria-hidden
				className="absolute inset-0 -z-20"
				style={{ y: backgroundY }}
				animate={{ scale: [1, 1.08] }}
				transition={{ duration: 18, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
			>
				<RevealImage
					src="/images/hero/hero-main.jpg"
					alt="Members training on the strength floor at Iron Elite Fitness Club"
					fill
					priority
					sizes="100vw"
					className="object-cover"
				/>
			</motion.div>
			<div
				aria-hidden
				className="absolute inset-0 -z-10 bg-gradient-to-b from-background/55 via-background/78 to-background"
			/>

			<motion.div
				aria-hidden
				className="pointer-events-none absolute -left-32 top-1/4 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-[120px]"
				animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
				transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				aria-hidden
				className="pointer-events-none absolute -right-32 bottom-1/4 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-[120px]"
				animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
				transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
			/>

			<Container>
				<motion.div variants={heroEntrance} initial="hidden" animate="visible" className="mx-auto max-w-3xl text-center">
					<motion.p variants={slideUp} className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
						Welcome to {siteConfig.name}
					</motion.p>

					<motion.h1 className="font-display text-5xl font-bold text-text sm:text-6xl lg:text-7xl">
						<motion.span variants={wordStagger} className="inline">
							{words.map((word, index) => (
								<motion.span key={index} variants={slideUp} className="mr-[0.25em] inline-block last:mr-0">
									{word}
								</motion.span>
							))}
						</motion.span>
					</motion.h1>

					<motion.p variants={slideUp} className="mx-auto mt-6 max-w-xl text-lg text-text-muted">
						{siteConfig.description}
					</motion.p>

					<motion.div variants={slideUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
						<Button href="/contact" size="lg">
							Book a Tour
						</Button>
						<Button href="/classes" variant="secondary" size="lg">
							Explore Classes
						</Button>
					</motion.div>

					<motion.div
						variants={slideUp}
						className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-8 border-t border-border pt-8 sm:grid-cols-4"
					>
						{HERO_STATS.map((stat) => (
							<HeroStat key={stat.label} {...stat} />
						))}
					</motion.div>
				</motion.div>
			</Container>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.6, duration: 0.8 }}
				className="absolute inset-x-0 bottom-8 hidden flex-col items-center gap-2 sm:flex"
			>
				<span className="text-[0.65rem] uppercase tracking-[0.3em] text-text-subtle">Scroll</span>
				<motion.div
					animate={{ y: [0, 8, 0] }}
					transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
					className="flex h-9 w-6 items-start justify-center rounded-full border border-border p-1.5"
				>
					<span className="h-1.5 w-1.5 rounded-full bg-primary" />
				</motion.div>
			</motion.div>
		</section>
	);
}
