import type { Metadata } from "next";
import { Navbar, Footer, BackToTop, Container } from "@/components/layout";
import { RevealImage, RevealGroup, RevealItem, CtaBanner, PageHeader } from "@/components/ui";
import { listGalleryImages } from "@/lib/store/gallery";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
	title: "Gallery",
	description: "A look inside Iron Elite Fitness Club — the facility, classes in session, and member moments.",
	path: "/gallery",
});

// Reflects gallery edits made in the admin panel without a rebuild.
export const dynamic = "force-dynamic";

export default function GalleryPage() {
	const images = listGalleryImages();

	return (
		<>
			<Navbar />
			<main>
				<PageHeader eyebrow="Gallery" title="Inside The Club" />

				<section className="py-24">
					<Container>
						{images.length === 0 ? (
							<p className="text-center text-text-muted">Gallery photos are coming soon.</p>
						) : (
						<RevealGroup className="grid grid-cols-2 gap-3 sm:grid-cols-3">
							{images.map((image, index) => (
								<RevealItem key={image.id}>
									<div
										className={`group relative overflow-hidden rounded-lg ${
											index % 2 === 0 ? "aspect-[4/5]" : "aspect-square"
										}`}
									>
										<RevealImage
											src={image.url}
											alt={image.alt}
											fill
											sizes="(min-width: 640px) 33vw, 50vw"
											className="object-cover group-hover:scale-105"
										/>
										{image.caption && (
											<div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-background/95 to-transparent p-4 pt-10 transition-transform duration-300 group-hover:translate-y-0">
												<p className="text-sm text-text">{image.caption}</p>
											</div>
										)}
									</div>
								</RevealItem>
							))}
						</RevealGroup>
						)}
					</Container>
				</section>

				<CtaBanner
					eyebrow="Follow Along"
					title="Follow Us For More"
					description="Daily training moments, member stories, and behind-the-scenes at the club."
					primaryCta={{ label: "Book a Tour", href: "/contact" }}
				/>
			</main>
			<Footer />
			<BackToTop />
		</>
	);
}
