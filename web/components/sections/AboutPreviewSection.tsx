"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Container } from "@/components/layout";
import { SectionTitle, Button } from "@/components/ui";

const HIGHLIGHTS = [
	"Free personalized fitness assessment for new members",
	"Small-group and one-on-one coaching available",
	"Nutrition guidance included with every membership",
	"Private recovery lounge and spa access",
];

/**
 * Gym introduction + mission + highlights, two-column. The image
 * area is a gradient placeholder (see TrainerCard for the same
 * pattern) -- swap for a Next `<Image>` once real photography of
 * the strength floor is sourced.
 */
export function AboutPreviewSection() {
	return (
		<section className="bg-secondary py-24">
			<Container>
				<div className="grid items-center gap-12 lg:grid-cols-2">
					<motion.div
						initial={{ opacity: 0, x: -24 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, amount: 0.4 }}
						transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
						aria-hidden
						className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-primary/15 via-background to-background shadow-elevated lg:order-1"
					/>

					<div>
						<SectionTitle
							eyebrow="Who We Are"
							title="Beyond a Gym. A Discipline."
							align="left"
							className="mb-6"
						/>

						<p className="text-text-muted">
							Iron Elite Fitness Club was founded on a simple belief: exceptional results come from
							exceptional standards. We are not a volume gym — we are a private training environment
							where every member receives a coached, considered path toward their goals.
						</p>
						<p className="mt-4 border-l-2 border-primary pl-4 text-text-muted">
							<strong className="text-text">Our mission</strong> is to give every member the coaching,
							environment, and accountability of a professional athlete — regardless of where
							they&rsquo;re starting from.
						</p>

						<ul className="mt-6 space-y-3">
							{HIGHLIGHTS.map((item) => (
								<li key={item} className="flex items-start gap-2 text-sm text-text">
									<Check size={16} className="mt-0.5 shrink-0 text-primary" />
									{item}
								</li>
							))}
						</ul>

						<div className="mt-8">
							<Button href="/about" variant="ghost">
								Discover Our Story &rarr;
							</Button>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
