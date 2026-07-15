/* ============================================================
   MEMBERSHIP CARD INTERACTION
   Hover lift/border is already handled by Phase 4 CSS. This adds
   a click/keyboard "highlight for comparison" state — a single
   active card at a time — independent of each card's real
   "Choose Plan" link, which still navigates normally.
============================================================ */

export function initPricingCards() {
	const cards = document.querySelectorAll('.pricing-card');
	if (!cards.length) return;

	cards.forEach((card) => {
		card.tabIndex = 0;
		card.setAttribute('role', 'button');
		card.setAttribute('aria-pressed', 'false');
		const planName = card.querySelector('.pricing-card__name')?.textContent ?? 'this plan';
		card.setAttribute('aria-label', `Highlight ${planName} for comparison`);
	});

	const setActive = (target) => {
		const alreadyActive = target.getAttribute('aria-pressed') === 'true';

		cards.forEach((card) => {
			const active = card === target && !alreadyActive;
			card.setAttribute('aria-pressed', String(active));
			card.style.borderColor = active ? 'var(--primary-color)' : '';
			card.style.boxShadow = active ? 'var(--shadow-gold)' : '';
		});
	};

	cards.forEach((card) => {
		card.addEventListener('click', (event) => {
			if (event.target.closest('a')) return; // let the real CTA link navigate
			setActive(card);
		});

		card.addEventListener('keydown', (event) => {
			if (event.key !== 'Enter' && event.key !== ' ') return;
			if (event.target.closest('a')) return;
			event.preventDefault();
			setActive(card);
		});
	});
}
