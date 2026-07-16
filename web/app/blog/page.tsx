import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, Footer, BackToTop, Container } from "@/components/layout";
import { RevealImage } from "@/components/ui";
import { BlogCard } from "@/components/cards";
import { BLOG_POSTS } from "@/constants/blog";

export const metadata: Metadata = {
	title: "The Journal",
	description: "Insights on training, recovery, and discipline from the coaches at Iron Elite Fitness Club.",
};

export default function BlogPage() {
	const [featured, ...rest] = BLOG_POSTS;

	return (
		<>
			<Navbar />
			<main>
				<section className="bg-secondary pb-20 pt-36 text-center">
					<Container>
						<p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">The Journal</p>
						<h1 className="font-display text-4xl font-bold text-text sm:text-5xl">
							Insights on Training, Recovery &amp; Discipline
						</h1>
					</Container>
				</section>

				{featured && (
					<section className="pb-12 pt-24">
						<Container>
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
						</Container>
					</section>
				)}

				<section className="pb-24">
					<Container>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{rest.map((post) => (
								<BlogCard key={post.id} post={post} />
							))}
						</div>
					</Container>
				</section>
			</main>
			<Footer />
			<BackToTop />
		</>
	);
}
