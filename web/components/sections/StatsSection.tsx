"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { useCountUp } from "@/hooks/useCountUp";
import { staggerContainer, slideUp, VIEWPORT_ONCE } from "@/lib/animations";
import { STATS } from "@/constants/stats";
import type { Stat } from "@/types";

const gridVariants = staggerContainer(0.1);

/** One counter — kept local since only StatsSection ever renders it. */
function StatItem({ stat }: { stat: Stat }) {
	const { ref, value } = useCountUp(stat.value);
	const Icon = stat.icon;

	return (
		<motion.div ref={ref} variants={slideUp} className="flex flex-col items-center gap-2 text-center">
			<Icon size={28} className="mb-1 text-primary" />
			<p className="font-display text-4xl font-bold text-text">
				{value.toLocaleString("en-US")}
				<span className="text-primary">+</span>
			</p>
			<p className="text-xs font-semibold uppercase tracking-wider text-text-muted">{stat.label}</p>
		</motion.div>
	);
}

/** "Iron Elite in Numbers" — animated counters, staggered in and triggered on scroll into view. */
export function StatsSection() {
	return (
		<section className="relative overflow-hidden border-y border-border bg-secondary py-20">
			<div
				aria-hidden
				className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]"
			/>
			<Container>
				<motion.div
					variants={gridVariants}
					initial="hidden"
					whileInView="visible"
					viewport={VIEWPORT_ONCE}
					className="relative grid grid-cols-2 gap-10 lg:grid-cols-4"
				>
					{STATS.map((stat) => (
						<StatItem key={stat.id} stat={stat} />
					))}
				</motion.div>
			</Container>
		</section>
	);
}
