/* IMPORTS */
import {
  autoID,
  getElByAttrOrSelector,
  getIndexOfNextItem
} from '../../common/functions.js';
import {NAME} from '../../common/constants.js';


/* CONSTANTS */
export const CAROUSEL = `${NAME}-carousel`;


export const ATTRS = {
  AUTO_SLIDE_SHOW: `${CAROUSEL}-auto-slide-show`,
  AUTO_SLIDE_SHOW_ACTIVE: `${CAROUSEL}-auto-slide-show-active`,
  AUTO_SLIDE_SHOW_BTN: `${CAROUSEL}-auto-slide-show-btn`,
  AUTO_SLIDE_SHOW_STOPPED: `${CAROUSEL}-auto-slide-show-stopped`,
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
  SLIDE_SELECTED: `${CAROUSEL}-slide-selected`,
  START_AUTO_SLIDE_SHOW_LABEL: `${CAROUSEL}-start-auto-slide-show-label`,
  STOP_AUTO_SLIDE_SHOW_LABEL: `${CAROUSEL}-stop-auto-slide-show-label`,
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
    SELECTED_SLIDE_CHANGED: `${CAROUSEL}-slide-changed`,
  }
};


export const DEFAULT_SLIDE_SHOW_TIME = 5000;


/* CLASS */
export default class Carousel extends HTMLElement {
  private autoSlideShowBtn: HTMLButtonElement;
  private autoSlideShowTime: number;
  private autoSlideShowTimer: number;
  private autoSlideShowStopped = false;
  private goToPrevSlideLabel: string;
  private goToLastSlideLabel: string;
  private goToNextSlideLabel: string;
  private goToFirstSlideLabel: string;
  private infinite: boolean;
  private initialised = false;
  private nextSlideBtn: HTMLButtonElement;
  private prevSlideBtn: HTMLButtonElement;
  private selectedSlideIndex: number;
  private slideEls: NodeListOf<HTMLElement>;
  private slidesWrapper: HTMLElement;
  private slideCount: number;
  private stopAutoSlideShowLabel: string;
  private startAutoSlideShowLabel: string;


  constructor() {
    super();


    /* CLASS METHOD BINDINGS */
    this.clickHandler = this.clickHandler.bind(this);
    this.customEventsHander = this.customEventsHander.bind(this);
    this.focusAndMouseHandler = this.focusAndMouseHandler.bind(this);
    this.initSlides = this.initSlides.bind(this);
    this.selectSlide = this.selectSlide.bind(this);
    this.selectSlideBasedOnDirection = this.selectSlideBasedOnDirection.bind(this);
    this.setNavBtnAttributes = this.setNavBtnAttributes.bind(this);
    this.setSelectedSlide = this.setSelectedSlide.bind(this);
    this.startAutoSlideShow = this.startAutoSlideShow.bind(this);
    this.stopAutoSlideShow = this.stopAutoSlideShow.bind(this);
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
    /* GET DOM ELEMENTS */
    const autoSlideShowCarousel = this.hasAttribute(ATTRS.AUTO_SLIDE_SHOW);
    if (autoSlideShowCarousel) {
      this.autoSlideShowBtn = this.querySelector('button');

      if (!this.autoSlideShowBtn) {
        console.error(`ACE: Carousel with ID '${this.id}' requires a descendant <button> element that is the first focusable element in order to toggle the automatic slide show.`);
        return;
      }
    }

    const prevSlideBtnSelector = autoSlideShowCarousel ? 'button:nth-of-type(2)' : 'button';
    const nextSlideBtnSelector = autoSlideShowCarousel ? 'button:nth-of-type(3)' : 'button:nth-of-type(2)';
    this.prevSlideBtn =
      this.querySelector(`button[${ATTRS.PREV_SLIDE_BTN}]`) ||
      this.querySelector(prevSlideBtnSelector);
    this.nextSlideBtn =
      this.querySelector(`button[${ATTRS.NEXT_SLIDE_BTN}]`) ||
      this.querySelector(nextSlideBtnSelector);

    if (!this.prevSlideBtn || !this.nextSlideBtn) {
      console.error(`ACE: Carousel with ID '${this.id}' requires two descendant <button> elements needed to display the previous and next slides.`);
      return;
    }

    this.slidesWrapper = getElByAttrOrSelector(this, ATTRS.SLIDES, `#${this.id} > div`);
    if (!this.slidesWrapper) {
      this.slidesWrapper = document.createElement('div');
      this.appendChild(this.slidesWrapper);
    }


    /* GET DOM DATA */
    this.infinite = this.hasAttribute(ATTRS.INFINITE);

    let initiallySelectedSlideNumber = +this.getAttribute(ATTRS.SELECTED_SLIDE);
    if (!initiallySelectedSlideNumber) {
      initiallySelectedSlideNumber = 1;
      this.setAttribute(ATTRS.SELECTED_SLIDE, initiallySelectedSlideNumber.toString());
    }
    this.selectedSlideIndex = initiallySelectedSlideNumber - 1;

    if (autoSlideShowCarousel) {
      this.autoSlideShowTime = +this.getAttribute(ATTRS.AUTO_SLIDE_SHOW_TIME) || DEFAULT_SLIDE_SHOW_TIME;

      // Get user defined aria labels for auto slide show start and stop states or use default values
      this.stopAutoSlideShowLabel =
        this.autoSlideShowBtn.getAttribute(ATTRS.STOP_AUTO_SLIDE_SHOW_LABEL) ||
        'Stop automatic slide show';
      this.startAutoSlideShowLabel =
        this.autoSlideShowBtn.getAttribute(ATTRS.START_AUTO_SLIDE_SHOW_LABEL) ||
        'Start automatic slide show';
    }

    // Get user defined aria labels for the prev and next slide btns or use default values
    this.goToPrevSlideLabel = this.prevSlideBtn.getAttribute(ATTRS.GO_TO_PREV_SLIDE_LABEL) || 'Go to previous slide';
    this.goToLastSlideLabel = this.prevSlideBtn.getAttribute(ATTRS.GO_TO_LAST_SLIDE_LABEL) || 'Go to last slide';
    this.goToNextSlideLabel = this.nextSlideBtn.getAttribute(ATTRS.GO_TO_NEXT_SLIDE_LABEL) || 'Go to next slide';
    this.goToFirstSlideLabel = this.nextSlideBtn.getAttribute(ATTRS.GO_TO_FIRST_SLIDE_LABEL) || 'Go to first slide';


    /* SET DOM DATA */
    this.setAttribute('aria-roledescription', 'carousel');
    this.setAttribute('role', 'region');

    const slidesWrapperId = this.slidesWrapper.id || `${this.id}-slides`;
    if (autoSlideShowCarousel) {
      this.setAttribute(ATTRS.AUTO_SLIDE_SHOW_TIME, this.autoSlideShowTime.toString());
      this.autoSlideShowBtn.setAttribute(ATTRS.AUTO_SLIDE_SHOW_BTN, '');
      this.autoSlideShowBtn.setAttribute('aria-label', this.stopAutoSlideShowLabel);
    }
    this.prevSlideBtn.setAttribute(ATTRS.PREV_SLIDE_BTN, '');
    this.prevSlideBtn.setAttribute('aria-controls', slidesWrapperId);
    this.nextSlideBtn.setAttribute(ATTRS.NEXT_SLIDE_BTN, '');
    this.nextSlideBtn.setAttribute('aria-controls', slidesWrapperId);

    this.slidesWrapper.id = slidesWrapperId;
    this.slidesWrapper.setAttribute(ATTRS.SLIDES, '');
    this.slidesWrapper.setAttribute('aria-live', 'polite');
    if (this.slidesWrapper.getAttribute('aria-atomic') === 'true') {
      this.slidesWrapper.setAttribute('aria-atomic', 'false');
    }


    /* ADD EVENT LISTENERS */
    this.addEventListener('click', this.clickHandler);
    this.addEventListener('focusin', this.focusAndMouseHandler);
    this.addEventListener('focusout', this.focusAndMouseHandler);
    this.addEventListener('mouseenter', this.focusAndMouseHandler);
    this.addEventListener('mouseleave', this.focusAndMouseHandler);
    this.addEventListener(EVENTS.IN.SET_PREV_SLIDE, this.customEventsHander);
    this.addEventListener(EVENTS.IN.SET_NEXT_SLIDE, this.customEventsHander);
    this.addEventListener(EVENTS.IN.START_AUTO_SLIDE_SHOW, this.customEventsHander);
    this.addEventListener(EVENTS.IN.STOP_AUTO_SLIDE_SHOW, this.customEventsHander);
    this.addEventListener(EVENTS.IN.UPDATE_SLIDES, this.customEventsHander);


    /* INITIALISATION */
    // Check if Carousel labelled
    const carouselHasLabel = this.hasAttribute('aria-label');
    const carouselLabelElId = this.getAttribute('aria-labelledby');
    if (carouselLabelElId) {
      const labelEl = document.getElementById(carouselLabelElId);
      if (!labelEl) {
        console.warn(`ACE: Carousel with ID '${this.id}' has 'aria-labelledby' attribute set to an element that does not exist.`);
      } else if (!labelEl.textContent.length) {
        console.warn(`ACE: Carousel with ID '${this.id}' has 'aria-labelledby' attribute set to an element with no text content.`);
      }
    } else if (!carouselHasLabel) {
      console.warn(`Carousel with ID '${this.id}' requires an 'aria-label' or an 'aria-labelledby' attribute.`);
    }

    this.initSlides();
    this.initialised = true;
  }


  public disconnectedCallback(): void {
    /* REMOVE EVENT LISTENERS */
    this.removeEventListener('click', this.clickHandler);
    this.removeEventListener('focusin', this.focusAndMouseHandler);
    this.removeEventListener('focusout', this.focusAndMouseHandler);
    this.removeEventListener('mouseenter', this.focusAndMouseHandler);
    this.removeEventListener('mouseleave', this.focusAndMouseHandler);
    this.removeEventListener(EVENTS.IN.SET_PREV_SLIDE, this.customEventsHander);
    this.removeEventListener(EVENTS.IN.SET_NEXT_SLIDE, this.customEventsHander);
    this.removeEventListener(EVENTS.IN.START_AUTO_SLIDE_SHOW, this.customEventsHander);
    this.removeEventListener(EVENTS.IN.STOP_AUTO_SLIDE_SHOW, this.customEventsHander);
    this.removeEventListener(EVENTS.IN.UPDATE_SLIDES, this.customEventsHander);

  }


  /*
    General click method. It checks for what type of click it is,
    and calls the appropriate method.
  */
  private clickHandler(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    const nextBtnClicked = target.closest(`[${ATTRS.NEXT_SLIDE_BTN}]`);
    const prevBtnClicked = target.closest(`[${ATTRS.PREV_SLIDE_BTN}]`);
    const autoSlideShowBtnClicked = target.closest(`[${ATTRS.AUTO_SLIDE_SHOW_BTN}]`);

    if (nextBtnClicked || prevBtnClicked) {
      const direction = nextBtnClicked ? 1 : -1;
      this.selectSlideBasedOnDirection(direction);
      return;
    }

    if (autoSlideShowBtnClicked) {
      this.autoSlideShowStopped = !this.autoSlideShowStopped;
      if (this.autoSlideShowStopped) {
        this.stopAutoSlideShow();
      } else {
        this.startAutoSlideShow();
      }
    }
  }


  /*
    Handler for listened for custom events
  */
  private customEventsHander(e: CustomEvent): void {
    switch (e.type) {
      case EVENTS.IN.SET_PREV_SLIDE:
      case EVENTS.IN.SET_NEXT_SLIDE: {
        const direction = (e.type === EVENTS.IN.SET_PREV_SLIDE) ? -1 : 1;
        const newSlideIndex = getIndexOfNextItem(this.selectedSlideIndex, direction, this.slideCount, this.infinite);
        this.setSelectedSlide(newSlideIndex);
        break;
      }
      case EVENTS.IN.UPDATE_SLIDES:
        this.initSlides();
        break;
      case EVENTS.IN.START_AUTO_SLIDE_SHOW:
        this.autoSlideShowStopped = false;
        this.startAutoSlideShow();
        break;
      case EVENTS.IN.STOP_AUTO_SLIDE_SHOW:
        this.autoSlideShowStopped = true;
        this.stopAutoSlideShow();
    }
  }


  /*
    Handles focus in, focus out, mouse enter and mouse leave events on Carousel.
  */
  private focusAndMouseHandler(e: FocusEvent): void {
    if (!this.autoSlideShowTime) {
      return;
    }

    switch (e.type) {
      case 'focusin':
      case 'mouseenter': {
        const target = e.target as HTMLElement;
        if (target.hasAttribute(ATTRS.AUTO_SLIDE_SHOW_BTN)) {
          this.startAutoSlideShow(true);
          return;
        }
        this.stopAutoSlideShow(true);
        break;
      }
      case 'focusout':
      case 'mouseleave': {
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (relatedTarget && !relatedTarget.closest(`#${this.id}`)) {
          this.startAutoSlideShow(true);
        }
      }
    }
  }


  /*
    Inititialises carousel slides with approapriate attributes.
  */
  private initSlides(): void {
    // Get slides
    this.slideEls = this.slidesWrapper.querySelectorAll(`[${ATTRS.SLIDES}] > *`);
    this.slideCount = this.slideEls.length;

    // If last slide was selected and it was deleted select the new last slide
    if (this.selectedSlideIndex >= this.slideCount) {
      this.selectedSlideIndex = this.slideCount - 1;
    }

    this.slideEls.forEach((slide, index) => {
      slide.setAttribute(ATTRS.SLIDE, '');
      if (index === this.selectedSlideIndex) {
        slide.setAttribute(ATTRS.SLIDE_SELECTED, '');
      } else {
        slide.removeAttribute(ATTRS.SLIDE_SELECTED);
      }
      slide.setAttribute('aria-label', `${index + 1} of ${this.slideCount}`);
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('role', 'group');
    });

    this.setNavBtnAttributes();

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
      'detail': {
        'id': this.id,
      }
    }));

    if (this.slideEls.length > 0 && this.autoSlideShowTime) {
      this.startAutoSlideShow();
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
  private selectSlideBasedOnDirection(direction: -1|1): void {
    const slideToSelectIndex = getIndexOfNextItem(this.selectedSlideIndex, direction, this.slideCount, this.infinite);
    this.setSelectedSlide(slideToSelectIndex);
  }


  /*
    Disables next and previous buttons if there are no more slides
    to go to, and adds specific aria-labels depending on the action
    it is going to take.
  */
  private setNavBtnAttributes(): void {
    this.prevSlideBtn.setAttribute('aria-label', this.goToPrevSlideLabel);
    this.prevSlideBtn.removeAttribute('disabled');

    if (this.selectedSlideIndex === 0) {
      if (this.infinite) {
        this.prevSlideBtn.setAttribute('aria-label', this.goToLastSlideLabel);
      } else {
        this.prevSlideBtn.setAttribute('disabled', '');
      }
    }

    this.nextSlideBtn.setAttribute('aria-label', this.goToNextSlideLabel);
    this.nextSlideBtn.removeAttribute('disabled');

    if (this.selectedSlideIndex === this.slideCount - 1) {
      if (this.infinite) {
        this.nextSlideBtn.setAttribute('aria-label',  this.goToFirstSlideLabel);
      } else {
        this.nextSlideBtn.setAttribute('disabled', '');
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
    Start carousel auto slide show
  */
  private startAutoSlideShow(paused = false): void {
    if (this.autoSlideShowStopped || this.getAttribute(ATTRS.AUTO_SLIDE_SHOW_ACTIVE) === 'true') {
      return;
    }

    window.clearInterval(this.autoSlideShowTimer);
    this.autoSlideShowTimer = window.setInterval(() => {
      this.selectSlideBasedOnDirection(1);
    }, this.autoSlideShowTime);

    this.setAttribute(ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'true');
    this.slidesWrapper.setAttribute('aria-live', 'off');

    if (!paused) {
      this.setAttribute(ATTRS.AUTO_SLIDE_SHOW_STOPPED, 'false');
      this.autoSlideShowBtn.setAttribute('aria-label', this.stopAutoSlideShowLabel);
    }

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.AUTO_SLIDE_SHOW_STARTED, {
      'detail': {
        'id': this.id,
      }
    }));
  }


  /*
    Stop Carousel auto slide show
  */
  private stopAutoSlideShow(paused = false): void {
    if (this.getAttribute(ATTRS.AUTO_SLIDE_SHOW_ACTIVE) === 'false') {
      return;
    }

    window.clearInterval(this.autoSlideShowTimer);
    this.setAttribute(ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'false');
    this.slidesWrapper.setAttribute('aria-live', 'polite');

    if (!paused) {
      this.setAttribute(ATTRS.AUTO_SLIDE_SHOW_STOPPED, 'true');
      this.autoSlideShowBtn.setAttribute('aria-label', this.startAutoSlideShowLabel);
    }

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.AUTO_SLIDE_SHOW_STOPPED, {
      'detail': {
        'id': this.id,
      }
    }));
  }
}


/* INITIALISE AND REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  autoID(CAROUSEL);
  customElements.define(CAROUSEL, Carousel);
});
