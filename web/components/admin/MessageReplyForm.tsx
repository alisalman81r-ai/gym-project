"use client";

import { useState, useTransition } from "react";

export interface ChatReplyResult {
	delivered: boolean;
	error?: string;
}

export interface MessageReplyFormProps {
	onReply: (replyText: string) => Promise<ChatReplyResult>;
	existingReply?: string | null;
	repliedAt?: string | null;
}

/**
 * "Send Reply" persists the reply text as a record (via the bound Server
 * Action) and delivers it into the visitor's live-chat conversation --
 * the same one their submission created (see app/api/contact/route.ts
 * and app/api/supplement-orders/route.ts) -- so it shows up in their
 * chat widget, not email.
 */
export function MessageReplyForm({ onReply, existingReply, repliedAt }: MessageReplyFormProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [text, setText] = useState(existingReply ?? "");
	const [result, setResult] = useState<ChatReplyResult | null>(null);
	const [isPending, startTransition] = useTransition();

	return (
		<div className="mt-2 min-w-[240px]">
			{existingReply && !isOpen && (
				<div className="mb-2 rounded-md border border-primary/30 bg-primary/5 p-2 text-xs">
					<p className="font-semibold text-primary">Your reply{repliedAt ? ` · ${repliedAt}` : ""}</p>
					<p className="mt-1 whitespace-pre-line text-text-muted">{existingReply}</p>
				</div>
			)}

			{isOpen ? (
				<div className="flex flex-col gap-2">
					<textarea
						value={text}
						onChange={(event) => setText(event.target.value)}
						rows={3}
						placeholder="Type your reply..."
						className="w-full rounded-md border border-border/80 bg-secondary-light px-3 py-2 text-xs text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
					/>
					{result && (
						<p className={`text-xs ${result.delivered ? "text-success" : "text-error"}`}>
							{result.delivered ? "Sent to their chat." : result.error}
						</p>
					)}
					<div className="flex flex-wrap items-center gap-3">
						<button
							type="button"
							disabled={isPending || !text.trim()}
							onClick={() =>
								startTransition(async () => {
									const replyResult = await onReply(text.trim());
									setResult(replyResult);
									if (replyResult.delivered) setIsOpen(false);
								})
							}
							className="rounded-full bg-gradient-to-br from-primary-light to-primary px-4 py-1.5 text-xs font-semibold text-background disabled:opacity-40"
						>
							{isPending ? "Sending..." : "Send Reply"}
						</button>
						<button
							type="button"
							onClick={() => {
								setIsOpen(false);
								setResult(null);
							}}
							className="text-xs font-semibold text-text-subtle hover:text-text"
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<button type="button" onClick={() => setIsOpen(true)} className="text-xs font-semibold text-primary hover:underline">
					{existingReply ? "Edit Reply" : "Reply"}
				</button>
			)}
		</div>
	);
}
