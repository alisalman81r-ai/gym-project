"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { SectionTitle } from "@/components/ui";
import { ClassCard } from "@/components/cards";
import { CLASSES } from "@/constants/classes";

const gridVariants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

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
					viewport={{ once: true, amount: 0.2 }}
					className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
				>
					{CLASSES.map((gymClass) => (
						<motion.div key={gymClass.id} variants={cardVariants}>
							<ClassCard gymClass={gymClass} />
						</motion.div>
					))}
				</motion.div>
			</Container>
		</section>
	);
}
