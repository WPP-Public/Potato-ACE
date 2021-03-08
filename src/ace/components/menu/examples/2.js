import { EVENTS } from '/ace/components/menu/menu.js';

document.addEventListener('DOMContentLoaded', () => {
	const menuEl = document.getElementById('custom-events-menu');
	const menuListEl = menuEl.querySelector('ul');

	const updateOptions = () => menuEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_OPTIONS));

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
