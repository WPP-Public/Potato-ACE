import { EVENTS } from '/ace/components/listbox/listbox.js';

document.addEventListener('DOMContentLoaded', () => {
	const LISTBOX_ID = 'ace-custom-events-listbox';
	const listboxEl = document.getElementById(LISTBOX_ID);

	const updateOptions = () => window.dispatchEvent(new CustomEvent(
		EVENTS.IN.UPDATE_OPTIONS,
		{'detail': {'id': LISTBOX_ID}},
	));

	document.getElementById('add-option')
		.addEventListener('click', () => {
			listboxEl.querySelector('ul').innerHTML += '<li>New Option</li>';
			updateOptions();
		});

	document.getElementById('remove-option')
		.addEventListener('click', () => {
			const listboxListEl = listboxEl.querySelector('ul');
			const fistOptionEl = listboxListEl.querySelector('li');
			if (!fistOptionEl) {
				return;
			}
			listboxListEl.removeChild(fistOptionEl);
			updateOptions();
		});
});
