import type { Metadata } from "next";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { Navbar, Footer, Container } from "@/components/layout";
import { Badge, Logo, RevealImage, Button } from "@/components/ui";
import { siteConfig } from "@/constants/site";
import { FACEBOOK_POSTS } from "@/constants/social";

export const metadata: Metadata = {
	title: "Facebook Preview",
	description: `A preview of ${siteConfig.name}'s Facebook Page.`,
	robots: { index: false, follow: false },
};

/**
 * Not a real Facebook embed -- the club's Page isn't live yet (see
 * Footer's SOCIAL_LINKS). This gives visitors a feel for the Page using
 * the same photos and testimonials already on the site, rather than a
 * dead "#" link.
 */
export default function FacebookPreviewPage() {
	return (
		<>
			<Navbar />
			<main className="pb-16">
				<div className="relative h-56 w-full overflow-hidden bg-secondary sm:h-72">
					<RevealImage
						src="/images/hero/about-strength-floor.jpg"
						alt="Iron Elite Fitness Club strength floor"
						fill
						sizes="100vw"
						className="object-cover"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
				</div>

				<Container className="max-w-3xl">
					<div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
						<div className="-mt-12 shrink-0 rounded-full border-4 border-background bg-secondary sm:-mt-10">
							<Logo size="lg" />
						</div>
						<div className="flex-1 pt-3 text-center sm:pb-1 sm:pt-0 sm:text-left">
							<div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
								<h1 className="font-display text-2xl font-bold text-text">{siteConfig.name}</h1>
								<Badge tone="neutral">Demo Preview</Badge>
							</div>
							<p className="text-sm text-text-muted">Fitness Center · 128 Riverside Ave, Springfield</p>
						</div>
					</div>

					<div className="mt-6 flex flex-wrap items-center gap-3 border-b border-border pb-6">
						<Button size="sm">Like</Button>
						<Button variant="secondary" size="sm">
							Follow
						</Button>
						<Button href="/contact" variant="secondary" size="sm">
							Message
						</Button>
						<p className="ml-auto text-sm text-text-subtle">8.9K likes · 9.6K followers</p>
					</div>

					<div className="mt-8 space-y-6">
						{FACEBOOK_POSTS.map((post) => (
							<article key={post.id} className="rounded-2xl border border-border bg-secondary p-6">
								<div className="flex items-center gap-3">
									<Logo size="sm" />
									<div>
										<p className="text-sm font-semibold text-text">{siteConfig.name}</p>
										<p className="text-xs text-text-subtle">{post.timeAgo} · 🌐</p>
									</div>
								</div>

								<p className="mt-4 whitespace-pre-line text-sm text-text-muted">{post.body}</p>

								{post.image && (
									<div className="relative mt-4 aspect-video overflow-hidden rounded-lg bg-background">
										<RevealImage src={post.image} alt={post.imageAlt ?? ""} fill sizes="(min-width: 640px) 640px, 100vw" className="object-cover" />
									</div>
								)}

								<div className="mt-4 flex items-center gap-6 border-t border-border pt-4 text-sm text-text-subtle">
									<span className="flex items-center gap-1.5">
										<ThumbsUp size={16} /> {post.likes}
									</span>
									<span className="flex items-center gap-1.5">
										<MessageCircle size={16} /> {post.comments}
									</span>
									<span className="flex items-center gap-1.5">
										<Share2 size={16} /> {post.shares}
									</span>
								</div>
							</article>
						))}
					</div>
				</Container>
			</main>
			<Footer />
		</>
	);
}
