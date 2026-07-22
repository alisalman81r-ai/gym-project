"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/layout";
import { SectionTitle, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { scaleIn } from "@/lib/animations";

type UnitSystem = "metric" | "imperial";
type Gender = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "athlete";
type CategoryTone = "underweight" | "healthy" | "overweight" | "obese";

interface BmiResult {
	bmi: number;
	category: string;
	categoryTone: CategoryTone;
	categoryColor: string;
	healthyRangeLabel: string;
	bmr: number;
	tdee: number;
	bodyFatPercent: number;
}

const ACTIVITY_LEVELS: Record<ActivityLevel, { label: string; multiplier: number }> = {
	sedentary: { label: "Sedentary — little or no exercise", multiplier: 1.2 },
	light: { label: "Light — exercise 1–3 days/week", multiplier: 1.375 },
	moderate: { label: "Moderate — exercise 3–5 days/week", multiplier: 1.55 },
	active: { label: "Active — exercise 6–7 days/week", multiplier: 1.725 },
	athlete: { label: "Athlete — twice-a-day training", multiplier: 1.9 },
};

const CM_PER_INCH = 2.54;
const KG_PER_LB = 0.45359237;
const BMI_SCALE_MIN = 15;
const BMI_SCALE_MAX = 40;

const CATEGORY_BANDS: Array<{ tone: CategoryTone; label: string; from: number; to: number; color: string }> = [
	{ tone: "underweight", label: "Underweight", from: BMI_SCALE_MIN, to: 18.5, color: "#5b84a8" },
	{ tone: "healthy", label: "Healthy Range", from: 18.5, to: 25, color: "#5c8a5c" },
	{ tone: "overweight", label: "Overweight", from: 25, to: 30, color: "#c9a227" },
	{ tone: "obese", label: "Obese", from: 30, to: BMI_SCALE_MAX, color: "#a64b4b" },
];

const GAUGE_GRADIENT = (() => {
	const range = BMI_SCALE_MAX - BMI_SCALE_MIN;
	const stops = CATEGORY_BANDS.flatMap((band) => {
		const fromPct = ((band.from - BMI_SCALE_MIN) / range) * 100;
		const toPct = ((band.to - BMI_SCALE_MIN) / range) * 100;
		return [`${band.color} ${fromPct}%`, `${band.color} ${toPct}%`];
	});
	return `linear-gradient(to right, ${stops.join(", ")})`;
})();

function categorize(bmi: number) {
	return CATEGORY_BANDS.find((band) => bmi < band.to) ?? CATEGORY_BANDS[CATEGORY_BANDS.length - 1];
}

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

const inputClasses =
	"w-full rounded-md border border-border/80 bg-secondary-light px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";

function segmentedButtonClasses(active: boolean) {
	return cn(
		"flex-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
		active ? "bg-gradient-to-br from-primary-light to-primary text-background shadow-gold" : "text-text-muted hover:text-text"
	);
}

/**
 * BMI = weight(kg) / height(m)^2, shown against a WHO category gauge
 * alongside BMR (Mifflin-St Jeor) and TDEE (BMR x activity multiplier)
 * and an estimated body-fat % (Deurenberg formula) -- all standard
 * population-level formulas, not a substitute for an in-person assessment.
 */
export function BmiCalculatorSection() {
	const formRef = useRef<HTMLFormElement>(null);
	const [unit, setUnit] = useState<UnitSystem>("metric");
	const [gender, setGender] = useState<Gender>("male");
	const [activity, setActivity] = useState<ActivityLevel>("moderate");
	const [result, setResult] = useState<BmiResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const age = Number(formData.get("age"));

		let heightCm: number;
		let weightKg: number;

		if (unit === "metric") {
			heightCm = Number(formData.get("height"));
			weightKg = Number(formData.get("weight"));
		} else {
			const feet = Number(formData.get("heightFt"));
			const inches = Number(formData.get("heightIn"));
			heightCm = (feet * 12 + inches) * CM_PER_INCH;
			weightKg = Number(formData.get("weightLb")) * KG_PER_LB;
		}

		if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0 || !age || age <= 0) {
			setError("Please fill in every field with a valid, positive number.");
			setResult(null);
			return;
		}

		const heightM = heightCm / 100;
		const bmi = weightKg / (heightM * heightM);
		const band = categorize(bmi);

		const bmr =
			gender === "male"
				? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
				: 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
		const tdee = bmr * ACTIVITY_LEVELS[activity].multiplier;
		const bodyFatPercent = 1.2 * bmi + 0.23 * age - 10.8 * (gender === "male" ? 1 : 0) - 5.4;

		const minHealthyKg = 18.5 * heightM * heightM;
		const maxHealthyKg = 24.9 * heightM * heightM;
		const healthyRangeLabel =
			unit === "metric"
				? `${minHealthyKg.toFixed(1)}–${maxHealthyKg.toFixed(1)} kg`
				: `${(minHealthyKg / KG_PER_LB).toFixed(0)}–${(maxHealthyKg / KG_PER_LB).toFixed(0)} lbs`;

		setError(null);
		setResult({
			bmi: Math.round(bmi * 10) / 10,
			category: band.label,
			categoryTone: band.tone,
			categoryColor: band.color,
			healthyRangeLabel,
			bmr: Math.round(bmr),
			tdee: Math.round(tdee),
			bodyFatPercent: Math.max(0, Math.round(bodyFatPercent * 10) / 10),
		});
	}

	function handleReset() {
		formRef.current?.reset();
		setResult(null);
		setError(null);
		setUnit("metric");
		setGender("male");
		setActivity("moderate");
	}

	const markerPercent = result
		? clamp(((result.bmi - BMI_SCALE_MIN) / (BMI_SCALE_MAX - BMI_SCALE_MIN)) * 100, 0, 100)
		: 0;

	return (
		<section className="py-24">
			<Container>
				<SectionTitle
					eyebrow="Free Tool"
					title="Advanced BMI & Body Metrics Calculator"
					description="Go beyond a single number: your healthy weight range, estimated body fat, resting metabolic rate, and daily calorie needs. A starting point, not a diagnosis — our coaches build your full assessment during your free tour."
				/>

				<div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2 lg:items-start">
					<form
						ref={formRef}
						onSubmit={handleSubmit}
						noValidate
						className="rounded-2xl border border-border bg-white/[0.03] p-8 backdrop-blur-md sm:p-10"
					>
						<div className="mb-6 flex rounded-full border border-border bg-secondary-light p-1">
							<button type="button" onClick={() => setUnit("metric")} className={segmentedButtonClasses(unit === "metric")}>
								Metric
							</button>
							<button type="button" onClick={() => setUnit("imperial")} className={segmentedButtonClasses(unit === "imperial")}>
								Imperial
							</button>
						</div>

						<div className="grid gap-5 sm:grid-cols-2">
							{unit === "metric" ? (
								<div className="flex flex-col gap-2">
									<label htmlFor="bmi-height" className="text-sm font-semibold text-text-muted">
										Height (cm)
									</label>
									<input id="bmi-height" name="height" type="number" min={100} max={250} className={inputClasses} />
								</div>
							) : (
								<div className="flex flex-col gap-2">
									<span className="text-sm font-semibold text-text-muted">Height (ft / in)</span>
									<div className="flex gap-2">
										<input
											aria-label="Height (feet)"
											name="heightFt"
											type="number"
											min={3}
											max={8}
											placeholder="ft"
											className={inputClasses}
										/>
										<input
											aria-label="Height (inches)"
											name="heightIn"
											type="number"
											min={0}
											max={11}
											placeholder="in"
											className={inputClasses}
										/>
									</div>
								</div>
							)}

							<div className="flex flex-col gap-2">
								<label htmlFor="bmi-weight" className="text-sm font-semibold text-text-muted">
									Weight ({unit === "metric" ? "kg" : "lbs"})
								</label>
								<input
									id="bmi-weight"
									name={unit === "metric" ? "weight" : "weightLb"}
									type="number"
									min={unit === "metric" ? 30 : 66}
									max={unit === "metric" ? 300 : 660}
									className={inputClasses}
								/>
							</div>

							<div className="flex flex-col gap-2">
								<label htmlFor="bmi-age" className="text-sm font-semibold text-text-muted">
									Age
								</label>
								<input id="bmi-age" name="age" type="number" min={15} max={100} className={inputClasses} />
							</div>

							<div className="flex flex-col gap-2">
								<span className="text-sm font-semibold text-text-muted">Gender</span>
								<div className="flex rounded-full border border-border bg-secondary-light p-1">
									<button
										type="button"
										onClick={() => setGender("male")}
										className={segmentedButtonClasses(gender === "male")}
									>
										Male
									</button>
									<button
										type="button"
										onClick={() => setGender("female")}
										className={segmentedButtonClasses(gender === "female")}
									>
										Female
									</button>
								</div>
							</div>
						</div>

						<div className="mt-5 flex flex-col gap-2">
							<label htmlFor="bmi-activity" className="text-sm font-semibold text-text-muted">
								Activity Level
							</label>
							<select
								id="bmi-activity"
								value={activity}
								onChange={(event) => setActivity(event.target.value as ActivityLevel)}
								className={inputClasses}
							>
								{Object.entries(ACTIVITY_LEVELS).map(([key, meta]) => (
									<option key={key} value={key}>
										{meta.label}
									</option>
								))}
							</select>
						</div>

						<div className="mt-6 flex gap-3">
							<Button type="submit" className="flex-1">
								Calculate
							</Button>
							<Button type="button" variant="secondary" onClick={handleReset}>
								Reset
							</Button>
						</div>

						{error && <p className="mt-4 text-center text-sm text-error">{error}</p>}
					</form>

					<AnimatePresence mode="wait" initial={false}>
						{result ? (
							<motion.div
								key="result"
								variants={scaleIn}
								initial="hidden"
								animate="visible"
								exit={{ opacity: 0, scale: 0.96 }}
								role="status"
								aria-live="polite"
								className="rounded-2xl border border-primary/40 bg-white/[0.03] p-8 backdrop-blur-md sm:p-10"
							>
								<div className="text-center">
									<p className="font-display text-5xl font-bold text-text">{result.bmi}</p>
									<p
										className="mt-1 text-sm font-semibold uppercase tracking-wider"
										style={{ color: result.categoryColor }}
									>
										{result.category}
									</p>
								</div>

								<div className="relative mt-8 h-3 rounded-full" style={{ background: GAUGE_GRADIENT }}>
									<motion.div
										className="absolute -top-1.5 h-6 w-1.5 -translate-x-1/2 rounded-full bg-text shadow-[0_0_0_3px_rgba(0,0,0,0.4)]"
										initial={{ left: "0%" }}
										animate={{ left: `${markerPercent}%` }}
										transition={{ duration: 0.6, ease: "easeOut" }}
									/>
								</div>
								<div className="mt-2 flex justify-between text-[0.65rem] uppercase tracking-wider text-text-subtle">
									<span>{BMI_SCALE_MIN}</span>
									<span>{BMI_SCALE_MAX}+</span>
								</div>

								<div className="mt-8 grid grid-cols-2 gap-4">
									<div className="rounded-lg border border-border p-4">
										<p className="text-[0.65rem] uppercase tracking-wider text-text-subtle">Healthy Weight Range</p>
										<p className="mt-1 font-display text-lg font-semibold text-text">{result.healthyRangeLabel}</p>
									</div>
									<div className="rounded-lg border border-border p-4">
										<p className="text-[0.65rem] uppercase tracking-wider text-text-subtle">BMR (at rest)</p>
										<p className="mt-1 font-display text-lg font-semibold text-text">{result.bmr} kcal</p>
									</div>
									<div className="rounded-lg border border-border p-4">
										<p className="text-[0.65rem] uppercase tracking-wider text-text-subtle">Daily Calories (TDEE)</p>
										<p className="mt-1 font-display text-lg font-semibold text-text">{result.tdee} kcal</p>
									</div>
									<div className="rounded-lg border border-border p-4">
										<p className="text-[0.65rem] uppercase tracking-wider text-text-subtle">Est. Body Fat</p>
										<p className="mt-1 font-display text-lg font-semibold text-text">{result.bodyFatPercent}%</p>
									</div>
								</div>

								<p className="mt-6 text-center text-xs text-text-subtle">
									Estimates from standard population formulas (Mifflin-St Jeor, Deurenberg) — not a substitute for an
									in-person body composition assessment.
								</p>
							</motion.div>
						) : (
							<motion.div
								key="placeholder"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border p-10 text-center text-text-subtle"
							>
								<p className="text-sm">
									Fill in your details and hit Calculate to see your full breakdown — BMI, healthy weight range, BMR,
									daily calorie needs, and estimated body fat.
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</Container>
		</section>
	);
}
