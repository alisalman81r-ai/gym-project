"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { SectionTitle } from "@/components/ui";
import { PricingCard } from "@/components/cards";
import { PRICING_PLANS } from "@/constants/pricing";

const gridVariants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

/** Three-tier membership pricing, the center (Elite) plan visually elevated. */
export function PricingSection() {
	return (
		<section className="py-24">
			<Container>
				<SectionTitle eyebrow="Membership" title="Choose Your Level of Elite" />

				<motion.div
					variants={gridVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
					className="grid gap-6 md:grid-cols-3"
				>
					{PRICING_PLANS.map((plan) => (
						<motion.div key={plan.id} variants={cardVariants} className={plan.isFeatured ? "md:scale-105" : undefined}>
							<PricingCard plan={plan} />
						</motion.div>
					))}
				</motion.div>
			</Container>
		</section>
	);
}
