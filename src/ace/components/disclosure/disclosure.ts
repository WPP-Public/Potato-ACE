/* IMPORTS */
import {NAME} from '../../common/constants.js';
import {autoID} from '../../common/functions.js';


/* COMPONENT NAME */
export const DISCLOSURE = `${NAME}-disclosure`;


/* CONSTANTS */
export const ATTRS = {
  TRIGGER: `${DISCLOSURE}-trigger-for`,
  TRIGGER_HIDE: `${DISCLOSURE}-trigger-hide`,
  TRIGGER_SHOW: `${DISCLOSURE}-trigger-show`,
  VISIBLE: `${DISCLOSURE}-visible`,
};


export const EVENTS = {
  IN: {
    HIDE: `${DISCLOSURE}-hide`,
    SHOW: `${DISCLOSURE}-show`,
    TOGGLE: `${DISCLOSURE}-toggle`,
  },
  OUT: {
    CHANGED: `${DISCLOSURE}-changed`,
    READY: `${DISCLOSURE}-ready`,
  },
};


/* CLASS */
export default class Disclosure extends HTMLElement {
  private triggerEls: NodeListOf<Element>;
  private readonly triggerSelector = `[${ATTRS.TRIGGER}=${this.id}]`;


  constructor() {
    super();


    /* CLASS METHOD BINDINGS */
    this.setDisclosure = this.setDisclosure.bind(this);
    this.customEventsHandler = this.customEventsHandler.bind(this);
    this.windowClickHandler = this.windowClickHandler.bind(this);
  }


  public connectedCallback(): void {
    /* GET DOM ELEMENTS */
    this.triggerEls = document.querySelectorAll(this.triggerSelector);


    /* GET DOM DATA */
    const visible = this.hasAttribute(ATTRS.VISIBLE);


    /* SET DOM DATA */
    this.setAttribute(ATTRS.VISIBLE, visible.toString());

    this.triggerEls.forEach((triggerEl) => {
      triggerEl.setAttribute('aria-controls', this.id);
      triggerEl.setAttribute('aria-expanded', visible.toString());
    });


    /* ADD EVENT LISTENERS */
    this.addEventListener(EVENTS.IN.HIDE, this.customEventsHandler);
    this.addEventListener(EVENTS.IN.SHOW, this.customEventsHandler);
    this.addEventListener(EVENTS.IN.TOGGLE, this.customEventsHandler);
    window.addEventListener('click', this.windowClickHandler);


    /* INITIALISATION */
    // Dispatch 'ready' event
    window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
      'detail': {
        'id': this.id,
      }
    }));
  }


  public disconnectedCallback(): void {
    /* REMOVE EVENT LISTENERS */
    this.removeEventListener(EVENTS.IN.HIDE, this.customEventsHandler);
    this.removeEventListener(EVENTS.IN.SHOW, this.customEventsHandler);
    this.removeEventListener(EVENTS.IN.TOGGLE, this.customEventsHandler);
    window.removeEventListener('click', this.windowClickHandler);
  }


  /*
    Handles custom events
  */
  private customEventsHandler(e: CustomEvent): void {
    let showDisclosure: boolean = null;
    if (e.type === EVENTS.IN.SHOW) {
      showDisclosure = true;
    }
    if (e.type === EVENTS.IN.HIDE) {
      showDisclosure = false;
    }

    this.setDisclosure(showDisclosure);
  }


  /*
    Show, hide or toggle the visibility of the disclosure
  */
  private setDisclosure(showDisclosure: boolean): void {
    const currentlyShown = this.getAttribute(ATTRS.VISIBLE) === 'true';

    if (showDisclosure && currentlyShown) {
      return;
    }

    if ((showDisclosure === false) && !currentlyShown) {
      return;
    }

    // if showDisclosure not defined toggle state
    if (showDisclosure === null || showDisclosure === undefined) {
      showDisclosure = !currentlyShown;
    }
    this.setAttribute(ATTRS.VISIBLE, showDisclosure.toString());
    this.triggerEls.forEach(triggerEl => triggerEl.setAttribute('aria-expanded', showDisclosure.toString()));

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.CHANGED, {
      'detail': {
        'id': this.id,
        'visible': showDisclosure,
      }
    }));
  }


  /*
    Handles clicks on the window and if a trigger for this instance clicked run setDisclosure
  */
  private windowClickHandler(e: MouseEvent): void {
    // Check that the trigger clicked is linked to this disclosure instance
    const triggerClicked = (e.target as HTMLElement).closest(this.triggerSelector);
    if (!triggerClicked) {
      return;
    }

    let showDisclosure: boolean = null;
    if (triggerClicked.hasAttribute(ATTRS.TRIGGER_SHOW)) {
      showDisclosure = true;
    }
    if (triggerClicked.hasAttribute(ATTRS.TRIGGER_HIDE)) {
      showDisclosure = false;
    }

    this.setDisclosure(showDisclosure);
  }
}


/* INITIALISE AND REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  autoID(DISCLOSURE);
  customElements.define(DISCLOSURE, Disclosure);
});
