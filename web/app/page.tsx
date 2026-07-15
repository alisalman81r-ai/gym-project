/**
 * Temporary placeholder. Replaced once the Hero and other
 * section components are built in Phase 9 — this exists only to
 * confirm the foundation (fonts, theme tokens, layout) renders.
 */
export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
			<p className="font-body text-xs uppercase tracking-[0.2em] text-primary">
				Foundation Ready
			</p>
			<h1 className="font-display text-4xl font-semibold text-text">
				Iron Elite Fitness Club
			</h1>
			<p className="font-body text-text-muted">Train Beyond Limits.</p>
		</main>
	);
}
