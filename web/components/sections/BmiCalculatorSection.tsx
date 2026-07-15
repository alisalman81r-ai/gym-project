"use client";

import { Container } from "@/components/layout";
import { SectionTitle, Button } from "@/components/ui";

/**
 * UI structure only, per Phase 10 scope -- the calculate button
 * doesn't compute anything yet. Wiring the actual BMI formula and
 * result rendering is deferred to a later phase.
 */
export function BmiCalculatorSection() {
	return (
		<section className="py-24">
			<Container>
				<SectionTitle
					eyebrow="Free Tool"
					title="Check Your BMI"
					description="A quick starting point for your fitness journey — not a diagnosis. Our coaches will build your full assessment during your free tour."
				/>

				<form className="mx-auto max-w-md rounded-2xl border border-border bg-white/[0.03] p-8 backdrop-blur-md sm:p-10">
					<div className="grid gap-5 sm:grid-cols-2">
						<div className="flex flex-col gap-2">
							<label htmlFor="bmi-height" className="text-sm font-semibold text-text-muted">
								Height (cm)
							</label>
							<input
								id="bmi-height"
								name="height"
								type="number"
								min={100}
								max={250}
								className="rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none"
							/>
						</div>

						<div className="flex flex-col gap-2">
							<label htmlFor="bmi-weight" className="text-sm font-semibold text-text-muted">
								Weight (kg)
							</label>
							<input
								id="bmi-weight"
								name="weight"
								type="number"
								min={30}
								max={300}
								className="rounded-md border border-border bg-background px-4 py-3 text-sm text-text focus:border-primary focus:outline-none"
							/>
						</div>
					</div>

					<Button type="submit" className="mt-6 w-full">
						Calculate BMI
					</Button>

					{/* Result placeholder -- populated once the calculation is wired up */}
					<div className="mt-6 rounded-md border border-primary/40 p-4 text-center text-sm text-text-muted">
						Your result will appear here.
					</div>
				</form>
			</Container>
		</section>
	);
}
