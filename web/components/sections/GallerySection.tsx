"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { SectionTitle, Button } from "@/components/ui";
import { GALLERY_IMAGES } from "@/constants/gallery";

const gridVariants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
	hidden: { opacity: 0, scale: 0.96 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

/**
 * Image-ready masonry grid. Currently rendering the hand-drawn
 * SVG placeholders in public/images/gallery/ -- see the README
 * note on swapping in real photography.
 */
export function GallerySection() {
	return (
		<section className="bg-secondary py-24">
			<Container>
				<SectionTitle eyebrow="Inside The Club" title="Transformation Gallery" />

				<motion.div
					variants={gridVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.15 }}
					className="grid grid-cols-2 gap-3 sm:grid-cols-3"
				>
					{GALLERY_IMAGES.map((image, index) => (
						<motion.div
							key={image.id}
							variants={itemVariants}
							className={`group relative overflow-hidden rounded-lg ${
								index % 2 === 0 ? "aspect-[4/5]" : "aspect-square"
							}`}
						>
							<Image
								src={image.src}
								alt={image.alt}
								fill
								unoptimized
								sizes="(min-width: 640px) 33vw, 50vw"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</motion.div>
					))}
				</motion.div>

				<div className="mt-10 text-center">
					<Button href="/gallery" variant="ghost">
						View Full Gallery &rarr;
					</Button>
				</div>
			</Container>
		</section>
	);
}
