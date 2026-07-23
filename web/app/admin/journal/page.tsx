import Link from "next/link";
import { Container } from "@/components/layout";
import { listBlogPosts } from "@/lib/store/blog";
import { deleteBlogPostAction } from "./actions";

export const metadata = { title: "Manage Journal" };

// Reads live posts for editing -- must not be statically cached.
export const dynamic = "force-dynamic";

export default function AdminJournalPage() {
	const posts = listBlogPosts();

	return (
		<main className="py-16">
			<Container className="max-w-5xl">
				<div className="mb-8 flex items-center justify-between gap-4">
					<h1 className="font-display text-3xl font-bold text-text">Journal ({posts.length})</h1>
					<Link
						href="/admin/journal/new"
						className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-background"
					>
						+ New Post
					</Link>
				</div>

				<div className="overflow-x-auto rounded-2xl border border-border">
					<table className="w-full min-w-[720px] border-collapse text-sm">
						<thead>
							<tr className="border-b border-border bg-secondary text-left text-text-muted">
								<th className="p-3">Title</th>
								<th className="p-3">Category</th>
								<th className="p-3">Author</th>
								<th className="p-3">Date</th>
								<th className="p-3">Actions</th>
							</tr>
						</thead>
						<tbody>
							{posts.length === 0 && (
								<tr>
									<td colSpan={5} className="p-4 text-center text-text-muted">
										No posts yet. Create your first one.
									</td>
								</tr>
							)}
							{posts.map((post) => (
								<tr key={post.id} className="border-b border-border align-top">
									<td className="p-3 font-semibold text-text">{post.title}</td>
									<td className="p-3 text-text-muted">{post.category}</td>
									<td className="p-3 text-text-muted">{post.author}</td>
									<td className="p-3 text-text-subtle">{post.date}</td>
									<td className="p-3">
										<div className="flex items-center gap-4">
											<Link href={`/admin/journal/${post.id}/edit`} className="text-xs font-semibold text-primary hover:underline">
												Edit
											</Link>
											<Link href={`/blog/${post.slug}`} className="text-xs font-semibold text-text-muted hover:underline">
												View
											</Link>
											<form action={deleteBlogPostAction.bind(null, Number(post.id))}>
												<button
													type="submit"
													className="text-xs font-semibold text-error hover:underline"
												>
													Delete
												</button>
											</form>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Container>
		</main>
	);
}
