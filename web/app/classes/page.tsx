import type { Metadata } from "next";
import { Navbar, Footer, BackToTop, Container } from "@/components/layout";
import { SectionTitle, CtaBanner } from "@/components/ui";
import { ClassCard } from "@/components/cards";
import { CLASSES } from "@/constants/classes";

export const metadata: Metadata = {
	title: "Classes & Programs",
	description: "Explore Iron Elite's training disciplines and find your fit.",
};

const SCHEDULE = [
	{ time: "6:00 AM", mon: "Strength", tue: "Boxing", wed: "Strength", thu: "Boxing", fri: "Strength", sat: "Cross Training", sun: "Recovery" },
	{ time: "9:00 AM", mon: "Yoga", tue: "HIIT", wed: "Yoga", thu: "HIIT", fri: "Yoga", sat: "HIIT", sun: "Yoga" },
	{ time: "5:30 PM", mon: "Cross Training", tue: "Strength", wed: "Cross Training", thu: "Strength", fri: "Cross Training", sat: "—", sun: "—" },
	{ time: "7:00 PM", mon: "Boxing", tue: "Recovery", wed: "Boxing", thu: "Recovery", fri: "Boxing", sat: "—", sun: "—" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export default function ClassesPage() {
	return (
		<>
			<Navbar />
			<main>
				<section className="bg-secondary pb-20 pt-36 text-center">
					<Container>
						<p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Training Disciplines</p>
						<h1 className="font-display text-4xl font-bold text-text sm:text-5xl">Classes Built For Every Goal</h1>
					</Container>
				</section>

				<section className="py-24">
					<Container>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
							{CLASSES.map((gymClass) => (
								<ClassCard key={gymClass.id} gymClass={gymClass} />
							))}
						</div>
					</Container>
				</section>

				<section className="bg-secondary py-24">
					<Container>
						<SectionTitle eyebrow="Plan Your Week" title="Weekly Class Schedule" />
						<div className="overflow-x-auto rounded-2xl border border-border">
							<table className="w-full min-w-[720px] border-collapse text-sm">
								<thead>
									<tr className="bg-background text-left">
										<th className="p-4 font-semibold text-primary">Time</th>
										{DAYS.map((day) => (
											<th key={day} className="p-4 text-center font-semibold text-text">
												{day}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{SCHEDULE.map((row) => (
										<tr key={row.time} className="border-t border-border">
											<th scope="row" className="p-4 text-left font-semibold text-text">
												{row.time}
											</th>
											<td className="p-4 text-center text-text-muted">{row.mon}</td>
											<td className="p-4 text-center text-text-muted">{row.tue}</td>
											<td className="p-4 text-center text-text-muted">{row.wed}</td>
											<td className="p-4 text-center text-text-muted">{row.thu}</td>
											<td className="p-4 text-center text-text-muted">{row.fri}</td>
											<td className="p-4 text-center text-text-muted">{row.sat}</td>
											<td className="p-4 text-center text-text-muted">{row.sun}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</Container>
				</section>

				<CtaBanner
					eyebrow="Not Sure?"
					title="Not Sure Where To Start?"
					description="Book a complimentary fitness assessment and we'll build your first plan together."
					primaryCta={{ label: "Book a Free Assessment", href: "/contact" }}
				/>
			</main>
			<Footer />
			<BackToTop />
		</>
	);
}
