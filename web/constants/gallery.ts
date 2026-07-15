import type { GalleryImage } from "@/types";

/**
 * Placeholder images — see public/images/gallery/. Swap the `src`
 * values for real photography when it's sourced; everything else
 * (grid, alt text, layout, captions) stays the same.
 */
export const GALLERY_IMAGES: GalleryImage[] = [
	{ id: "gallery-01", src: "/images/gallery/gallery-01.svg", alt: "The strength floor at Iron Elite Fitness Club" },
	{ id: "gallery-02", src: "/images/gallery/gallery-02.svg", alt: "Boxing class in session" },
	{
		id: "gallery-03",
		src: "/images/gallery/gallery-03.svg",
		alt: "Member training progress moment",
		caption: "Sarah — down 22lbs and stronger than ever, 4 months in.",
	},
	{ id: "gallery-04", src: "/images/gallery/gallery-04.svg", alt: "The private recovery lounge" },
	{
		id: "gallery-05",
		src: "/images/gallery/gallery-05.svg",
		alt: "Personal training session in progress",
		caption: "James — first bodyweight deadlift after 6 months of coaching.",
	},
	{
		id: "gallery-06",
		src: "/images/gallery/gallery-06.svg",
		alt: "Group class celebrating a completed session",
		caption: "Maria — hit her first strict pull-up this year.",
	},
];
