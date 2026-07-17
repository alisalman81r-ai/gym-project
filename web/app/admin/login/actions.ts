"use server";

import { redirect } from "next/navigation";
import { checkAdminCredentials, createAdminSession } from "@/lib/auth";

export interface LoginState {
	error?: string;
}

export async function loginAction(_prevState: LoginState | undefined, formData: FormData): Promise<LoginState> {
	const username = String(formData.get("username") ?? "").trim();
	const password = String(formData.get("password") ?? "");

	if (!checkAdminCredentials(username, password)) {
		return { error: "Invalid username or password." };
	}

	await createAdminSession();
	redirect("/admin");
}
