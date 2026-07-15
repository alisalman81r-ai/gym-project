import type { LucideIcon } from "lucide-react";

/**
 * Same shape as `GymClass` (id/title/description/icon/image), so
 * EquipmentSection reuses ClassCard directly rather than adding a
 * near-duplicate EquipmentCard component.
 */
export interface EquipmentItem {
	id: string;
	title: string;
	description: string;
	icon: LucideIcon;
	image: { src: string; alt: string };
}
