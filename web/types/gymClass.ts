import type { LucideIcon } from "lucide-react";

/**
 * Same shape as `Feature` (id/title/description/icon) so
 * ClassesSection can reuse FeatureCard directly instead of a
 * near-duplicate card component -- see constants/classes.ts.
 */
export interface GymClass {
	id: string;
	title: string;
	description: string;
	icon: LucideIcon;
}
