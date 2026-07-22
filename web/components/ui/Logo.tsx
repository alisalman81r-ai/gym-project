"use client";

import { useId } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type LogoSize = "sm" | "md" | "lg";

export interface LogoProps {
	/** Wraps the mark in a `Link` when provided; renders bare otherwise (for nesting inside an existing link/button). */
	href?: string;
	size?: LogoSize;
	className?: string;
}

const MARK_PX: Record<LogoSize, number> = { sm: 40, md: 50, lg: 68 };

/**
 * The site's brand mark -- a crest badge with "IRON ELITE" arched over a
 * flexed-arm-and-dumbbell glyph, "FITNESS CLUB" underneath. The wordmark
 * lives inside the badge itself (not a separate text element beside it),
 * so this single SVG is the whole logo across the Navbar, Footer, and
 * admin topbar. Ids are namespaced per instance via `useId` since the
 * Navbar and Footer badges can both be mounted on the page at once.
 */
export function Logo({ href, size = "md", className }: LogoProps) {
	const markPx = MARK_PX[size];
	const uid = useId();
	const gradientId = `logo-gold-${uid}`;
	const topArcId = `logo-top-arc-${uid}`;

	const content = (
		<motion.svg
			viewBox="0 0 100 100"
			width={markPx}
			height={markPx}
			fill="none"
			aria-label="Iron Elite Fitness Club"
			className={className}
			whileHover={{ rotate: -6 }}
			transition={{ type: "spring", stiffness: 260, damping: 14 }}
		>
			<defs>
				<linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor="var(--color-primary-light)" />
					<stop offset="100%" stopColor="var(--color-primary-dark)" />
				</linearGradient>
				<path id={topArcId} d="M 14.5 43.75 A 36 36 0 0 1 85.5 43.75" fill="none" />
			</defs>

			{/* crest rings */}
			<circle cx="50" cy="50" r="47" fill="var(--color-secondary)" stroke={`url(#${gradientId})`} strokeWidth="2" />
			<circle cx="50" cy="50" r="41" fill="none" stroke={`url(#${gradientId})`} strokeWidth="0.75" opacity="0.6" />

			{/* arched wordmark */}
			<text fontSize="9.5" fontWeight="700" letterSpacing="1.2" fill={`url(#${gradientId})`}>
				<textPath href={`#${topArcId}`} startOffset="50%" textAnchor="middle">
					IRON ELITE
				</textPath>
			</text>

			{/* flexed arm + dumbbell glyph */}
			<path
				d="M 36 68 L 56 64 L 48 40"
				stroke={`url(#${gradientId})`}
				strokeWidth="9"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
			/>
			<ellipse cx="45" cy="62" rx="10" ry="7.5" fill={`url(#${gradientId})`} transform="rotate(-14 45 62)" />
			<rect x="34" y="34" width="28" height="5" rx="2.5" fill={`url(#${gradientId})`} />
			<circle cx="34" cy="36.5" r="7" fill={`url(#${gradientId})`} />
			<circle cx="62" cy="36.5" r="7" fill={`url(#${gradientId})`} />

			{/* subtitle */}
			<text x="50" y="79" fontSize="5.5" fontWeight="600" letterSpacing="1.2" textAnchor="middle" fill="var(--color-text-subtle)">
				FITNESS CLUB
			</text>
		</motion.svg>
	);

	if (!href) return content;

	return (
		<Link href={href} className="inline-flex items-center">
			{content}
		</Link>
	);
}
