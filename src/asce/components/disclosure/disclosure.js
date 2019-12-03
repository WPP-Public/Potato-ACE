/* IMPORTS */
import { libraryName, KEYBOARD_KEYS as KEYS } from '../../common/constants.js';
import { keyPressedMatches } from '../../common/common.js';

/* CONSTANTS */
export const NAME = `${libraryName}-disclosure`;

export const ATTRS = {
  TRIGGER: `${NAME}-trigger-for`
};

export const EVENTS = {
  TOGGLE: `${NAME}-toggle`,
  OPENED: `${NAME}-opened`,
  CLOSED: `${NAME}-closed`
};

/* CLASS */
export class Disclosure extends HTMLElement {
  /* CONSTRUCTOR */
  constructor() {
    super();

    /* CLASS INSTANCE CONSTANTS */
    this.contentVisible = false;

    /* GET DOM ELEMENTS */
    this.triggers = document.querySelectorAll(`[${ATTRS['TRIGGER']}=${this.id}]`);

    /* BIND 'THIS' TO CLASS METHODS */
    this.toggleDisclosure = this.toggleDisclosure.bind(this);
    this.toggleEventHandler = this.toggleEventHandler.bind(this);
    this.windowClickHandler = this.windowClickHandler.bind(this);
    this.windowKeyDownHandler = this.windowKeyDownHandler.bind(this);
  }

  /* CLASS METHODS */
  connectedCallback() {
    /* ATTACH EVENT LISTENERS */
    window.addEventListener('click', this.windowClickHandler, { passive: true });
    window.addEventListener('keydown', this.windowKeyDownHandler, { passive: true });
    window.addEventListener(EVENTS['TOGGLE'], this.toggleEventHandler, { passive: true });

    // Set disclosure attrs
    this.setAttribute('aria-hidden', 'true');

    // Set trigger attrs
    this.triggers.forEach(toggle => {
      toggle.setAttribute('aria-controls', this.id);
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('tabindex', '0');
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
    const triggerClicked = e.target.closest(`[${ATTRS['TRIGGER']}=${this.id}]`);
    if (!triggerClicked || triggerClicked.tagName === 'BUTTON') {
      return;
    }

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

  toggleDisclosure(trigger) {
    // Toggle visibility and aria attributes
    if (this.contentVisible) {
      this.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      document.dispatchEvent(new CustomEvent(EVENTS['CLOSED_EVENT'], { detail: {
        'id': this.id
      }}));
    } else {
      this.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      document.dispatchEvent(new CustomEvent(EVENTS['OPENED_EVENT'], { detail: {
        'id': this.id
      }}));
    }
    this.contentVisible = !this.contentVisible;
  }
}

customElements.define(NAME, Disclosure);
