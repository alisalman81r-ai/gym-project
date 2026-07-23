import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/auth";
import { getConversationById, listConversations, getMessages, addMessage, markReadByAdmin, deleteConversation } from "@/lib/store/chat";

const MAX_MESSAGE_LENGTH = 2000;

/**
 * No page-level Proxy gate applies to /api/* routes (see proxy.ts's
 * matcher), so this checks the admin session directly -- same
 * defense-in-depth reasoning as Server Actions independently calling
 * hasAdminSession() rather than trusting Proxy alone.
 */
async function assertAdmin() {
	if (!(await hasAdminSession())) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	return null;
}

// GET /api/admin/chat            -> list all conversations (for the inbox sidebar)
// GET /api/admin/chat?conversationId=X -> one conversation's full thread, marks it read
export async function GET(request: Request) {
	const unauthorized = await assertAdmin();
	if (unauthorized) return unauthorized;

	const { searchParams } = new URL(request.url);
	const conversationIdRaw = searchParams.get("conversationId");

	if (conversationIdRaw) {
		const id = Number(conversationIdRaw);
		const conversation = getConversationById(id);
		if (!conversation) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });

		markReadByAdmin(id);
		return NextResponse.json({ conversation, messages: getMessages(id) });
	}

	return NextResponse.json({ conversations: listConversations() });
}

export async function POST(request: Request) {
	const unauthorized = await assertAdmin();
	if (unauthorized) return unauthorized;

	const body = await request.json();
	const conversationId = Number(body.conversationId);
	const text = String(body.message ?? "").trim();

	if (!conversationId || !text) return NextResponse.json({ error: "Missing fields." }, { status: 400 });
	if (text.length > MAX_MESSAGE_LENGTH) return NextResponse.json({ error: "Message is too long." }, { status: 400 });

	const conversation = getConversationById(conversationId);
	if (!conversation) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });

	addMessage(conversationId, "admin", text);
	return NextResponse.json({ messages: getMessages(conversationId) });
}

// DELETE /api/admin/chat?conversationId=X -> remove a conversation and its messages
export async function DELETE(request: Request) {
	const unauthorized = await assertAdmin();
	if (unauthorized) return unauthorized;

	const { searchParams } = new URL(request.url);
	const id = Number(searchParams.get("conversationId"));
	if (!id) return NextResponse.json({ error: "Missing conversationId." }, { status: 400 });

	const deleted = deleteConversation(id);
	if (!deleted) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });

	return NextResponse.json({ ok: true });
}
