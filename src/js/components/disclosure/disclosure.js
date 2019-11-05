import { KEYBOARD_KEYS as KEYS } from '../../common/constants';


// CONSTANTS
const BASE_ATTR = 'a11y-disclosure';
export const CONSTS = {
  ELEM: `${BASE_ATTR}`,
  TRIGGER: `${BASE_ATTR}-trigger-for`,
  TOGGLE_EVENT: `a11yToggleDisclosure`,
}


// CLASS
export class Disclosure {
  constructor(elem) {
    // DEFINE CONSTANTS
    this.elem = elem;
    this.contentVisible = false;

    // GET DOM ELEMENTS
    // Get the elements which toggle this disclosure
    this.toggleElems = document.querySelectorAll(`[${CONSTS.TRIGGER_ATTR}=${this.elem.id}]`);

    // GET DOM DATA

    // SET DOM DATA
    // Hide the disclosure
    this.elem.style.display = 'none';
    // Set aria-controls attribute and role="button" for none button triggers
    this.toggleElems.forEach(toggle => {
      toggle.setAttribute('aria-controls', this.elem.id);

      // If a non-button element is used as a trigger
      if (toggle.tagName !== 'BUTTON') {
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('tabindex', '0');
      }
    })

    // BIND 'THIS'
    this.windowClickHandler = this.windowClickHandler.bind(this);
    this.toggleDisclosure = this.toggleDisclosure.bind(this);
    this.windowKeydownHandler = this.windowKeydownHandler.bind(this);

    // EVENT LISTENERS
    window.addEventListener('click', this.windowClickHandler);
    window.addEventListener('keydown', this.windowKeydownHandler);
    this.elem.addEventListener(CONSTS.TOGGLE_EVENT, (e) => {
      this.toggleDisclosure(e.detail.trigger)
    });
  }


  static attachTo(elem) {
    return new Disclosure(elem);
  }


  // Show or hide the disclosure content when a trigger is clicked
  windowClickHandler(e) {
    const triggerClicked = e.target.closest(`[${CONSTS.TRIGGER_ATTR}=${this.elem.id}]`);
    if (triggerClicked) {
      this.toggleDisclosure(triggerClicked);
    }
  }


  toggleDisclosure(trigger) {
    // Toggle content visibility
    if (this.contentVisible) {
      this.elem.style.display = 'none';
      trigger.setAttribute('aria-expanded', 'false');
    } else {
      this.elem.style.display = '';
      trigger.setAttribute('aria-expanded', 'true');
    }
    this.contentVisible = !this.contentVisible;
  }


  windowKeydownHandler(e) {
    const triggerClicked = e.target.closest(`[${CONSTS.TRIGGER_ATTR}=${this.elem.id}]`);
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
}
