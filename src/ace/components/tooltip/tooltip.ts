/* IMPORTS */
import {DISPLAY_NAME, FOCUSABLE_ELEMENTS_SELECTOR, KEYS, NAME} from '../../common/constants.js';
import {autoID, handleOverflow, keyPressedMatches} from '../../common/functions.js';


/* COMPONENT NAME */
export const TOOLTIP = `${NAME}-tooltip`;


/* CONSTANTS */
export const ATTRS = {
  DELAY: `${TOOLTIP}-delay`,
  TARGET: `${TOOLTIP}-target`,
  VISIBLE: `${TOOLTIP}-visible`,
};


export const EVENTS = {
  IN: {
    HIDE: `${TOOLTIP}-hide`,
    SHOW: `${TOOLTIP}-show`,
  },
  OUT: {
    CHANGED: `${TOOLTIP}-changed`,
    READY: `${TOOLTIP}-ready`,
  },
};

export const DEFAULT_DELAY = 1000;


/* CLASS */
export default class Tooltip extends HTMLElement {
  private delay: number;
  private isDisabled: boolean;
  private showTimeout: number|null = null;
  private targetEl: Element;


  constructor() {
    super();


    /* CLASS METHOD BINDINGS */
    this.hide = this.hide.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.show = this.show.bind(this);
    this.tooltipIsPrimaryLabel = this.tooltipIsPrimaryLabel.bind(this);
  }


  static get observedAttributes(): Array<string> {
    return ['disabled'];
  }


  private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue !== newValue) {
      this.isDisabled = !(newValue === null);
    }
  }


  public connectedCallback(): void {
    /* GET DOM ELEMENTS */
    this.targetEl = this.parentElement;
    // If target is not focusable tooltip is not accessible to keyboard users
    if (
      !this.targetEl.closest(FOCUSABLE_ELEMENTS_SELECTOR) &&
      (this.targetEl.getAttribute('tabindex') && parseInt(this.targetEl.getAttribute('tabindex')) <= 0)
    ) {
      console.error(`${DISPLAY_NAME}: The target of Tooltip with ID ${this.id} is not a focusable element making the tooltip inaccessible to keyboard users.`);
      return;
    }


    /* GET DOM DATA */
    const delay = parseInt(this.getAttribute(ATTRS.DELAY));
    this.delay = (delay || delay === 0) ? delay : DEFAULT_DELAY;


    /* SET DOM DATA */
    this.setAttribute('role', 'tooltip');
    this.targetEl.setAttribute(ATTRS.TARGET, '');

    // If target has no text content nor aria-label, nor aria-labelledby then tooltip is set to it's aria-labelledby attribute, otherwise it's set to the target's aria-describedby attribute
    const isPrimaryLabel = this.tooltipIsPrimaryLabel();
    this.targetEl.setAttribute(isPrimaryLabel ? 'aria-labelledby' : 'aria-describedby', this.id);


    /* ADD EVENT LISTENERS */
    this.targetEl.addEventListener('blur', this.hide);
    this.targetEl.addEventListener('click', this.hide);
    this.targetEl.addEventListener('focus', this.show);
    this.targetEl.addEventListener('keydown', this.keydownHandler);
    this.targetEl.addEventListener('mouseenter', this.show);
    this.targetEl.addEventListener('mouseleave', this.hide);
    this.addEventListener(EVENTS.IN.HIDE, this.hide);
    this.addEventListener(EVENTS.IN.SHOW, this.show);


    /* INITIALISATION */
    window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
      'detail': {
        'id': this.id,
      }
    }));
  }


  public disconnectedCallback(): void {
    /* REMOVE EVENT LISTENERS */

    this.targetEl.removeEventListener('blur', this.hide);
    this.targetEl.removeEventListener('click', this.hide);
    this.targetEl.removeEventListener('focus', this.show);
    this.targetEl.removeEventListener('keydown', this.keydownHandler);
    this.targetEl.removeEventListener('mouseenter', this.show);
    this.targetEl.removeEventListener('mouseleave', this.hide);
    this.removeEventListener(EVENTS.IN.HIDE, this.hide);
    this.removeEventListener(EVENTS.IN.SHOW, this.show);
  }


  /*
    Hide tooltip
  */
  private hide(): void {
    clearTimeout(this.showTimeout);
    this.removeAttribute(ATTRS.VISIBLE);

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.CHANGED, {
      'detail': {
        'id': this.id,
        'visible': false,
      }
    }));
  }


  /*
    Handle keydown event
  */
  private keydownHandler(e: KeyboardEvent): void {
    const keyPressed = e.key || e.which || e.keyCode;
    if (keyPressedMatches(keyPressed, KEYS.ESCAPE)) {
      if(!this.hasAttribute(ATTRS.VISIBLE)) {
        return;
      }

      // stop propagation to prevent Esc from affecting ancestors, e.g. closing a modal the tooltip target is in
      e.stopPropagation();
      this.hide();
    }
  }


  /*
    Show tooltip
  */
  private show(): void {
    if (this.isDisabled) {
      return;
    }

    clearTimeout(this.showTimeout);
    handleOverflow(this);
    this.showTimeout = window.setTimeout(() => this.setAttribute(ATTRS.VISIBLE, ''), this.delay);

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.CHANGED, {
      'detail': {
        'id': this.id,
        'visible': true,
      }
    }));
  }


  /*
    Determine if tooltip text is a primary or secondary label based on whether or not the tooltip target has text or is labelled
  */
  private tooltipIsPrimaryLabel(): boolean {
    if (this.targetEl.textContent.trim().length - this.textContent.trim().length) {
      return false;
    }

    const targetAriaLabel = this.targetEl.getAttribute('aria-label');
    if (targetAriaLabel && targetAriaLabel.length) {
      return false;
    }

    const targetLabellingElId = this.targetEl.getAttribute('aria-labelledby');
    const targetLabellingEl = document.getElementById(targetLabellingElId);
    return !(targetLabellingEl && targetLabellingEl.textContent.length);
  }
}


/* REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  autoID(TOOLTIP);
  customElements.define(TOOLTIP, Tooltip);
});
