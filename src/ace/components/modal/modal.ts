/* IMPORTS */
import {
  FocusTrap,
  autoID,
  getInteractableDescendants,
  keyPressedMatches,
  warnIfElHasNoAriaLabel
} from '../../common/functions.js';
import {KEYS, NAME} from '../../common/constants.js';


/* COMPONENT NAME */
export const MODAL = `${NAME}-modal`;


/* CONSTANTS */
export const ATTRS = {
  BACKDROP: `${MODAL}-backdrop`,
  HIDE_BTN: `${MODAL}-hide-btn`,
  IS_VISIBLE: `${MODAL}-is-visible`,
  TRIGGER: `${MODAL}-trigger-for`,
  TRIGGER_HIDE: `${MODAL}-trigger-hide`,
  TRIGGER_SHOW: `${MODAL}-trigger-show`,
  VISIBLE: `${MODAL}-visible`,
};


export const EVENTS = {
  IN: {
    HIDE: `${MODAL}-hide`,
    SHOW: `${MODAL}-show`,
    TOGGLE: `${MODAL}-toggle`,
    UPDATE_FOCUS_TRAP: `${MODAL}-update-focus-trap`,
  },
  OUT: {
    CHANGED: `${MODAL}-changed`,
    READY: `${MODAL}-ready`,
  },
};


/* CLASS */
export default class Modal extends HTMLElement {
  private backdropEl: HTMLElement;
  private canUseInert = false;
  private firstInteractableDescendant: HTMLElement;
  private focusTrap: FocusTrap;
  private inertableElements: Array<Element>;
  private lastActiveElement: HTMLElement;
  private modalVisible: boolean;


  constructor() {
    super();


    /* CLASS METHOD BINDINGS */
    this.clickHandler = this.clickHandler.bind(this);
    this.customEventsHandler = this.customEventsHandler.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
  }


  static get observedAttributes(): Array<string> {
    return [ATTRS.VISIBLE];
  }


  private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === null || oldValue === newValue) {
      return;
    }

    const newValueBoolean = newValue === 'true';
    if (newValueBoolean) {
      // Add keydown listener to handle ESC key presses
      window.addEventListener('keydown', this.keydownHandler);

      this.modalVisible = true;
      document.body.setAttribute(ATTRS.IS_VISIBLE, '');
      this.backdropEl.setAttribute(ATTRS.IS_VISIBLE, '');

      // Store element that was active before Modal was shown, to return to when Modal is hidden
      this.lastActiveElement = document.activeElement as HTMLElement;

      // Add inert HTML attribute to all body children except backdrop and this Modal
      if (this.canUseInert) {
        this.inertableElements = [...document.body.children]
          .filter((child) => child !== this && !child.hasAttribute(ATTRS.BACKDROP) && child.tagName !== 'SCRIPT');
        this.inertableElements.forEach(child => (child as any).inert = true);
      }

      this.firstInteractableDescendant.focus();
    } else {
      window.removeEventListener('keydown', this.keydownHandler);
      this.modalVisible = false;
      document.body.removeAttribute(ATTRS.IS_VISIBLE);
      this.backdropEl.removeAttribute(ATTRS.IS_VISIBLE);

      // Remove inert HTML attribute from all body children to which it was added when Modal was shown
      if (this.canUseInert) {
        this.inertableElements.forEach(child => (child as any).inert = false);
      }

      this.lastActiveElement.focus();
    }

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.CHANGED, {
      'detail': {
        'id': this.id,
        'visible': newValueBoolean,
      }
    }));
  }


  public connectedCallback(): void {
    // Determine whether browser supports HTML inert attribute and Modal is a child of body so it can be used later to trap focus
    const body = document.body as any;
    const browserSupportsInert = (body.inert === true || body.inert === false);
    if (browserSupportsInert) {
      this.canUseInert = this.parentElement === body;
    }


    /* GET DOM ELEMENTS */
    // Get backdrop element or create it if not present and add as last child of bodys
    this.backdropEl = document.querySelector(`[${ATTRS.BACKDROP}]`);
    if (!this.backdropEl) {
      this.backdropEl = document.createElement('div');
      this.backdropEl.setAttribute(ATTRS.BACKDROP, '');
      document.body.append(this.backdropEl);
    }


    /* GET DOM DATA */


    /* SET DOM DATA */
    this.modalVisible = this.hasAttribute(ATTRS.VISIBLE);
    this.setAttribute(ATTRS.VISIBLE, this.modalVisible.toString());
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-modal', 'true');


    /* ADD EVENT LISTENERS */
    this.addEventListener('click', this.clickHandler);
    this.addEventListener(EVENTS.IN.TOGGLE, this.customEventsHandler);
    if (!this.canUseInert) {
      this.addEventListener(EVENTS.IN.UPDATE_FOCUS_TRAP, this.customEventsHandler);
    }


    /* INITIALISATION */
    warnIfElHasNoAriaLabel(this, 'Modal');

    // Create a hide Modal button if none are present and add as first child of modal
    let hideModalBtn = this.querySelector(`button[${ATTRS.HIDE_BTN}]`);
    if (!hideModalBtn) {
      hideModalBtn = document.createElement('button');
      hideModalBtn.setAttribute(ATTRS.HIDE_BTN, '');
      hideModalBtn.setAttribute('aria-label', 'hide modal');
      hideModalBtn.innerHTML = '&#x2715;';
      this.prepend(hideModalBtn);
    }

    this.firstInteractableDescendant = getInteractableDescendants(this)[0][0];

    // If inert cannot be used for this instance then use FocusTrap instead
    if (!this.canUseInert) {
      this.focusTrap = new FocusTrap(this);
    }

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
      'detail': {
        'id': this.id,
      }
    }));
  }


  public disconnectedCallback(): void {
    this.focusTrap.destroy();

    /* REMOVE EVENT LISTENERS */
    this.removeEventListener('click', this.clickHandler);
    this.removeEventListener(EVENTS.IN.TOGGLE, this.customEventsHandler);
    if (!this.canUseInert) {
      this.removeEventListener(EVENTS.IN.UPDATE_FOCUS_TRAP, this.customEventsHandler);
    }
  }


  /*
    Handle click events
  */
  private clickHandler(e: MouseEvent): void {
    // Hide modal if a hide modal button is clicked
    const hideModalBtnClicked = (e.target as HTMLElement).closest(`button[${ATTRS.HIDE_BTN}]`);
    if (hideModalBtnClicked) {
      this.setAttribute(ATTRS.VISIBLE, 'false');
    }
  }


  /*
    Handle custom events
  */
  private customEventsHandler(e: CustomEvent): void {
    switch(e.type) {
      case EVENTS.IN.HIDE:
        this.setAttribute(ATTRS.VISIBLE, 'false');
        break;
      case EVENTS.IN.SHOW:
        this.setAttribute(ATTRS.VISIBLE, 'true');
        break;
      case EVENTS.IN.TOGGLE:
        this.setAttribute(ATTRS.VISIBLE, (!this.modalVisible).toString());
        break;
      case EVENTS.IN.UPDATE_FOCUS_TRAP:
        this.focusTrap.getInteractableDescendants();
        this.firstInteractableDescendant = this.focusTrap.interactableDescendants[0];
        break;
    }
  }


  /*
    Handle keystrokes on Modal
  */
  private keydownHandler(e: KeyboardEvent): void {
    // Hide Modal if Esc pressed
    const keyPressed = e.key || e.which || e.keyCode;
    if (keyPressedMatches(keyPressed, KEYS.ESCAPE)) {
      this.setAttribute(ATTRS.VISIBLE, 'false');
      return;
    }
  }
}


/* INITIALISE AND REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  autoID(MODAL);
  customElements.define(MODAL, Modal);

  window.addEventListener('click', (e) => {
    const triggerClicked = (e.target as HTMLElement).closest(`[${ATTRS.TRIGGER}]`);
    const backdropClicked = (e.target as HTMLElement).closest(`[${ATTRS.BACKDROP}]`);
    if (!triggerClicked && !backdropClicked) {
      return;
    }

    // Show Modal if any of its triggers are clicked
    if (triggerClicked) {
      const modalId = triggerClicked.getAttribute(ATTRS.TRIGGER);
      document.getElementById(modalId).setAttribute(ATTRS.VISIBLE, 'true');
      return;
    }

    // Hide any visible Modals if backdrop clicked (allows Modals to be triggered from within other visible Modals)
    const visibleModalEls = document.querySelectorAll(`${MODAL}[${ATTRS.VISIBLE}]`);
    visibleModalEls.forEach(visibleModalEl => visibleModalEl.setAttribute(ATTRS.VISIBLE, 'false'));
  });
});
