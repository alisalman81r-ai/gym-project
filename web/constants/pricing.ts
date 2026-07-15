import type { PricingPlan } from "@/types";

export const PRICING_PLANS: PricingPlan[] = [
	{
		id: "signature",
		name: "Signature",
		price: 149,
		period: "mo",
		features: ["Full gym floor access", "Locker room & showers", "2 group classes / week", "Mobile app tracking"],
	},
	{
		id: "elite",
		name: "Elite",
		price: 249,
		period: "mo",
		isFeatured: true,
		features: [
			"Everything in Signature",
			"Unlimited group classes",
			"1 personal training session / month",
			"Nutrition plan included",
		],
	},
	{
		id: "private-club",
		name: "Private Club",
		price: 499,
		period: "mo",
		features: [
			"Everything in Elite",
			"4 personal training sessions / month",
			"Priority class booking",
			"Private recovery lounge access",
		],
	},
];
