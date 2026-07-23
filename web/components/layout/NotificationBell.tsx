"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import type { Notification } from "@/types";

const POLL_INTERVAL_MS = 15000;

/**
 * Bell icon shown only inside a signed-in customer's account area
 * (/account/*) -- e.g. "Your membership was approved" (see
 * app/admin/memberships/actions.ts). It never appears on the public
 * home page or the rest of the marketing site, and renders nothing
 * until the customer session is confirmed via /api/notifications.
 */
export function NotificationBell() {
	const pathname = usePathname();
	const isAccountRoute = pathname?.startsWith("/account") ?? false;

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Only poll inside the account area -- no bell anywhere else.
		if (!isAccountRoute) return;

		let cancelled = false;
		async function poll() {
			try {
				const response = await fetch("/api/notifications");
				const data = await response.json();
				if (cancelled) return;
				setIsAuthenticated(Boolean(data.authenticated));
				if (data.authenticated) {
					setNotifications(data.notifications ?? []);
					setUnreadCount(data.unreadCount ?? 0);
				}
			} catch {
				// Silent -- the next poll retries.
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
		function handleClickOutside(event: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	async function markAllRead() {
		setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
		setUnreadCount(0);
		try {
			await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
		} catch {
			// Local state already updated optimistically; next poll reconciles either way.
		}
	}

	async function markOneRead(id: number) {
		setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
		setUnreadCount((prev) => Math.max(0, prev - 1));
		try {
			await fetch("/api/notifications", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
		} catch {
			// Local state already updated optimistically; next poll reconciles either way.
		}
	}

	// Bell lives only in the signed-in account area, nowhere else.
	if (!isAccountRoute || !isAuthenticated) return null;

	return (
		<div ref={containerRef} className="relative">
			<button
				type="button"
				onClick={() => setIsOpen((open) => !open)}
				aria-label="Notifications"
				className="relative text-text-muted transition-colors hover:text-text"
			>
				<Bell size={20} />
				{unreadCount > 0 && (
					<span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[0.6rem] font-bold text-background">
						{unreadCount > 9 ? "9+" : unreadCount}
					</span>
				)}
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.15 }}
						className="absolute right-0 top-full z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-border bg-secondary shadow-elevated"
					>
						<div className="flex items-center justify-between border-b border-border px-4 py-3">
							<p className="font-display text-sm font-semibold text-text">Notifications</p>
							{unreadCount > 0 && (
								<button type="button" onClick={markAllRead} className="text-xs font-semibold text-primary hover:underline">
									Mark all read
								</button>
							)}
						</div>
						<div className="max-h-80 overflow-y-auto">
							{notifications.length === 0 ? (
								<p className="p-4 text-sm text-text-muted">No notifications yet.</p>
							) : (
								notifications.map((notification) => {
									const content = (
										<div
											className={`border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-secondary-light ${
												notification.isRead ? "" : "bg-primary/5"
											}`}
										>
											<div className="flex items-start gap-2">
												{!notification.isRead && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
												<div>
													<p className="text-sm font-semibold text-text">{notification.title}</p>
													{notification.body && <p className="mt-0.5 text-xs text-text-muted">{notification.body}</p>}
												</div>
											</div>
										</div>
									);

									return notification.link ? (
										<Link key={notification.id} href={notification.link} onClick={() => markOneRead(notification.id)}>
											{content}
										</Link>
									) : (
										<button
											key={notification.id}
											type="button"
											className="block w-full"
											onClick={() => markOneRead(notification.id)}
										>
											{content}
										</button>
									);
								})
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
