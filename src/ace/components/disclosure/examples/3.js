import { EVENTS } from '/ace/components/disclosure/disclosure.js';

document.addEventListener('DOMContentLoaded', () => {
	const customEventBtn = document.getElementById('toggle-custom-event-btn');

	customEventBtn.addEventListener('click', () => {
		window.dispatchEvent(new CustomEvent(EVENTS.IN.TOGGLE, {'detail': {'id': 'custom-events-disclosure'}}));
	});
});
