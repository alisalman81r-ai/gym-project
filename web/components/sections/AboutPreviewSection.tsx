"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Container } from "@/components/layout";
import { SectionTitle, Button } from "@/components/ui";
import { siteConfig } from "@/constants/site";

const HIGHLIGHTS = [
	"Free personalized fitness assessment for new members",
	"Small-group and one-on-one coaching available",
	"Nutrition guidance included with every membership",
	"Private recovery lounge and spa access",
];

/**
 * Gym introduction + mission/vision + highlights, two-column.
 * `about-strength-floor.svg` is a placeholder -- swap the file at
 * public/images/hero/about-strength-floor.svg for a real photo of
 * the strength floor and nothing here needs to change.
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
						className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-elevated lg:order-1"
					>
						<Image
							src="/images/hero/about-strength-floor.svg"
							alt="Coach guiding a member through a barbell lift on the Iron Elite strength floor"
							fill
							unoptimized
							sizes="(min-width: 1024px) 50vw, 100vw"
							className="object-cover"
						/>
					</motion.div>

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
							<strong className="text-text">Our mission</strong> is {siteConfig.mission}
						</p>
						<p className="mt-4 border-l-2 border-primary/40 pl-4 text-text-muted">
							<strong className="text-text">Our vision</strong> is {siteConfig.vision}
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
