import { ATTRS, EVENTS } from '/ace/components/combobox/combobox.js';

document.addEventListener('DOMContentLoaded', () => {
	const COMBOBOX_ID = 'custom-events-combobox';
	const comboboxEl = document.getElementById(COMBOBOX_ID);
	const comboboxListEl = comboboxEl.querySelector(`[${ATTRS.LIST}]`);
	const selectOptionForm = document.getElementById('select-option-form');

	window.addEventListener('click', (e) => {
		switch (e.target.id) {
			case 'add-options-btn':
				for (let i = 0; i < 3; i++) {
					const newOption = document.createElement('li');
					newOption.textContent = 'New Option';
					comboboxListEl.appendChild(newOption);
				}
				window.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_OPTIONS, {'detail': {'id': COMBOBOX_ID}}));
				break;
			case 'show-list-btn':
				window.dispatchEvent(new CustomEvent(EVENTS.IN.SHOW_LIST, {'detail': {'id': COMBOBOX_ID}}));
				break;
			case 'hide-list-btn':
				window.dispatchEvent(new CustomEvent(EVENTS.IN.HIDE_LIST, {'detail': {'id': COMBOBOX_ID}}));
				break;
		}
	});

	selectOptionForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const optionNumber = +new FormData(e.target).get('option-number');
		const option = comboboxEl.querySelectorAll('li')[optionNumber - 1];
		if (!option) {
			return;
		}
		window.dispatchEvent(new CustomEvent(EVENTS.IN.SELECT_OPTION, {
			'detail': {
				'id': COMBOBOX_ID,
				'optionId': option.id,
			}
		}));
	});
});
