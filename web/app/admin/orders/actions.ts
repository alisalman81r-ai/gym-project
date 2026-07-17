"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hasAdminSession } from "@/lib/auth";
import { updateOrderStatus, assignTracking } from "@/lib/store/orders";
import type { OrderStatus } from "@/types";

async function assertAdmin(): Promise<void> {
	if (!(await hasAdminSession())) redirect("/admin/login");
}

export async function updateOrderStatusAction(orderId: number, formData: FormData): Promise<void> {
	await assertAdmin();
	const status = String(formData.get("status") ?? "") as OrderStatus;
	updateOrderStatus(orderId, status);
	revalidatePath("/admin/orders");
	revalidatePath(`/admin/orders/${orderId}`);
}

export async function assignTrackingAction(orderId: number, formData: FormData): Promise<void> {
	await assertAdmin();
	const courierName = String(formData.get("courierName") ?? "").trim();
	const trackingNumber = String(formData.get("trackingNumber") ?? "").trim();
	const estimatedDeliveryDate = String(formData.get("estimatedDeliveryDate") ?? "").trim() || null;
	if (!courierName || !trackingNumber) return;

	assignTracking(orderId, { courierName, trackingNumber, estimatedDeliveryDate });
	revalidatePath(`/admin/orders/${orderId}`);
}
