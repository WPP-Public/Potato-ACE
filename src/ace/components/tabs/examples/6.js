import { ATTRS, EVENTS } from '/ace/components/tabs/tabs.js';

document.addEventListener('DOMContentLoaded', () => {
	const tabsEl = document.getElementById('custom-events-tabs');
	const tablistEl = tabsEl.querySelector(`[${ATTRS.TABLIST}]`);

	const addTab = () => {
		const tabNumber = tablistEl.children.length + 1;
		const newTab = document.createElement('button');
		newTab.textContent = `Tab ${tabNumber}`;
		tablistEl.appendChild(newTab);

		const heading = document.createElement('h3');
		heading.textContent = `Panel ${tabNumber}`;
		const p = document.createElement('p');
		p.textContent = `This tab was added dynamically, after this Tabs component was initialised`;
		const newPanel = document.createElement('div');
		newPanel.setAttribute(ATTRS.PANEL, '');
		newPanel.appendChild(heading);
		newPanel.appendChild(p);
		tabsEl.appendChild(newPanel);
	};

	const removeTab = () => {
		tablistEl.removeChild(tablistEl.lastElementChild);
		tabsEl.removeChild(tabsEl.lastElementChild);
	};

	window.addEventListener('click', (e) => {
		const targetId = e.target.id;
		switch (targetId) {
			case 'prev-tab-btn':
			case 'next-tab-btn': {
				const event = EVENTS.IN[`SET_${targetId === 'prev-tab-btn' ? 'PREV' : 'NEXT'}_TAB`];
				tabsEl.dispatchEvent(new CustomEvent(event));
				break;
			}
			case 'add-tab-btn':
			case 'remove-tab-btn':
				if (targetId === 'add-tab-btn') {
					addTab();
				} else {
					removeTab();
				}
				tabsEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE));
				break;
		}
	});
});
