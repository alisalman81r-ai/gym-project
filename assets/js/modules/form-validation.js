/* ============================================================
   FORM VALIDATION
   Generic Constraint-Validation-API wrapper: intercepts submit,
   renders on-brand inline error messages instead of native
   browser bubbles, and only calls `onValid` once every field
   passes. Reusable for any form on the site — today that's the
   BMI calculator and the footer newsletter signup; the full
   Contact page form will reuse this same module later.
============================================================ */

const ERROR_FLAG = 'formError';

function messageFor(field) {
	if (field.validity.valueMissing) return 'This field is required.';
	if (field.validity.typeMismatch && field.type === 'email') return 'Enter a valid email address.';
	if (field.validity.rangeUnderflow) return `Enter a value of at least ${field.min}.`;
	if (field.validity.rangeOverflow) return `Enter a value of at most ${field.max}.`;
	return 'Please check this field.';
}

/** Fields commonly live inside a `.form__row` or a footer newsletter row. */
function getRowContainer(field) {
	return field.closest('.form__row, .footer__newsletter-row') || field.parentElement;
}

function getErrorElement(field) {
	const container = getRowContainer(field);
	let error = container.nextElementSibling;

	if (!error || !error.dataset || error.dataset[ERROR_FLAG] !== 'true') {
		error = document.createElement('small');
		error.dataset[ERROR_FLAG] = 'true';
		Object.assign(error.style, {
			display: 'none',
			color: 'var(--color-error)',
			fontSize: '0.8rem',
			marginTop: '0.35rem',
		});
		container.insertAdjacentElement('afterend', error);
	}

	return error;
}

function showError(field) {
	const error = getErrorElement(field);
	error.textContent = messageFor(field);
	error.style.display = 'block';
	field.setAttribute('aria-invalid', 'true');
}

function clearError(field) {
	const container = getRowContainer(field);
	const error = container.nextElementSibling;
	if (error && error.dataset && error.dataset[ERROR_FLAG] === 'true') {
		error.style.display = 'none';
	}
	field.removeAttribute('aria-invalid');
}

/**
 * @param {HTMLFormElement} form
 * @param {(form: HTMLFormElement) => void} onValid called once every field passes
 */
export function initFormValidation(form, onValid) {
	if (!form) return;

	form.noValidate = true;
	const fields = Array.from(form.querySelectorAll('input, textarea, select'));

	fields.forEach((field) => {
		field.addEventListener('input', () => {
			if (field.validity.valid) clearError(field);
		});
	});

	form.addEventListener('submit', (event) => {
		event.preventDefault();

		let firstInvalid = null;
		fields.forEach((field) => {
			if (field.validity.valid) {
				clearError(field);
			} else {
				showError(field);
				firstInvalid = firstInvalid || field;
			}
		});

		if (firstInvalid) {
			firstInvalid.focus();
			return;
		}

		onValid?.(form);
	});
}
