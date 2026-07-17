"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword, createCustomerSession, destroyCustomerSession } from "@/lib/customerAuth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface AuthFormState {
	error?: string;
}

export async function registerAction(_prevState: AuthFormState | undefined, formData: FormData): Promise<AuthFormState> {
	const name = String(formData.get("name") ?? "").trim();
	const email = String(formData.get("email") ?? "").trim().toLowerCase();
	const phone = String(formData.get("phone") ?? "").trim();
	const password = String(formData.get("password") ?? "");

	if (!name || !email || !EMAIL_PATTERN.test(email) || password.length < 8) {
		return { error: "Please enter a valid name, email, and a password of at least 8 characters." };
	}

	const existing = db.prepare("SELECT 1 FROM users WHERE email = ?").get(email);
	if (existing) {
		return { error: "An account with that email already exists." };
	}

	const result = db
		.prepare("INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)")
		.run(name, email, phone || null, hashPassword(password));

	await createCustomerSession(Number(result.lastInsertRowid));
	redirect("/account");
}

export async function loginAction(_prevState: AuthFormState | undefined, formData: FormData): Promise<AuthFormState> {
	const email = String(formData.get("email") ?? "").trim().toLowerCase();
	const password = String(formData.get("password") ?? "");

	const row = db.prepare("SELECT id, password_hash, is_blocked FROM users WHERE email = ?").get(email) as
		| { id: number; password_hash: string; is_blocked: number }
		| undefined;

	if (!row || !verifyPassword(password, row.password_hash)) {
		return { error: "Invalid email or password." };
	}
	if (row.is_blocked) {
		return { error: "This account has been blocked. Contact us for help." };
	}

	await createCustomerSession(row.id);
	redirect("/account");
}

export async function logoutAction(): Promise<void> {
	await destroyCustomerSession();
	redirect("/account/login");
}
