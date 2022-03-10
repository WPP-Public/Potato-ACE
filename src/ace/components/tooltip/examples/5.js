import { EVENTS } from '/ace/components/tooltip/tooltip.js';

document.addEventListener('DOMContentLoaded', () => {
	const TOOLTIP_ID = 'ace-custom-events-tooltip';

	window.addEventListener('click', (e) => {
		const targetId = e.target.id;
		if (targetId === 'show-tooltip-btn' || targetId === 'hide-tooltip-btn') {
			window.dispatchEvent(new CustomEvent(
				EVENTS.IN[`${targetId === 'show-tooltip-btn' ? 'SHOW' : 'HIDE'}`],
				{'detail': {'id': TOOLTIP_ID}},
			));
		}
	});
});
