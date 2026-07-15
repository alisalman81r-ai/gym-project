"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/types";

export interface AccordionProps {
	items: FaqItem[];
	className?: string;
}

/**
 * Multi-open accordion (each item toggles independently — no
 * exclusivity). Height animates via Framer Motion's `auto` layout
 * support rather than a fixed max-height guess.
 */
export function Accordion({ items, className }: AccordionProps) {
	const [openIds, setOpenIds] = useState<Set<string>>(new Set());

	const toggle = (id: string) => {
		setOpenIds((current) => {
			const next = new Set(current);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	return (
		<div className={cn("mx-auto max-w-3xl divide-y divide-border", className)}>
			{items.map((item) => {
				const isOpen = openIds.has(item.id);

				return (
					<div key={item.id}>
						<h3>
							<button
								type="button"
								onClick={() => toggle(item.id)}
								aria-expanded={isOpen}
								className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-text"
							>
								{item.question}
								<motion.span
									animate={{ rotate: isOpen ? 180 : 0 }}
									transition={{ duration: 0.25 }}
									className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-primary"
								>
									<ChevronDown size={16} />
								</motion.span>
							</button>
						</h3>

						<AnimatePresence initial={false}>
							{isOpen && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
									className="overflow-hidden"
								>
									<p className="pb-5 text-sm text-text-muted">{item.answer}</p>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				);
			})}
		</div>
	);
}
