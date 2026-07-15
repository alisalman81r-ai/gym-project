export interface PricingPlan {
	id: string;
	name: string;
	price: number;
	period: "mo";
	features: string[];
	isFeatured?: boolean;
}
