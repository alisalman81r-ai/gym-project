/* ============================================================
   FAQ ACCORDION
   Multi-open per the Phase 2 decision — each question toggles
   independently. Height animates via the Web Animations API so
   the `[hidden]`-gated panel doesn't need a CSS transition.
============================================================ */

const OPEN_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

function openPanel(trigger, panel) {
	trigger.setAttribute('aria-expanded', 'true');
	panel.hidden = false;

	const targetHeight = panel.scrollHeight;
	panel.style.overflow = 'hidden';

	const animation = panel.animate(
		[{ height: '0px' }, { height: `${targetHeight}px` }],
		{ duration: 350, easing: OPEN_EASING }
	);

	animation.onfinish = () => {
		panel.style.overflow = '';
		panel.style.height = '';
	};
}

function closePanel(trigger, panel) {
	trigger.setAttribute('aria-expanded', 'false');
	const startHeight = panel.scrollHeight;
	panel.style.overflow = 'hidden';

	const animation = panel.animate(
		[{ height: `${startHeight}px` }, { height: '0px' }],
		{ duration: 300, easing: OPEN_EASING }
	);

	animation.onfinish = () => {
		panel.hidden = true;
		panel.style.overflow = '';
		panel.style.height = '';
	};
}

export function initAccordion() {
	const triggers = document.querySelectorAll('.accordion__trigger');
	if (!triggers.length) return;

	triggers.forEach((trigger) => {
		const panel = document.getElementById(trigger.getAttribute('aria-controls'));
		if (!panel) return;

		trigger.addEventListener('click', () => {
			const isOpen = trigger.getAttribute('aria-expanded') === 'true';
			if (isOpen) closePanel(trigger, panel);
			else openPanel(trigger, panel);
		});
	});
}
