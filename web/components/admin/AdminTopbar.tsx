"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui";
import { logoutAction } from "@/app/admin/actions";

const LINKS = [
	{ href: "/admin", label: "Dashboard" },
	{ href: "/admin/products", label: "Products" },
	{ href: "/admin/orders", label: "Orders" },
	{ href: "/admin/memberships", label: "Memberships" },
	{ href: "/admin/customers", label: "Customers" },
	{ href: "/admin/coupons", label: "Coupons" },
	{ href: "/admin/gallery", label: "Gallery" },
	{ href: "/admin/journal", label: "Journal" },
	{ href: "/admin/reviews", label: "Reviews" },
	{ href: "/admin/messages", label: "Messages" },
	{ href: "/admin/chat", label: "Live Chat" },
];

const BADGE_POLL_INTERVAL_MS = 8000;

interface BadgeCounts {
	orders: number;
	memberships: number;
	reviews: number;
	products: number;
	messages: number;
	chat: number;
}

const EMPTY_COUNTS: BadgeCounts = { orders: 0, memberships: 0, reviews: 0, products: 0, messages: 0, chat: 0 };

export interface AdminTopbarProps {
	adminUsername?: string;
}

export function AdminTopbar({ adminUsername }: AdminTopbarProps) {
	const pathname = usePathname();
	const [counts, setCounts] = useState<BadgeCounts>(EMPTY_COUNTS);

	useEffect(() => {
		if (pathname === "/admin/login") return;

		let cancelled = false;
		async function poll() {
			try {
				const response = await fetch("/api/admin/badge-counts");
				const data = await response.json();
				if (!cancelled) setCounts({ ...EMPTY_COUNTS, ...data });
			} catch {
				// Silent -- the next poll retries.
			}
		}
		poll();
		const interval = setInterval(poll, BADGE_POLL_INTERVAL_MS);
		return () => {
			cancelled = true;
			clearInterval(interval);
		};
	}, [pathname]);

	const badgeCounts: Record<string, number> = {
		"/admin/products": counts.products,
		"/admin/orders": counts.orders,
		"/admin/memberships": counts.memberships,
		"/admin/reviews": counts.reviews,
		"/admin/messages": counts.messages,
		"/admin/chat": counts.chat,
	};

	if (pathname === "/admin/login") return null;

	return (
		<div className="no-print border-b border-border bg-secondary">
			<div className="flex flex-wrap items-center gap-4 px-6 py-4">
				<Link href="/admin" className="flex shrink-0 items-center gap-3">
					<Logo size="sm" />
					<span className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-text-subtle">
						Admin
					</span>
				</Link>

				<nav className="flex flex-1 flex-wrap justify-center gap-2">
					{LINKS.map((link) => {
						const isActive = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
						const badgeCount = badgeCounts[link.href] ?? 0;
						return (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									"flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
									isActive ? "bg-primary text-background" : "text-text-muted hover:text-text"
								)}
							>
								{link.label}
								{badgeCount > 0 && (
									<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1.5 text-xs font-bold text-white">
										{badgeCount}
									</span>
								)}
							</Link>
						);
					})}
				</nav>

				<div className="flex shrink-0 items-center gap-4">
					{adminUsername && (
						<span className="hidden text-xs text-text-subtle lg:inline">
							Signed in as <span className="font-semibold text-text-muted">{adminUsername}</span>
						</span>
					)}
					<form action={logoutAction}>
						<button
							type="submit"
							className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-text-muted transition-colors hover:border-primary/60 hover:text-text"
						>
							Log Out
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
