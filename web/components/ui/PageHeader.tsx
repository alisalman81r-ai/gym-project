import { Container } from "@/components/layout";

export interface PageHeaderProps {
	eyebrow?: string;
	title: string;
	/** Plain text under the title (e.g. "Last updated: ..."), used instead of `eyebrow` on legal pages. */
	subtitle?: string;
	compact?: boolean;
}

/**
 * The eyebrow + H1 banner every interior page opens with. Was
 * previously copy-pasted verbatim into 9 separate page.tsx files
 * (about/membership/trainers/classes/gallery/blog/contact/privacy/
 * terms) -- this is the single source now.
 */
export function PageHeader({ eyebrow, title, subtitle, compact = false }: PageHeaderProps) {
	return (
		<section className={`bg-secondary text-center pt-36 ${compact ? "pb-16" : "pb-20"}`}>
			<Container>
				{eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
				<h1 className={`font-display font-bold text-text ${compact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"}`}>
					{title}
				</h1>
				{subtitle && <p className="mt-2 text-sm text-text-subtle">{subtitle}</p>}
			</Container>
		</section>
	);
}
