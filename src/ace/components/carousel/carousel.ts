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
  INFINITE: `${CAROUSEL}-infinite`,
  NEXT_BTN: `${CAROUSEL}-next-btn`,
  PREV_BTN: `${CAROUSEL}-previous-btn`,
  SELECTED_SLIDE: `${CAROUSEL}-selected-slide`,
  SLIDE: `${CAROUSEL}-slide`,
  SLIDES: `${CAROUSEL}-slides`,
  SLIDE_SELECTED: `${CAROUSEL}-slide-selected`,
};


export const EVENTS = {
  IN: {
    SET_NEXT_SLIDE: `${CAROUSEL}-set-next-slide`,
    SET_PREV_SLIDE: `${CAROUSEL}-set-prev-slide`,
    UPDATE: `${CAROUSEL}-update`,
  },
  OUT: {
    CHANGED: `${CAROUSEL}-changed`,
    READY: `${CAROUSEL}-ready`,
  }
};


/* CLASS */
export default class Carousel extends HTMLElement {
  private infinite: boolean;
  private initialised = false;
  private nextButton: HTMLElement;
  private prevButton: HTMLElement;
  private selectedSlideIndex: number;
  private slideEls: NodeListOf<HTMLElement>;
  private slidesWrapper: HTMLElement;
  private slideCount: number;


  constructor() {
    super();


    /* CLASS METHOD BINDINGS */
    this.clickHandler = this.clickHandler.bind(this);
    this.customEventsHander = this.customEventsHander.bind(this);
    this.initSlides = this.initSlides.bind(this);
    this.selectSlide = this.selectSlide.bind(this);
    this.setNavBtnAttributes = this.setNavBtnAttributes.bind(this);
    this.setSelectedSlide = this.setSelectedSlide.bind(this);
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
    this.prevButton = getElByAttrOrSelector(this, ATTRS.PREV_BTN, 'button');
    this.nextButton = getElByAttrOrSelector(this, ATTRS.NEXT_BTN, 'button:nth-of-type(2)');
    this.slidesWrapper = getElByAttrOrSelector(this, ATTRS.SLIDES, `#${this.id} > div`);
    if (!this.slidesWrapper) {
      console.error(`ACE: Carousel with ID '${this.id}' requires an child <div> or an ancestor with attribute '${ATTRS.SLIDES}', to be used as a slides container.`);
      return;
    }


    /* GET DOM DATA */
    let initiallySelectedSlideNumber = +this.getAttribute(ATTRS.SELECTED_SLIDE);
    if (!initiallySelectedSlideNumber) {
      initiallySelectedSlideNumber = 1;
      this.setAttribute(ATTRS.SELECTED_SLIDE, initiallySelectedSlideNumber.toString());
    }
    this.selectedSlideIndex = initiallySelectedSlideNumber - 1;

    this.infinite = this.hasAttribute(ATTRS.INFINITE);


    /* SET DOM DATA */
    this.setAttribute('aria-roledescription', 'carousel');
    this.setAttribute('role', 'region');

    const slidesWrapperId = this.slidesWrapper.id || `${this.id}-slides`;
    if (this.prevButton) {
      this.prevButton.setAttribute(ATTRS.PREV_BTN, '');
      this.prevButton.setAttribute('aria-controls', slidesWrapperId);
    }
    if (this.nextButton) {
      this.nextButton.setAttribute(ATTRS.NEXT_BTN, '');
      this.nextButton.setAttribute('aria-controls', slidesWrapperId);
    }

    this.slidesWrapper.id = slidesWrapperId;
    this.slidesWrapper.setAttribute(ATTRS.SLIDES, '');
    this.slidesWrapper.setAttribute('aria-live', 'polite');


    /* ADD EVENT LISTENERS */
    this.addEventListener('click', this.clickHandler);
    this.addEventListener(EVENTS.IN.SET_PREV_SLIDE, this.customEventsHander);
    this.addEventListener(EVENTS.IN.SET_NEXT_SLIDE, this.customEventsHander);
    this.addEventListener(EVENTS.IN.UPDATE, this.customEventsHander);


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
    this.removeEventListener(EVENTS.IN.SET_PREV_SLIDE, this.customEventsHander);
    this.removeEventListener(EVENTS.IN.SET_NEXT_SLIDE, this.customEventsHander);
    this.removeEventListener(EVENTS.IN.UPDATE, this.customEventsHander);
  }


  /*
    General click method. It checks for what type of click it is,
    and calls the appropriate method.
  */
  private clickHandler(e: MouseEvent): void {
    const target = (e.target as HTMLElement);
    const nextBtnClicked = target.closest(`[${ATTRS.NEXT_BTN}]`);
    const prevBtnClicked = target.closest(`[${ATTRS.PREV_BTN}]`);

    if (nextBtnClicked || prevBtnClicked) {
      const direction = nextBtnClicked ? 1 : -1;
      const slideToSelectIndex = getIndexOfNextItem(this.selectedSlideIndex, direction, this.slideCount, this.infinite);
      this.setSelectedSlide(slideToSelectIndex);
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
      case EVENTS.IN.UPDATE: {
        this.initSlides();
        break;
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

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.CHANGED, {
      'detail': {
        'currentlySelectedSlide': slideToSelectIndex + 1,
        'id': this.id,
        'previouslySelectedSlide': selectedSlideIndex + 1,
        }
      }
    ));
  }


  /*
    Changes the slide by setting SELECTED_SLIDE observed attribute.
  */
  private setSelectedSlide(slideToSelectIndex: number): void {
    this.setAttribute(ATTRS.SELECTED_SLIDE, (slideToSelectIndex + 1).toString());
  }


  /*
    Disables next and previous buttons if there are no more slides
    to go to, and adds specific aria-labels depending on the action
    it is going to take.
  */
  private setNavBtnAttributes(): void {
    if (this.prevButton) {
      this.prevButton.setAttribute('aria-label', 'Go to previous slide');
      this.prevButton.removeAttribute('disabled');

      if (this.selectedSlideIndex === 0) {
        if (this.infinite) {
          this.prevButton.setAttribute('aria-label', 'Go to last slide');
        } else {
          this.prevButton.setAttribute('disabled', '');
        }
      }
    }

    if(this.nextButton) {
      this.nextButton.setAttribute('aria-label', 'Go to next slide');
      this.nextButton.removeAttribute('disabled');

      if (this.selectedSlideIndex === this.slideCount - 1) {
        if (this.infinite) {
          this.nextButton.setAttribute('aria-label', 'Go to first slide');
        } else {
          this.nextButton.setAttribute('disabled', '');
        }
      }
    }
  }
}


/* INITIALISE AND REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  autoID(CAROUSEL);
  customElements.define(CAROUSEL, Carousel);
});
