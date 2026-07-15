/* ============================================================
   MAIN ENTRY POINT
   Loaded as a module from index.html. Every init() below guards
   on its own required elements, so this same file can be linked
   from every future page without throwing on missing markup.
============================================================ */

import { onReady } from './utils/dom-utils.js';

import { initPreloader } from './modules/preloader.js';
import { initNavbar } from './modules/navbar.js';
import { initMobileMenu } from './modules/mobile-menu.js';
import { initSmoothScroll } from './modules/smooth-scroll.js';
import { initScrollReveal } from './modules/scroll-reveal.js';
import { initCountUp } from './modules/count-up.js';
import { initPricingCards } from './modules/pricing-cards.js';
import { initTestimonialSlider } from './modules/testimonial-slider.js';
import { initAccordion } from './modules/accordion.js';
import { initBmiCalculator } from './modules/bmi-calculator.js';
import { initNewsletterForm } from './modules/newsletter-form.js';
import { initBackToTop } from './modules/back-to-top.js';

onReady(() => {
	initPreloader();
	initNavbar();
	initMobileMenu();
	initSmoothScroll();
	initScrollReveal();
	initCountUp();
	initPricingCards();
	initTestimonialSlider();
	initAccordion();
	initBmiCalculator();
	initNewsletterForm();
	initBackToTop();
});
