"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import type { ChatConversationSummary, ChatMessage } from "@/types";

const POLL_INTERVAL_MS = 5000;

/** Two-pane live-chat inbox: conversation list on the left, active thread + reply box on the right. Polls /api/admin/chat rather than a websocket -- see ChatWidget for the visitor-facing half of this. */
export function ChatAdminPanel() {
	const [conversations, setConversations] = useState<ChatConversationSummary[]>([]);
	const [activeId, setActiveId] = useState<number | null>(null);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [reply, setReply] = useState("");
	const [isSending, setIsSending] = useState(false);
	const threadRef = useRef<HTMLDivElement>(null);

	const fetchConversations = useCallback(async () => {
		try {
			const response = await fetch("/api/admin/chat");
			const data = await response.json();
			setConversations(data.conversations ?? []);
		} catch {
			// Silent -- the next poll retries.
		}
	}, []);

	const fetchThread = useCallback(async (id: number) => {
		try {
			const response = await fetch(`/api/admin/chat?conversationId=${id}`);
			const data = await response.json();
			setMessages(data.messages ?? []);
		} catch {
			// Silent -- the next poll retries.
		}
	}, []);

	useEffect(() => {
		fetchConversations();
		const interval = setInterval(fetchConversations, POLL_INTERVAL_MS);
		return () => clearInterval(interval);
	}, [fetchConversations]);

	useEffect(() => {
		if (activeId === null) return;
		fetchThread(activeId);
		const interval = setInterval(() => fetchThread(activeId), POLL_INTERVAL_MS);
		return () => clearInterval(interval);
	}, [activeId, fetchThread]);

	useEffect(() => {
		threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
	}, [messages]);

	function selectConversation(id: number) {
		setActiveId(id);
		setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)));
	}

	async function handleDelete(id: number) {
		if (!window.confirm("Delete this conversation? This permanently removes all its messages.")) return;
		// Optimistically drop it from the list; clear the thread if it was open.
		setConversations((prev) => prev.filter((c) => c.id !== id));
		if (activeId === id) {
			setActiveId(null);
			setMessages([]);
		}
		try {
			await fetch(`/api/admin/chat?conversationId=${id}`, { method: "DELETE" });
		} finally {
			fetchConversations();
		}
	}

	async function handleReply() {
		const text = reply.trim();
		if (!text || activeId === null || isSending) return;
		setIsSending(true);
		setReply("");
		try {
			const response = await fetch("/api/admin/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ conversationId: activeId, message: text }),
			});
			const data = await response.json();
			if (data.messages) setMessages(data.messages);
			fetchConversations();
		} finally {
			setIsSending(false);
		}
	}

	return (
		<div className="grid gap-6 lg:grid-cols-[320px_1fr]">
			<div className="rounded-2xl border border-border bg-secondary">
				<div className="border-b border-border p-4">
					<h2 className="text-xs font-bold uppercase tracking-widest text-text-subtle">
						Conversations ({conversations.length})
					</h2>
				</div>
				<div className="max-h-[32rem] overflow-y-auto">
					{conversations.length === 0 ? (
						<p className="p-4 text-sm text-text-muted">No conversations yet.</p>
					) : (
						conversations.map((conversation) => (
							<div
								key={conversation.id}
								className={`flex items-center border-b border-border transition-colors ${
									activeId === conversation.id ? "bg-primary/10" : "hover:bg-secondary-light"
								}`}
							>
							<button
								type="button"
								onClick={() => selectConversation(conversation.id)}
								className="flex min-w-0 flex-1 flex-col gap-1 px-4 py-3 text-left"
							>
								<div className="flex items-center justify-between gap-2">
									<span className="text-sm font-semibold text-text">
										{conversation.visitorName || `Visitor #${conversation.id}`}
									</span>
									{conversation.unreadCount > 0 && (
										<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1.5 text-xs font-bold text-white">
											{conversation.unreadCount}
										</span>
									)}
								</div>
								<p className="line-clamp-1 text-xs text-text-muted">{conversation.lastMessage ?? "No messages yet"}</p>
							</button>
							<button
								type="button"
								onClick={() => handleDelete(conversation.id)}
								aria-label="Delete conversation"
								title="Delete conversation"
								className="mr-2 shrink-0 rounded-md p-2 text-text-subtle transition-colors hover:bg-error/10 hover:text-error"
							>
								<Trash2 size={16} />
							</button>
							</div>
						))
					)}
				</div>
			</div>

			<div className="flex min-h-[32rem] flex-col rounded-2xl border border-border bg-secondary">
				{activeId === null ? (
					<div className="flex flex-1 items-center justify-center p-10 text-center text-sm text-text-muted">
						Select a conversation to view messages.
					</div>
				) : (
					<>
						<div ref={threadRef} className="flex-1 space-y-3 overflow-y-auto p-6" style={{ maxHeight: "26rem" }}>
							{messages.length === 0 ? (
								<p className="text-sm text-text-muted">No messages in this conversation yet.</p>
							) : (
								messages.map((message) => (
									<div key={message.id} className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}>
										<div
											className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
												message.sender === "admin"
													? "bg-gradient-to-br from-primary-light to-primary text-background"
													: "bg-secondary-light text-text"
											}`}
										>
											{message.body}
										</div>
									</div>
								))
							)}
						</div>
						<form
							onSubmit={(event) => {
								event.preventDefault();
								handleReply();
							}}
							className="flex items-center gap-2 border-t border-border p-4"
						>
							<input
								value={reply}
								onChange={(event) => setReply(event.target.value)}
								placeholder="Type a reply..."
								className="flex-1 rounded-md border border-border/80 bg-secondary-light px-4 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
							/>
							<button
								type="submit"
								disabled={!reply.trim() || isSending}
								className="rounded-full bg-gradient-to-br from-primary-light to-primary px-5 py-2 text-sm font-semibold text-background disabled:opacity-40"
							>
								Send
							</button>
						</form>
					</>
				)}
			</div>
		</div>
	);
}
