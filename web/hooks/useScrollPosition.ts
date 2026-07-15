"use client";

import { useEffect, useState } from "react";

/**
 * True once the page has scrolled past `threshold` px. Used by the
 * Navbar (deepen the glass background) and BackToTop (fade the
 * button in) — a single scroll listener shared by both concerns
 * rather than each rolling its own.
 */
export function useScrolledPast(threshold: number): boolean {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > threshold);

		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [threshold]);

	return scrolled;
}
