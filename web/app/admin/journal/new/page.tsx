import { Container } from "@/components/layout";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { createBlogPostAction } from "../actions";

export const metadata = { title: "New Journal Post" };

export default function NewBlogPostPage() {
	return (
		<main className="py-16">
			<Container className="max-w-6xl">
				<h1 className="mb-8 font-display text-3xl font-bold text-text">New Journal Post</h1>
				<BlogPostForm action={createBlogPostAction} submitLabel="Publish Post" />
			</Container>
		</main>
	);
}
