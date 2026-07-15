/* ============================================================
   BACK TO TOP
   Wires the footer's existing button, and injects a floating
   twin that fades in after the user scrolls past the hero. The
   footer button alone can't demonstrate "show after scrolling" —
   it only ever becomes visible once a visitor has already
   scrolled that far, so the toggle would never be seen.
============================================================ */

import { rafThrottle } from '../utils/dom-utils.js';

const SHOW_AFTER_PX = 600;

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

function createFloatingButton() {
	const button = document.createElement('button');
	button.type = 'button';
	button.setAttribute('aria-label', 'Back to top');
	button.innerHTML = '&uarr;';
	button.tabIndex = -1;

	Object.assign(button.style, {
		position: 'fixed',
		right: '24px',
		bottom: '24px',
		zIndex: '90',
		width: '46px',
		height: '46px',
		borderRadius: '50%',
		border: 'none',
		background: 'linear-gradient(135deg, var(--color-gold-light), var(--primary-color))',
		color: 'var(--background-color)',
		fontSize: '1.2rem',
		fontWeight: '800',
		cursor: 'pointer',
		boxShadow: 'var(--shadow-md)',
		opacity: '0',
		pointerEvents: 'none',
		transform: 'translateY(12px)',
		transition: 'opacity 300ms ease, transform 300ms ease',
	});

	button.addEventListener('click', scrollToTop);
	document.body.appendChild(button);
	return button;
}

export function initBackToTop() {
	document.getElementById('backToTop')?.addEventListener('click', scrollToTop);

	const floatingButton = createFloatingButton();

	const updateVisibility = () => {
		const visible = window.scrollY > SHOW_AFTER_PX;
		floatingButton.style.opacity = visible ? '1' : '0';
		floatingButton.style.pointerEvents = visible ? 'auto' : 'none';
		floatingButton.style.transform = visible ? 'translateY(0)' : 'translateY(12px)';
		floatingButton.tabIndex = visible ? 0 : -1;
		floatingButton.setAttribute('aria-hidden', String(!visible));
	};

	window.addEventListener('scroll', rafThrottle(updateVisibility), { passive: true });
	updateVisibility();
}
