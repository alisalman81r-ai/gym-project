"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hasAdminSession } from "@/lib/auth";

// Defense in depth: Proxy already gates /admin, but Server Actions are
// their own entry point and must verify the session independently.
async function assertAdmin(): Promise<void> {
	if (!(await hasAdminSession())) redirect("/admin/login");
}

export async function setContactStatusAction(id: number, status: string): Promise<void> {
	await assertAdmin();
	db.prepare("UPDATE contact_submissions SET status = ? WHERE id = ?").run(status, id);
	revalidatePath("/admin/messages");
}

export async function deleteContactAction(id: number): Promise<void> {
	await assertAdmin();
	db.prepare("DELETE FROM contact_submissions WHERE id = ?").run(id);
	revalidatePath("/admin/messages");
}

export async function setOrderStatusAction(id: number, status: string): Promise<void> {
	await assertAdmin();
	db.prepare("UPDATE supplement_orders SET status = ? WHERE id = ?").run(status, id);
	revalidatePath("/admin/messages");
}

export async function deleteOrderAction(id: number): Promise<void> {
	await assertAdmin();
	db.prepare("DELETE FROM supplement_orders WHERE id = ?").run(id);
	revalidatePath("/admin/messages");
}
