"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireCustomer, verifyPassword, hashPassword } from "@/lib/customerAuth";
import { addAddress, deleteAddress, setDefaultAddress } from "@/lib/store/addresses";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface AccountFormState {
	error?: string;
	success?: string;
}

export async function updateProfileAction(_prevState: AccountFormState | undefined, formData: FormData): Promise<AccountFormState> {
	const customer = await requireCustomer();
	const name = String(formData.get("name") ?? "").trim();
	const email = String(formData.get("email") ?? "").trim().toLowerCase();
	const phone = String(formData.get("phone") ?? "").trim();

	if (!name || !email || !EMAIL_PATTERN.test(email)) {
		return { error: "Please enter a valid name and email." };
	}

	const existing = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(email, customer.id);
	if (existing) return { error: "Another account already uses that email." };

	db.prepare("UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?").run(name, email, phone || null, customer.id);
	revalidatePath("/account/profile");
	return { success: "Profile updated." };
}

export async function changePasswordAction(_prevState: AccountFormState | undefined, formData: FormData): Promise<AccountFormState> {
	const customer = await requireCustomer();
	const currentPassword = String(formData.get("currentPassword") ?? "");
	const newPassword = String(formData.get("newPassword") ?? "");

	if (newPassword.length < 8) return { error: "New password must be at least 8 characters." };

	const row = db.prepare("SELECT password_hash FROM users WHERE id = ?").get(customer.id) as { password_hash: string };
	if (!verifyPassword(currentPassword, row.password_hash)) return { error: "Current password is incorrect." };

	db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(newPassword), customer.id);
	return { success: "Password changed." };
}

export interface AddressFormState {
	error?: string;
}

export async function addAddressAction(_prevState: AddressFormState | undefined, formData: FormData): Promise<AddressFormState> {
	const customer = await requireCustomer();
	const fullName = String(formData.get("fullName") ?? "").trim();
	const phone = String(formData.get("phone") ?? "").trim();
	const addressLine = String(formData.get("addressLine") ?? "").trim();
	const city = String(formData.get("city") ?? "").trim();
	const postalCode = String(formData.get("postalCode") ?? "").trim();
	const isDefault = formData.get("isDefault") === "on";

	if (!fullName || !phone || !addressLine || !city || !postalCode) {
		return { error: "Please fill in all address fields." };
	}

	addAddress(customer.id, { fullName, phone, addressLine, city, postalCode, isDefault });
	revalidatePath("/account/addresses");
	return {};
}

export async function deleteAddressAction(addressId: number): Promise<void> {
	const customer = await requireCustomer();
	deleteAddress(addressId, customer.id);
	revalidatePath("/account/addresses");
}

export async function setDefaultAddressAction(addressId: number): Promise<void> {
	const customer = await requireCustomer();
	setDefaultAddress(addressId, customer.id);
	revalidatePath("/account/addresses");
}
