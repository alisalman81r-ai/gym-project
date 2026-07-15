import { Award, Dumbbell, Target, Leaf } from "lucide-react";
import type { Feature } from "@/types";

export const FEATURES: Feature[] = [
	{
		id: "trainers",
		title: "Professional Trainers",
		description:
			"Certified, experienced coaches dedicated to building your strength, safely and deliberately.",
		icon: Award,
	},
	{
		id: "equipment",
		title: "Modern Equipment",
		description:
			"State-of-the-art strength and conditioning equipment, meticulously maintained.",
		icon: Dumbbell,
	},
	{
		id: "programs",
		title: "Personalized Programs",
		description: "Every member trains on a plan built around their body, goals, and schedule.",
		icon: Target,
	},
	{
		id: "nutrition",
		title: "Nutrition Guidance",
		description:
			"Custom nutrition coaching that supports your training so results show consistently.",
		icon: Leaf,
	},
];
