/* ============================================================
   MOBILE NAVIGATION
   Hamburger toggle for the full-screen drawer built in Phase 3.
   Open/close animation runs via the Web Animations API so no
   CSS transition rules are needed for the [hidden]-gated panel.
============================================================ */

import { trapFocus } from '../utils/dom-utils.js';

const SLIDE_KEYFRAMES = [
	{ opacity: 0, transform: 'translateX(100%)' },
	{ opacity: 1, transform: 'translateX(0)' },
];
const ANIMATION_OPTIONS = { duration: 350, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' };

export function initMobileMenu() {
	const toggle = document.getElementById('navToggle');
	const drawer = document.getElementById('mobileNav');
	const closeButton = document.getElementById('mobileNavClose');
	if (!toggle || !drawer || !closeButton) return;

	let releaseFocusTrap = () => {};

	const open = () => {
		drawer.hidden = false;
		document.body.style.overflow = 'hidden';
		toggle.setAttribute('aria-expanded', 'true');
		toggle.setAttribute('aria-label', 'Close menu');

		drawer.animate(SLIDE_KEYFRAMES, ANIMATION_OPTIONS);
		releaseFocusTrap = trapFocus(drawer);
		closeButton.focus();
	};

	const close = () => {
		const animation = drawer.animate([...SLIDE_KEYFRAMES].reverse(), ANIMATION_OPTIONS);
		animation.onfinish = () => {
			drawer.hidden = true;
			document.body.style.overflow = '';
		};

		toggle.setAttribute('aria-expanded', 'false');
		toggle.setAttribute('aria-label', 'Open menu');
		releaseFocusTrap();
		toggle.focus();
	};

	toggle.addEventListener('click', () => (drawer.hidden ? open() : close()));
	closeButton.addEventListener('click', close);

	drawer.querySelectorAll('.mobile-nav__link').forEach((link) => {
		link.addEventListener('click', close);
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && !drawer.hidden) close();
	});
}
