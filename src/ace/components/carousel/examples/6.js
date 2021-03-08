import { ATTRS, EVENTS } from '/ace/components/carousel/carousel.js';

document.addEventListener('DOMContentLoaded', () => {
	// If user prefers reduced motion then do not animate
	if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
		return;
	}

	const CAROUSEL_ID = 'animated-carousel';
	const carouselEl = document.getElementById(CAROUSEL_ID);
	const carouselSlidesEl = carouselEl.querySelector(`[${ATTRS.SLIDES}]`);
	const carouselSlideEls = carouselEl.querySelectorAll(`[${ATTRS.SLIDE}]`);
	const slidesEdges = [];
	let selectedSlideIndex = +carouselEl.getAttribute(ATTRS.SELECTED_SLIDE) - 1;
	let scrollTimeout;

	// Hide non-selected slides on page load
	carouselSlideEls.forEach((slide, i) => {
		if (i === selectedSlideIndex) {
			return;
		}
		slide.setAttribute('aria-hidden', 'true');
		slide.classList.add(`${CAROUSEL_ID}__slide--hidden`);
	});

	// Store left edge x-coordinates of slides on page load and resize
	const getSlidesEdges = () => {
		carouselSlideEls.forEach((slide, i) => slidesEdges[i] = slide.offsetLeft - carouselSlidesEl.offsetLeft);
	};
	window.addEventListener('load', getSlidesEdges);
	window.addEventListener('resize', getSlidesEdges, { passive: true });

	// Start animation when slide changes
	window.addEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, (e) => {
		if (!e.detail || e.detail.id !== CAROUSEL_ID) {
			return;
		}
		clearTimeout(scrollTimeout);
		selectedSlideIndex = e.detail.currentlySelectedSlide - 1;
		carouselSlideEls.forEach((slide) => {
			// Prevent non-selected slides from being announced by screen reader due to aria-live="polite" on carouselSlidesEl
			slide.setAttribute('aria-hidden', 'true');
			slide.classList.remove(`${CAROUSEL_ID}__slide--hidden`);
		});
		carouselSlidesEl.scrollTo({ behavior: 'smooth', left: slidesEdges[selectedSlideIndex] });
	});

	// Hide non-selected slides when scrolling finishes
	carouselSlidesEl.addEventListener('scroll', () => {
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			carouselSlideEls.forEach((slide, i) => {
				if (i === selectedSlideIndex) {
					slide.removeAttribute('aria-hidden');
					return;
				}
				slide.classList.add(`${CAROUSEL_ID}__slide--hidden`);
			});
		}, 100);
	}, { passive: true });
});
