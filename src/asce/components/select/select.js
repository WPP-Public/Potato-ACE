/* IMPORTS */
import {NAME, KEYS} from '../../common/constants.js';
import Listbox, {ATTRS as LISTBOX_ATTRS} from '../listbox/listbox.js';
import {autoID, handleOverflow, keyPressedMatches} from '../../common/functions.js';


/* COMPONENT NAME */
export const SELECT = `${NAME}-select`;


/* CONSTANTS */
export const ATTRS = {
  LIST: `${SELECT}-list`,
  LIST_HIDDEN: `${SELECT}-list-hidden`,
  TRIGGER: `${SELECT}-trigger`,
};


export const EVENTS = {
  OPTION_SELECTED: `${SELECT}-option-selected`,
};


/* CLASS */
export default class Select extends Listbox {
  constructor() {
    super();

    /* CLASS CONSTANTS */


    /* CLASS METHOD BINDINGS */
    this.dispatchOptionSelectedEvent = this.dispatchOptionSelectedEvent.bind(this);
    this.hideList = this.hideList.bind(this);
    this.selectClickHandler = this.selectClickHandler.bind(this);
    this.selectKeydownHandler = this.selectKeydownHandler.bind(this);
    this.showList = this.showList.bind(this);
    this.updateTriggerText = this.updateTriggerText.bind(this);
  }


  /* CLASS METHODS */
  connectedCallback() {
    super.connectedCallback();


    /* GET DOM ELEMENTS */
    this.triggerEl = this.querySelector('button');
    this.listEl = this.querySelector('ul') || this.querySelector('ol');


    /* GET DOM DATA */


    /* SET DOM DATA */
    // Set trigger attrs
    this.triggerEl.id = this.triggerEl.id || `${this.id}-trigger`;
    this.triggerEl.setAttribute(ATTRS.TRIGGER, '');
    this.triggerEl.setAttribute('aria-haspopup', 'listbox');

    // Set list attrs
    this.listEl.setAttribute(ATTRS.LIST, '');
    this.listEl.setAttribute('tabindex', '-1');


    /* ADD EVENT LISTENERS */
    this.listEl.addEventListener('blur', this.hideList, {passive: true});
    this.addEventListener('keydown', this.selectKeydownHandler);
    window.addEventListener('click', this.selectClickHandler, {passive: true});


    /* INITIALISATION */
    this.hideList();
  }


  /*
    Show dropdown list
  */
  dispatchOptionSelectedEvent() {
    const optionSelected = this.listEl.querySelector('[aria-selected="true"]');

    this.dispatchEvent(
      new CustomEvent(EVENTS.OPTION_SELECTED, {
        detail: {
          selectId: this.id,
          optionIndex: optionSelected.getAttribute(LISTBOX_ATTRS.OPTION_INDEX),
          optionId: optionSelected.id,
        }
      })
    );
  }


  /*
    Hide dropdown list and update trigger text
  */
  hideList() {
    this.updateTriggerText();
    this.listEl.setAttribute(ATTRS.LIST_HIDDEN, '');
    this.triggerEl.setAttribute('aria-expanded', 'false');
  }


  /*
    Handle clicks on trigger and on listbox options
  */
  selectClickHandler(e) {
    const optionClicked = e.target.closest(`[${LISTBOX_ATTRS.OPTION_INDEX}]`);
    const triggerClicked = e.target.closest(`[${ATTRS.TRIGGER}]`) === this.triggerEl;

    if (!optionClicked && !triggerClicked) {
      return;
   }

    if (triggerClicked) {
      this.showList();
      this.listEl.focus();
      return;
   }

    this.dispatchOptionSelectedEvent();
    this.hideList();
  }


  /*
    Handle keystrokes on select
  */
  selectKeydownHandler(e) {
    const keydownOnTrigger = e.target.closest(`[${ATTRS.TRIGGER}]`);
    const keydownOnList = e.target.closest(`[${LISTBOX_ATTRS.LIST}]`);

    if (!keydownOnTrigger && !keydownOnList) {
      return;
    }

    const keyPressed = e.key || e.which || e.keyCode;
    if (keydownOnList && keyPressedMatches(keyPressed, [KEYS.ENTER, KEYS.ESCAPE])) {
      e.preventDefault();
      this.hideList();
      this.triggerEl.focus();
      this.dispatchOptionSelectedEvent();
      return;
    }

    if (keyPressedMatches(keyPressed, [KEYS.UP, KEYS.DOWN])) {
      e.preventDefault();
      this.showList();
      this.listEl.focus();
      return;
    }

    this.activeOptionIndex = this.activeOptionIndex || 0;
    this.keydownHandler(e);
    this.updateTriggerText();
  }


  /*
    Show dropdown list
  */
  showList() {
    this.triggerEl.setAttribute('aria-expanded', 'true');
    this.listEl.removeAttribute(ATTRS.LIST_HIDDEN);
    handleOverflow(this.listEl);
  }


  /*
    Show dropdown list
  */
  updateTriggerText() {
    const activeOption = this.listEl.querySelector('[aria-selected="true"]');
    if (activeOption !== null) {
      this.triggerEl.textContent = activeOption.textContent;
    }
  }


  disconnectedCallback() {
    /* REMOVE EVENT LISTENERS */
    this.listEl.removeEventListener('blur', this.hideList, {passive: true});
    this.removeEventListener('keydown', this.selectKeydownHandler);
    window.removeEventListener('click', this.selectClickHandler, {passive: true});

    super.disconnectedCallback();
  }
}


/* INITIALISE AND REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  autoID(SELECT);
  customElements.define(SELECT, Select);
});
