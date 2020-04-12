/* IMPORTS */
import {NAME} from '../../common/constants.js';
import {autoID} from '../../common/functions.js';


/* CONSTANTS */
export const DISCLOSURE = `${NAME}-disclosure`;

export const ATTRS = {
  TRIGGER: `${DISCLOSURE}-trigger-for`,
  VISIBLE: `${DISCLOSURE}-visible`,
};

// TODO: Consider adding extra events for hooking animations into.
export const EVENTS = {
  TOGGLE: `${DISCLOSURE}-toggle`,
  TOGGLED: `${DISCLOSURE}-toggled`,
};



/* CLASS */
export default class Disclosure extends HTMLElement {
  /* CONSTRUCTOR */
  constructor() {
    super();

    /* CLASS CONSTANTS */
    this.disclosureTriggerSelector = `[${ATTRS.TRIGGER}=${this.id}]`;


    /* CLASS METHOD BINDINGS */
    this.toggleDisclosure = this.toggleDisclosure.bind(this);
    this.toggleEventHandler = this.toggleEventHandler.bind(this);
    this.windowClickHandler = this.windowClickHandler.bind(this);
  }


  /* CLASS METHODS */
  connectedCallback() {
    /* GET DOM ELEMENTS */
    this.triggerEls = document.querySelectorAll(this.disclosureTriggerSelector);


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
    window.addEventListener(EVENTS.TOGGLE, this.toggleEventHandler, {passive: true});
  }


  /*
    Handle keypresses on triggers
  */
  toggleDisclosure() {
    const visible = (this.getAttribute(ATTRS.VISIBLE) == 'true');

    this.setAttribute(ATTRS.VISIBLE, !visible);
    this.triggerEls.forEach(triggerEl => triggerEl.setAttribute('aria-expanded', !visible));

    window.dispatchEvent(new CustomEvent(EVENTS.TOGGLED,
      {
        'detail': {
          'id': this.id,
          'visible': !visible,
        }
      }
    ));
  }


  /*
    Toggle event handler
  */
  toggleEventHandler(e) {
    const detail = e['detail'];
    if (!detail || (detail['id'] !== this.id)) {
      return;
    }

    this.toggleDisclosure();
  }


  /*
    Determine if disclosure is visible or not
  */
  windowClickHandler(e) {
    // Check that the trigger clicked is linked to this disclosure instance
    const triggerClicked = e.target.closest(this.disclosureTriggerSelector);
    if (!triggerClicked) {
      return;
    }

    this.toggleDisclosure();
  }


  disconnectedCallback() {
    /* REMOVE EVENT LISTENERS */
    window.removeEventListener('click', this.windowClickHandler, {passive: true});
    window.removeEventListener(EVENTS.TOGGLE, this.toggleEventHandler, {passive: true});
  }
}



/* INITIALISE AND REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  autoID(DISCLOSURE);
  customElements.define(DISCLOSURE, Disclosure);
});
