"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { SectionTitle, Accordion } from "@/components/ui";
import { slideUp, VIEWPORT_ONCE } from "@/lib/animations";
import { FAQ_ITEMS } from "@/constants/faq";

/** Frequently asked questions -- multi-open accordion. */
export function FaqSection() {
	return (
		<section className="py-24">
			<Container>
				<SectionTitle eyebrow="Questions" title="Frequently Asked Questions" />
				<motion.div variants={slideUp} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE}>
					<Accordion items={FAQ_ITEMS} />
				</motion.div>
			</Container>
		</section>
	);
}
