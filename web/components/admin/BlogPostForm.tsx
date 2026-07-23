"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import { ImageUp } from "lucide-react";
import { Button } from "@/components/ui";
import type { BlogFormState } from "@/app/admin/journal/actions";
import type { BlogPost } from "@/types";

const initialState: BlogFormState = {};
const inputClasses =
	"w-full rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";

export interface BlogPostFormProps {
	action: (prevState: BlogFormState | undefined, formData: FormData) => Promise<BlogFormState>;
	post?: BlogPost;
	submitLabel: string;
}

/** Mirrors the server's estimate so the preview's read time matches what gets saved. */
function estimateReadTime(body: string): string {
	const words = body.trim().split(/\s+/).filter(Boolean).length;
	return `${Math.max(1, Math.round(words / 200))} min read`;
}

function formatDate(date: string): string {
	if (!date) return "";
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) return date;
	return parsed.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function BlogPostForm({ action, post, submitLabel }: BlogPostFormProps) {
	const [state, formAction, pending] = useActionState(action, initialState);

	// Controlled so the live preview re-renders on every keystroke, while the
	// `name` attributes still feed the server action on submit.
	const [title, setTitle] = useState(post?.title ?? "");
	const [category, setCategory] = useState(post?.category ?? "");
	const [author, setAuthor] = useState(post?.author ?? "");
	const [date, setDate] = useState(post?.date ?? "");
	const [readTime, setReadTime] = useState(post?.readTime ?? "");
	const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
	const [body, setBody] = useState(post?.body.join("\n\n") ?? "");
	const [imageAlt, setImageAlt] = useState(post?.image.alt ?? "");
	const [previewImage, setPreviewImage] = useState<string | null>(post?.image.src ?? null);
	const [fileName, setFileName] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file) {
			setPreviewImage(URL.createObjectURL(file));
			setFileName(file.name);
		}
	}

	const paragraphs = useMemo(
		() =>
			body
				.split(/\n\s*\n/)
				.map((paragraph) => paragraph.trim())
				.filter(Boolean),
		[body]
	);
	const effectiveReadTime = readTime.trim() || (body.trim() ? estimateReadTime(body) : "");

	return (
		<div className="grid gap-8 lg:grid-cols-2 lg:items-start">
			<form action={formAction} className="space-y-6 rounded-2xl border border-border bg-secondary p-8">
				<div className="flex flex-col gap-2">
					<label htmlFor="title" className="text-sm font-semibold text-text-muted">
						Title
					</label>
					<input
						id="title"
						name="title"
						type="text"
						value={title}
						onChange={(event) => setTitle(event.target.value)}
						required
						className={inputClasses}
					/>
				</div>

				<div className="grid gap-5 sm:grid-cols-2">
					<div className="flex flex-col gap-2">
						<label htmlFor="category" className="text-sm font-semibold text-text-muted">
							Category
						</label>
						<input
							id="category"
							name="category"
							type="text"
							value={category}
							onChange={(event) => setCategory(event.target.value)}
							placeholder="e.g. Training, Recovery, Nutrition"
							required
							className={inputClasses}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="author" className="text-sm font-semibold text-text-muted">
							Author
						</label>
						<input
							id="author"
							name="author"
							type="text"
							value={author}
							onChange={(event) => setAuthor(event.target.value)}
							required
							className={inputClasses}
						/>
					</div>
				</div>

				<div className="grid gap-5 sm:grid-cols-2">
					<div className="flex flex-col gap-2">
						<label htmlFor="date" className="text-sm font-semibold text-text-muted">
							Date
						</label>
						<input
							id="date"
							name="date"
							type="date"
							value={date}
							onChange={(event) => setDate(event.target.value)}
							required
							className={inputClasses}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="readTime" className="text-sm font-semibold text-text-muted">
							Read time <span className="text-text-subtle">(optional — auto-estimated if blank)</span>
						</label>
						<input
							id="readTime"
							name="readTime"
							type="text"
							value={readTime}
							onChange={(event) => setReadTime(event.target.value)}
							placeholder="e.g. 5 min read"
							className={inputClasses}
						/>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="excerpt" className="text-sm font-semibold text-text-muted">
						Excerpt <span className="text-text-subtle">(short summary shown on cards)</span>
					</label>
					<textarea
						id="excerpt"
						name="excerpt"
						rows={2}
						value={excerpt}
						onChange={(event) => setExcerpt(event.target.value)}
						required
						className={inputClasses}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="body" className="text-sm font-semibold text-text-muted">
						Body <span className="text-text-subtle">(separate paragraphs with a blank line)</span>
					</label>
					<textarea
						id="body"
						name="body"
						rows={12}
						value={body}
						onChange={(event) => setBody(event.target.value)}
						required
						className={`${inputClasses} font-mono leading-relaxed`}
					/>
				</div>

				<div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
					<div className="flex flex-col gap-2">
						<span className="text-sm font-semibold text-text-muted">Cover image</span>
						{/* Hidden native input; the styled button below triggers it. */}
						<input
							ref={fileInputRef}
							id="image"
							name="image"
							type="file"
							accept="image/*"
							required={!post}
							onChange={handleFileChange}
							className="hidden"
						/>
						<div className="flex items-center gap-3">
							{previewImage && (
								// eslint-disable-next-line @next/next/no-img-element -- local/object-URL thumbnail, not a remote asset
								<img src={previewImage} alt="" className="h-14 w-20 shrink-0 rounded-md border border-border object-cover" />
							)}
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-background"
							>
								<ImageUp size={16} />
								{post ? "Change Image" : "Upload Image"}
							</button>
						</div>
						{fileName ? (
							<p className="text-xs text-text-subtle">Selected: {fileName}</p>
						) : (
							post && <p className="text-xs text-text-subtle">Leave as-is to keep the current image.</p>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<label htmlFor="imageAlt" className="text-sm font-semibold text-text-muted">
							Image alt text <span className="text-text-subtle">(for accessibility)</span>
						</label>
						<input
							id="imageAlt"
							name="imageAlt"
							type="text"
							value={imageAlt}
							onChange={(event) => setImageAlt(event.target.value)}
							placeholder="Describe the cover image"
							className={inputClasses}
						/>
					</div>
				</div>

				{state?.error && <p className="text-sm text-error">{state.error}</p>}

				<Button type="submit" disabled={pending}>
					{pending ? "Saving..." : submitLabel}
				</Button>
			</form>

			{/* Live preview -- mirrors the public article layout (app/blog/[slug]) */}
			<div className="lg:sticky lg:top-6">
				<p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-subtle">
					<span className="h-1.5 w-1.5 rounded-full bg-primary" /> Live Preview
				</p>
				<div className="overflow-hidden rounded-2xl border border-border bg-background p-6">
					<div className="relative mb-6 aspect-video overflow-hidden rounded-xl bg-secondary-light">
						{previewImage ? (
							// eslint-disable-next-line @next/next/no-img-element -- local/object-URL preview, not a remote asset
							<img src={previewImage} alt={imageAlt} className="h-full w-full object-cover" />
						) : (
							<div className="flex h-full w-full items-center justify-center text-sm text-text-subtle">Cover image</div>
						)}
					</div>

					<p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
						{category || "Category"}
					</p>
					<h1 className="mb-3 font-display text-2xl font-bold text-text sm:text-3xl">
						{title || "Your article title"}
					</h1>
					<p className="mb-8 text-sm text-text-subtle">
						By {author || "Author"}
						{date && ` · ${formatDate(date)}`}
						{effectiveReadTime && ` · ${effectiveReadTime}`}
					</p>

					<div className="space-y-4 leading-relaxed text-text-muted">
						{paragraphs.length > 0 ? (
							paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
						) : (
							<p className="text-text-subtle">Start writing the body to see it here…</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
