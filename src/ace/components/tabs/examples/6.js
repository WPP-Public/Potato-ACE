import { ATTRS, EVENTS } from '/ace/components/tabs/tabs.js';

document.addEventListener('DOMContentLoaded', () => {
	const TABS_ID = 'custom-events-tabs';
	const tabsEl = document.getElementById(TABS_ID);
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
			case 'next-tab-btn':
			case 'prev-tab-btn': {
				const event = targetId === 'next-tab-btn' ?
					EVENTS.IN.SET_NEXT_TAB :
					EVENTS.IN.SET_PREV_TAB;
				window.dispatchEvent(new CustomEvent(event, {
					'detail': {
						'id': TABS_ID,
					}
				}));
				break;
			}
			case 'add-tab-btn':
			case 'remove-tab-btn':
				if (targetId === 'add-tab-btn') {
					addTab();
				} else {
					removeTab();
				}
				window.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE, {
					'detail': {
						'id': TABS_ID,
					}
				}));
				break;
		}
	});
});
