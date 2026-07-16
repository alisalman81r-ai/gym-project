import type { Metadata } from "next";
import { Navbar, Footer, BackToTop, Container } from "@/components/layout";
import { RevealImage, CtaBanner } from "@/components/ui";
import { GALLERY_IMAGES } from "@/constants/gallery";

export const metadata: Metadata = {
	title: "Gallery",
	description: "A look inside Iron Elite Fitness Club — the facility, classes in session, and member moments.",
};

export default function GalleryPage() {
	return (
		<>
			<Navbar />
			<main>
				<section className="bg-secondary pb-20 pt-36 text-center">
					<Container>
						<p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Gallery</p>
						<h1 className="font-display text-4xl font-bold text-text sm:text-5xl">Inside The Club</h1>
					</Container>
				</section>

				<section className="py-24">
					<Container>
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
							{GALLERY_IMAGES.map((image, index) => (
								<div
									key={image.id}
									className={`group relative overflow-hidden rounded-lg ${
										index % 2 === 0 ? "aspect-[4/5]" : "aspect-square"
									}`}
								>
									<RevealImage
										src={image.src}
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
							))}
						</div>
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
