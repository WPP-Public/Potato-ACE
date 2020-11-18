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


  constructor() {
    super();


    /* CLASS METHOD BINDINGS */
    this.customEventsHandler = this.customEventsHandler.bind(this);
  }


  static get observedAttributes(): Array<string> {
    return [ATTRS.VISIBLE];
  }


  private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === null || oldValue === newValue) {
      return;
    }

    const disclosureVisible = newValue === 'true';
    this.triggerEls.forEach(triggerEl => triggerEl.setAttribute('aria-expanded', disclosureVisible.toString()));

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.CHANGED, {
      'detail': {
        'id': this.id,
        'visible': disclosureVisible,
      }
    }));
  }


  public connectedCallback(): void {
    /* GET DOM ELEMENTS */
    this.triggerEls = document.querySelectorAll(`[${ATTRS.TRIGGER}=${this.id}]`);


    /* GET DOM DATA */
    const visible = this.hasAttribute(ATTRS.VISIBLE);


    /* SET DOM DATA */
    this.setAttribute(ATTRS.VISIBLE, visible.toString());

    this.triggerEls.forEach((triggerEl) => {
      triggerEl.setAttribute('aria-controls', this.id);
      triggerEl.setAttribute('aria-expanded', visible.toString());
    });


    /* ADD EVENT LISTENERS */
    this.addEventListener(EVENTS.IN.TOGGLE, this.customEventsHandler);


    /* INITIALISATION */
    window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
      'detail': {
        'id': this.id,
      }
    }));
  }


  public disconnectedCallback(): void {
    /* REMOVE EVENT LISTENERS */
    this.removeEventListener(EVENTS.IN.TOGGLE, this.customEventsHandler);
  }


  /*
    Handle custom events
  */
  private customEventsHandler(): void {
    const showDisclosure = !(this.getAttribute(ATTRS.VISIBLE) === 'true');
    this.setAttribute(ATTRS.VISIBLE, showDisclosure.toString());
  }
}


/* INITIALISE AND REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  autoID(DISCLOSURE);
  customElements.define(DISCLOSURE, Disclosure);

  // Add window click handler for disclosure triggers
  window.addEventListener('click', (e) => {
    const triggerClicked = (e.target as HTMLElement).closest(`[${ATTRS.TRIGGER}]`);
    if (!triggerClicked) {
      return;
    }

    const disclosureId = triggerClicked.getAttribute(ATTRS.TRIGGER);
    const disclosureEl = document.getElementById(disclosureId);

    let showDisclosure: boolean = null;
    if (triggerClicked.hasAttribute(ATTRS.TRIGGER_SHOW)) {
      showDisclosure = true;
    }
    else if (triggerClicked.hasAttribute(ATTRS.TRIGGER_HIDE)) {
      showDisclosure = false;
    }
    else {
      // Trigger is toggle
      showDisclosure = !(disclosureEl.getAttribute(ATTRS.VISIBLE) === 'true');
    }

    disclosureEl.setAttribute(ATTRS.VISIBLE, showDisclosure.toString());
  });
});
