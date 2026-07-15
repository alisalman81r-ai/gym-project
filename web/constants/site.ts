/**
 * Site-wide identity used by metadata, the layout, and (later)
 * the Navbar/Footer. Single source of truth so brand copy never
 * has to be hunted down across multiple files.
 */
export const siteConfig = {
	name: "Iron Elite Fitness Club",
	tagline: "Train Beyond Limits.",
	description:
		"Iron Elite Fitness Club is a private luxury training club offering elite strength coaching, personalized programs, and premium recovery facilities.",
	url: "https://www.ironelitefitnessclub.com",
} as const;
