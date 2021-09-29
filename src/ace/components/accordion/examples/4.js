import {ATTRS, EVENTS} from '/ace/components/accordion/accordion.js';

document.addEventListener('DOMContentLoaded', () => {
	const ACCORDION_ID = 'custom-events-accordion';
	const accordionEl = document.getElementById(ACCORDION_ID);

	window.addEventListener('click', (e) => {
		let customEvent;
		const targetId = e.target.id;
		switch(targetId) {
			case 'hide-panel-btn':
			case 'show-panel-btn':
			case 'toggle-panel-btn': {
				const panelNumber = document.getElementById('panel-number').value;
				if (targetId === 'toggle-panel-btn') {
					customEvent = EVENTS.IN.TOGGLE_PANEL;
				} else {
					customEvent = EVENTS.IN[`${targetId === 'hide-panel-btn' ? 'HIDE' : 'SHOW'}_PANEL`];
				}
				window.dispatchEvent(new CustomEvent(customEvent, {
					'detail': {
						'id': ACCORDION_ID,
						'panelNumber': panelNumber,
					}
				}));
				break;
			}
			case 'show-panels-btn':
			case 'hide-panels-btn': {
				customEvent = EVENTS.IN[`${targetId === 'hide-panels-btn' ? 'HIDE' : 'SHOW'}_PANELS`];
				window.dispatchEvent(new CustomEvent(customEvent, {'detail': {'id': ACCORDION_ID}}));
				break;
			}
			case 'append-panel-btn': {
				const newTriggerEl = document.createElement('button');
				newTriggerEl.textContent = 'Dynamically added trigger';
				const newHeaderEl = document.createElement('h3');
				newHeaderEl.setAttribute(ATTRS.HEADER, '');
				newHeaderEl.append(newTriggerEl);

				const newPanelP = document.createElement('p');
				newPanelP.textContent = `Dynamically added panel`;
				const newPanelEl = document.createElement('div');
				newPanelEl.setAttribute(ATTRS.PANEL, '');
				newPanelEl.append(newPanelP);

				accordionEl.append(newHeaderEl);
				accordionEl.append(newPanelEl);
				window.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE, {'detail': {'id': ACCORDION_ID}}));
				break;
			}
			case 'remove-panel-btn': {
				const headerEl = accordionEl.querySelector(`[${ATTRS.HEADER}]`);
				const panelEl = accordionEl.querySelector(`[${ATTRS.PANEL}]`);
				accordionEl.removeChild(headerEl);
				accordionEl.removeChild(panelEl);
				window.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE, {'detail': {'id': ACCORDION_ID}}));
				break;
			}
		}
	});
});
