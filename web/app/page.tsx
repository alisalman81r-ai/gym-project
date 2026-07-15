/**
 * Temporary placeholder. Replaced once the Home page is actually
 * assembled from the components/sections/ library — this exists
 * only to confirm the foundation (fonts, theme tokens, layout)
 * renders. All section components have been built and verified
 * (see components/sections/) but are not yet wired into a page.
 */
export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
			<p className="font-body text-xs uppercase tracking-[0.2em] text-primary">
				Component Library Ready
			</p>
			<h1 className="font-display text-4xl font-semibold text-text">
				Iron Elite Fitness Club
			</h1>
			<p className="font-body text-text-muted">Train Beyond Limits.</p>
		</main>
	);
}
