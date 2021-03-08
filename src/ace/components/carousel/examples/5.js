import {EVENTS} from '/ace/components/carousel/carousel.js';

document.addEventListener('DOMContentLoaded', () => {
	const carouselEl = document.getElementById('auto-carousel');

	window.addEventListener('click', (e) => {
		const targetId = e.target.id;
		switch(targetId) {
			case 'start-auto-slide-show-custom-event-btn':
			case 'stop-auto-slide-show-custom-event-btn': {
				const event = EVENTS.IN[`${targetId === 'start-auto-slide-show-custom-event-btn' ? 'START' : 'STOP'}_AUTO_SLIDE_SHOW`];
				carouselEl.dispatchEvent(new CustomEvent(event));
				break;
			}
		}
	});
});
