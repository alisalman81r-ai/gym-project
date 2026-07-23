import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SUPPLEMENTS } from "@/constants/supplements";
import { getOrCreateChatKey } from "@/lib/chatSession";
import { getOrCreateConversation, addMessage } from "@/lib/store/chat";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
	const body = await request.json();
	const supplementId = String(body.supplementId ?? "").trim();
	const quantity = Number(body.quantity) || 1;
	const name = String(body.name ?? "").trim();
	const email = String(body.email ?? "").trim();
	const phone = String(body.phone ?? "").trim();
	const deliveryAddress = String(body.deliveryAddress ?? "").trim();
	const notes = String(body.notes ?? "").trim();

	const supplement = SUPPLEMENTS.find((item) => item.id === supplementId);

	if (!supplement || !name || !email || !EMAIL_PATTERN.test(email) || !deliveryAddress || quantity < 1) {
		return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
	}

	// Also lands in the visitor's live-chat conversation -- see
	// app/api/contact/route.ts for the same pattern on the Contact form.
	const chatKey = await getOrCreateChatKey();
	const conversation = getOrCreateConversation(chatKey, { name, email });
	addMessage(
		conversation.id,
		"visitor",
		`[Supplement Order] ${quantity}x ${supplement.name} — deliver to: ${deliveryAddress}${notes ? `\nNotes: ${notes}` : ""}`
	);

	db.prepare(
		`INSERT INTO supplement_orders (supplement_id, supplement_name, quantity, name, email, phone, delivery_address, notes, chat_conversation_id)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
	).run(supplement.id, supplement.name, quantity, name, email, phone || null, deliveryAddress, notes || null, conversation.id);

	return NextResponse.json({ ok: true });
}
