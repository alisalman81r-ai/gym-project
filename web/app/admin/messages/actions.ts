"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hasAdminSession } from "@/lib/auth";
import { sendEmail, type SendEmailResult } from "@/lib/email";
import { siteConfig } from "@/constants/site";

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

// Saves the admin's reply text as a record, emails it to the address the
// visitor gave, and marks the message handled. Sending requires SMTP_*
// env vars (see lib/email.ts) -- the reply is still saved as a record
// even when sending fails, so nothing the admin typed is lost.
export async function replyToContactAction(id: number, replyText: string): Promise<SendEmailResult> {
	await assertAdmin();
	const trimmed = replyText.trim();
	if (!trimmed) return { sent: false, error: "Reply can't be empty." };

	const row = db.prepare("SELECT name, email, interest FROM contact_submissions WHERE id = ?").get(id) as
		| { name: string; email: string; interest: string }
		| undefined;
	if (!row) return { sent: false, error: "Message not found." };

	const result = await sendEmail({
		to: row.email,
		subject: `Re: Your inquiry to ${siteConfig.name}`,
		text: `Hi ${row.name},\n\n${trimmed}\n\n— ${siteConfig.name}`,
	});

	db.prepare("UPDATE contact_submissions SET admin_reply = ?, replied_at = datetime('now'), status = 'handled' WHERE id = ?").run(
		trimmed,
		id
	);
	revalidatePath("/admin/messages");
	return result;
}

export async function replyToOrderAction(id: number, replyText: string): Promise<SendEmailResult> {
	await assertAdmin();
	const trimmed = replyText.trim();
	if (!trimmed) return { sent: false, error: "Reply can't be empty." };

	const row = db.prepare("SELECT name, email, supplement_name FROM supplement_orders WHERE id = ?").get(id) as
		| { name: string; email: string; supplement_name: string }
		| undefined;
	if (!row) return { sent: false, error: "Inquiry not found." };

	const result = await sendEmail({
		to: row.email,
		subject: `Re: Your ${row.supplement_name} order inquiry`,
		text: `Hi ${row.name},\n\n${trimmed}\n\n— ${siteConfig.name}`,
	});

	db.prepare("UPDATE supplement_orders SET admin_reply = ?, replied_at = datetime('now'), status = 'handled' WHERE id = ?").run(
		trimmed,
		id
	);
	revalidatePath("/admin/messages");
	return result;
}
