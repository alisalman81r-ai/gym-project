"use client";

import { MotionConfig } from "framer-motion";

/**
 * A thin client boundary so the Server Component root layout can
 * still render this (Server Components can render Client
 * Component children, but framer-motion's exports themselves
 * aren't marked "use client", so this file provides that boundary).
 *
 * `reducedMotion="user"` makes every `motion.*` component and
 * `useAnimate`/`animate()` call site-wide automatically honor the
 * OS-level "reduce motion" preference -- one setting instead of a
 * `useReducedMotion()` check in every animated component.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
	return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
