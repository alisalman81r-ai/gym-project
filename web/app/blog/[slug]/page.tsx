import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar, Footer, BackToTop, Container } from "@/components/layout";
import { RevealImage, Button } from "@/components/ui";
import { BlogCard } from "@/components/cards";
import { BLOG_POSTS } from "@/constants/blog";

interface BlogPostPageProps {
	params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
	return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = BLOG_POSTS.find((p) => p.slug === slug);
	if (!post) return {};
	return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;
	const post = BLOG_POSTS.find((p) => p.slug === slug);

	if (!post) notFound();

	const related = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);

	return (
		<>
			<Navbar />
			<main>
				<article className="pb-16 pt-36">
					<Container>
						<p className="mb-4 text-xs text-text-subtle">
							<Button href="/blog" variant="ghost">
								&larr; Journal
							</Button>
						</p>

						<div className="relative mb-8 aspect-video overflow-hidden rounded-2xl">
							<RevealImage src={post.image.src} alt={post.image.alt} fill sizes="100vw" className="object-cover" priority />
						</div>

						<p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">{post.category}</p>
						<h1 className="mb-4 font-display text-3xl font-bold text-text sm:text-4xl">{post.title}</h1>
						<p className="mb-10 text-sm text-text-subtle">
							By {post.author} &middot; {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} &middot; {post.readTime}
						</p>

						<div className="mx-auto max-w-2xl space-y-6 text-lg leading-relaxed text-text-muted">
							{post.body.map((paragraph, index) => (
								<p key={index}>{paragraph}</p>
							))}
						</div>
					</Container>
				</article>

				{related.length > 0 && (
					<section className="border-t border-border bg-secondary py-24">
						<Container>
							<h2 className="mb-10 text-center font-display text-2xl font-semibold text-text">Related Articles</h2>
							<div className="grid gap-6 sm:grid-cols-3">
								{related.map((relatedPost) => (
									<BlogCard key={relatedPost.id} post={relatedPost} />
								))}
							</div>
						</Container>
					</section>
				)}
			</main>
			<Footer />
			<BackToTop />
		</>
	);
}
