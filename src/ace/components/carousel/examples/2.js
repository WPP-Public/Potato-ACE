import {ATTRS, EVENTS} from '/ace/components/carousel/carousel.js';

document.addEventListener('DOMContentLoaded', () => {
	const CAROUSEL_ID = 'ace-custom-events-carousel';
	const carouselEl = document.getElementById(CAROUSEL_ID);
	const slidesWrapper = carouselEl.querySelector(`[${ATTRS.SLIDES}]`);

	const addSlide = () => {
		const headingEl = document.createElement('h2');
		headingEl.textContent = `Dynamically added Slide`;
		const p = document.createElement('p');
		p.textContent = `This slide was added dynamically, after this Carousel was initialised.`;
		const newSlideEl = document.createElement('div');
		newSlideEl.appendChild(headingEl);
		newSlideEl.appendChild(p);
		slidesWrapper.appendChild(newSlideEl);
		window.dispatchEvent(new CustomEvent(
			EVENTS.IN.UPDATE_SLIDES,
			{'detail': {'id': CAROUSEL_ID}},
		));
	};

	window.addEventListener('click', (e) => {
		const targetId = e.target.id;
		switch(targetId) {
			case 'prev-slide-btn':
			case 'next-slide-btn': {
				const event = EVENTS.IN[`SET_${targetId === 'prev-slide-btn' ? 'PREV' : 'NEXT'}_SLIDE`];
				window.dispatchEvent(new CustomEvent(
					event,
					{'detail': {'id': CAROUSEL_ID}},
				));
				break;
			}
			case 'add-slide-btn':
			case 'remove-slide-btn':
				if (targetId === 'add-slide-btn') {
					addSlide();
				} else {
					slidesWrapper.removeChild(slidesWrapper.lastElementChild);
				}
				window.dispatchEvent(new CustomEvent(
					EVENTS.IN.UPDATE_SLIDES,
					{'detail': {'id': CAROUSEL_ID}},
				));
				break;
		}
	});
});
