"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useScrolledPast } from "@/hooks/useScrollPosition";

const SHOW_AFTER_PX = 600;

/**
 * Floating scroll-to-top button, fades in once scrolled past the hero.
 * Sits bottom-left -- ChatWidget's floating bubble owns bottom-right.
 */
export function BackToTop() {
	const isVisible = useScrolledPast(SHOW_AFTER_PX);

	const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.button
					type="button"
					onClick={scrollToTop}
					aria-label="Back to top"
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 12 }}
					whileHover={{ scale: 1.08 }}
					whileTap={{ scale: 0.94 }}
					transition={{ duration: 0.25 }}
					className="fixed bottom-4 left-4 z-[90] flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-primary text-background opacity-80 shadow-elevated hover:opacity-100 sm:bottom-6 sm:left-6 sm:h-12 sm:w-12"
				>
					<ArrowUp size={18} className="sm:hidden" />
					<ArrowUp size={20} className="hidden sm:block" />
				</motion.button>
			)}
		</AnimatePresence>
	);
}
