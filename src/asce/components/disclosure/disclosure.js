/* IMPORTS */
import {NAME, KEYS} from '../../common/constants.js';
import {autoID, keyPressedMatches} from '../../common/functions.js';


/* COMPONENT NAME */
export const DISCLOSURE = `${NAME}-disclosure`;


/* CONSTANTS */
export const ATTRS = {
  TRIGGER: `${DISCLOSURE}-trigger-for`
};


// TODO: Consider adding extra events for hooking animations into.
export const EVENTS = {
  TOGGLE: `${DISCLOSURE}-toggle`,
  OPENED: `${DISCLOSURE}-opened`,
  CLOSED: `${DISCLOSURE}-closed`,
  UPDATE_TRIGGERS: `${DISCLOSURE}-update-triggers`
};


/* CLASS */
export class Disclosure extends HTMLElement {
  /* CONSTRUCTOR */
  constructor() {
    super();


    /* CLASS CONSTANTS */


    /* CLASS METHOD BINDINGS */
    this.isShown = this.isShown.bind(this);
    this.setDisclosureVisibility = this.setDisclosureVisibility.bind(this);
    this.toggleDisclosure = this.toggleDisclosure.bind(this);
    this.toggleEventHandler = this.toggleEventHandler.bind(this);
    this.updateTriggersHandler = this.updateTriggersHandler.bind(this);
    this.windowClickHandler = this.windowClickHandler.bind(this);
    this.windowKeyDownHandler = this.windowKeyDownHandler.bind(this);
  }


  /* CLASS METHODS */
  connectedCallback() {
    /* GET DOM ELEMENTS */
    // Get triggers
    this.triggers = this.getTriggers(this.id);


    /* SET DOM DATA */
    // Set disclosure attrs
    const expandedTriggers = Array.from(this.triggers).filter(elem => elem.getAttribute('aria-expanded') === 'true');
    if (expandedTriggers.length) {
      this.setAttribute('aria-hidden', 'false');
    } else {
      this.setAttribute('aria-hidden', 'true');
    }

    // TODO: Add support for multiple triggers (setting aria-expanded on all triggers)
    // Set trigger attrs
    this.triggers.forEach(toggle => {
      toggle.setAttribute('aria-controls', this.id);
      if (toggle.tagName !== 'BUTTON') {
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('tabindex', '0');
      }
    });


    /* ADD EVENT LISTENERS */
    window.addEventListener('click', this.windowClickHandler, {passive: true});
    window.addEventListener('keydown', this.windowKeyDownHandler, {passive: true});
    window.addEventListener(EVENTS['TOGGLE'], this.toggleEventHandler, {passive: true});
    window.addEventListener(EVENTS['UPDATE_TRIGGERS'], this.updateTriggersHandler, {passive: true});
  }


  /*
    Get all triggers
  */
  getTriggers(id) {
    // Get all the triggers for this disclosure
    return document.querySelectorAll(`[${ATTRS['TRIGGER']}=${id}]`);
  }


  /*
    Determine if disclosure is visible or not
  */
  isShown() {
    return this.getAttribute('aria-hidden') === 'false';
  }


  /*
    Show disclosure
  */
  setDisclosureVisibility(visible) {
    this.setAttribute('aria-hidden', !visible);
    this.triggers.forEach(elem => elem.setAttribute('aria-expanded', visible));
    this.dispatchEvent(new CustomEvent(visible ? EVENTS['OPENED'] : EVENTS['CLOSED'], {detail: {
      'id': this.id
    }}));
  }


  /*
    Toggle disclosure
  */
  toggleDisclosure() {
    // Toggle visibility and aria attributes
    this.setDisclosureVisibility(!this.isShown());
  }


  /*
    Handle when trigger event is dispatched
  */
  toggleEventHandler(e) {
    // Check the event is for this instance
    if (e.detail['id'] !== this.id) {
      return;
    }

    this.toggleDisclosure(e.detail['trigger']);
  }


  /*
    Handle keypresses on triggers
  */
  updateTriggersHandler(e) {
    const detail = e['detail'];
    if (!detail || (detail['id'] !== this.id)) {
      return;
    }

    this.triggers = this.getTriggers(this.id);
  }


  /*
    Handle clicks on triggers
  */
  windowClickHandler(e) {
    // Check that the trigger clicked is linked to this disclosure instance
    const triggerClicked = e.target.closest(`[${ATTRS['TRIGGER']}=${this.id}]`);
    if (!triggerClicked) {
      return;
    }

    window.dispatchEvent(new CustomEvent(EVENTS['TOGGLE'], {
      detail: {
        'id': this.id,
        'trigger': triggerClicked
    }}));
  }


  /*
    Handle keypresses on triggers
  */
  windowKeyDownHandler(e) {
    // Check that the trigger focused is linked to this disclosure instance
    const triggerClicked = e.target.closest(`[${ATTRS['TRIGGER']}=${this.id}]`);
    if (!triggerClicked) {
      return;
    }

    // if enter or space is pressed then toggle the disclosure
    const keyPressed = e.key || e.which || e.keyCode;
    if (keyPressedMatches(keyPressed, [KEYS.ENTER, KEYS.SPACE])) {
      this.toggleDisclosure(e.target);
    }
  }


  disconnectedCallback() {
    /* REMOVE EVENT LISTENERS */
    window.removeEventListener('click', this.windowClickHandler, {passive: true});
    window.removeEventListener('keydown', this.windowKeyDownHandler, {passive: true});
    window.removeEventListener(EVENTS['TOGGLE'], this.toggleEventHandler, {passive: true});
    window.removeEventListener(EVENTS['UPDATE_TRIGGERS'], this.updateTriggersHandler, {passive: true});
  }
}


/* REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  autoID(DISCLOSURE);
  customElements.define(DISCLOSURE, Disclosure);
});
