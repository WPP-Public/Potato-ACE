/* IMPORTS */
import { DISPLAY_NAME, KEYS, NAME, PAGE_VISIBILITY_API_STRINGS } from '../../common/constants.js';
import {
	autoID,
	getElByAttrOrSelector,
	getIndexBasedOnDirection,
	warnIfElHasNoAriaLabel
} from '../../common/functions.js';


/* CONSTANTS */
export const CAROUSEL = `${NAME}-carousel`;


export const ATTRS = {
	AUTO_SLIDE_SHOW: `${CAROUSEL}-auto-slide-show`,
	AUTO_SLIDE_SHOW_ACTIVE: `${CAROUSEL}-auto-slide-show-active`,
	AUTO_SLIDE_SHOW_BTN: `${CAROUSEL}-auto-slide-show-btn`,
	AUTO_SLIDE_SHOW_TIME: `${CAROUSEL}-auto-slide-show-time`,
	GO_TO_FIRST_SLIDE_LABEL: `${CAROUSEL}-go-to-first-slide-label`,
	GO_TO_LAST_SLIDE_LABEL: `${CAROUSEL}-go-to-last-slide-label`,
	GO_TO_NEXT_SLIDE_LABEL: `${CAROUSEL}-go-to-next-slide-label`,
	GO_TO_PREV_SLIDE_LABEL: `${CAROUSEL}-go-to-prev-slide-label`,
	INFINITE: `${CAROUSEL}-infinite`,
	NEXT_SLIDE_BTN: `${CAROUSEL}-next-btn`,
	PREV_SLIDE_BTN: `${CAROUSEL}-prev-btn`,
	SELECTED_SLIDE: `${CAROUSEL}-selected-slide`,
	SLIDE: `${CAROUSEL}-slide`,
	SLIDES: `${CAROUSEL}-slides`,
	SLIDE_ARIA_LABEL_INFIX: `${CAROUSEL}-slide-aria-label-infix`,
	SLIDE_PICKER: `${CAROUSEL}-slide-picker`,
	SLIDE_PICKER_BTN: `${CAROUSEL}-slide-picker-btn`,
	SLIDE_PICKER_BTN_ARIA_LABEL_PREFIX: `${CAROUSEL}-slide-picker-btn-aria-label-prefix`,
	SLIDE_SELECTED: `${CAROUSEL}-slide-selected`,
	START_AUTO_SLIDE_SHOW_LABEL: `${CAROUSEL}-start-auto-slide-show-label`,
	STOP_AUTO_SLIDE_SHOW_LABEL: `${CAROUSEL}-stop-auto-slide-show-label`,
	WITH_SLIDE_PICKER: `${CAROUSEL}-with-slide-picker`,
};


export const EVENTS = {
	IN: {
		SET_NEXT_SLIDE: `${CAROUSEL}-set-next-slide`,
		SET_PREV_SLIDE: `${CAROUSEL}-set-prev-slide`,
		START_AUTO_SLIDE_SHOW: `${CAROUSEL}-start-auto-slide-show`,
		STOP_AUTO_SLIDE_SHOW: `${CAROUSEL}-stop-auto-slide-show`,
		UPDATE_SLIDES: `${CAROUSEL}-update-slides`,
	},
	OUT: {
		AUTO_SLIDE_SHOW_STARTED: `${CAROUSEL}-auto-slide-show-started`,
		AUTO_SLIDE_SHOW_STOPPED: `${CAROUSEL}-auto-slide-show-stopped`,
		READY: `${CAROUSEL}-ready`,
		SELECTED_SLIDE_CHANGED: `${CAROUSEL}-selected-slide-changed`,
	}
};


export const DEFAULT_SLIDE_SHOW_TIME = 5000;


/* CLASS */
export default class Carousel extends HTMLElement {
	private autoSlideShowActive = false;
	private autoSlideShowBtn: HTMLButtonElement | null = null;
	private autoSlideShowCarousel = false;
	private autoSlideShowPaused = false;
	private autoSlideShowTime = DEFAULT_SLIDE_SHOW_TIME;
	private autoSlideShowTimer: number | undefined;
	private carouselHasSlidePicker = false;
	private goToFirstSlideLabel = 'Go to first slide';
	private goToLastSlideLabel = 'Go to last slide';
	private goToNextSlideLabel = 'Go to next slide';
	private goToPrevSlideLabel = 'Go to previous slide';
	private infinite = false;
	private initialised = false;
	private nextSlideBtn: HTMLButtonElement | null = null;
	private prevSlideBtn: HTMLButtonElement | null = null;
	private selectedSlideIndex = 0;
	private slideAriaLabelInfix = 'of';
	private slideCount = 0;
	private slideEls: NodeListOf<HTMLElement> | undefined;
	private slidePickerBtnAriaLabelPrefix = 'Slide';
	private slidePickerEl: HTMLElement | null = null;
	private slidesWrapper: HTMLElement | null = null;
	private startAutoSlideShowLabel = 'Start automatic slide show';
	private stopAutoSlideShowLabel = 'Stop automatic slide show';


	constructor() {
		super();


		/* CLASS METHOD BINDINGS */
		this.clickHandler = this.clickHandler.bind(this);
		this.customEventsHander = this.customEventsHander.bind(this);
		this.focusAndMouseHandler = this.focusAndMouseHandler.bind(this);
		this.initSlides = this.initSlides.bind(this);
		this.keydownHandler = this.keydownHandler.bind(this);
		this.selectSlide = this.selectSlide.bind(this);
		this.selectSlideBasedOnDirection = this.selectSlideBasedOnDirection.bind(this);
		this.setSlideAttributes = this.setSlideAttributes.bind(this);
		this.setNavBtnAttributes = this.setNavBtnAttributes.bind(this);
		this.setSelectedSlide = this.setSelectedSlide.bind(this);
		this.startAutoSlideShow = this.startAutoSlideShow.bind(this);
		this.stopAutoSlideShow = this.stopAutoSlideShow.bind(this);
		this.visibilityChangeHandler = this.visibilityChangeHandler.bind(this);
	}


	static get observedAttributes(): Array<string> {
		return [ATTRS.SELECTED_SLIDE, ATTRS.INFINITE];
	}


	private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		if (!this.initialised || oldValue === newValue) {
			return;
		}

		switch (name) {
			case ATTRS.SELECTED_SLIDE: {
				const selectedSlideNumber = +newValue;
				if (selectedSlideNumber) {
					this.selectSlide(selectedSlideNumber - 1);
				}
				break;
			}
			case ATTRS.INFINITE:
				this.infinite = (newValue === '');
				this.setNavBtnAttributes();
				break;
		}
	}


	public connectedCallback(): void {
		this.id = this.id || autoID(CAROUSEL);


		/* GET DOM ELEMENTS */
		// Automatic slide show toggle button
		this.autoSlideShowCarousel = this.hasAttribute(ATTRS.AUTO_SLIDE_SHOW);
		if (this.autoSlideShowCarousel) {
			this.autoSlideShowBtn = this.querySelector('button');

			if (!this.autoSlideShowBtn) {
				console.error(`${DISPLAY_NAME}: Carousel with ID ${this.id} has attribute ${ATTRS.AUTO_SLIDE_SHOW}, which makes it an automatic slide show. It therefore requires a descendant <button> element that is the first focusable element, needed to toggle the automatic slide show.`);
				return;
			}
		}

		// Slide picker
		this.slidePickerEl = this.querySelector(`[${ATTRS.SLIDE_PICKER}]`);
		this.carouselHasSlidePicker = !!this.slidePickerEl;

		// Slide wrapper
		const slidesWrapperSelector = this.slidePickerEl ? `#${this.id} > div:nth-of-type(2)` : `#${this.id} > div`;
		this.slidesWrapper = getElByAttrOrSelector(this, ATTRS.SLIDES, slidesWrapperSelector);
		if (!this.slidesWrapper) {
			this.slidesWrapper = document.createElement('div');
			this.appendChild(this.slidesWrapper);
		}

		// Previous and next slide buttons
		const prevSlideBtnSelector = this.autoSlideShowCarousel ? 'button:nth-of-type(2)' : 'button';
		const nextSlideBtnSelector = this.autoSlideShowCarousel ? 'button:nth-of-type(3)' : 'button:nth-of-type(2)';
		this.prevSlideBtn =
			this.querySelector(`button[${ATTRS.PREV_SLIDE_BTN}]`) ||
			this.querySelector(prevSlideBtnSelector);
		this.nextSlideBtn =
			this.querySelector(`button[${ATTRS.NEXT_SLIDE_BTN}]`) ||
			this.querySelector(nextSlideBtnSelector);

		if ((!this.prevSlideBtn || !this.nextSlideBtn) && !this.carouselHasSlidePicker) {
			console.error(`${DISPLAY_NAME}: Carousel with ID ${this.id} must contain either slide picker buttons or previous and next slide buttons.`);
			return;
		}


		/* GET DOM DATA */
		this.infinite = this.hasAttribute(ATTRS.INFINITE);

		let initiallySelectedSlideNumber = +(this.getAttribute(ATTRS.SELECTED_SLIDE) || '');
		if (!initiallySelectedSlideNumber) {
			initiallySelectedSlideNumber = 1;
			this.setAttribute(ATTRS.SELECTED_SLIDE, initiallySelectedSlideNumber.toString());
		}
		this.selectedSlideIndex = initiallySelectedSlideNumber - 1;

		// Automatic slide show
		if (this.autoSlideShowCarousel) {
			this.autoSlideShowTime = +(this.getAttribute(ATTRS.AUTO_SLIDE_SHOW_TIME) || '') || this.autoSlideShowTime;

			// Get user provided aria labels for auto slide show start and stop states or use default values
			this.stopAutoSlideShowLabel =
				this.autoSlideShowBtn?.getAttribute(ATTRS.STOP_AUTO_SLIDE_SHOW_LABEL) || this.stopAutoSlideShowLabel;
			this.startAutoSlideShowLabel =
				this.autoSlideShowBtn?.getAttribute(ATTRS.START_AUTO_SLIDE_SHOW_LABEL) || this.startAutoSlideShowLabel;
		}

		// Get user provided aria labels for the prev and next slide btns or use default values
		this.goToFirstSlideLabel = this.nextSlideBtn?.getAttribute(ATTRS.GO_TO_FIRST_SLIDE_LABEL) || this.goToFirstSlideLabel;
		this.goToLastSlideLabel = this.prevSlideBtn?.getAttribute(ATTRS.GO_TO_LAST_SLIDE_LABEL) || this.goToLastSlideLabel;
		this.goToNextSlideLabel = this.nextSlideBtn?.getAttribute(ATTRS.GO_TO_NEXT_SLIDE_LABEL) || this.goToNextSlideLabel;
		this.goToPrevSlideLabel = this.prevSlideBtn?.getAttribute(ATTRS.GO_TO_PREV_SLIDE_LABEL) || this.goToPrevSlideLabel;

		// For localisation, users can provide a string to prefix before the slide number in the slide picker button aria-label attributes, e.g. if this.slidePickerEl has attribute ace-carousel-slide-picker-btn-aria-label-prefix="Diapositiva" the aria labels of the slide picker buttons will be "Diapositiva n" where n is the slide number.
		if (this.carouselHasSlidePicker) {
			this.slidePickerBtnAriaLabelPrefix = this.slidePickerEl?.getAttribute(ATTRS.SLIDE_PICKER_BTN_ARIA_LABEL_PREFIX) || this.slidePickerBtnAriaLabelPrefix;
		}

		// For localisation, users can provide a string to infix between the slide number and slide count in the slide aria-label attributes, e.g. if this.slidesWrapper has attribute ace-carousel-slide-aria-label-infix="de" the aria labels of the slides will be "1 de N", "2 de N", ... "n de N" where n is the slide number and N is the slide count.
		this.slideAriaLabelInfix = this.slidesWrapper.getAttribute(ATTRS.SLIDE_ARIA_LABEL_INFIX) || this.slideAriaLabelInfix;


		/* SET DOM DATA */
		this.setAttribute('aria-roledescription', 'carousel');
		this.setAttribute('role', 'region');

		// Automatic slideshow Carousel
		if (this.autoSlideShowCarousel) {
			this.setAttribute(ATTRS.AUTO_SLIDE_SHOW_TIME, this.autoSlideShowTime.toString());
			this.autoSlideShowBtn?.setAttribute(ATTRS.AUTO_SLIDE_SHOW_BTN, '');
			this.autoSlideShowBtn?.setAttribute('aria-label', this.stopAutoSlideShowLabel);
		}

		// Previous and next slide buttons
		const slidesWrapperId = this.slidesWrapper.id || `${this.id}-slides`;
		this.prevSlideBtn?.setAttribute(ATTRS.PREV_SLIDE_BTN, '');
		this.prevSlideBtn?.setAttribute('aria-controls', slidesWrapperId);
		this.nextSlideBtn?.setAttribute(ATTRS.NEXT_SLIDE_BTN, '');
		this.nextSlideBtn?.setAttribute('aria-controls', slidesWrapperId);

		// Carousel with slide picker
		if (this.carouselHasSlidePicker) {
			this.setAttribute(ATTRS.WITH_SLIDE_PICKER, '');
			this.slidePickerEl?.setAttribute(ATTRS.SLIDE_PICKER, '');
			this.slidePickerEl?.setAttribute('role', 'tablist');
			if (!this.slidePickerEl?.hasAttribute('aria-label') || !this.slidePickerEl?.hasAttribute('aria-labelledby')) {
				this.slidePickerEl?.setAttribute('aria-label', 'Choose slide to display');
			}
		}

		// Slides wrapper
		this.slidesWrapper.id = slidesWrapperId;
		this.slidesWrapper.setAttribute(ATTRS.SLIDES, '');
		this.slidesWrapper.setAttribute('aria-live', 'polite');
		if (this.slidesWrapper.getAttribute('aria-atomic') === 'true') {
			this.slidesWrapper.setAttribute('aria-atomic', 'false');
		}


		/* ADD EVENT LISTENERS */
		this.addEventListener('click', this.clickHandler);
		window.addEventListener(EVENTS.IN.SET_PREV_SLIDE, this.customEventsHander);
		window.addEventListener(EVENTS.IN.SET_NEXT_SLIDE, this.customEventsHander);
		window.addEventListener(EVENTS.IN.UPDATE_SLIDES, this.customEventsHander);

		if (this.autoSlideShowCarousel) {
			document.addEventListener(PAGE_VISIBILITY_API_STRINGS.VISIBILITY_CHANGE as string, this.visibilityChangeHandler);
			this.addEventListener('focusin', this.focusAndMouseHandler);
			this.addEventListener('focusout', this.focusAndMouseHandler);
			this.addEventListener('mouseenter', this.focusAndMouseHandler);
			this.addEventListener('mouseleave', this.focusAndMouseHandler);
			window.addEventListener(EVENTS.IN.START_AUTO_SLIDE_SHOW, this.customEventsHander);
			window.addEventListener(EVENTS.IN.STOP_AUTO_SLIDE_SHOW, this.customEventsHander);
		}

		if (this.carouselHasSlidePicker) {
			this.addEventListener('keydown', this.keydownHandler);
		}


		/* INITIALISATION */
		warnIfElHasNoAriaLabel(this, 'Carousel');
		this.initSlides();
		this.initialised = true;

		window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
			'detail': {
				'id': this.id,
			}
		}));
	}


	public disconnectedCallback(): void {
		/* REMOVE EVENT LISTENERS */
		this.removeEventListener('click', this.clickHandler);
		window.removeEventListener(EVENTS.IN.SET_PREV_SLIDE, this.customEventsHander);
		window.removeEventListener(EVENTS.IN.SET_NEXT_SLIDE, this.customEventsHander);
		window.removeEventListener(EVENTS.IN.UPDATE_SLIDES, this.customEventsHander);

		if (this.autoSlideShowCarousel) {
			document.removeEventListener(PAGE_VISIBILITY_API_STRINGS.VISIBILITY_CHANGE as string, this.visibilityChangeHandler);
			this.removeEventListener('focusin', this.focusAndMouseHandler);
			this.removeEventListener('focusout', this.focusAndMouseHandler);
			this.removeEventListener('mouseenter', this.focusAndMouseHandler);
			this.removeEventListener('mouseleave', this.focusAndMouseHandler);
			window.removeEventListener(EVENTS.IN.START_AUTO_SLIDE_SHOW, this.customEventsHander);
			window.removeEventListener(EVENTS.IN.STOP_AUTO_SLIDE_SHOW, this.customEventsHander);
		}

		if (this.carouselHasSlidePicker) {
			this.removeEventListener('keydown', this.keydownHandler);
		}
	}


	/*
		General click method. It checks for what type of click it is,
		and calls the appropriate method.
	*/
	private clickHandler(e: MouseEvent): void {
		const target = e.target as HTMLElement;
		const nextBtnClicked = target.closest(`[${ATTRS.NEXT_SLIDE_BTN}]`);
		const prevBtnClicked = target.closest(`[${ATTRS.PREV_SLIDE_BTN}]`);

		if (nextBtnClicked || prevBtnClicked) {
			const direction = nextBtnClicked ? 1 : -1;
			this.selectSlideBasedOnDirection(direction);
			return;
		}

		if (this.autoSlideShowCarousel) {
			const autoSlideShowBtnClicked = target.closest(`[${ATTRS.AUTO_SLIDE_SHOW_BTN}]`);
			if (autoSlideShowBtnClicked) {
				this.autoSlideShowActive ? this.stopAutoSlideShow() :	this.startAutoSlideShow();
				return;
			}
		}

		if (this.carouselHasSlidePicker) {
			const slidePickerBtnClicked = target.closest(`[${ATTRS.SLIDE_PICKER_BTN}][aria-selected="false"]`);
			if (slidePickerBtnClicked) {
				const slideToSelect = slidePickerBtnClicked.getAttribute(ATTRS.SLIDE_PICKER_BTN);
				if (slideToSelect !== null) {
					this.setSelectedSlide(+slideToSelect - 1);
				}
			}
		}
	}


	/*
		Handler for incoming custom events
	*/
	private customEventsHander(e: Event): void {
		const detail = (e as CustomEvent)['detail'];
		if (!detail || detail['id'] !== this.id) {
			return;
		}

		switch (e.type) {
			case EVENTS.IN.SET_PREV_SLIDE:
			case EVENTS.IN.SET_NEXT_SLIDE: {
				const direction = (e.type === EVENTS.IN.SET_PREV_SLIDE) ? -1 : 1;
				const newSlideIndex = getIndexBasedOnDirection(this.selectedSlideIndex, direction, this.slideCount, this.infinite);
				this.setSelectedSlide(newSlideIndex);
				break;
			}
			case EVENTS.IN.UPDATE_SLIDES:
				this.initSlides();
				break;
			case EVENTS.IN.START_AUTO_SLIDE_SHOW:
				this.startAutoSlideShow();
				break;
			case EVENTS.IN.STOP_AUTO_SLIDE_SHOW:
				this.stopAutoSlideShow();
		}
	}


	/*
		Handles focus in, focus out, mouse enter and mouse leave events on Carousel.
	*/
	private focusAndMouseHandler(e: FocusEvent): void {
		switch (e.type) {
			case 'focusin':
				this.stopAutoSlideShow();
				break;
			case 'mouseenter':
				if (this.autoSlideShowActive) {
					this.stopAutoSlideShow();
					this.autoSlideShowPaused = true;
				}
				break;
			case 'mouseleave': {
				if (this.autoSlideShowPaused) {
					const relatedTarget = e.relatedTarget as HTMLElement;
					if (relatedTarget && !relatedTarget.closest(`#${this.id}`)) {
						this.startAutoSlideShow();
						this.autoSlideShowPaused = false;
					}
				}
			}
		}
	}


	/*
		Inititialises carousel slides with approapriate attributes.
	*/
	private initSlides(): void {
		// Get slides
		this.slideEls = this.slidesWrapper?.querySelectorAll(`[${ATTRS.SLIDES}] > *`);
		this.slideCount = this.slideEls?.length || this.slideCount;

		// If last slide was selected before it was deleted select the current last slide
		if (this.selectedSlideIndex >= this.slideCount) {
			this.selectedSlideIndex = this.slideCount - 1;
		}

		// Slide picker buttons
		if (this.carouselHasSlidePicker) {
			let slidePickerBtns = this.slidePickerEl?.querySelectorAll('button');
			const slidePickerBtnsCount = slidePickerBtns?.length;
			if (slidePickerBtnsCount === 0) {
				this.slideEls?.forEach(() => this.slidePickerEl?.appendChild(document.createElement('button')));
				slidePickerBtns = this.slidePickerEl?.querySelectorAll('button');
			} else if (slidePickerBtnsCount !== this.slideCount) {
				console.warn(`${DISPLAY_NAME}: Carousel with ID ${this.id} has descendant with attribute ${ATTRS.SLIDE_PICKER} that must have an equal number of slide picker buttons as slides. Either provide the correct number of slide picker buttons, or no buttons at all and Carousel will automatically generate the correct number required.`);
				return;
			}

			slidePickerBtns?.forEach((slidePickerBtn, index) => {
				const slideNumber = index + 1;
				const isSelectedSlideBtn = index === this.selectedSlideIndex;
				slidePickerBtn.setAttribute(ATTRS.SLIDE_PICKER_BTN, `${slideNumber}`);
				slidePickerBtn.setAttribute('aria-label', `${this.slidePickerBtnAriaLabelPrefix} ${slideNumber}`);
				slidePickerBtn.setAttribute('aria-selected', isSelectedSlideBtn ? 'true' : 'false');
				slidePickerBtn.setAttribute('aria-controls', `${this.id}-slide-${slideNumber}`);
				slidePickerBtn.setAttribute('tabindex', isSelectedSlideBtn ? '0' : '-1');
				slidePickerBtn.setAttribute('role', 'tab');
			});
		}

		// Slides
		this.setSlideAttributes();
		this.setNavBtnAttributes();

		if (this.initialised) {
			window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
				'detail': {
					'id': this.id,
				}
			}));
		}

		if (this.autoSlideShowCarousel && this.slideEls && this.slideEls.length > 0) {
			this.startAutoSlideShow();
		}
	}


	/*
		Handles keydown event on slide picker
	*/
	private keydownHandler(e: KeyboardEvent): void {
		const keyPressed = e.key;
		const homeKeyPressed = keyPressed == KEYS.HOME;
		const endKeyPressed = keyPressed == KEYS.END;
		const leftKeyPressed = keyPressed == KEYS.LEFT;
		const rightKeyPressed = keyPressed == KEYS.RIGHT;

		if (!homeKeyPressed && !endKeyPressed && !leftKeyPressed && !rightKeyPressed) {
			return;
		}

		e.preventDefault();
		if (leftKeyPressed || rightKeyPressed) {
			const direction = leftKeyPressed ? -1 : 1;
			this.selectSlideBasedOnDirection(direction);
		} else {
			this.setSelectedSlide(homeKeyPressed ? 0 : this.slideCount - 1);
		}
	}


	/*
		Displays the correct slide by adding the an attribute, resets the
		buttons, and dispaches an event that announces the slide change.
	*/
	private selectSlide(slideToSelectIndex: number): void {
		if (!this.slideEls || slideToSelectIndex < 0 || slideToSelectIndex >= this.slideCount) {
			return;
		}

		const selectedSlideIndex = this.selectedSlideIndex;
		this.slideEls[selectedSlideIndex].removeAttribute(ATTRS.SLIDE_SELECTED);
		this.slideEls[slideToSelectIndex].setAttribute(ATTRS.SLIDE_SELECTED, '');

		if (this.carouselHasSlidePicker) {
			const selectedSlidePickerBtn = this.slidePickerEl?.querySelector('button[aria-selected="true"]');
			const slideToSelectPickerBtn = this.slidePickerEl?.querySelector(`button:nth-of-type(${slideToSelectIndex + 1})`);

			if (selectedSlidePickerBtn) {
				selectedSlidePickerBtn.setAttribute('tabindex', '-1');
				selectedSlidePickerBtn.setAttribute('aria-selected', 'false');
			}

			if (slideToSelectPickerBtn) {
				slideToSelectPickerBtn.setAttribute('aria-selected', 'true');
				slideToSelectPickerBtn.setAttribute('tabindex', '0');
				if (selectedSlidePickerBtn === document.activeElement) {
					(slideToSelectPickerBtn as HTMLButtonElement).focus();
				}
			}
		}

		this.selectedSlideIndex = slideToSelectIndex;

		this.setNavBtnAttributes();

		window.dispatchEvent(new CustomEvent(EVENTS.OUT.SELECTED_SLIDE_CHANGED, {
			'detail': {
				'currentlySelectedSlide': slideToSelectIndex + 1,
				'id': this.id,
				'previouslySelectedSlide': selectedSlideIndex + 1,
			}
		}
		));
	}


	/*
		Select a new slide based on a given direction
	*/
	private selectSlideBasedOnDirection(direction: -1 | 1): void {
		const slideToSelectIndex = getIndexBasedOnDirection(this.selectedSlideIndex, direction, this.slideCount, this.infinite);
		this.setSelectedSlide(slideToSelectIndex);
	}


	/*
		Disables next and previous buttons if there are no more slides
		to go to, and adds specific aria-labels depending on the action
		it is going to take.
	*/
	private setNavBtnAttributes(): void {
		this.prevSlideBtn?.setAttribute('aria-label', this.goToPrevSlideLabel);
		this.prevSlideBtn?.removeAttribute('disabled');

		if (this.selectedSlideIndex === 0) {
			if (this.infinite) {
				this.prevSlideBtn?.setAttribute('aria-label', this.goToLastSlideLabel);
			} else {
				this.prevSlideBtn?.setAttribute('disabled', '');
			}
		}

		this.nextSlideBtn?.setAttribute('aria-label', this.goToNextSlideLabel);
		this.nextSlideBtn?.removeAttribute('disabled');

		if (this.selectedSlideIndex === this.slideCount - 1) {
			if (this.infinite) {
				this.nextSlideBtn?.setAttribute('aria-label', this.goToFirstSlideLabel);
			} else {
				this.nextSlideBtn?.setAttribute('disabled', '');
			}
		}
	}


	/*
		Changes the slide by setting SELECTED_SLIDE observed attribute.
	*/
	private setSelectedSlide(slideToSelectIndex: number): void {
		this.setAttribute(ATTRS.SELECTED_SLIDE, (slideToSelectIndex + 1).toString());
	}


	/*
		Set slide attributes
	*/
	private setSlideAttributes(): void {
		this.slideEls?.forEach((slide, index) => {
			// Set ID only if it was not given or we have previously provided it automatically
			if (!slide.id || slide.id.includes(`${this.id}-slide-`)) {
				slide.id = `${this.id}-slide-${index + 1}`;
			}

			slide.setAttribute(ATTRS.SLIDE, '');
			if (index === this.selectedSlideIndex) {
				slide.setAttribute(ATTRS.SLIDE_SELECTED, '');
			} else {
				slide.removeAttribute(ATTRS.SLIDE_SELECTED);
			}
			slide.setAttribute('aria-label', `${index + 1} ${this.slideAriaLabelInfix} ${this.slideCount}`);
			slide.setAttribute('role', this.carouselHasSlidePicker ? 'tabpanel' : 'group');
			if (!this.carouselHasSlidePicker) {
				slide.setAttribute('aria-roledescription', 'slide');
			}
		});
	}


	/*
		Start carousel auto slide show
	*/
	private startAutoSlideShow(): void {
		if (
			this.autoSlideShowActive ||
			(document as any)[PAGE_VISIBILITY_API_STRINGS.HIDDEN as string]
		) {
			return;
		}

		window.clearInterval(this.autoSlideShowTimer);
		this.autoSlideShowTimer = window.setInterval(() => this.selectSlideBasedOnDirection(1), this.autoSlideShowTime);

		this.setAttribute(ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'true');
		this.slidesWrapper?.setAttribute('aria-live', 'off');
		this.autoSlideShowBtn?.setAttribute('aria-label', this.stopAutoSlideShowLabel);
		this.autoSlideShowActive = true;

		window.dispatchEvent(new CustomEvent(EVENTS.OUT.AUTO_SLIDE_SHOW_STARTED, {
			'detail': {
				'id': this.id,
			}
		}));
	}


	/*
		Stop Carousel auto slide show
	*/
	private stopAutoSlideShow(): void {
		this.autoSlideShowPaused = false;
		if (!this.autoSlideShowActive) {
			return;
		}

		window.clearInterval(this.autoSlideShowTimer);
		this.setAttribute(ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'false');
		this.slidesWrapper?.setAttribute('aria-live', 'polite');
		this.autoSlideShowBtn?.setAttribute('aria-label', this.startAutoSlideShowLabel);
		this.autoSlideShowActive = false;

		window.dispatchEvent(new CustomEvent(EVENTS.OUT.AUTO_SLIDE_SHOW_STOPPED, {
			'detail': {
				'id': this.id,
			}
		}));
	}


	/*
		Handle document visibility changes, pausing the carousel
	*/
	private visibilityChangeHandler(): void {
		(document as any)[PAGE_VISIBILITY_API_STRINGS.HIDDEN as string] ?
			this.stopAutoSlideShow() :
			this.startAutoSlideShow();
	}
}


/* INITIALISE AND REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
	customElements.define(CAROUSEL, Carousel);
});
