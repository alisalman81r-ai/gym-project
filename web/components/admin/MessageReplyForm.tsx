"use client";

import { useState, useTransition } from "react";

export interface ReplySendResult {
	sent: boolean;
	error?: string;
}

export interface MessageReplyFormProps {
	onReply: (replyText: string) => Promise<ReplySendResult>;
	recipientEmail: string;
	mailSubject: string;
	mailBody: string;
	existingReply?: string | null;
	repliedAt?: string | null;
}

/**
 * "Send Reply" both persists the reply text as a record (via the bound
 * Server Action) and emails it to the visitor's address through the
 * SMTP relay in lib/email.ts. If SMTP isn't configured yet, the reply
 * still saves and the result banner explains why nothing was emailed --
 * the "Open in Email App" mailto link is the fallback for that case.
 */
export function MessageReplyForm({ onReply, recipientEmail, mailSubject, mailBody, existingReply, repliedAt }: MessageReplyFormProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [text, setText] = useState(existingReply ?? "");
	const [result, setResult] = useState<ReplySendResult | null>(null);
	const [isPending, startTransition] = useTransition();

	const mailtoHref = `mailto:${recipientEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(
		text.trim() || mailBody
	)}`;

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
						<p className={`text-xs ${result.sent ? "text-success" : "text-error"}`}>
							{result.sent ? `Email sent to ${recipientEmail}.` : result.error}
						</p>
					)}
					<div className="flex flex-wrap items-center gap-3">
						<button
							type="button"
							disabled={isPending || !text.trim()}
							onClick={() =>
								startTransition(async () => {
									const sendResult = await onReply(text.trim());
									setResult(sendResult);
									if (sendResult.sent) setIsOpen(false);
								})
							}
							className="rounded-full bg-gradient-to-br from-primary-light to-primary px-4 py-1.5 text-xs font-semibold text-background disabled:opacity-40"
						>
							{isPending ? "Sending..." : "Send Reply"}
						</button>
						<a
							href={mailtoHref}
							className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:border-primary/60 hover:text-text"
						>
							Open in Email App
						</a>
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
