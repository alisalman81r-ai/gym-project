/* ============================================================
   SCROLL REVEAL
   Fades each Home section up as it enters the viewport, and
   staggers any card-like children inside so grids cascade in.
   All styling is applied and then cleaned up via inline styles —
   no `.reveal` class exists in the stylesheet, so nothing here
   depends on (or breaks) the CSS authored in Phase 4.
============================================================ */

const SECTION_SELECTOR = 'main > section';
const STAGGER_SELECTOR = '.card, .trainer-card, .pricing-card, .class-card, .gallery-preview__image';
const STAGGER_STEP_MS = 90;
const TRANSITION = 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)';

function prepare(el, delayMs = 0) {
	el.style.opacity = '0';
	el.style.transform = 'translateY(24px)';
	el.style.transition = TRANSITION;
	el.style.transitionDelay = `${delayMs}ms`;
}

function reveal(el) {
	el.style.opacity = '1';
	el.style.transform = 'translateY(0)';

	// Hand control back to the stylesheet once the animation settles,
	// so later CSS-driven states (e.g. hover) aren't fighting inline styles.
	el.addEventListener(
		'transitionend',
		() => {
			el.style.transition = '';
			el.style.transitionDelay = '';
			el.style.transform = '';
			el.style.opacity = '';
		},
		{ once: true }
	);
}

export function initScrollReveal() {
	const sections = document.querySelectorAll(SECTION_SELECTOR);
	if (!sections.length || !('IntersectionObserver' in window)) return;

	sections.forEach((section) => prepare(section));

	const observer = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const section = entry.target;

				reveal(section);

				section.querySelectorAll(STAGGER_SELECTOR).forEach((item, index) => {
					prepare(item, index * STAGGER_STEP_MS);
					requestAnimationFrame(() => reveal(item));
				});

				obs.unobserve(section);
			});
		},
		{ threshold: 0.15 }
	);

	sections.forEach((section) => observer.observe(section));
}
