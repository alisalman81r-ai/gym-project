import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class names and resolves conflicting
 * Tailwind utility classes (e.g. "p-2 p-4" -> "p-4"). Used by
 * every component that accepts a `className` prop.
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
