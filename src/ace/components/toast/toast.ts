/* IMPORTS */
import {NAME} from '../../common/constants.js';
import {autoID} from '../../common/functions.js';


/* COMPONENT NAME */
export const TOAST = `${NAME}-toast`;


/* CONSTANTS */
export const ATTRS = {
  SHOW_TIME: `${TOAST}-show-time`,
  VISIBLE: `${TOAST}-visible`,
};


export const EVENTS = {
  DETAIL_PROPS: {
    VISIBLE: 'visible',
  },
  OUT: {
    CHANGED: `${TOAST}-changed`,
    READY: `${TOAST}-ready`,
  },
};


export const DEFAULT_SHOW_TIME = 4000;


/* CLASS */
export default class Toast extends HTMLElement {
  private initialised = false;
  private innerEl: HTMLElement;
  private showTime: number;
  private showTimeout: number|null = null;


  constructor() {
    super();


    /* CLASS METHOD BINDINGS */
  }


  static get observedAttributes(): Array<string> {
    return [ATTRS.VISIBLE];
  }


  private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (!this.initialised || oldValue === newValue) {
      return;
    }

    const visible = (newValue === 'true');

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.CHANGED, {
      'detail': {
        'id': this.id,
        [EVENTS.DETAIL_PROPS.VISIBLE]: visible,
      }
    }));

    clearTimeout(this.showTimeout);
    if (newValue === 'true') {
      this.showTimeout = window.setTimeout(() => this.setAttribute(ATTRS.VISIBLE, 'false'), this.showTime);
    }
  }


  public connectedCallback(): void {
    /* GET DOM ELEMENTS */


    /* GET DOM DATA */
    this.showTime = parseInt(this.getAttribute(ATTRS.SHOW_TIME)) || DEFAULT_SHOW_TIME;


    /* SET DOM DATA */
    this.setAttribute(ATTRS.VISIBLE, 'false');
    this.setAttribute('role', 'status');
    this.setAttribute('aria-live', 'polite');


    /* ADD EVENT LISTENERS */


    /* INITIALISATION */
    this.initialised = true;

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
      'detail': {
        'id': this.id,
      }
    }));
  }
}


/* REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  autoID(TOAST);
  customElements.define(TOAST, Toast);
});
