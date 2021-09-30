import { EVENTS } from '/ace/components/tooltip/tooltip.js';

window.addEventListener('click', (e) => {
	const targetId = e.target.id;
	switch (targetId) {
		case 'hide-tooltip-btn':
		case 'show-tooltip-btn': {
			const event = targetId === 'hide-tooltip-btn' ? EVENTS.IN.HIDE : EVENTS.IN.SHOW;
			window.dispatchEvent(new CustomEvent(event, {
				'detail': {
					'id': 'custom-events-tooltip',
				}
			}));
			break;
		}
	}
});
