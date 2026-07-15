"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { Button } from "@/components/ui";
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
 * Full-viewport brand intro. The background is a CSS gradient
 * placeholder until real hero photography is sourced — swap for
 * a Next `<Image fill priority>` at that point (see the migration
 * plan's image strategy).
 */
export function HeroSection() {
	return (
		<section className="relative flex min-h-screen items-center overflow-hidden pt-32 pb-20">
			<div
				aria-hidden
				className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(201,162,39,0.16),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(232,205,115,0.12),transparent_40%)] bg-background"
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
				</motion.div>
			</Container>
		</section>
	);
}
