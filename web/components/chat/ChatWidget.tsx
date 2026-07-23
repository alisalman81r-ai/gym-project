"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import type { ChatMessage } from "@/types";

const POLL_INTERVAL_MS = 4000;

/**
 * Floating chat bubble + panel for a signed-in customer's account area.
 * It only appears on /account/* pages -- never on the public home page or
 * the rest of the marketing site -- and only once the customer session is
 * confirmed (via /api/chat's `authenticated` flag). Each customer has
 * their own conversation, keyed to their account. Polls /api/chat rather
 * than a websocket: simple, and plenty responsive at this scale.
 */
export function ChatWidget() {
	const pathname = usePathname();
	const isAccountRoute = pathname?.startsWith("/account") ?? false;

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");
	const [isSending, setIsSending] = useState(false);
	const [hasUnread, setHasUnread] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);
	const lastSeenIdRef = useRef(0);
	const isOpenRef = useRef(isOpen);
	isOpenRef.current = isOpen;

	useEffect(() => {
		// Only poll inside the account area -- no chat anywhere else.
		if (!isAccountRoute) return;

		let cancelled = false;
		async function poll() {
			try {
				const response = await fetch("/api/chat");
				const data = await response.json();
				if (cancelled) return;
				setIsAuthenticated(Boolean(data.authenticated));
				if (!data.authenticated) {
					setMessages([]);
					return;
				}
				const next: ChatMessage[] = data.messages ?? [];
				setMessages(next);
				const latest = next[next.length - 1];
				if (latest && latest.id > lastSeenIdRef.current) {
					if (!isOpenRef.current && latest.sender === "admin") setHasUnread(true);
					lastSeenIdRef.current = latest.id;
				}
			} catch {
				// Silent -- the next poll just retries.
			}
		}
		poll();
		const interval = setInterval(poll, POLL_INTERVAL_MS);
		return () => {
			cancelled = true;
			clearInterval(interval);
		};
	}, [isAccountRoute]);

	useEffect(() => {
		if (!isOpen) return;
		setHasUnread(false);
		scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
	}, [isOpen, messages]);

	// Chat lives only in the signed-in account area, nowhere else.
	if (!isAccountRoute || !isAuthenticated) return null;

	async function handleSend() {
		const text = input.trim();
		if (!text || isSending) return;
		setIsSending(true);
		setInput("");
		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: text }),
			});
			const data = await response.json();
			if (data.messages) setMessages(data.messages);
		} finally {
			setIsSending(false);
		}
	}

	return (
		<>
			<motion.button
				type="button"
				onClick={() => setIsOpen((open) => !open)}
				aria-label={isOpen ? "Close chat" : "Open chat"}
				whileHover={{ scale: 1.08 }}
				whileTap={{ scale: 0.94 }}
				className="fixed bottom-4 right-4 z-[95] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-primary text-background shadow-gold sm:bottom-6 sm:right-6"
			>
				{isOpen ? <X size={24} /> : <MessageCircle size={24} />}
				{hasUnread && !isOpen && (
					<span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-error ring-2 ring-background" />
				)}
			</motion.button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 20, scale: 0.95 }}
						transition={{ duration: 0.2 }}
						className="fixed bottom-20 right-4 z-[95] flex h-[28rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-secondary shadow-elevated sm:bottom-24 sm:right-6"
					>
						<div className="border-b border-border bg-secondary-light px-4 py-3">
							<p className="font-display text-sm font-semibold text-text">Chat with Iron Elite</p>
							<p className="text-xs text-text-subtle">A coach usually replies within a few minutes</p>
						</div>

						<div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
							{messages.length === 0 ? (
								<p className="mt-6 text-center text-sm text-text-muted">
									Send us a message and a coach will get back to you right here.
								</p>
							) : (
								messages.map((message) => (
									<div key={message.id} className={`flex ${message.sender === "visitor" ? "justify-end" : "justify-start"}`}>
										<div
											className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
												message.sender === "visitor"
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
								handleSend();
							}}
							className="flex items-center gap-2 border-t border-border p-3"
						>
							<input
								value={input}
								onChange={(event) => setInput(event.target.value)}
								placeholder="Type a message..."
								className="flex-1 rounded-full border border-border/80 bg-secondary-light px-4 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
							/>
							<button
								type="submit"
								disabled={!input.trim() || isSending}
								aria-label="Send message"
								className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-primary text-background disabled:opacity-40"
							>
								<Send size={16} />
							</button>
						</form>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
