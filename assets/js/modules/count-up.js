/* ============================================================
   ANIMATED STATISTICS COUNTER
   Counts each `[data-count-to]` stat (Members, Trainers, Years,
   Awards) up from 0 once it scrolls into view. The trailing "+"
   is rendered by CSS (`.stats__number::after`) — this only ever
   writes the bare number.
============================================================ */

import { easeOutExpo, formatNumber } from '../utils/helpers.js';

const DURATION_MS = 1600;

function animateCounter(el) {
	const target = Number(el.dataset.countTo) || 0;
	const start = performance.now();

	const tick = (now) => {
		const progress = Math.min((now - start) / DURATION_MS, 1);
		el.textContent = formatNumber(target * easeOutExpo(progress));

		if (progress < 1) requestAnimationFrame(tick);
	};

	requestAnimationFrame(tick);
}

export function initCountUp() {
	const counters = document.querySelectorAll('.stats__number[data-count-to]');
	if (!counters.length || !('IntersectionObserver' in window)) return;

	const observer = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				animateCounter(entry.target);
				obs.unobserve(entry.target);
			});
		},
		{ threshold: 0.4 }
	);

	counters.forEach((counter) => observer.observe(counter));
}
