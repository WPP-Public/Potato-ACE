/* IMPORTS */
import { libraryName, KEYBOARD_KEYS as KEYS } from '../../common/constants.js';
import { keyPressedMatches } from '../../common/common.js';

/* CONSTANTS */
export const NAME = `${libraryName}-disclosure`;

export const ATTRS = {
  TRIGGER: `${NAME}-trigger-for`
};

// TODO: Consider adding extra events for hooking animations into.
export const EVENTS = {
  TOGGLE: `${NAME}-toggle`,
  OPENED: `${NAME}-opened`,
  CLOSED: `${NAME}-closed`,
  UPDATE_TRIGGERS: `${NAME}-update-triggers`
};

/* CLASS */
export class Disclosure extends HTMLElement {
  /* CONSTRUCTOR */
  constructor() {
    super();

    /* BIND 'THIS' TO CLASS METHODS */
    this.isShown = this.isShown.bind(this);
    this.showDisclosure = this.showDisclosure.bind(this);
    this.hideDisclosure = this.hideDisclosure.bind(this);
    this.toggleDisclosure = this.toggleDisclosure.bind(this);
    this.toggleEventHandler = this.toggleEventHandler.bind(this);
    this.windowClickHandler = this.windowClickHandler.bind(this);
    this.windowKeyDownHandler = this.windowKeyDownHandler.bind(this);
    this.updateTriggersHandler = this.updateTriggersHandler.bind(this);
  }

  /* CLASS METHODS */
  connectedCallback() {
    /* ATTACH EVENT LISTENERS */
    window.addEventListener('click', this.windowClickHandler, { passive: true });
    window.addEventListener('keydown', this.windowKeyDownHandler, { passive: true });
    window.addEventListener(EVENTS['TOGGLE'], this.toggleEventHandler, { passive: true });
    window.addEventListener(EVENTS['UPDATE_TRIGGERS'], this.updateTriggersHandler, { passive: true });

    // Get triggers
    this.triggers = this.getTriggers(this.id);

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
  }

  windowClickHandler(e) {
    // Check that the trigger clicked is linked to this disclosure instance
    const triggerClicked = e.target.closest(`[${ATTRS['TRIGGER']}=${this.id}]`);
    if (triggerClicked) {
      window.dispatchEvent(new CustomEvent(EVENTS['TOGGLE'], { detail: {
        'id': this.id,
        'trigger': triggerClicked
       }}));
    }
  }

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

  toggleEventHandler(e) {
    // Check the event is for this instance
    if (e.detail['id'] !== this.id) {
      return;
    }
    this.toggleDisclosure(e.detail['trigger']);
  }

  updateTriggersHandler(e) {
    // Check the event is for this instance
    if (e.detail['id'] !== this.id) {
      return;
    }
    this.triggers = this.getTriggers(this.id);
  }

  isShown() {
    return this.getAttribute('aria-hidden') === 'false';
  }

  showDisclosure() {
    // Set the disclosure to not be hidden, update trigger to be expanded and dispatch opened event
    this.setAttribute('aria-hidden', 'false');
    this.triggers.forEach(elem => elem.setAttribute('aria-expanded', 'true'));
    this.dispatchEvent(new CustomEvent(EVENTS['OPENED_EVENT'], { detail: {
      'id': this.id
    }}));
  }

  hideDisclosure() {
    // Set the disclosure to be hidden, update trigger to not be expanded and dispatch closed event
    this.setAttribute('aria-hidden', 'true');
    this.triggers.forEach(elem => elem.setAttribute('aria-expanded', 'false'));
    this.dispatchEvent(new CustomEvent(EVENTS['CLOSED_EVENT'], { detail: {
      'id': this.id
    }}));
  }

  toggleDisclosure() {
    // Toggle visibility and aria attributes
    if (this.isShown()) {
      this.hideDisclosure();
    } else {
      this.showDisclosure();
    }
  }

  getTriggers(id) {
    // Get all the triggers for this disclosure
    return document.querySelectorAll(`[${ATTRS['TRIGGER']}=${id}]`);
  }
}

customElements.define(NAME, Disclosure);
