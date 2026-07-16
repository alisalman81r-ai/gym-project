import type { MetadataRoute } from "next";
import { siteConfig } from "@/constants/site";
import { BLOG_POSTS } from "@/constants/blog";

const STATIC_ROUTES = [
	{ path: "", priority: 1, changeFrequency: "weekly" as const },
	{ path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
	{ path: "/membership", priority: 0.9, changeFrequency: "monthly" as const },
	{ path: "/trainers", priority: 0.8, changeFrequency: "monthly" as const },
	{ path: "/classes", priority: 0.8, changeFrequency: "monthly" as const },
	{ path: "/supplements", priority: 0.7, changeFrequency: "monthly" as const },
	{ path: "/gallery", priority: 0.6, changeFrequency: "monthly" as const },
	{ path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
	{ path: "/contact", priority: 0.9, changeFrequency: "yearly" as const },
	{ path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
	{ path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
	const staticEntries = STATIC_ROUTES.map((route) => ({
		url: `${siteConfig.url}${route.path}`,
		lastModified: new Date(),
		changeFrequency: route.changeFrequency,
		priority: route.priority,
	}));

	const blogEntries = BLOG_POSTS.map((post) => ({
		url: `${siteConfig.url}/blog/${post.slug}`,
		lastModified: new Date(post.date),
		changeFrequency: "monthly" as const,
		priority: 0.6,
	}));

	return [...staticEntries, ...blogEntries];
}
