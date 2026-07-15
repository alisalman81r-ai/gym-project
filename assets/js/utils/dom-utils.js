/* ============================================================
   DOM UTILITIES
   Small, dependency-free helpers shared across every module.
============================================================ */

/** Runs `fn` once the DOM is parsed, even if it already is. */
export const onReady = (fn) => {
	if (document.readyState !== 'loading') fn();
	else document.addEventListener('DOMContentLoaded', fn, { once: true });
};

/** True when the visitor has requested reduced motion at the OS level. */
export const prefersReducedMotion = () =>
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Wraps a scroll/resize handler so it runs at most once per animation frame. */
export const rafThrottle = (fn) => {
	let ticking = false;
	return (...args) => {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			fn(...args);
			ticking = false;
		});
	};
};

/**
 * Minimal focus trap for full-screen overlays (the mobile drawer).
 * Returns a cleanup function that releases the trap.
 */
export const trapFocus = (container) => {
	const focusable = Array.from(
		container.querySelectorAll(
			'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
		)
	);
	if (!focusable.length) return () => {};

	const first = focusable[0];
	const last = focusable[focusable.length - 1];

	const handleKeydown = (event) => {
		if (event.key !== 'Tab') return;
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	};

	container.addEventListener('keydown', handleKeydown);
	return () => container.removeEventListener('keydown', handleKeydown);
};
