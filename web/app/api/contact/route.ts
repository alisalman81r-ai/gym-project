import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateChatKey } from "@/lib/chatSession";
import { getOrCreateConversation, addMessage } from "@/lib/store/chat";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INTEREST_LABELS: Record<string, string> = {
	general: "General Inquiry",
	tour: "Booking a Tour",
	membership: "Membership Plans",
	"personal-training": "Personal Training",
	classes: "About Classes",
	session: "Book a Session",
	supplement: "Supplement Order & Home Delivery",
};

export async function POST(request: Request) {
	const body = await request.json();
	const name = String(body.name ?? "").trim();
	const email = String(body.email ?? "").trim();
	const phone = String(body.phone ?? "").trim();
	const interest = String(body.interest ?? "general").trim();
	const message = String(body.message ?? "").trim();

	if (!name || !email || !EMAIL_PATTERN.test(email) || !message) {
		return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
	}

	// Also lands in the visitor's live-chat conversation (same cookie the
	// floating chat widget uses) so it shows a notification in the admin
	// inbox and any reply flows straight back into their chat box, not
	// just email -- see replyToContactAction in app/admin/messages/actions.ts.
	const chatKey = await getOrCreateChatKey();
	const conversation = getOrCreateConversation(chatKey, { name, email });
	const interestLabel = INTEREST_LABELS[interest] ?? interest;
	addMessage(conversation.id, "visitor", `[${interestLabel}] ${message}`);

	db.prepare(
		`INSERT INTO contact_submissions (name, email, phone, interest, message, chat_conversation_id) VALUES (?, ?, ?, ?, ?, ?)`
	).run(name, email, phone || null, interest, message, conversation.id);

	return NextResponse.json({ ok: true });
}
