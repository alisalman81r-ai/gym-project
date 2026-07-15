"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { SectionTitle } from "@/components/ui";
import { ClassCard } from "@/components/cards";
import { staggerContainer, slideUp, VIEWPORT_ONCE } from "@/lib/animations";
import { EQUIPMENT } from "@/constants/equipment";

const gridVariants = staggerContainer(0.1);

/**
 * Facility/equipment showcase. `EquipmentItem` shares `GymClass`'s
 * exact shape (id/title/description/icon/image), so this reuses
 * ClassCard rather than adding a near-duplicate EquipmentCard.
 */
export function EquipmentSection() {
	return (
		<section className="bg-secondary py-24">
			<Container>
				<SectionTitle eyebrow="The Facility" title="Built With No Compromises" />

				<motion.div
					variants={gridVariants}
					initial="hidden"
					whileInView="visible"
					viewport={VIEWPORT_ONCE}
					className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
				>
					{EQUIPMENT.map((item) => (
						<motion.div key={item.id} variants={slideUp}>
							<ClassCard gymClass={item} />
						</motion.div>
					))}
				</motion.div>
			</Container>
		</section>
	);
}
