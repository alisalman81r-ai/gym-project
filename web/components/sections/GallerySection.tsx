"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout";
import { SectionTitle, Button, RevealImage } from "@/components/ui";
import { staggerContainer, scaleIn } from "@/lib/animations";
import { GALLERY_IMAGES } from "@/constants/gallery";

const gridVariants = staggerContainer(0.08);

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
							variants={scaleIn}
							className={`group relative overflow-hidden rounded-lg ${
								index % 2 === 0 ? "aspect-[4/5]" : "aspect-square"
							}`}
						>
							<RevealImage
								src={image.src}
								alt={image.alt}
								fill
								unoptimized
								sizes="(min-width: 640px) 33vw, 50vw"
								className="object-cover group-hover:scale-105"
							/>
							{image.caption && (
								<div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-background/95 to-transparent p-4 pt-10 transition-transform duration-300 group-hover:translate-y-0">
									<p className="text-sm text-text">{image.caption}</p>
								</div>
							)}
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
