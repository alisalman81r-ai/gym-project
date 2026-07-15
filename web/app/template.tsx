"use client";

import { motion } from "framer-motion";
import { EASE_LUXURY } from "@/lib/animations";

/**
 * Wraps every route's content (App Router re-mounts `template.tsx`
 * on each navigation, unlike `layout.tsx`). Gives page changes a
 * brief fade + rise instead of an abrupt cut -- currently only
 * Home exists, but this activates automatically for every future
 * route with no per-page code.
 */
export default function Template({ children }: { children: React.ReactNode }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: EASE_LUXURY }}
		>
			{children}
		</motion.div>
	);
}
