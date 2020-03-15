/* IMPORTS */
import {NAME, KEYS} from '../../common/constants.js';
import {Listbox, ATTRS as LISTBOX_ATTRS} from '../listbox/listbox.js';
import {handleOverflow, keyPressedMatches} from '../../common/functions.js';


/* EXPORTED CONSTANTS */
export const SELECT = `${NAME}-select`;


export const ATTRS = {
  LIST: `${SELECT}-list`,
  LIST_HIDDEN: `${SELECT}-list-hidden`,
  TRIGGER: `${SELECT}-trigger`,
};



/* CLASS */
export class Select extends Listbox {
  constructor() {
    super();

    /* CLASS INSTANCE CONSTANTS */


    /* CLASS METHOD BINDINGS */
    this.selectClickHandler = this.selectClickHandler.bind(this);
    this.selectKeydownHandler = this.selectKeydownHandler.bind(this);
    this.showList = this.showList.bind(this);
    this.hideList = this.hideList.bind(this);
  }


  /* CLASS METHODS */
  connectedCallback() {
    super.connectedCallback.call(this);

    /* GET DOM ELEMENTS */
    this.triggerEl = this.querySelector('button');
    this.listEl = this.querySelector('ul') || this.querySelector('ol');


    /* GET DOM DATA */



    /* SET DOM DATA */
    // Set trigger attrs
    this.triggerEl.id = this.triggerEl.id || `${this.id}-trigger`;
    this.triggerEl.setAttribute(ATTRS.TRIGGER, '');

    if (!this.getAttribute('aria-haspopup')) {
      this.triggerEl.setAttribute('aria-haspopup', 'listbox');
    }

    // Set list attrs
    this.listEl.setAttribute(ATTRS.LIST, '');
    this.listEl.setAttribute('tabindex', '-1');


    /* ATTACH EVENT LISTENERS */
    window.addEventListener('click', this.selectClickHandler, {passive: true});
    this.addEventListener('keydown', this.selectKeydownHandler);
    this.listEl.addEventListener('blur', this.hideList, {passive: true});


    /* INITIALISATION CODE */
    this.hideList();
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
    if (keydownOnTrigger && keyPressedMatches(keyPressed, [KEYS.UP, KEYS.DOWN])) {
      e.preventDefault();
      this.showList();
      this.listEl.focus();
      return;
    }

    if (keydownOnList && keyPressedMatches(keyPressed, [KEYS.ENTER, KEYS.ESCAPE])) {
      e.preventDefault();
      this.hideList();
      this.triggerEl.focus();
      return;
    }
  }


  /*
    Hide dropdown list and update trigger text
  */
  hideList() {
    const activeOption = this.listEl.querySelector('[aria-selected="true"]');
    if (activeOption !== null) {
      this.triggerEl.textContent = activeOption.textContent;
    }

    this.triggerEl.setAttribute('aria-expanded', 'false');
    this.listEl.setAttribute(ATTRS.LIST_HIDDEN, '');
  }


  /*
    Show dropdown list
  */
  showList() {
    this.triggerEl.setAttribute('aria-expanded', 'true');
    this.listEl.removeAttribute(ATTRS.LIST_HIDDEN);
    handleOverflow(this.listEl);
  }


  disconnectedCallback() {
    /* DETACH EVENT LISTENERS */
    window.removeEventListener('click', this.selectClickHandler, { passive: true });
    this.removeEventListener('keydown', this.selectKeydownHandler);
    this.listEl.removeEventListener('blur', this.hideList, { passive: true });

    super.disconnectedCallback.call(this);
  }
}


customElements.define(SELECT, Select);
