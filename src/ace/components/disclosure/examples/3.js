import { EVENTS } from '/ace/components/disclosure/disclosure.js';

document.addEventListener('DOMContentLoaded', () => {
	const disclosureEl = document.getElementById('custom-events-disclosure');
	const customEventBtn = document.getElementById('toggle-custom-event-btn');

	customEventBtn.addEventListener('click', () => {
		disclosureEl.dispatchEvent(new CustomEvent(EVENTS.IN.TOGGLE));
	});
});
