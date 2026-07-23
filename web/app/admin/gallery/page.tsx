import { Container } from "@/components/layout";
import { GalleryAdminPanel } from "@/components/admin/GalleryAdminPanel";
import { listGalleryImages } from "@/lib/store/gallery";
import { addGalleryImageAction, deleteGalleryImageAction } from "./actions";

export const metadata = { title: "Manage Gallery" };

// Reads the live gallery for editing -- must not be statically cached.
export const dynamic = "force-dynamic";

export default function AdminGalleryPage() {
	const images = listGalleryImages();

	return (
		<main className="py-16">
			<Container className="max-w-5xl">
				<h1 className="mb-2 font-display text-3xl font-bold text-text">Gallery</h1>
				<p className="mb-8 text-sm text-text-muted">
					Add or remove the photos shown on the public gallery page.
				</p>
				<GalleryAdminPanel images={images} addAction={addGalleryImageAction} deleteAction={deleteGalleryImageAction} />
			</Container>
		</main>
	);
}
