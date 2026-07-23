import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { getBlogPostById } from "@/lib/store/blog";
import { updateBlogPostAction } from "../../actions";

export const metadata = { title: "Edit Journal Post" };

// Reads the post live for editing -- must not be statically cached.
export const dynamic = "force-dynamic";

interface EditBlogPostPageProps {
	params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
	const { id } = await params;
	const post = getBlogPostById(Number(id));
	if (!post) notFound();

	const boundAction = updateBlogPostAction.bind(null, Number(id));

	return (
		<main className="py-16">
			<Container className="max-w-6xl">
				<Link
					href="/admin/journal"
					className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-text-muted transition-colors hover:text-text"
				>
					<ArrowLeft size={16} /> Back to Journal
				</Link>
				<h1 className="mb-8 font-display text-3xl font-bold text-text">Edit Journal Post</h1>
				<BlogPostForm action={boundAction} post={post} submitLabel="Save Changes" />
			</Container>
		</main>
	);
}
