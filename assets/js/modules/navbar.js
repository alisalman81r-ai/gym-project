/* ============================================================
   STICKY NAVBAR
   Deepens the glass effect once the page scrolls past the hero.
   Applied via inline style (not a CSS class) so this phase
   ships JS-only with zero stylesheet changes.
============================================================ */

import { rafThrottle } from '../utils/dom-utils.js';

const SCROLL_THRESHOLD = 80;

export function initNavbar() {
	const navbar = document.querySelector('.navbar');
	if (!navbar) return;

	const updateState = () => {
		const isScrolled = window.scrollY > SCROLL_THRESHOLD;
		navbar.style.background = isScrolled ? 'rgba(10, 10, 10, 0.94)' : '';
		navbar.style.boxShadow = isScrolled ? '0 8px 24px rgba(0, 0, 0, 0.35)' : '';
	};

	window.addEventListener('scroll', rafThrottle(updateState), { passive: true });
	updateState();
}
