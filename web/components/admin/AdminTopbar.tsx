"use client";

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
	{ href: "/admin/reviews", label: "Reviews" },
	{ href: "/admin/messages", label: "Messages" },
];

export interface AdminTopbarProps {
	adminUsername?: string;
}

export function AdminTopbar({ adminUsername }: AdminTopbarProps) {
	const pathname = usePathname();
	if (pathname === "/admin/login") return null;

	return (
		<div className="no-print border-b border-border bg-secondary">
			<div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
				<Link href="/admin" className="flex items-center gap-3">
					<Logo size="sm" />
					<span className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-text-subtle">
						Admin
					</span>
				</Link>

				<div className="flex items-center gap-4">
					{adminUsername && (
						<span className="hidden text-xs text-text-subtle sm:inline">
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

			<nav className="flex flex-wrap gap-2 px-6 pb-4">
				{LINKS.map((link) => {
					const isActive = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
					return (
						<Link
							key={link.href}
							href={link.href}
							className={cn(
								"rounded-full px-4 py-2 text-sm font-semibold transition-colors",
								isActive ? "bg-primary text-background" : "text-text-muted hover:text-text"
							)}
						>
							{link.label}
						</Link>
					);
				})}
			</nav>
		</div>
	);
}
