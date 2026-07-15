import Link from "next/link";
import { Container } from "./Container";
import { InstagramIcon, FacebookIcon } from "@/components/ui";
import { NAV_LINKS, CONTACT_LINK } from "@/constants/navigation";
import { siteConfig } from "@/constants/site";

const SOCIAL_LINKS = [
	{ label: "Instagram", href: "#", Icon: InstagramIcon },
	{ label: "Facebook", href: "#", Icon: FacebookIcon },
];

/** Static footer — brand, quick links, contact info, social. No interactivity needed. */
export function Footer() {
	return (
		<footer className="border-t border-border bg-background">
			<Container>
				<div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
					{/* Brand */}
					<div>
						<p className="font-display text-lg font-semibold text-text">{siteConfig.name}</p>
						<p className="mt-2 font-display italic text-text-muted">{siteConfig.tagline}</p>
						<ul className="mt-5 flex gap-3">
							{SOCIAL_LINKS.map(({ label, href, Icon }) => (
								<li key={label}>
									<Link
										href={href}
										aria-label={`${siteConfig.name} on ${label}`}
										className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text transition-colors hover:border-primary hover:bg-primary hover:text-background"
									>
										<Icon width={18} height={18} />
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Quick links */}
					<nav aria-label="Quick links">
						<h3 className="text-xs font-bold uppercase tracking-widest text-primary">Explore</h3>
						<ul className="mt-4 space-y-3">
							{NAV_LINKS.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className="text-sm text-text-muted transition-colors hover:text-text">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					{/* Contact */}
					<div>
						<h3 className="text-xs font-bold uppercase tracking-widest text-primary">Visit Us</h3>
						<address className="mt-4 space-y-1 text-sm not-italic text-text-muted">
							<p>128 Riverside Ave, Springfield</p>
							<p>
								<a href="tel:+15552104488" className="hover:text-text">
									(555) 210-4488
								</a>
							</p>
							<p>
								<a href="mailto:hello@ironelitefitnessclub.com" className="hover:text-text">
									hello@ironelitefitnessclub.com
								</a>
							</p>
						</address>
					</div>

					{/* Hours + contact CTA */}
					<div>
						<h3 className="text-xs font-bold uppercase tracking-widest text-primary">Hours</h3>
						<p className="mt-4 text-sm text-text-muted">Mon&ndash;Fri 5am&ndash;11pm</p>
						<p className="text-sm text-text-muted">Sat&ndash;Sun 7am&ndash;8pm</p>
						<Link href={CONTACT_LINK.href} className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
							{CONTACT_LINK.label} &rarr;
						</Link>
					</div>
				</div>

				<div className="flex flex-col items-center justify-between gap-4 border-t border-border py-6 text-xs text-text-subtle sm:flex-row">
					<p>
						&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
					</p>
					<div className="flex gap-6">
						<Link href="#" className="hover:text-text">
							Privacy Policy
						</Link>
						<Link href="#" className="hover:text-text">
							Terms of Service
						</Link>
					</div>
				</div>
			</Container>
		</footer>
	);
}
