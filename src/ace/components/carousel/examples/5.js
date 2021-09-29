import {EVENTS} from '/ace/components/carousel/carousel.js';

document.addEventListener('DOMContentLoaded', () => {
	window.addEventListener('click', (e) => {
		const targetId = e.target.id;
		switch(targetId) {
			case 'start-auto-slide-show-custom-event-btn':
			case 'stop-auto-slide-show-custom-event-btn': {
				const event = EVENTS.IN[`${targetId === 'start-auto-slide-show-custom-event-btn' ? 'START' : 'STOP'}_AUTO_SLIDE_SHOW`];
				window.dispatchEvent(new CustomEvent(event, {'detail': {'id': 'auto-carousel'}}));
				break;
			}
		}
	});
});
