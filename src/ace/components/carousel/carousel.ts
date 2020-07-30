/* IMPORTS */
import {NAME} from '../../common/constants.js';
import {autoID} from '../../common/functions.js';


/* CONSTANTS */
export const CAROUSEL = `${NAME}-carousel`;

export const ATTRS = {
  ACTIVE_CAROUSEL_SLIDE: `${CAROUSEL}-active-slide`,
  CAROUSEL_SLIDE: `${CAROUSEL}-slide`,
  CAROUSEL_SLIDES: `${CAROUSEL}-slides`,
  CURRENT_SLIDE: `${CAROUSEL}-current-slide`,
  INFINITE_ROTATION: `${CAROUSEL}-infinite`,
  NEXT_BUTTON: `${CAROUSEL}-button-next`,
  PREVIOUS_BUTTON: `${CAROUSEL}-button-previous`,
};

export const EVENTS = {
  CHANGED: `${CAROUSEL}-changed`,
};


/* CLASS */
export default class Carousel extends HTMLElement {
  private carouselSlideEls: NodeListOf<HTMLElement>;
  private carouselSlideWrapper: HTMLElement;
  private currentSlideIndex: number;
  private infinite: boolean;
  private nextButton: HTMLElement;
  private prevButton: HTMLElement;
  private slideCount: number;


  /* CONSTRUCTOR */
  constructor() {
    super();


    /* CLASS METHOD BINDINGS */
    this.activateCarouselSlide = this.activateCarouselSlide.bind(this);
    this.changeSlide = this.changeSlide.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.getIndexOfSlideToActivate = this.getIndexOfSlideToActivate.bind(this);
    this.initCarouselSlides = this.initCarouselSlides.bind(this);
    this.setNavBtnAttributes = this.setNavBtnAttributes.bind(this);
  }


  static get observedAttributes(): Array<string> {
    return [ ATTRS.INFINITE_ROTATION, ATTRS.CURRENT_SLIDE ];
  }


  public connectedCallback(): void {
    /* GET DOM ELEMENTS */
    // Get button elements.
    this.nextButton = this.querySelector(`[${ATTRS.NEXT_BUTTON}]`);
    this.prevButton = this.querySelector(`[${ATTRS.PREVIOUS_BUTTON}]`);

    // Get slide wrapper.
    this.carouselSlideWrapper = this.querySelector(`[${ATTRS.CAROUSEL_SLIDES}]`);


    /* GET DOM DATA */
    this.infinite = this.hasAttribute(ATTRS.INFINITE_ROTATION);
    const currentSlideAttr = +this.getAttribute(ATTRS.CURRENT_SLIDE);


    /* SET DOM DATA */
    // Set id for the slide wrapper in order to properly set aria-controls on buttons.
    this.carouselSlideWrapper.id = ATTRS.CAROUSEL_SLIDES;
    this.nextButton.setAttribute('aria-controls', ATTRS.CAROUSEL_SLIDES);
    this.prevButton.setAttribute('aria-controls', ATTRS.CAROUSEL_SLIDES);

    // Set aria attributes and roles.
    this.setAttribute('aria-roledescription', 'carousel');
    this.setAttribute('role', 'region');
    this.carouselSlideWrapper.setAttribute('aria-live', 'polite');

    // Set default aria labels only if not provided already.
    if (!this.getAttribute('aria-label')) {
      this.setAttribute('aria-label', 'Page carousel');
    }

    // Initialise carousel slides.
    this.initCarouselSlides();

    // Initialise buttons.
    this.setNavBtnAttributes();

    // Display the first carousel slide or the one set via the attribute.
    currentSlideAttr ? this.activateCarouselSlide(currentSlideAttr - 1) : this.activateCarouselSlide(0);


    /* ADD EVENT LISTENERS */
    this.addEventListener('click', this.clickHandler);
  }


  public disconnectedCallback(): void {
    /* REMOVE EVENT LISTENERS */
    this.removeEventListener('click', this.clickHandler);
  }


  private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue !== newValue) {
      if (name === ATTRS.INFINITE_ROTATION) {
        this.infinite = (newValue === 'true');
      } else if (name == ATTRS.CURRENT_SLIDE) {
        this.activateCarouselSlide(+newValue - 1);
      }
      this.setNavBtnAttributes();
    }
  }


  /*
    Displays the correct slide by adding the an attribute, resets the
    buttons, and dispaches an event that announces the slide change.
  */
  private activateCarouselSlide(slideIndex: number): void {
    if (!this.carouselSlideEls) return;
    if (slideIndex > this.carouselSlideEls.length - 1) return;

    // Set active attribute to the correct slide.
    this.carouselSlideEls.forEach((slide, i) => {
      if (i == slideIndex) {
        slide.setAttribute(ATTRS.ACTIVE_CAROUSEL_SLIDE, '');
      } else {
        slide.removeAttribute(ATTRS.ACTIVE_CAROUSEL_SLIDE);
      }
    });

    // Set the current slide index.
    this.currentSlideIndex = slideIndex;

    // Reset the buttons.
    this.setNavBtnAttributes();

    // Dispatch an event that the slide has changed.
    window.dispatchEvent(new CustomEvent(
      EVENTS.CHANGED,
      {
        'detail': {
          'currentSlideNumber': this.currentSlideIndex + 1,
          'id': this.id
        }
      }
    ));
  }


  /*
    Changes the slide by getting the direction (next or previous),
    calls helper function to get the correct index, and activates it.
  */
  private changeSlide(target: HTMLElement): void {
    const direction = target.hasAttribute(ATTRS.NEXT_BUTTON) ? 1 : -1;
    const indexOfSlideToActivate = this.getIndexOfSlideToActivate(direction);
    this.activateCarouselSlide(indexOfSlideToActivate);
  }


  /*
    General click method. It checks for what type of click it is,
    and calls the appropriate method.
  */
  private clickHandler(e: MouseEvent): void {
    const target = (e.target as HTMLElement);
    const nextBtnClicked = target.closest(`[${ATTRS.NEXT_BUTTON}]`);
    const prevBtnClicked = target.closest(`[${ATTRS.PREVIOUS_BUTTON}]`);

    if (nextBtnClicked || prevBtnClicked) {
      this.changeSlide(target);
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
  private initCarouselSlides(): void {
    // Get carousel slides.
    this.carouselSlideEls = this.querySelectorAll(`[${ATTRS.CAROUSEL_SLIDE}]`);
    this.slideCount = this.carouselSlideEls.length;

    this.carouselSlideEls.forEach((slide, i) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      if (!slide.hasAttribute('aria-label')) {
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
          this.prevButton.setAttribute('disabled', 'true');
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
          this.nextButton.setAttribute('disabled', 'true');
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
