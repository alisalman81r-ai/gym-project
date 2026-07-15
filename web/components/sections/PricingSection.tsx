"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { SectionTitle } from "@/components/ui";
import { PricingCard } from "@/components/cards";
import { staggerContainer, slideUp, VIEWPORT_ONCE } from "@/lib/animations";
import { PRICING_PLANS } from "@/constants/pricing";

const gridVariants = staggerContainer(0.12);

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
					viewport={VIEWPORT_ONCE}
					className="grid gap-6 md:grid-cols-3"
				>
					{PRICING_PLANS.map((plan) => (
						<motion.div key={plan.id} variants={slideUp} className={plan.isFeatured ? "md:scale-105" : undefined}>
							<PricingCard plan={plan} />
						</motion.div>
					))}
				</motion.div>
			</Container>
		</section>
	);
}
