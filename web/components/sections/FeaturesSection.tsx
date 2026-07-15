"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { SectionTitle } from "@/components/ui";
import { FeatureCard } from "@/components/cards";
import { staggerContainer, slideUp, VIEWPORT_ONCE } from "@/lib/animations";
import { FEATURES } from "@/constants/features";

const gridVariants = staggerContainer(0.1);

/** "Why Choose Us" — a staggered grid of feature tiles. */
export function FeaturesSection() {
	return (
		<section className="py-24">
			<Container>
				<SectionTitle eyebrow="The Iron Elite Standard" title="Why Members Choose Iron Elite" />

				<motion.div
					variants={gridVariants}
					initial="hidden"
					whileInView="visible"
					viewport={VIEWPORT_ONCE}
					className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
				>
					{FEATURES.map((feature) => (
						<motion.div key={feature.id} variants={slideUp}>
							<FeatureCard feature={feature} />
						</motion.div>
					))}
				</motion.div>
			</Container>
		</section>
	);
}
