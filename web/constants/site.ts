/**
 * Site-wide identity used by metadata, the layout, and the
 * Navbar/Footer/AboutPreviewSection. Single source of truth so
 * brand copy never has to be hunted down across multiple files.
 */
export const siteConfig = {
	name: "Iron Elite Fitness Club",
	tagline: "Train Beyond Limits.",
	description:
		"Iron Elite Fitness Club is a private luxury training club offering elite strength coaching, personalized programs, and premium recovery facilities.",
	url: "https://www.ironelitefitnessclub.com",
	mission:
		"To give every member the coaching, environment, and accountability of a professional athlete — regardless of where they're starting from.",
	vision:
		"To set the standard for private fitness coaching: a club where results are never left to chance, and every rep is part of a real plan.",
} as const;
