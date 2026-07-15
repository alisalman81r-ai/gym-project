/* ============================================================
   LOADING SCREEN
   A brief, on-brand loading moment shown once per session (not
   on every page navigation), skipped entirely under reduced
   motion. The overlay is built and styled entirely in JS since
   no preloader markup exists in the HTML.

   Note: because this script loads as a deferred module at the
   end of <body>, it runs after the page has already parsed —
   so this is a branded decorative moment, not a true
   flash-of-unstyled-content guard. A render-blocking preloader
   would need a small inline script in <head>, which is out of
   scope for a JS-only phase that can't touch the HTML.
============================================================ */

import { prefersReducedMotion } from '../utils/dom-utils.js';

const SESSION_KEY = 'ironElitePreloaderShown';
const MIN_VISIBLE_MS = 900;

export function initPreloader() {
	if (prefersReducedMotion() || sessionStorage.getItem(SESSION_KEY)) return;

	const overlay = document.createElement('div');
	overlay.setAttribute('aria-hidden', 'true');
	Object.assign(overlay.style, {
		position: 'fixed',
		inset: '0',
		zIndex: '9999',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		background: 'var(--background-color, #0A0A0A)',
		transition: 'opacity 500ms ease',
	});

	const wordmark = document.createElement('p');
	wordmark.textContent = 'IRON ELITE';
	Object.assign(wordmark.style, {
		margin: '0',
		fontFamily: "'Playfair Display', Georgia, serif",
		fontSize: '1.75rem',
		letterSpacing: '0.35em',
		color: 'var(--primary-color, #C9A227)',
		opacity: '0',
		transition: 'opacity 600ms ease, letter-spacing 900ms ease',
	});

	overlay.appendChild(wordmark);
	document.body.appendChild(overlay);

	requestAnimationFrame(() => {
		wordmark.style.opacity = '1';
		wordmark.style.letterSpacing = '0.5em';
	});

	window.setTimeout(() => {
		overlay.style.opacity = '0';
		overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
		sessionStorage.setItem(SESSION_KEY, 'true');
	}, MIN_VISIBLE_MS);
}
