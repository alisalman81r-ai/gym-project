import { Dumbbell, Flame, Wind, UserCheck } from "lucide-react";
import type { GymClass } from "@/types";

export const CLASSES: GymClass[] = [
	{
		id: "strength-training",
		title: "Strength Training",
		description: "Progressive barbell programming built around proven strength cycles.",
		icon: Dumbbell,
		image: { src: "/images/classes/strength-training.svg", alt: "Member performing a barbell lift during a strength training session" },
	},
	{
		id: "cross-training",
		title: "Cross Training",
		description: "High-intensity functional conditioning that builds real-world strength.",
		icon: Flame,
		image: { src: "/images/classes/cross-training.svg", alt: "Group cross training class using kettlebells and functional equipment" },
	},
	{
		id: "yoga",
		title: "Yoga",
		description: "Guided mobility and recovery sessions that balance out heavy training.",
		icon: Wind,
		image: { src: "/images/classes/yoga.svg", alt: "Instructor leading a yoga class focused on mobility and recovery" },
	},
	{
		id: "personal-training",
		title: "Personal Training",
		description: "One-on-one coaching with a dedicated trainer who adjusts your plan weekly.",
		icon: UserCheck,
		image: { src: "/images/classes/personal-training.svg", alt: "Personal trainer coaching a client one-on-one" },
	},
];
