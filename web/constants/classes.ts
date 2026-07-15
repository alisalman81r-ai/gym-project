import { Dumbbell, Flame, Wind, UserCheck } from "lucide-react";
import type { GymClass } from "@/types";

export const CLASSES: GymClass[] = [
	{
		id: "strength-training",
		title: "Strength Training",
		description: "Progressive barbell programming built around proven strength cycles.",
		icon: Dumbbell,
	},
	{
		id: "cross-training",
		title: "Cross Training",
		description: "High-intensity functional conditioning that builds real-world strength.",
		icon: Flame,
	},
	{
		id: "yoga",
		title: "Yoga",
		description: "Guided mobility and recovery sessions that balance out heavy training.",
		icon: Wind,
	},
	{
		id: "personal-training",
		title: "Personal Training",
		description: "One-on-one coaching with a dedicated trainer who adjusts your plan weekly.",
		icon: UserCheck,
	},
];
