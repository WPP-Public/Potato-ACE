import {EVENTS} from '/ace/components/carousel/carousel.js';

window.addEventListener('click', (e) => {
	const targetId = e.target.id;
	switch(targetId) {
		case 'start-auto-slide-show-custom-event-btn':
		case 'stop-auto-slide-show-custom-event-btn': {
			const event = targetId === 'start-auto-slide-show-custom-event-btn' ?
				EVENTS.IN.START_AUTO_SLIDE_SHOW :
				EVENTS.IN.STOP_AUTO_SLIDE_SHOW;
			window.dispatchEvent(new CustomEvent(event, {
				'detail': {
					'id': 'auto-carousel',
				}
			}));
			break;
		}
	}
});
