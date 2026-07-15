/* ============================================================
   SMOOTH SCROLL
   Handles any in-page anchor link (currently the skip-link;
   future pages that deep-link into a Home section, e.g.
   "index.html#membership", get this automatically). Accounts
   for the sticky header height so targets don't land underneath it.
============================================================ */

export function initSmoothScroll() {
	const header = document.getElementById('site-header');
	const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');

	links.forEach((link) => {
		link.addEventListener('click', (event) => {
			const target = document.querySelector(link.getAttribute('href'));
			if (!target) return;

			event.preventDefault();
			const headerOffset = header ? header.offsetHeight : 0;
			const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 16;

			window.scrollTo({ top, behavior: 'smooth' });

			// Move focus to the target for keyboard/screen-reader users.
			target.setAttribute('tabindex', '-1');
			target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
			window.setTimeout(() => target.focus({ preventScroll: true }), 400);
		});
	});
}
