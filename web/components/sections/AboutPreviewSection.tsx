"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Container } from "@/components/layout";
import { SectionTitle, Button, RevealImage } from "@/components/ui";
import { slideInLeft, slideUp, staggerContainer, VIEWPORT_ONCE } from "@/lib/animations";
import { siteConfig } from "@/constants/site";

const HIGHLIGHTS = [
	"Free personalized fitness assessment for new members",
	"Small-group and one-on-one coaching available",
	"Nutrition guidance included with every membership",
	"Private recovery lounge and spa access",
];

const contentStagger = staggerContainer(0.08);

/**
 * Gym introduction + mission/vision + highlights, two-column.
 * Photo: Vitaly Gariev on Unsplash (see public/images/README.md).
 */
export function AboutPreviewSection() {
	return (
		<section className="bg-secondary py-24">
			<Container>
				<div className="grid items-center gap-12 lg:grid-cols-2">
					<motion.div
						variants={slideInLeft}
						initial="hidden"
						whileInView="visible"
						viewport={VIEWPORT_ONCE}
						className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-elevated lg:order-1"
					>
						<RevealImage
							src="/images/hero/about-strength-floor.jpg"
							alt="Coach guiding a member through a barbell lift on the Iron Elite strength floor"
							fill
							sizes="(min-width: 1024px) 50vw, 100vw"
							className="object-cover"
						/>
					</motion.div>

					<motion.div variants={contentStagger} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE}>
						<motion.div variants={slideUp}>
							<SectionTitle eyebrow="Who We Are" title="Beyond a Gym. A Discipline." align="left" className="mb-6" />
						</motion.div>

						<motion.p variants={slideUp} className="text-text-muted">
							Iron Elite Fitness Club was founded on a simple belief: exceptional results come from
							exceptional standards. We are not a volume gym — we are a private training environment
							where every member receives a coached, considered path toward their goals.
						</motion.p>
						<motion.p variants={slideUp} className="mt-4 border-l-2 border-primary pl-4 text-text-muted">
							<strong className="text-text">Our mission</strong> is {siteConfig.mission}
						</motion.p>
						<motion.p variants={slideUp} className="mt-4 border-l-2 border-primary/40 pl-4 text-text-muted">
							<strong className="text-text">Our vision</strong> is {siteConfig.vision}
						</motion.p>

						<motion.ul variants={slideUp} className="mt-6 space-y-3">
							{HIGHLIGHTS.map((item) => (
								<li key={item} className="flex items-start gap-2 text-sm text-text">
									<Check size={16} className="mt-0.5 shrink-0 text-primary" />
									{item}
								</li>
							))}
						</motion.ul>

						<motion.div variants={slideUp} className="mt-8">
							<Button href="/about" variant="ghost">
								Discover Our Story &rarr;
							</Button>
						</motion.div>
					</motion.div>
				</div>
			</Container>
		</section>
	);
}
