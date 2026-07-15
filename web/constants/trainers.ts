import type { Trainer } from "@/types";

export const TRAINERS: Trainer[] = [
	{
		id: "marcus-reed",
		name: "Marcus Reed",
		role: "Head Strength Coach",
		experience: "10+ years · CSCS, USAW Level 2",
		bio: "Marcus has coached powerlifters and everyday athletes alike toward measurable strength gains, building programs around slow, honest progression rather than shortcuts.",
		image: { src: "/images/trainers/marcus-reed.jpg", alt: "Portrait of Marcus Reed, Head Strength Coach" },
	},
	{
		id: "alina-cruz",
		name: "Alina Cruz",
		role: "HIIT & Conditioning",
		experience: "8 years · NASM-CPT",
		bio: "A former competitive sprinter, Alina designs metabolic conditioning sessions that keep members coming back for more — and genuinely enjoying the burn.",
		image: { src: "/images/trainers/alina-cruz.jpg", alt: "Portrait of Alina Cruz, HIIT & Conditioning Coach" },
	},
	{
		id: "daniel-osei",
		name: "Daniel Osei",
		role: "Functional Movement",
		experience: "12+ years · Licensed Physiotherapist",
		bio: "A certified physiotherapist turned coach, Daniel focuses on mobility, injury prevention, and the kind of training longevity that keeps members in the gym for decades.",
		image: { src: "/images/trainers/daniel-osei.jpg", alt: "Portrait of Daniel Osei, Functional Movement Coach" },
	},
	{
		id: "priya-nair",
		name: "Priya Nair",
		role: "Nutrition & Wellness",
		experience: "7 years · Registered Sports Dietitian",
		bio: "Priya builds sustainable, no-extremes meal plans tailored to each member's training load — nutrition coaching built for real life, not a fad.",
		image: { src: "/images/trainers/priya-nair.jpg", alt: "Portrait of Priya Nair, Nutrition & Wellness Coach" },
	},
];
