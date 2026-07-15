/* ============================================================
   FOOTER NEWSLETTER FORM
   Wires the footer signup to the shared validator and shows an
   inline confirmation in place of the input row on success.
   (There's no backend yet — this is the client-side half of
   what a later phase would POST somewhere.)
============================================================ */

import { initFormValidation } from './form-validation.js';

export function initNewsletterForm() {
	const form = document.querySelector('.footer__newsletter');
	if (!form) return;

	initFormValidation(form, (validatedForm) => {
		const row = validatedForm.querySelector('.footer__newsletter-row');
		if (!row) return;

		row.innerHTML = '';
		const message = document.createElement('p');
		message.textContent = "Thank you — you're on the list.";
		Object.assign(message.style, { color: 'var(--primary-color)', fontWeight: '600', margin: '0' });
		row.appendChild(message);
	});
}
