import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/constants/site";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { StructuredData } from "@/components/StructuredData";
import { ChatWidget } from "@/components/chat/ChatWidget";

const playfairDisplay = Playfair_Display({
	subsets: ["latin"],
	weight: ["500", "600", "700"],
	style: ["normal", "italic"],
	variable: "--font-playfair",
	display: "swap",
});

const inter = Inter({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-inter",
	display: "swap",
});

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	metadataBase: new URL(siteConfig.url),
	openGraph: {
		type: "website",
		siteName: siteConfig.name,
		title: siteConfig.name,
		description: siteConfig.description,
		url: siteConfig.url,
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${playfairDisplay.variable} ${inter.variable} scroll-smooth`}>
			<body className="font-body antialiased">
				<StructuredData />
				<MotionProvider>{children}</MotionProvider>
				<ChatWidget />
			</body>
		</html>
	);
}
