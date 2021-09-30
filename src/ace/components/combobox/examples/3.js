import { ATTRS, EVENTS } from '/ace/components/combobox/combobox.js';

document.addEventListener('DOMContentLoaded', () => {
	const COMBOBOX_ID = 'custom-events-combobox';
	const comboboxEl = document.getElementById(COMBOBOX_ID);
	const comboboxListEl = comboboxEl.querySelector(`[${ATTRS.LIST}]`);
	const selectOptionForm = document.getElementById('select-option-form');

	window.addEventListener('click', (e) => {
		const targetId = e.target.id;
		switch (targetId) {
			case 'add-options-btn':
				for (let i = 0; i < 3; i++) {
					const newOption = document.createElement('li');
					newOption.textContent = 'New Option';
					comboboxListEl.appendChild(newOption);
				}
				window.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_OPTIONS, {
					'detail': {
						'id': COMBOBOX_ID,
					}
				}));
				break;
			case 'hide-list-btn':
			case 'show-list-btn': {
				const event = targetId === 'hide-list-btn' ? EVENTS.IN.HIDE_LIST : EVENTS.IN.SHOW_LIST;
				window.dispatchEvent(new CustomEvent(event, {
					'detail': {
						'id': COMBOBOX_ID,
					}
				}));
				break;
			}
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
