"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Container } from "./Container";
import { Button } from "@/components/ui";
import { NAV_LINKS, CONTACT_LINK } from "@/constants/navigation";
import { siteConfig } from "@/constants/site";
import { useScrolledPast } from "@/hooks/useScrollPosition";
import { cn } from "@/lib/utils";

/**
 * Sticky primary navigation. The mobile drawer is fully wired
 * here (state + Framer Motion slide-in) rather than left as a
 * stub, since it's simple enough to own end-to-end at this stage.
 * Deepens its glass background and shrinks slightly once the page
 * scrolls past the hero.
 */
export function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const isScrolled = useScrolledPast(80);

	const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
					<Link href="/" className="font-display text-lg font-semibold tracking-wide text-text">
						{siteConfig.name.split(" ")[0].toUpperCase()}{" "}
						<span className="text-primary">{siteConfig.name.split(" ")[1]?.toUpperCase()}</span>
					</Link>

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

					<div className="hidden items-center gap-6 md:flex">
						<Link href={CONTACT_LINK.href} className="text-xs font-semibold text-text-muted hover:text-text">
							{CONTACT_LINK.label}
						</Link>
						<Button href="/contact" size="sm">
							Book a Tour
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
							<div className="pb-6">
								<Button href="/contact" className="w-full" onClick={closeMobileMenu}>
									Book a Tour
								</Button>
							</div>
						</Container>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
