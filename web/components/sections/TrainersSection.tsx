"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { SectionTitle } from "@/components/ui";
import { TrainerCard } from "@/components/cards";
import { TRAINERS } from "@/constants/trainers";

const gridVariants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

/** Coaching roster grid — "View Profile" opens a bio modal in a later phase. */
export function TrainersSection() {
	return (
		<section className="py-24">
			<Container>
				<SectionTitle eyebrow="Our Coaches" title="Trained By The Best" />

				<motion.div
					variants={gridVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
					className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
				>
					{TRAINERS.map((trainer) => (
						<motion.div key={trainer.id} variants={cardVariants}>
							<TrainerCard trainer={trainer} />
						</motion.div>
					))}
				</motion.div>
			</Container>
		</section>
	);
}
