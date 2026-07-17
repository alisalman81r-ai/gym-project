import type { NavLink } from "@/types";

/** Single source for the Navbar, MobileNav, and Footer link lists. */
export const NAV_LINKS: NavLink[] = [
	{ label: "Home", href: "/" },
	{ label: "Shop", href: "/shop" },
	{ label: "About", href: "/about" },
	{ label: "Classes", href: "/classes" },
	{ label: "Trainers", href: "/trainers" },
	{ label: "Membership", href: "/membership" },
	{ label: "Supplements", href: "/supplements" },
	{ label: "Gallery", href: "/gallery" },
	{ label: "Journal", href: "/blog" },
];

export const CONTACT_LINK: NavLink = { label: "Contact", href: "/contact" };
