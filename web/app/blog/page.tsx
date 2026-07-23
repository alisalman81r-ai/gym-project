import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, Footer, BackToTop, Container } from "@/components/layout";
import { RevealImage, Reveal, RevealGroup, RevealItem, PageHeader } from "@/components/ui";
import { BlogCard } from "@/components/cards";
import { listBlogPosts } from "@/lib/store/blog";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
	title: "The Journal",
	description: "Insights on training, recovery, and discipline from the coaches at Iron Elite Fitness Club.",
	path: "/blog",
});

// Reflects journal edits made in the admin panel without a rebuild.
export const dynamic = "force-dynamic";

export default function BlogPage() {
	const [featured, ...rest] = listBlogPosts();

	return (
		<>
			<Navbar />
			<main>
				<PageHeader eyebrow="The Journal" title="Insights on Training, Recovery &amp; Discipline" />

				{featured && (
					<section className="pb-12 pt-24">
						<Container>
							<Reveal>
								<Link
									href={`/blog/${featured.slug}`}
									className="grid gap-8 rounded-2xl border border-border bg-secondary p-6 transition-colors hover:border-primary/50 lg:grid-cols-2 lg:items-center"
								>
									<div className="relative aspect-video overflow-hidden rounded-xl lg:aspect-[4/3]">
										<RevealImage
											src={featured.image.src}
											alt={featured.image.alt}
											fill
											sizes="(min-width: 1024px) 50vw, 100vw"
											className="object-cover"
										/>
									</div>
									<div>
										<p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">{featured.category}</p>
										<h2 className="mb-3 font-display text-2xl font-semibold text-text sm:text-3xl">{featured.title}</h2>
										<p className="mb-4 text-text-muted">{featured.excerpt}</p>
										<p className="text-xs text-text-subtle">
											{featured.author} &middot; {featured.readTime}
										</p>
									</div>
								</Link>
							</Reveal>
						</Container>
					</section>
				)}

				<section className="pb-24">
					<Container>
						<RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{rest.map((post) => (
								<RevealItem key={post.id}>
									<BlogCard post={post} />
								</RevealItem>
							))}
						</RevealGroup>
					</Container>
				</section>
			</main>
			<Footer />
			<BackToTop />
		</>
	);
}
