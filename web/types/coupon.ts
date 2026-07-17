export type CouponType = "percentage" | "fixed";

export interface Coupon {
	id: number;
	code: string;
	type: CouponType;
	value: number;
	expiresAt: string | null;
	usageLimit: number | null;
	usedCount: number;
	active: boolean;
	createdAt: string;
}
