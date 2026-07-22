/**
 * Demo content for the /instagram and /facebook preview pages. These
 * routes exist because the real social accounts aren't live yet (see
 * Footer's SOCIAL_LINKS) -- this gives visitors a sense of the club's
 * social presence instead of a dead "#" link. Reuses the same photos/
 * testimonials as the rest of the site rather than inventing new assets.
 */

export interface InstagramPost {
	id: string;
	image: string;
	alt: string;
	caption: string;
	likes: number;
	comments: number;
}

export const INSTAGRAM_POSTS: InstagramPost[] = [
	{
		id: "ig-01",
		image: "/images/gallery/gallery-01.jpg",
		alt: "The strength floor at Iron Elite Fitness Club",
		caption: "5am or it didn't happen.",
		likes: 342,
		comments: 12,
	},
	{
		id: "ig-02",
		image: "/images/gallery/gallery-02.jpg",
		alt: "Boxing class in session",
		caption: "Boxing conditioning hits different.",
		likes: 289,
		comments: 8,
	},
	{
		id: "ig-03",
		image: "/images/gallery/gallery-03.jpg",
		alt: "Member training progress moment",
		caption: "Sarah — down 22lbs and stronger than ever, 4 months in.",
		likes: 512,
		comments: 34,
	},
	{
		id: "ig-04",
		image: "/images/trainers/marcus-reed.jpg",
		alt: "Portrait of Marcus Reed, Head Strength Coach",
		caption: "Coach spotlight: Marcus Reed, Head Strength Coach.",
		likes: 276,
		comments: 14,
	},
	{
		id: "ig-05",
		image: "/images/gallery/gallery-04.jpg",
		alt: "The private recovery lounge",
		caption: "Recovery is part of the program, not an afterthought.",
		likes: 198,
		comments: 5,
	},
	{
		id: "ig-06",
		image: "/images/gallery/gallery-05.jpg",
		alt: "Personal training session in progress",
		caption: "James — first bodyweight deadlift after 6 months of coaching.",
		likes: 467,
		comments: 29,
	},
	{
		id: "ig-07",
		image: "/images/trainers/alina-cruz.jpg",
		alt: "Portrait of Alina Cruz, HIIT & Conditioning Coach",
		caption: "HIIT Friday with Coach Alina.",
		likes: 301,
		comments: 9,
	},
	{
		id: "ig-08",
		image: "/images/gallery/gallery-06.jpg",
		alt: "Group class celebrating a completed session",
		caption: "Maria hit her first strict pull-up this year.",
		likes: 388,
		comments: 21,
	},
	{
		id: "ig-09",
		image: "/images/trainers/daniel-osei.jpg",
		alt: "Portrait of Daniel Osei, Functional Movement Coach",
		caption: "Mobility work with Coach Daniel — the unglamorous work that keeps you training pain-free.",
		likes: 210,
		comments: 6,
	},
];

export interface FacebookPost {
	id: string;
	body: string;
	image?: string;
	imageAlt?: string;
	timeAgo: string;
	likes: number;
	comments: number;
	shares: number;
}

export const FACEBOOK_POSTS: FacebookPost[] = [
	{
		id: "fb-01",
		body: '👏 Shoutout to Sarah Whitfield! "The coaching here changed how I think about training entirely. Six months in, I\'m stronger at 40 than I was at 25." — Elite Member since 2023',
		image: "/images/gallery/gallery-03.jpg",
		imageAlt: "Sarah's training progress moment",
		timeAgo: "2d",
		likes: 128,
		comments: 19,
		shares: 6,
	},
	{
		id: "fb-02",
		body: "New in the Supplements Shop 🧪 — Electrolyte Hydration Mix just restocked. Link in bio.",
		timeAgo: "4d",
		likes: 64,
		comments: 7,
		shares: 3,
	},
	{
		id: "fb-03",
		body: '💪 James Keller just hit a milestone: "Best coaching staff I\'ve trained with. My deadlift went up 80lbs in six months following their program."',
		image: "/images/gallery/gallery-05.jpg",
		imageAlt: "James's first bodyweight deadlift",
		timeAgo: "1w",
		likes: 203,
		comments: 27,
		shares: 11,
	},
	{
		id: "fb-04",
		body: "Reminder: Yoga & Mobility sessions now run daily at 6am, 7am, and 8am. See you on the mat.",
		timeAgo: "1w",
		likes: 51,
		comments: 4,
		shares: 2,
	},
	{
		id: "fb-05",
		body: '🎉 Maria Gomez: "The community here keeps me accountable. I actually look forward to leg day now, which still surprises me." Proud of you, Maria!',
		image: "/images/gallery/gallery-06.jpg",
		imageAlt: "Maria celebrating her first strict pull-up",
		timeAgo: "2w",
		likes: 176,
		comments: 22,
		shares: 8,
	},
];
