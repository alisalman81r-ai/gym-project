"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ShoppingCart, User, Heart } from "lucide-react";
import { Container } from "./Container";
import { NotificationBell } from "./NotificationBell";
import { Button, Logo } from "@/components/ui";
import { NAV_LINKS, CONTACT_LINK } from "@/constants/navigation";
import { useScrolledPast } from "@/hooks/useScrollPosition";
import { cn } from "@/lib/utils";
import { CART_UPDATED_EVENT } from "@/lib/cartEvents";

/**
 * Sticky primary navigation. The mobile drawer is fully wired
 * here (state + Framer Motion slide-in) rather than left as a
 * stub, since it's simple enough to own end-to-end at this stage.
 * Deepens its glass background and shrinks slightly once the page
 * scrolls past the hero.
 */
export function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [cartCount, setCartCount] = useState(0);
	const pathname = usePathname();
	const isScrolled = useScrolledPast(80);

	const closeMobileMenu = () => setIsMobileMenuOpen(false);

	// Client-fetched rather than server-rendered so the marketing pages
	// around it can stay statically generated (see lib/cartEvents.ts).
	useEffect(() => {
		let cancelled = false;
		async function fetchCartCount() {
			try {
				const response = await fetch("/api/cart/count");
				const data = await response.json();
				if (!cancelled) setCartCount(data.count ?? 0);
			} catch {
				// Badge just won't update this time -- not worth surfacing an error for.
			}
		}
		fetchCartCount();
		window.addEventListener(CART_UPDATED_EVENT, fetchCartCount);
		return () => {
			cancelled = true;
			window.removeEventListener(CART_UPDATED_EVENT, fetchCartCount);
		};
	}, []);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 border-b border-border backdrop-blur-md transition-colors duration-300",
				isScrolled ? "bg-background/95 shadow-elevated" : "bg-background/70"
			)}
		>
			<Container>
				<nav
					aria-label="Primary"
					className={cn("flex items-center justify-between transition-[padding] duration-300", isScrolled ? "py-3" : "py-5")}
				>
					<Logo href="/" />

					<ul className="hidden items-center gap-8 md:flex">
						{NAV_LINKS.map((link) => {
							const isActive = pathname === link.href;
							return (
								<li key={link.href}>
									<Link
										href={link.href}
										className={cn(
											"relative text-xs font-semibold uppercase tracking-wider text-text-muted transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-text hover:after:scale-x-100",
											isActive && "text-text after:scale-x-100"
										)}
									>
										{link.label}
									</Link>
								</li>
							);
						})}
					</ul>

					<div className="hidden items-center gap-5 md:flex">
						<Link href={CONTACT_LINK.href} className="text-xs font-semibold text-text-muted hover:text-text">
							{CONTACT_LINK.label}
						</Link>
						<Link href="/account/wishlist" aria-label="Wishlist" className="text-text-muted transition-colors hover:text-text">
							<Heart size={20} />
						</Link>
						<Link href="/account" aria-label="My Account" className="text-text-muted transition-colors hover:text-text">
							<User size={20} />
						</Link>
						<NotificationBell />
						<Link href="/cart" aria-label="Cart" className="relative text-text-muted transition-colors hover:text-text">
							<ShoppingCart size={20} />
							{cartCount > 0 && (
								<span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[0.6rem] font-bold text-background">
									{cartCount > 9 ? "9+" : cartCount}
								</span>
							)}
						</Link>
						<Button href="/admin/login" size="sm">
							Admin Login
						</Button>
					</div>

					<button
						type="button"
						aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
						aria-expanded={isMobileMenuOpen}
						onClick={() => setIsMobileMenuOpen((open) => !open)}
						className="text-text md:hidden"
					>
						{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</nav>
			</Container>

			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
						className="overflow-hidden border-t border-border bg-background md:hidden"
					>
						<Container>
							<ul className="flex flex-col gap-1 py-6">
								{[...NAV_LINKS, CONTACT_LINK].map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											onClick={closeMobileMenu}
											className="block py-3 font-display text-lg text-text"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
							<div className="flex items-center gap-6 pb-6">
								<Link href="/account/wishlist" onClick={closeMobileMenu} className="flex items-center gap-2 text-sm text-text-muted">
									<Heart size={18} /> Wishlist
								</Link>
								<Link href="/account" onClick={closeMobileMenu} className="flex items-center gap-2 text-sm text-text-muted">
									<User size={18} /> Account
								</Link>
								<Link href="/cart" onClick={closeMobileMenu} className="flex items-center gap-2 text-sm text-text-muted">
									<ShoppingCart size={18} /> Cart{cartCount > 0 ? ` (${cartCount})` : ""}
								</Link>
							</div>
							<div className="pb-6">
								<Button href="/admin/login" className="w-full" onClick={closeMobileMenu}>
									Admin Login
								</Button>
							</div>
						</Container>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
