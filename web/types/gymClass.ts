import type { LucideIcon } from "lucide-react";

/**
 * As of Phase 11, classes carry their own photography (unlike
 * `Feature`, which stays icon-only), so ClassesSection now uses
 * a dedicated ClassCard rather than reusing FeatureCard.
 */
export interface GymClass {
	id: string;
	title: string;
	description: string;
	icon: LucideIcon;
	image: { src: string; alt: string };
}
