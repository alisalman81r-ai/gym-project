"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hasAdminSession } from "@/lib/auth";
import { addMessage } from "@/lib/store/chat";

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

export interface ChatReplyResult {
	delivered: boolean;
	error?: string;
}

// Saves the admin's reply text as a record and delivers it into the
// visitor's live-chat conversation (created alongside their submission --
// see app/api/contact/route.ts) rather than email. Older rows from before
// that linking existed have no chat_conversation_id, so delivery can
// legitimately fail for those -- surfaced via `delivered: false` instead
// of silently pretending it worked.
export async function replyToContactAction(id: number, replyText: string): Promise<ChatReplyResult> {
	await assertAdmin();
	const trimmed = replyText.trim();
	if (!trimmed) return { delivered: false, error: "Reply can't be empty." };

	const row = db.prepare("SELECT chat_conversation_id FROM contact_submissions WHERE id = ?").get(id) as
		| { chat_conversation_id: number | null }
		| undefined;
	if (!row) return { delivered: false, error: "Message not found." };

	db.prepare("UPDATE contact_submissions SET admin_reply = ?, replied_at = datetime('now'), status = 'handled' WHERE id = ?").run(
		trimmed,
		id
	);
	revalidatePath("/admin/messages");

	if (!row.chat_conversation_id) {
		return { delivered: false, error: "This message predates live chat, so there's no chat to deliver the reply into." };
	}
	addMessage(row.chat_conversation_id, "admin", trimmed);
	return { delivered: true };
}

export async function replyToOrderAction(id: number, replyText: string): Promise<ChatReplyResult> {
	await assertAdmin();
	const trimmed = replyText.trim();
	if (!trimmed) return { delivered: false, error: "Reply can't be empty." };

	const row = db.prepare("SELECT chat_conversation_id FROM supplement_orders WHERE id = ?").get(id) as
		| { chat_conversation_id: number | null }
		| undefined;
	if (!row) return { delivered: false, error: "Inquiry not found." };

	db.prepare("UPDATE supplement_orders SET admin_reply = ?, replied_at = datetime('now'), status = 'handled' WHERE id = ?").run(
		trimmed,
		id
	);
	revalidatePath("/admin/messages");

	if (!row.chat_conversation_id) {
		return { delivered: false, error: "This order predates live chat, so there's no chat to deliver the reply into." };
	}
	addMessage(row.chat_conversation_id, "admin", trimmed);
	return { delivered: true };
}
