"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { SectionTitle } from "@/components/ui";
import { FeatureCard } from "@/components/cards";
import { FEATURES } from "@/constants/features";

const gridVariants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

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
					viewport={{ once: true, amount: 0.2 }}
					className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
				>
					{FEATURES.map((feature) => (
						<motion.div key={feature.id} variants={cardVariants}>
							<FeatureCard feature={feature} />
						</motion.div>
					))}
				</motion.div>
			</Container>
		</section>
	);
}
