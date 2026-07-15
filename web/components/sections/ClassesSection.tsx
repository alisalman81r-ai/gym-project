"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { SectionTitle } from "@/components/ui";
import { ClassCard } from "@/components/cards";
import { staggerContainer, slideUp, VIEWPORT_ONCE } from "@/lib/animations";
import { CLASSES } from "@/constants/classes";

const gridVariants = staggerContainer(0.1);

/**
 * Featured training disciplines, each with its own photo (see
 * ClassCard) -- as of Phase 11, `GymClass` carries an `image`
 * field that `Feature` doesn't, so this is a dedicated card
 * rather than a FeatureCard reuse.
 */
export function ClassesSection() {
	return (
		<section className="py-24">
			<Container>
				<SectionTitle eyebrow="Training Disciplines" title="Featured Classes" />

				<motion.div
					variants={gridVariants}
					initial="hidden"
					whileInView="visible"
					viewport={VIEWPORT_ONCE}
					className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
				>
					{CLASSES.map((gymClass) => (
						<motion.div key={gymClass.id} variants={slideUp}>
							<ClassCard gymClass={gymClass} />
						</motion.div>
					))}
				</motion.div>
			</Container>
		</section>
	);
}
