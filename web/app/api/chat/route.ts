import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/customerAuth";
import { getConversationByVisitorKey, getOrCreateConversation, getMessages, addMessage } from "@/lib/store/chat";

const MAX_MESSAGE_LENGTH = 2000;

/**
 * Live chat is for logged-in customers only, and each customer gets their
 * own conversation keyed by their account id (not a browser cookie) -- so
 * a user's chat follows them across devices and never leaks between people
 * sharing a browser.
 */
function keyForCustomer(id: number): string {
	return `user-${id}`;
}

/** Customer polls this to see their own conversation, including admin replies. */
export async function GET() {
	const customer = await getCurrentCustomer();
	if (!customer) return NextResponse.json({ authenticated: false, messages: [] });

	const conversation = getConversationByVisitorKey(keyForCustomer(customer.id));
	return NextResponse.json({
		authenticated: true,
		messages: conversation ? getMessages(conversation.id) : [],
	});
}

/** Customer sends a message -- creates their conversation on first send. */
export async function POST(request: Request) {
	const customer = await getCurrentCustomer();
	if (!customer) return NextResponse.json({ error: "Please sign in to chat." }, { status: 401 });

	const body = await request.json();
	const text = String(body.message ?? "").trim();

	if (!text) return NextResponse.json({ error: "Message can't be empty." }, { status: 400 });
	if (text.length > MAX_MESSAGE_LENGTH) return NextResponse.json({ error: "Message is too long." }, { status: 400 });

	const conversation = getOrCreateConversation(keyForCustomer(customer.id), {
		name: customer.name,
		email: customer.email,
	});
	addMessage(conversation.id, "visitor", text);

	return NextResponse.json({ messages: getMessages(conversation.id) });
}
