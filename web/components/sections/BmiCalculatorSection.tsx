"use client";

import { useState, type FormEvent } from "react";
import { Container } from "@/components/layout";
import { SectionTitle, Button } from "@/components/ui";

interface BmiResult {
	value: number;
	category: string;
}

function categorize(bmi: number): string {
	if (bmi < 18.5) return "Underweight";
	if (bmi < 25) return "Healthy Range";
	if (bmi < 30) return "Overweight";
	return "Obese";
}

/** Computes BMI = weight(kg) / height(m)^2 and shows the WHO category band. */
export function BmiCalculatorSection() {
	const [result, setResult] = useState<BmiResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const heightCm = Number(formData.get("height"));
		const weightKg = Number(formData.get("weight"));

		if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
			setError("Please enter a valid height and weight.");
			setResult(null);
			return;
		}

		const heightM = heightCm / 100;
		const bmi = weightKg / (heightM * heightM);
		setError(null);
		setResult({ value: Math.round(bmi * 10) / 10, category: categorize(bmi) });
	}

	return (
		<section className="py-24">
			<Container>
				<SectionTitle
					eyebrow="Free Tool"
					title="Check Your BMI"
					description="A quick starting point for your fitness journey — not a diagnosis. Our coaches will build your full assessment during your free tour."
				/>

				<form
					onSubmit={handleSubmit}
					noValidate
					className="mx-auto max-w-md rounded-2xl border border-border bg-white/[0.03] p-8 backdrop-blur-md sm:p-10"
				>
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
								className="rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
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
								className="rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
							/>
						</div>
					</div>

					<Button type="submit" className="mt-6 w-full">
						Calculate BMI
					</Button>

					{error && <p className="mt-4 text-center text-sm text-error">{error}</p>}

					{result && (
						<div className="mt-6 rounded-md border border-primary/40 p-4 text-center" role="status" aria-live="polite">
							<p className="font-display text-2xl font-bold text-text">{result.value}</p>
							<p className="text-sm text-primary">{result.category}</p>
						</div>
					)}
				</form>
			</Container>
		</section>
	);
}
