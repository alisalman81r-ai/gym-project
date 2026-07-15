"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useScrolledPast } from "@/hooks/useScrollPosition";

const SHOW_AFTER_PX = 600;

/** Floating scroll-to-top button, fades in once scrolled past the hero. */
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
					className="fixed bottom-6 right-6 z-[90] flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-primary text-background shadow-elevated"
				>
					<ArrowUp size={20} />
				</motion.button>
			)}
		</AnimatePresence>
	);
}
