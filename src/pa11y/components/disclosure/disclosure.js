import { KEYBOARD_KEYS as KEYS } from '../../common/constants.js';


// CONSTANTS
const BASE_CONST = 'pa11y-disclosure';
export const CONSTS = {
  ELEM: `${BASE_CONST}`,
  TRIGGER: `${BASE_CONST}-trigger-for`,
  TOGGLE_EVENT: `a11yToggleDisclosure`,
};


// CLASS
export class Disclosure extends HTMLElement {
  constructor() {
    super();
    // DEFINE CONSTANTS
    this.contentVisible = false;

    // GET DOM ELEMENTS
    // Get the elements which toggle this disclosure
    this.toggleElems = document.querySelectorAll(`[${CONSTS.TRIGGER}=${this.id}]`);

    // GET DOM DATA

    // SET DOM DATA
    // Hide the disclosure
    this.style.display = 'none';
    // Set aria-controls attribute and role="button" for none button triggers
    this.toggleElems.forEach(toggle => {
      toggle.setAttribute('aria-controls', this.id);

      // If a non-button element is used as a trigger
      if (toggle.tagName !== 'BUTTON') {
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('tabindex', '0');
      }
    });

    // BIND 'THIS'
    this.windowClickHandler = this.windowClickHandler.bind(this);
    this.toggleDisclosure = this.toggleDisclosure.bind(this);
    this.windowKeydownHandler = this.windowKeydownHandler.bind(this);
    this.toggleEventHandler = this.toggleEventHandler.bind(this);

    // EVENT LISTENERS
    window.addEventListener('click', this.windowClickHandler);
    window.addEventListener('keydown', this.windowKeydownHandler);
    window.addEventListener(CONSTS.TOGGLE_EVENT, this.toggleEventHandler);
  }

  // Show or hide the disclosure content when a trigger is clicked
  windowClickHandler(e) {
    const triggerClicked = e.target.closest(`[${CONSTS.TRIGGER}=${this.id}]`);
    if (triggerClicked) {
      window.dispatchEvent(new CustomEvent(CONSTS.TOGGLE_EVENT, { detail: {
        'id': this.id,
        'trigger': triggerClicked
       }}));
    }
  }

  windowKeydownHandler(e) {
    const triggerClicked = e.target.closest(`[${CONSTS.TRIGGER}=${this.id}]`);
    if (!triggerClicked || triggerClicked.tagName === 'BUTTON') {
      return;
    }

    const keyPressed = e.key || e.which || e.keyCode;
    if (keyPressed === KEYS.ENTER.CODE ||
        keyPressed === KEYS.ENTER.KEY ||
        keyPressed === KEYS.SPACE.CODE ||
        keyPressed === KEYS.SPACE.KEY) {
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
    // Check the
    // Toggle content visibility
    if (this.contentVisible) {
      this.style.display = 'none';
      trigger.setAttribute('aria-expanded', 'false');
    } else {
      this.style.display = '';
      trigger.setAttribute('aria-expanded', 'true');
    }
    this.contentVisible = !this.contentVisible;
  }
}

customElements.define(BASE_CONST, Disclosure);
