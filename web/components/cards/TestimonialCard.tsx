import { Quote } from "lucide-react";
import type { Testimonial } from "@/types";

export interface TestimonialCardProps {
	testimonial: Testimonial;
}

/**
 * A single member quote — used by TestimonialsSection. Not
 * wrapped in the base `Card` since the slider gives it its own
 * frosted-glass treatment rather than the standard card box.
 */
export function TestimonialCard({ testimonial }: TestimonialCardProps) {
	return (
		<div className="mx-auto max-w-2xl rounded-2xl border border-primary/25 bg-white/[0.03] p-10 text-center backdrop-blur-md sm:p-14">
			<Quote className="mx-auto mb-4 text-primary/60" size={32} />
			<p className="text-lg text-text sm:text-xl">&ldquo;{testimonial.quote}&rdquo;</p>
			<p className="mt-6 font-semibold text-text">
				{testimonial.name} <span className="font-normal text-text-muted">&middot; {testimonial.tenure}</span>
			</p>
		</div>
	);
}
