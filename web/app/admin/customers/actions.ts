"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hasAdminSession } from "@/lib/auth";
import { setCustomerBlocked, updateCustomer } from "@/lib/store/customers";

async function assertAdmin(): Promise<void> {
	if (!(await hasAdminSession())) redirect("/admin/login");
}

export async function toggleBlockedAction(customerId: number, blocked: boolean): Promise<void> {
	await assertAdmin();
	setCustomerBlocked(customerId, blocked);
	revalidatePath("/admin/customers");
}

export interface CustomerFormState {
	error?: string;
}

export async function updateCustomerAction(
	customerId: number,
	_prevState: CustomerFormState | undefined,
	formData: FormData
): Promise<CustomerFormState> {
	await assertAdmin();
	const name = String(formData.get("name") ?? "").trim();
	const email = String(formData.get("email") ?? "").trim().toLowerCase();
	const phone = String(formData.get("phone") ?? "").trim() || null;

	if (!name || !email) return { error: "Name and email are required." };

	updateCustomer(customerId, { name, email, phone });
	revalidatePath("/admin/customers");
	redirect("/admin/customers");
}
