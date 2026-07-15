"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { SectionTitle } from "@/components/ui";
import { TrainerCard } from "@/components/cards";
import { staggerContainer, slideUp, VIEWPORT_ONCE } from "@/lib/animations";
import { TRAINERS } from "@/constants/trainers";

const gridVariants = staggerContainer(0.1);

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
					viewport={VIEWPORT_ONCE}
					className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
				>
					{TRAINERS.map((trainer) => (
						<motion.div key={trainer.id} variants={slideUp}>
							<TrainerCard trainer={trainer} />
						</motion.div>
					))}
				</motion.div>
			</Container>
		</section>
	);
}
