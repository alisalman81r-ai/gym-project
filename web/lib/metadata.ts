import type { Metadata } from "next";
import { siteConfig } from "@/constants/site";

export interface PageMetadataOptions {
	title: string;
	description: string;
	/** Path relative to the site root, e.g. "/about" or "/" for Home. */
	path: string;
	/** Path to a real image already in public/ -- defaults to the hero photo. Never a nonexistent placeholder. */
	image?: string;
}

/**
 * Builds a full per-page Metadata object (title, description,
 * canonical, Open Graph, Twitter Card).
 *
 * Why this exists: Next.js's metadata merging does NOT inherit a
 * page's plain `title`/`description` into `openGraph`/`twitter` --
 * those objects only merge from the parent layout. Without this
 * helper, every page's social preview would silently show the
 * root layout's site-wide title/description instead of the page's
 * own, which is a real (if invisible) SEO bug. Centralizing here
 * also avoids re-typing the same openGraph/twitter boilerplate in
 * every page.tsx.
 */
export function createMetadata({ title, description, path, image = "/images/hero/hero-main.jpg" }: PageMetadataOptions): Metadata {
	return {
		title,
		description,
		alternates: {
			canonical: path,
		},
		openGraph: {
			title,
			description,
			url: path,
			type: "website",
			siteName: siteConfig.name,
			images: [{ url: image, width: 1200, height: 630, alt: title }],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [image],
		},
	};
}
