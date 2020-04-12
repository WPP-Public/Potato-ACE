/* IMPORTS */
import {NAME} from '../../common/constants.js';
import {autoID} from '../../common/functions.js';


export const DISCLOSURE = `${NAME}-disclosure`;


/* CONSTANTS */
export const ATTRS = {
  TRIGGER: `${DISCLOSURE}-trigger-for`,
  VISIBLE: `${DISCLOSURE}-visible`,
  SHOW: `${DISCLOSURE}-show`,
  HIDE: `${DISCLOSURE}-hide`,
};


export const EVENTS = {
  HIDE: `${DISCLOSURE}-hide`,
  SHOW: `${DISCLOSURE}-show`,
  TOGGLE: `${DISCLOSURE}-toggle`,
  CHANGED: `${DISCLOSURE}-changed`,
};



/* CLASS */
export default class Disclosure extends HTMLElement {
  /* CONSTRUCTOR */
  constructor() {
    super();

    /* CLASS CONSTANTS */
    this.triggerSelector = `[${ATTRS.TRIGGER}=${this.id}]`;


    /* CLASS METHOD BINDINGS */
    this.setDisclosure = this.setDisclosure.bind(this);
    this.customEventsHandler = this.customEventsHandler.bind(this);
    this.windowClickHandler = this.windowClickHandler.bind(this);
  }


  /* CLASS METHODS */
  connectedCallback() {
    /* GET DOM ELEMENTS */
    this.triggerEls = document.querySelectorAll(this.triggerSelector);


    /* GET DOM DATA */
    const visible = this.hasAttribute(ATTRS.VISIBLE);


    /* SET DOM DATA */
    this.setAttribute(ATTRS.VISIBLE, visible);

    this.triggerEls.forEach((triggerEl) => {
      triggerEl.setAttribute('aria-controls', this.id);
      triggerEl.setAttribute('aria-expanded', visible);
    });


    /* ADD EVENT LISTENERS */
    window.addEventListener('click', this.windowClickHandler, {passive: true});
    window.addEventListener(EVENTS.HIDE, this.customEventsHandler, {passive: true});
    window.addEventListener(EVENTS.SHOW, this.customEventsHandler, {passive: true});
    window.addEventListener(EVENTS.TOGGLE, this.customEventsHandler, {passive: true});
  }


  /*
    Show, hide or toggle the visibility of the disclosure
  */
  setDisclosure(showDisclosure) {
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
    this.setAttribute(ATTRS.VISIBLE, showDisclosure);
    this.triggerEls.forEach(triggerEl => triggerEl.setAttribute('aria-expanded', showDisclosure));

    window.dispatchEvent(new CustomEvent(
      EVENTS.CHANGED,
      {
        'detail': {
          'id': this.id,
          'shown': showDisclosure,
        }
      }
    ));
  }


  /*
    Handles custom events
  */
  customEventsHandler(e) {
    const detail = e['detail'];
    if (!detail || (detail['id'] !== this.id) || !e.type) {
      return;
    }

    let showDisclosure = null;
    if (e.type === EVENTS.SHOW) {
      showDisclosure = true;
    }
    if (e.type === EVENTS.HIDE) {
      showDisclosure = false;
    }

    this.setDisclosure(showDisclosure);
  }


  /*
    Handles clicks on the window and if a trigger for this instance clicked run setDisclosure
  */
  windowClickHandler(e) {
    // Check that the trigger clicked is linked to this disclosure instance
    const triggerClicked = e.target.closest(this.triggerSelector);
    if (!triggerClicked) {
      return;
    }

    let showDisclosure = null;
    if (triggerClicked.hasAttribute(ATTRS.SHOW)) {
      showDisclosure = true;
    }
    if (triggerClicked.hasAttribute(ATTRS.HIDE)) {
      showDisclosure = false;
    }

    this.setDisclosure(showDisclosure);
  }


  disconnectedCallback() {
    /* REMOVE EVENT LISTENERS */
    window.removeEventListener('click', this.windowClickHandler, {passive: true});
    window.removeEventListener(EVENTS.HIDE, this.toggleEventHandler, {passive: true});
    window.removeEventListener(EVENTS.SHOW, this.toggleEventHandler, {passive: true});
    window.removeEventListener(EVENTS.TOGGLE, this.toggleEventHandler, {passive: true});
  }
}


/* INITIALISE AND REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  autoID(DISCLOSURE);
  customElements.define(DISCLOSURE, Disclosure);
});
