"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout";
import { TestimonialCard } from "@/components/cards";
import { TESTIMONIALS } from "@/constants/testimonials";

const AUTOPLAY_INTERVAL_MS = 6000;

/** Autoplaying testimonial crossfade with manual dot controls. */
export function TestimonialsSection() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const prefersReducedMotion = useReducedMotion();

	useEffect(() => {
		if (isPaused || prefersReducedMotion) return;

		const timer = setInterval(() => {
			setActiveIndex((current) => (current + 1) % TESTIMONIALS.length);
		}, AUTOPLAY_INTERVAL_MS);

		return () => clearInterval(timer);
	}, [isPaused, prefersReducedMotion]);

	return (
		<section
			className="bg-background py-24"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
			onFocus={() => setIsPaused(true)}
			onBlur={() => setIsPaused(false)}
		>
			<Container>
				<p className="mb-10 text-center text-xs font-bold uppercase tracking-[0.2em] text-primary">
					Member Stories
				</p>

				<AnimatePresence mode="wait">
					<motion.div
						key={TESTIMONIALS[activeIndex].id}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
					>
						<TestimonialCard testimonial={TESTIMONIALS[activeIndex]} />
					</motion.div>
				</AnimatePresence>

				<div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="Testimonial navigation">
					{TESTIMONIALS.map((testimonial, index) => (
						<button
							key={testimonial.id}
							type="button"
							role="tab"
							aria-selected={index === activeIndex}
							aria-label={`Show testimonial ${index + 1}`}
							onClick={() => setActiveIndex(index)}
							className={`h-2.5 w-2.5 rounded-full transition-colors ${
								index === activeIndex ? "bg-primary" : "bg-border hover:bg-text-muted"
							}`}
						/>
					))}
				</div>
			</Container>
		</section>
	);
}
