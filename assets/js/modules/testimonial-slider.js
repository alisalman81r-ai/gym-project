/* ============================================================
   TESTIMONIAL SLIDER
   Automatic sliding with pause-on-hover/focus, plus the manual
   dot controls already present in the Phase 3 markup. Slide
   visibility is toggled via inline `display` (overriding the
   Phase 4 CSS rule that statically hides all but the first),
   so no stylesheet changes are needed here.
============================================================ */

import { prefersReducedMotion } from '../utils/dom-utils.js';

const AUTOPLAY_INTERVAL_MS = 6000;

export function initTestimonialSlider() {
	const track = document.querySelector('.testimonials__track');
	const slides = track ? Array.from(track.querySelectorAll('.testimonial')) : [];
	const dots = Array.from(document.querySelectorAll('.testimonials__dot'));
	if (!track || slides.length < 2) return;

	let activeIndex = 0;
	let timerId = null;

	const showSlide = (index) => {
		activeIndex = (index + slides.length) % slides.length;

		slides.forEach((slide, i) => {
			const isActive = i === activeIndex;
			slide.style.display = isActive ? '' : 'none';
			if (isActive && !prefersReducedMotion()) {
				slide.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: 'ease-out' });
			}
		});

		dots.forEach((dot, i) => {
			const isActive = i === activeIndex;
			dot.classList.toggle('testimonials__dot--active', isActive);
			dot.setAttribute('aria-selected', String(isActive));
		});
	};

	const stopAutoplay = () => {
		if (timerId) clearInterval(timerId);
	};

	const startAutoplay = () => {
		stopAutoplay();
		if (prefersReducedMotion()) return;
		timerId = window.setInterval(() => showSlide(activeIndex + 1), AUTOPLAY_INTERVAL_MS);
	};

	dots.forEach((dot, i) => {
		dot.addEventListener('click', () => {
			showSlide(i);
			startAutoplay();
		});
	});

	track.addEventListener('mouseenter', stopAutoplay);
	track.addEventListener('mouseleave', startAutoplay);
	track.addEventListener('focusin', stopAutoplay);
	track.addEventListener('focusout', startAutoplay);

	showSlide(0);
	startAutoplay();
}
