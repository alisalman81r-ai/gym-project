"use client";

import { Container } from "@/components/layout";
import { useCountUp } from "@/hooks/useCountUp";
import { STATS } from "@/constants/stats";
import type { Stat } from "@/types";

/** One counter — kept local since only StatsSection ever renders it. */
function StatItem({ stat }: { stat: Stat }) {
	const { ref, value } = useCountUp(stat.value);
	const Icon = stat.icon;

	return (
		<div ref={ref} className="flex flex-col items-center gap-2 text-center">
			<Icon size={28} className="mb-1 text-primary" />
			<p className="font-display text-4xl font-bold text-text">
				{value.toLocaleString("en-US")}
				<span className="text-primary">+</span>
			</p>
			<p className="text-xs font-semibold uppercase tracking-wider text-text-muted">{stat.label}</p>
		</div>
	);
}

/** "Iron Elite in Numbers" — animated counters, triggered on scroll into view. */
export function StatsSection() {
	return (
		<section className="border-y border-border bg-secondary py-20">
			<Container>
				<div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
					{STATS.map((stat) => (
						<StatItem key={stat.id} stat={stat} />
					))}
				</div>
			</Container>
		</section>
	);
}
