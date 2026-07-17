"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hasAdminSession } from "@/lib/auth";
import { createCoupon, updateCoupon, deleteCoupon, type CouponInput } from "@/lib/store/coupons";

async function assertAdmin(): Promise<void> {
	if (!(await hasAdminSession())) redirect("/admin/login");
}

export interface CouponFormState {
	error?: string;
}

function buildInput(formData: FormData): CouponInput | { error: string } {
	const code = String(formData.get("code") ?? "").trim();
	const type = String(formData.get("type") ?? "percentage") === "fixed" ? "fixed" : "percentage";
	const value = Number(formData.get("value"));
	const expiresAtRaw = String(formData.get("expiresAt") ?? "").trim();
	const expiresAt = expiresAtRaw || null;
	const usageLimitRaw = String(formData.get("usageLimit") ?? "").trim();
	const usageLimit = usageLimitRaw ? Number(usageLimitRaw) : null;
	const active = formData.get("active") === "on";

	if (!code || !Number.isFinite(value) || value <= 0) {
		return { error: "Please enter a valid code and discount value." };
	}
	if (type === "percentage" && value > 100) return { error: "Percentage discounts can't exceed 100." };

	return { code, type, value, expiresAt, usageLimit, active };
}

export async function createCouponAction(_prevState: CouponFormState | undefined, formData: FormData): Promise<CouponFormState> {
	await assertAdmin();
	const result = buildInput(formData);
	if ("error" in result) return result;

	try {
		createCoupon(result);
	} catch {
		return { error: "A coupon with that code already exists." };
	}
	revalidatePath("/admin/coupons");
	redirect("/admin/coupons");
}

export async function updateCouponAction(
	id: number,
	_prevState: CouponFormState | undefined,
	formData: FormData
): Promise<CouponFormState> {
	await assertAdmin();
	const result = buildInput(formData);
	if ("error" in result) return result;

	try {
		updateCoupon(id, result);
	} catch {
		return { error: "A coupon with that code already exists." };
	}
	revalidatePath("/admin/coupons");
	redirect("/admin/coupons");
}

export async function deleteCouponAction(id: number): Promise<void> {
	await assertAdmin();
	deleteCoupon(id);
	revalidatePath("/admin/coupons");
}
