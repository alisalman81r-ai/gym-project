import type { Metadata } from "next";
import { Navbar, Footer, BackToTop } from "@/components/layout";
import {
	HeroSection,
	AboutPreviewSection,
	FeaturesSection,
	StatsSection,
	PricingSection,
	ClassesSection,
	EquipmentSection,
	TrainersSection,
	GallerySection,
	TestimonialsSection,
	BmiCalculatorSection,
	FaqSection,
	ContactCtaSection,
} from "@/components/sections";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = createMetadata({
	title: siteConfig.tagline,
	description: siteConfig.description,
	path: "/",
});

export default function Home() {
	return (
		<>
			<Navbar />
			<main>
				<HeroSection />
				<AboutPreviewSection />
				<FeaturesSection />
				<StatsSection />
				<PricingSection />
				<ClassesSection />
				<EquipmentSection />
				<TrainersSection />
				<GallerySection />
				<TestimonialsSection />
				<BmiCalculatorSection />
				<FaqSection />
				<ContactCtaSection />
			</main>
			<Footer />
			<BackToTop />
		</>
	);
}
