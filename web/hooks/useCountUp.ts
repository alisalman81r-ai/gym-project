"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

/**
 * Animates a number from 0 to `target` once its returned `ref`
 * scrolls into view. Built on Framer Motion's `animate()` so the
 * easing matches the rest of the site's motion language.
 */
export function useCountUp(target: number, duration = 1.6) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, amount: 0.4 });
	const [value, setValue] = useState(0);

	useEffect(() => {
		if (!isInView) return;

		const controls = animate(0, target, {
			duration,
			ease: [0.16, 1, 0.3, 1],
			onUpdate: (latest) => setValue(Math.round(latest)),
		});

		return () => controls.stop();
	}, [isInView, target, duration]);

	return { ref, value };
}
