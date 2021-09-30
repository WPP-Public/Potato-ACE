import { EVENTS } from '/ace/components/select/select.js';

document.addEventListener('DOMContentLoaded', () => {
	const SELECT_ID = 'custom-events-select';
	const selectEl = document.getElementById(SELECT_ID);
	const selectListEl = selectEl.querySelector('ul');

	const updateOptions = () => {
		window.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_OPTIONS, {
			'detail': {
				'id': SELECT_ID,
			}
		}));
	};

	document.getElementById('add-option').addEventListener('click', () => {
		const optionEl = document.createElement('li');
		optionEl.textContent = 'Option';
		selectListEl.appendChild(optionEl);
		updateOptions();
	});

	document.getElementById('remove-option').addEventListener('click', () => {
		const lastOptionEl = selectListEl.querySelector('li:last-child');
		if (lastOptionEl) {
			selectListEl.removeChild(lastOptionEl);
			updateOptions();
		}
	});
});
