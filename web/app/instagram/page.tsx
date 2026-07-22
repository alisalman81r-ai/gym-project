import type { Metadata } from "next";
import { Heart, MessageCircle } from "lucide-react";
import { Navbar, Footer, Container } from "@/components/layout";
import { Badge, Logo, RevealImage, Button } from "@/components/ui";
import { siteConfig } from "@/constants/site";
import { INSTAGRAM_POSTS } from "@/constants/social";

export const metadata: Metadata = {
	title: "Instagram Preview",
	description: `A preview of ${siteConfig.name}'s Instagram feed.`,
	robots: { index: false, follow: false },
};

const STATS = [
	{ label: "Posts", value: String(INSTAGRAM_POSTS.length) },
	{ label: "Followers", value: "12.4K" },
	{ label: "Following", value: "180" },
];

/**
 * Not a real Instagram embed -- the club's account isn't live yet (see
 * Footer's SOCIAL_LINKS). This gives visitors a feel for the feed using
 * the same photos and captions already on the site, rather than a dead
 * "#" link.
 */
export default function InstagramPreviewPage() {
	return (
		<>
			<Navbar />
			<main className="py-16 pt-32">
				<Container className="max-w-3xl">
					<div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
						<Logo size="lg" />
						<div className="flex-1">
							<div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
								<h1 className="font-display text-xl font-semibold text-text">@ironelitefitness</h1>
								<Badge tone="neutral">Demo Preview</Badge>
							</div>
							<div className="mt-4 flex justify-center gap-8 sm:justify-start">
								{STATS.map((stat) => (
									<div key={stat.label} className="text-center sm:text-left">
										<p className="font-display text-lg font-bold text-text">{stat.value}</p>
										<p className="text-xs uppercase tracking-wider text-text-subtle">{stat.label}</p>
									</div>
								))}
							</div>
							<p className="mt-4 text-sm text-text-muted">{siteConfig.tagline}</p>
							<p className="text-sm text-text-muted">{siteConfig.description}</p>
							<p className="text-sm text-primary">📍 128 Riverside Ave, Springfield</p>
							<Button href="/contact" size="sm" className="mt-4">
								Book a Tour
							</Button>
						</div>
					</div>
				</Container>

				<Container className="mt-10 max-w-4xl">
					<div className="grid grid-cols-3 gap-1 sm:gap-2">
						{INSTAGRAM_POSTS.map((post) => (
							<div key={post.id} className="group relative aspect-square overflow-hidden bg-secondary">
								<RevealImage
									src={post.image}
									alt={post.alt}
									fill
									sizes="(min-width: 640px) 33vw, 33vw"
									className="object-cover transition-transform duration-300 group-hover:scale-105"
								/>
								<div className="absolute inset-0 flex items-center justify-center gap-5 bg-background/0 opacity-0 transition-all duration-200 group-hover:bg-background/60 group-hover:opacity-100">
									<span className="flex items-center gap-1.5 text-sm font-semibold text-text">
										<Heart size={18} fill="currentColor" /> {post.likes}
									</span>
									<span className="flex items-center gap-1.5 text-sm font-semibold text-text">
										<MessageCircle size={18} fill="currentColor" /> {post.comments}
									</span>
								</div>
							</div>
						))}
					</div>
				</Container>
			</main>
			<Footer />
		</>
	);
}
