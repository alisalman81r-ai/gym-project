import { Loader2 } from "lucide-react";

/**
 * Shown by Next.js while a route segment is loading (e.g. a slow
 * data fetch on a future page). Purely a Server Component --
 * no Framer Motion needed for a simple spin.
 */
export default function Loading() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<Loader2 className="animate-spin text-primary" size={32} aria-label="Loading" />
		</div>
	);
}
