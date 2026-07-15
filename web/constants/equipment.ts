import { Weight, Snowflake, Activity, LayoutGrid } from "lucide-react";
import type { EquipmentItem } from "@/types";

export const EQUIPMENT: EquipmentItem[] = [
	{
		id: "free-weight-zone",
		title: "Elite Free-Weight Zone",
		description: "Competition-grade barbells, plates, and racks — maintained daily, never a wait for the bar you need.",
		icon: Weight,
		image: { src: "/images/equipment/free-weight-zone.svg", alt: "The elite free-weight zone at Iron Elite Fitness Club" },
	},
	{
		id: "recovery-suite",
		title: "Recovery & Cryotherapy Suite",
		description: "Compression therapy, cryotherapy, and guided stretching — recovery treated as seriously as the lift itself.",
		icon: Snowflake,
		image: { src: "/images/equipment/recovery-suite.svg", alt: "The recovery and cryotherapy suite" },
	},
	{
		id: "cardio-deck",
		title: "Precision Cardio Deck",
		description: "A full floor of connected, data-tracked cardio equipment overlooking the strength floor below.",
		icon: Activity,
		image: { src: "/images/equipment/cardio-deck.svg", alt: "The precision cardio deck" },
	},
	{
		id: "functional-turf-zone",
		title: "Functional Turf Zone",
		description: "A dedicated turf lane for sleds, sprints, and functional conditioning work — space to actually move.",
		icon: LayoutGrid,
		image: { src: "/images/equipment/functional-turf-zone.svg", alt: "The functional turf training zone" },
	},
];
