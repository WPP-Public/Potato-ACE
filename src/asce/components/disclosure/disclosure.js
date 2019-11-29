import { KEYBOARD_KEYS as KEYS } from '../../common/constants.js';


// CONSTANTS
const BASE_CONST = 'asce-disclosure';
export const CONSTS = {
  ELEM: `${BASE_CONST}`,
  TRIGGER: `${BASE_CONST}-trigger-for`,
  TOGGLE_EVENT: `${BASE_CONST}-toggle`,
  OPENED_EVENT: `${BASE_CONST}-opened`,
  CLOSED_EVENT: `${BASE_CONST}-closed`
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
    // Set aria-controls attribute and role="button" for triggers
    this.toggleElems.forEach(toggle => {
      toggle.setAttribute('aria-controls', this.id);
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('tabindex', '0');
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
    // Toggle content visibility and dispatch event
    if (this.contentVisible) {
      this.style.display = 'none';
      trigger.setAttribute('aria-expanded', 'false');
      document.dispatchEvent(new CustomEvent(CONSTS.CLOSED_EVENT, { detail: {
        'id': this.id
      }}));
    } else {
      this.style.display = '';
      trigger.setAttribute('aria-expanded', 'true');
      document.dispatchEvent(new CustomEvent(CONSTS.OPENED_EVENT, { detail: {
        'id': this.id
      }}));
    }
    this.contentVisible = !this.contentVisible;
  }
}

customElements.define(BASE_CONST, Disclosure);
