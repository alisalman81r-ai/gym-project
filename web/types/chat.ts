export type ChatSender = "visitor" | "admin";
export type ChatConversationStatus = "open" | "closed";

export interface ChatMessage {
	id: number;
	conversationId: number;
	sender: ChatSender;
	body: string;
	createdAt: string;
}

export interface ChatConversation {
	id: number;
	visitorKey: string;
	visitorName: string | null;
	visitorEmail: string | null;
	status: ChatConversationStatus;
	createdAt: string;
	updatedAt: string;
}

export interface ChatConversationSummary extends ChatConversation {
	lastMessage: string | null;
	lastMessageAt: string | null;
	unreadCount: number;
}
