"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Trash2, ImagePlus, CheckCircle2, AlertCircle } from "lucide-react";
import type { GalleryFormState } from "@/app/admin/gallery/actions";
import type { GalleryImageRecord } from "@/lib/store/gallery";

const inputClasses =
	"w-full rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";

interface GalleryAdminPanelProps {
	images: GalleryImageRecord[];
	addAction: (prevState: GalleryFormState | undefined, formData: FormData) => Promise<GalleryFormState>;
	deleteAction: (id: number) => Promise<void>;
}

function AddButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-primary-light to-primary px-6 py-2.5 text-sm font-semibold text-background shadow-gold transition-opacity disabled:opacity-40"
		>
			<ImagePlus size={16} />
			{pending ? "Uploading..." : "Add Image"}
		</button>
	);
}

function DeleteButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			aria-label="Delete image"
			title="Delete image"
			onClick={(event) => {
				if (!window.confirm("Delete this image from the gallery? This cannot be undone.")) event.preventDefault();
			}}
			className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-error opacity-0 transition-opacity hover:bg-error hover:text-white group-hover:opacity-100 disabled:opacity-40"
		>
			<Trash2 size={15} />
		</button>
	);
}

/** Two panes: an upload form on top, then the current gallery grid with per-image delete. */
export function GalleryAdminPanel({ images, addAction, deleteAction }: GalleryAdminPanelProps) {
	const [state, formAction] = useActionState(addAction, undefined);
	const [preview, setPreview] = useState<string | null>(null);
	const formRef = useRef<HTMLFormElement>(null);

	// Clear the form + preview once an upload succeeds.
	useEffect(() => {
		if (state?.success) {
			formRef.current?.reset();
			setPreview(null);
		}
	}, [state?.success]);

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		setPreview(file ? URL.createObjectURL(file) : null);
	}

	return (
		<div className="space-y-10">
			<form ref={formRef} action={formAction} className="space-y-5 rounded-2xl border border-border bg-secondary p-6">
				<h2 className="font-display text-lg font-semibold text-text">Add a Photo</h2>

				<div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
					<div className="flex flex-col gap-2">
						<label htmlFor="image" className="text-sm font-semibold text-text-muted">
							Image file
						</label>
						{preview ? (
							// eslint-disable-next-line @next/next/no-img-element -- local object URL preview, not a remote asset
							<img src={preview} alt="" className="h-32 w-32 rounded-lg border border-border object-cover" />
						) : (
							<div className="flex h-32 w-32 items-center justify-center rounded-lg border border-dashed border-border text-text-subtle">
								<ImagePlus size={24} />
							</div>
						)}
						<input
							id="image"
							name="image"
							type="file"
							accept="image/*"
							required
							onChange={handleFileChange}
							className="w-full max-w-[8rem] text-xs text-text-muted"
						/>
					</div>

					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<label htmlFor="alt" className="text-sm font-semibold text-text-muted">
								Alt text <span className="text-text-subtle">(for accessibility)</span>
							</label>
							<input id="alt" name="alt" type="text" placeholder="e.g. Boxing class in session" className={inputClasses} />
						</div>
						<div className="flex flex-col gap-2">
							<label htmlFor="caption" className="text-sm font-semibold text-text-muted">
								Caption <span className="text-text-subtle">(optional, shown on hover)</span>
							</label>
							<input
								id="caption"
								name="caption"
								type="text"
								placeholder="e.g. Sarah — down 22lbs, 4 months in."
								className={inputClasses}
							/>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<AddButton />
					{state?.error && (
						<span className="flex items-center gap-1.5 text-sm font-semibold text-error">
							<AlertCircle size={15} /> {state.error}
						</span>
					)}
					{state?.success && (
						<span className="flex items-center gap-1.5 text-sm font-semibold text-primary">
							<CheckCircle2 size={15} /> Image added.
						</span>
					)}
				</div>
			</form>

			<div>
				<h2 className="mb-4 font-display text-lg font-semibold text-text">
					Current Gallery <span className="text-sm font-normal text-text-subtle">({images.length})</span>
				</h2>
				{images.length === 0 ? (
					<p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-text-muted">
						No images yet. Add your first photo above.
					</p>
				) : (
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
						{images.map((image) => (
							<div key={image.id} className="group relative overflow-hidden rounded-lg border border-border">
								<div className="aspect-square">
									{/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail for a dynamic list of local/uploaded paths */}
									<img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
								</div>
								{image.caption && (
									<p className="line-clamp-2 bg-secondary px-2 py-1.5 text-xs text-text-muted">{image.caption}</p>
								)}
								<form action={deleteAction.bind(null, image.id)}>
									<DeleteButton />
								</form>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
