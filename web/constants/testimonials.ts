import type { Testimonial } from "@/types";

export const TESTIMONIALS: Testimonial[] = [
	{
		id: "sarah-whitfield",
		quote:
			"The coaching here changed how I think about training entirely. Six months in, I'm stronger at 40 than I was at 25.",
		name: "Sarah Whitfield",
		tenure: "Elite Member since 2023",
		avatar: { src: "/images/testimonials/sarah-whitfield.svg", alt: "" },
	},
	{
		id: "james-keller",
		quote:
			"Best coaching staff I've trained with. My deadlift went up 80lbs in six months following their program.",
		name: "James Keller",
		tenure: "Premium Member since 2021",
		avatar: { src: "/images/testimonials/james-keller.svg", alt: "" },
	},
	{
		id: "maria-gomez",
		quote:
			"The community here keeps me accountable. I actually look forward to leg day now, which still surprises me.",
		name: "Maria Gomez",
		tenure: "Elite Member since 2024",
		avatar: { src: "/images/testimonials/maria-gomez.svg", alt: "" },
	},
];
