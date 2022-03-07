import { EVENTS } from '/ace/components/menu/menu.js';

document.addEventListener('DOMContentLoaded', () => {
	const MENU_ID = 'custom-events-menu';
	const menuEl = document.getElementById(MENU_ID);
	const menuListEl = menuEl.querySelector('ul');

	const updateOptions = () => window.dispatchEvent(new CustomEvent(
		EVENTS.IN.UPDATE_OPTIONS,
		{'detail': {'id': MENU_ID}}
	));

	document.getElementById('add-option').addEventListener('click', () => {
		const optionEl = document.createElement('li');
		optionEl.textContent = 'Option';
		menuListEl.appendChild(optionEl);
		updateOptions();
	});

	document.getElementById('remove-option').addEventListener('click', () => {
		const lastOptionEl = menuListEl.querySelector('li:last-child');
		if (lastOptionEl) {
			menuListEl.removeChild(lastOptionEl);
			updateOptions();
		}
	});
});
