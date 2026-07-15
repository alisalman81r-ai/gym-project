/* ============================================================
   BMI CALCULATOR
   Reads height (cm) and weight (kg), computes BMI, and shows a
   result category. Validation is delegated to the shared
   form-validation module.
============================================================ */

import { initFormValidation } from './form-validation.js';

const CATEGORIES = [
	{ max: 18.5, label: 'Underweight', cssVar: '--primary-color' },
	{ max: 25, label: 'Normal Weight', cssVar: '--color-success' },
	{ max: 30, label: 'Overweight', cssVar: '--primary-color' },
	{ max: Infinity, label: 'Obese', cssVar: '--color-error' },
];

const getCategory = (bmi) => CATEGORIES.find((category) => bmi < category.max);

export function initBmiCalculator() {
	const form = document.getElementById('bmiForm');
	const heightInput = document.getElementById('bmiHeight');
	const weightInput = document.getElementById('bmiWeight');
	const result = document.getElementById('bmiResult');
	if (!form || !heightInput || !weightInput || !result) return;

	initFormValidation(form, () => {
		const heightMeters = Number(heightInput.value) / 100;
		const weightKg = Number(weightInput.value);
		const bmi = weightKg / (heightMeters * heightMeters);
		const category = getCategory(bmi);
		const accentColor = getComputedStyle(document.documentElement)
			.getPropertyValue(category.cssVar)
			.trim();

		result.hidden = false;
		result.style.borderColor = accentColor || '';
		result.innerHTML = `Your BMI is <strong>${bmi.toFixed(1)}</strong> &mdash; <strong>${category.label}</strong>`;
	});
}
