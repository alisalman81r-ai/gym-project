import { Target, Award, Users, Trophy } from "lucide-react";
import type { Feature } from "@/types";

/** "Our Values" tiles on the About page — shares Feature's shape, reuses FeatureCard. */
export const VALUES: Feature[] = [
	{
		id: "discipline",
		title: "Discipline",
		description: "Consistency beats intensity. We build habits that outlast motivation.",
		icon: Target,
	},
	{
		id: "excellence",
		title: "Excellence",
		description: "Every detail — coaching, equipment, facility — is held to a private-club standard.",
		icon: Award,
	},
	{
		id: "community",
		title: "Community",
		description: "Members train alongside people who hold each other to the same standard.",
		icon: Users,
	},
	{
		id: "legacy",
		title: "Legacy",
		description: "We coach for the results our members will still have ten years from now.",
		icon: Trophy,
	},
];
