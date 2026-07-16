import type { Supplement } from "@/types";

export const SUPPLEMENTS: Supplement[] = [
	{
		id: "whey-protein-isolate",
		name: "Whey Protein Isolate",
		category: "Protein",
		price: 54.99,
		description: "25g of fast-absorbing protein per scoop to support muscle repair after training.",
		image: { src: "/images/supplements/whey-protein-isolate.jpg", alt: "Tub of whey protein isolate with a scoop and shaker bottle" },
	},
	{
		id: "creatine-monohydrate",
		name: "Creatine Monohydrate",
		category: "Performance",
		price: 29.99,
		description: "Micronized, unflavored creatine for strength and power output — the most researched supplement in sports nutrition.",
		image: { src: "/images/supplements/creatine-monohydrate.jpg", alt: "Bag of creatine monohydrate supplement powder" },
	},
	{
		id: "pre-workout-igniter",
		name: "Pre-Workout Igniter",
		category: "Pre-Workout",
		price: 39.99,
		description: "A balanced dose of caffeine and citrulline malate to sharpen focus and energy before a session.",
		image: { src: "/images/supplements/pre-workout-igniter.jpg", alt: "Jar of pre-workout supplement powder with a scoop" },
	},
	{
		id: "bcaa-recovery-blend",
		name: "BCAA Recovery Blend",
		category: "Recovery",
		price: 34.99,
		description: "A 2:1:1 branched-chain amino acid ratio to reduce soreness and support recovery between sessions.",
		image: { src: "/images/supplements/bcaa-recovery-blend.jpg", alt: "Container of BCAA amino acid recovery powder with a scoop" },
	},
	{
		id: "daily-multivitamin",
		name: "Daily Multivitamin",
		category: "Wellness",
		price: 24.99,
		description: "A complete daily foundation of essential vitamins and minerals for active lifestyles.",
		image: { src: "/images/supplements/daily-multivitamin.jpg", alt: "Bottle of daily multivitamin supplement" },
	},
	{
		id: "electrolyte-hydration-mix",
		name: "Electrolyte Hydration Mix",
		category: "Hydration",
		price: 19.99,
		description: "Sugar-free electrolyte packets to replace what you sweat out during long or hot sessions.",
		image: { src: "/images/supplements/electrolyte-hydration-mix.jpg", alt: "Electrolyte powder being poured into a water bottle" },
	},
];
