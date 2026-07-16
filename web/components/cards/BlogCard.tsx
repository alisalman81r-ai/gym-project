import Link from "next/link";
import { Card, RevealImage } from "@/components/ui";
import type { BlogPost } from "@/types";

export interface BlogCardProps {
	post: BlogPost;
}

/** One article tile — used by the Journal listing page. */
export function BlogCard({ post }: BlogCardProps) {
	return (
		<Card className="group overflow-hidden p-0">
			<Link href={`/blog/${post.slug}`}>
				<div className="relative aspect-video w-full overflow-hidden">
					<RevealImage
						src={post.image.src}
						alt={post.image.alt}
						fill
						sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
						className="object-cover group-hover:scale-105"
					/>
				</div>
			</Link>
			<div className="p-6">
				<p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">{post.category}</p>
				<h3 className="mb-2 font-display text-lg font-semibold text-text">
					<Link href={`/blog/${post.slug}`} className="hover:text-primary">
						{post.title}
					</Link>
				</h3>
				<p className="mb-4 text-sm text-text-muted">{post.excerpt}</p>
				<p className="text-xs text-text-subtle">
					{post.author} &middot; {post.readTime}
				</p>
			</div>
		</Card>
	);
}
