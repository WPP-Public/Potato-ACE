/* IMPORTS */
import {NAME} from '../../common/constants.js';
import {autoID} from '../../common/functions.js';


/* CONSTANTS */
export const CAROUSEL = `${NAME}-carousel`;


export const ATTRS = {
  ACTIVE_SLIDE_NUMBER: `${CAROUSEL}-active-slide-number`,
  NEXT_BUTTON: `${CAROUSEL}-next`,
  PREV: `${CAROUSEL}-previous`,
  SLIDE: `${CAROUSEL}-slide`,
  SLIDES: `${CAROUSEL}-slides`,
  SLIDE_ACTIVE: `${CAROUSEL}-slide-active`,
  WRAPPING: `${CAROUSEL}-wrapping`,
};


export const EVENTS = {
  OUT: {
    CHANGED: `${CAROUSEL}-changed`,
  }
};


/* CLASS */
export default class Carousel extends HTMLElement {
  private currentSlideIndex: number;
  private infinite: boolean;
  private nextButton: HTMLElement;
  private prevButton: HTMLElement;
  private slideEls: NodeListOf<HTMLElement>;
  private slidesWrapper: HTMLElement;
  private slideCount: number;


  constructor() {
    super();


    /* CLASS METHOD BINDINGS */
    this.activateSlide = this.activateSlide.bind(this);
    this.changeSlide = this.changeSlide.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.getIndexOfSlideToActivate = this.getIndexOfSlideToActivate.bind(this);
    this.initSlides = this.initSlides.bind(this);
    this.setNavBtnAttributes = this.setNavBtnAttributes.bind(this);
  }


  static get observedAttributes(): Array<string> {
    return [ATTRS.WRAPPING, ATTRS.ACTIVE_SLIDE_NUMBER];
  }


  public connectedCallback(): void {
    /* GET DOM ELEMENTS */
    // Get button elements.
    this.prevButton = this.querySelector(`[${ATTRS.PREV}]`) || this.querySelector('button');
    this.nextButton = this.querySelector(`[${ATTRS.NEXT_BUTTON}]`) || this.querySelectorAll('button')[1];

    // Get slide wrapper.
    this.slidesWrapper = this.querySelector(`[${ATTRS.SLIDES}]`) || this.querySelector('div');


    /* GET DOM DATA */
    this.infinite = this.hasAttribute(ATTRS.WRAPPING);
    const currentSlideAttr = +this.getAttribute(ATTRS.ACTIVE_SLIDE_NUMBER);


    /* SET DOM DATA */
    this.setAttribute('aria-roledescription', 'carousel');
    this.setAttribute('role', 'region');

    const slidesWrapperId = this.slidesWrapper.id || `${this.id}-slides`;
    this.prevButton.setAttribute(ATTRS.PREV, '');
    this.prevButton.setAttribute('aria-controls', slidesWrapperId);
    this.nextButton.setAttribute(ATTRS.NEXT_BUTTON, '');
    this.nextButton.setAttribute('aria-controls', slidesWrapperId);

    this.slidesWrapper.id = slidesWrapperId;
    this.slidesWrapper.setAttribute(ATTRS.SLIDES, '');
    this.slidesWrapper.setAttribute('aria-live', 'polite');


    /* INITIALISATION */
    if (!this.hasAttribute('aria-label') && !this.hasAttribute('aria-labelledby')) {
      console.warn(`Please provide 'aria-label' or 'aria-labelledby' attribute for #${this.id}`);
    }

    // Initialise slides.
    this.initSlides();

    // Initialise buttons.
    this.setNavBtnAttributes();

    // Display the first slide or the one set via the attribute.
    const slideToActivate = currentSlideAttr ? currentSlideAttr - 1 : 0;
    this.activateSlide(slideToActivate);


    /* ADD EVENT LISTENERS */
    this.addEventListener('click', this.clickHandler);
  }


  public disconnectedCallback(): void {
    /* REMOVE EVENT LISTENERS */
    this.removeEventListener('click', this.clickHandler);
  }


  private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue !== newValue) {
      if (name === ATTRS.WRAPPING) {
        this.infinite = (newValue === '');
      } else if (name == ATTRS.ACTIVE_SLIDE_NUMBER) {
        const newSlideNumber = +newValue;
        if (!newSlideNumber || newSlideNumber > this.slideCount) {
          return;
        }
        this.activateSlide(newSlideNumber - 1);
      }
      this.setNavBtnAttributes();
    }
  }


  /*
    Displays the correct slide by adding the an attribute, resets the
    buttons, and dispaches an event that announces the slide change.
  */
  private activateSlide(slideIndex: number): void {
    if (!this.slideEls) return;
    if (slideIndex > this.slideEls.length - 1) return;

    const slideNumber = (slideIndex + 1).toString();
    if (this.getAttribute(ATTRS.ACTIVE_SLIDE_NUMBER) !== slideNumber) {
      this.setAttribute(ATTRS.ACTIVE_SLIDE_NUMBER, slideNumber);
      return;
    }

    // Set active attribute to the correct slide.
    this.slideEls.forEach((slide, i) => {
      if (i == slideIndex) {
        slide.setAttribute(ATTRS.SLIDE_ACTIVE, '');
      } else {
        slide.removeAttribute(ATTRS.SLIDE_ACTIVE);
      }
    });

    // Set the current slide index.
    this.currentSlideIndex = slideIndex;

    // Reset the buttons.
    this.setNavBtnAttributes();

    // Dispatch an event that the slide has changed.
    window.dispatchEvent(new CustomEvent(
      EVENTS.OUT.CHANGED,
      {
        'detail': {
          'currentSlideNumber': this.currentSlideIndex + 1,
          'id': this.id
        }
      }
    ));
  }


  /*
    Changes the slide by setting ACTIVE_SLIDE_NUMBER observed attribute.
  */
  private changeSlide(slideIndexToActivate: number): void {
    const slideNumberToActivate = slideIndexToActivate + 1;
    this.setAttribute(ATTRS.ACTIVE_SLIDE_NUMBER, slideNumberToActivate.toString());
  }


  /*
    General click method. It checks for what type of click it is,
    and calls the appropriate method.
  */
  private clickHandler(e: MouseEvent): void {
    const target = (e.target as HTMLElement);
    const nextBtnClicked = target.closest(`[${ATTRS.NEXT_BUTTON}]`);
    const prevBtnClicked = target.closest(`[${ATTRS.PREV}]`);

    if (nextBtnClicked || prevBtnClicked) {
      const direction = nextBtnClicked ? 1 : -1;
      const slideIndexToActivate = this.getIndexOfSlideToActivate(direction);
      this.changeSlide(slideIndexToActivate);
    }
  }


  /*
    Helper function to calculate the correct slide index based on the
    direction (next or previous) and whether it's infinite or not.
  */
  private getIndexOfSlideToActivate(direction: -1|1): number {
    let newIndex = this.currentSlideIndex + direction;
    if (newIndex < 0) {
      newIndex = this.infinite ? this.slideCount - 1 : 0;
    } else if (newIndex === this.slideCount) {
      newIndex = this.infinite ? 0 : this.slideCount - 1;
    }

    return newIndex;
  }


  /*
    Inititialises carousel slides with approapriate aria labels.
  */
  private initSlides(): void {
    // Get slides
    this.slideEls = this.querySelectorAll(`[${ATTRS.SLIDE}]`);
    if (this.slideEls.length === 0) {
      this.slideEls = this.slidesWrapper.querySelectorAll('div');
    }
    this.slideCount = this.slideEls.length;

    this.slideEls.forEach((slide, i) => {
      slide.setAttribute(ATTRS.SLIDE, '');
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      if (!slide.hasAttribute('aria-label') && !slide.hasAttribute('aria-labelledby')) {
        slide.setAttribute('aria-label', `${i + 1} of ${this.slideCount}`);
      }
    });
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

      if (this.currentSlideIndex === 0) {
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

      if (this.currentSlideIndex === this.slideCount - 1) {
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
