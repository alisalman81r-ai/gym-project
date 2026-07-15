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
