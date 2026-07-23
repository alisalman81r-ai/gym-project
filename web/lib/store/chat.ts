import { db } from "@/lib/db";
import type { ChatConversation, ChatConversationSummary, ChatMessage } from "@/types";

interface ConversationRow {
	id: number;
	visitor_key: string;
	visitor_name: string | null;
	visitor_email: string | null;
	status: string;
	created_at: string;
	updated_at: string;
}

interface MessageRow {
	id: number;
	conversation_id: number;
	sender: string;
	body: string;
	created_at: string;
}

function mapConversation(row: ConversationRow): ChatConversation {
	return {
		id: row.id,
		visitorKey: row.visitor_key,
		visitorName: row.visitor_name,
		visitorEmail: row.visitor_email,
		status: row.status as ChatConversation["status"],
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	};
}

function mapMessage(row: MessageRow): ChatMessage {
	return {
		id: row.id,
		conversationId: row.conversation_id,
		sender: row.sender as ChatMessage["sender"],
		body: row.body,
		createdAt: row.created_at,
	};
}

export function getConversationByVisitorKey(visitorKey: string): ChatConversation | null {
	const row = db.prepare("SELECT * FROM chat_conversations WHERE visitor_key = ?").get(visitorKey) as
		| ConversationRow
		| undefined;
	return row ? mapConversation(row) : null;
}

export function getConversationById(id: number): ChatConversation | null {
	const row = db.prepare("SELECT * FROM chat_conversations WHERE id = ?").get(id) as ConversationRow | undefined;
	return row ? mapConversation(row) : null;
}

export interface VisitorContactInfo {
	name?: string;
	email?: string;
}

/**
 * `contactInfo` lets the Contact page form (which asks for name/email
 * already) attach that to the conversation instead of the admin inbox
 * just showing "Visitor #N" -- applied whether the conversation is
 * being created here or already existed (e.g. the visitor opened the
 * chat widget first, then later submitted the Contact form from the
 * same browser).
 */
export function getOrCreateConversation(visitorKey: string, contactInfo?: VisitorContactInfo): ChatConversation {
	const existing = getConversationByVisitorKey(visitorKey);
	if (!existing) {
		db.prepare("INSERT INTO chat_conversations (visitor_key, visitor_name, visitor_email) VALUES (?, ?, ?)").run(
			visitorKey,
			contactInfo?.name ?? null,
			contactInfo?.email ?? null
		);
	} else if (contactInfo?.name || contactInfo?.email) {
		db.prepare("UPDATE chat_conversations SET visitor_name = COALESCE(?, visitor_name), visitor_email = COALESCE(?, visitor_email) WHERE visitor_key = ?").run(
			contactInfo?.name ?? null,
			contactInfo?.email ?? null,
			visitorKey
		);
	}

	const conversation = getConversationByVisitorKey(visitorKey);
	if (!conversation) throw new Error("Failed to create chat conversation.");
	return conversation;
}

export function getMessages(conversationId: number): ChatMessage[] {
	const rows = db
		.prepare("SELECT * FROM chat_messages WHERE conversation_id = ? ORDER BY id ASC")
		.all(conversationId) as MessageRow[];
	return rows.map(mapMessage);
}

export function addMessage(conversationId: number, sender: "visitor" | "admin", body: string): ChatMessage {
	const result = db
		.prepare("INSERT INTO chat_messages (conversation_id, sender, body) VALUES (?, ?, ?)")
		.run(conversationId, sender, body);
	db.prepare("UPDATE chat_conversations SET updated_at = datetime('now') WHERE id = ?").run(conversationId);

	const row = db.prepare("SELECT * FROM chat_messages WHERE id = ?").get(result.lastInsertRowid) as MessageRow;
	return mapMessage(row);
}

/** Visitor messages the admin has now seen -- drives the unread badge in the admin inbox. */
export function markReadByAdmin(conversationId: number): void {
	db.prepare("UPDATE chat_messages SET read_by_admin = 1 WHERE conversation_id = ? AND sender = 'visitor'").run(
		conversationId
	);
}

export function listConversations(): ChatConversationSummary[] {
	const rows = db
		.prepare(
			`SELECT c.*,
				(SELECT body FROM chat_messages m WHERE m.conversation_id = c.id ORDER BY m.id DESC LIMIT 1) as last_message,
				(SELECT created_at FROM chat_messages m WHERE m.conversation_id = c.id ORDER BY m.id DESC LIMIT 1) as last_message_at,
				(SELECT COUNT(*) FROM chat_messages m WHERE m.conversation_id = c.id AND m.sender = 'visitor' AND m.read_by_admin = 0) as unread_count
			FROM chat_conversations c
			ORDER BY c.updated_at DESC`
		)
		.all() as Array<ConversationRow & { last_message: string | null; last_message_at: string | null; unread_count: number }>;

	return rows.map((row) => ({
		...mapConversation(row),
		lastMessage: row.last_message,
		lastMessageAt: row.last_message_at,
		unreadCount: row.unread_count,
	}));
}

/**
 * Deletes a conversation and its messages (chat_messages cascades). The
 * contact_submissions / supplement_orders tables reference this row
 * without a cascade rule, so their link is cleared first -- otherwise
 * foreign_keys=ON would block the delete. Returns false if no such
 * conversation existed.
 */
export function deleteConversation(id: number): boolean {
	const run = db.transaction((conversationId: number) => {
		db.prepare("UPDATE contact_submissions SET chat_conversation_id = NULL WHERE chat_conversation_id = ?").run(conversationId);
		db.prepare("UPDATE supplement_orders SET chat_conversation_id = NULL WHERE chat_conversation_id = ?").run(conversationId);
		return db.prepare("DELETE FROM chat_conversations WHERE id = ?").run(conversationId).changes;
	});
	return run(id) > 0;
}

export function getTotalUnreadCount(): number {
	const row = db
		.prepare("SELECT COUNT(*) as count FROM chat_messages WHERE sender = 'visitor' AND read_by_admin = 0")
		.get() as { count: number };
	return row.count;
}
