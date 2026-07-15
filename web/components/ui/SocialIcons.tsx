/**
 * lucide-react intentionally excludes brand/logo icons (trademark
 * scope), so the handful of social glyphs the Footer needs are
 * hand-drawn here as simple `currentColor` SVGs — same usage
 * pattern as any lucide icon (size via className).
 */

type IconProps = React.SVGProps<SVGSVGElement>;

export function InstagramIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
			<rect x="3" y="3" width="18" height="18" rx="5" />
			<circle cx="12" cy="12" r="4.2" />
			<circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
		</svg>
	);
}

export function FacebookIcon(props: IconProps) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
			<path d="M15 8.5h-2c-.8 0-1.5.7-1.5 1.5v2h3.5l-.5 3H11.5v7h-3v-7H6.5v-3H8.5V9.5C8.5 7 10.5 5 13 5h2v3.5z" />
		</svg>
	);
}
