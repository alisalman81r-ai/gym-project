"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { SectionTitle } from "@/components/ui";
import { FeatureCard } from "@/components/cards";
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
 * Featured training disciplines. Reuses `FeatureCard` directly --
 * `GymClass` shares the exact {id, title, description, icon}
 * shape as `Feature`, so a dedicated ClassCard would just be a
 * duplicate of an existing component.
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
							<FeatureCard feature={gymClass} />
						</motion.div>
					))}
				</motion.div>
			</Container>
		</section>
	);
}
