"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hasAdminSession } from "@/lib/auth";
import { updateOrderStatus, assignTracking } from "@/lib/store/orders";
import { ORDER_STATUS_LABELS } from "@/lib/orderStatus";
import type { OrderStatus } from "@/types";

const VALID_STATUSES: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"];

async function assertAdmin(): Promise<void> {
	if (!(await hasAdminSession())) redirect("/admin/login");
}

export interface StatusFormState {
	ok: boolean;
	message: string;
	/** The status now persisted -- lets the client form re-sync its select after a submit. */
	status?: OrderStatus;
}

export async function updateOrderStatusAction(
	orderId: number,
	_prevState: StatusFormState | null,
	formData: FormData
): Promise<StatusFormState> {
	await assertAdmin();
	const status = String(formData.get("status") ?? "") as OrderStatus;
	if (!VALID_STATUSES.includes(status)) {
		return { ok: false, message: "Please choose a valid status." };
	}

	updateOrderStatus(orderId, status);
	revalidatePath("/admin/orders");
	revalidatePath(`/admin/orders/${orderId}`);
	return { ok: true, message: `Status updated to "${ORDER_STATUS_LABELS[status]}".`, status };
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
