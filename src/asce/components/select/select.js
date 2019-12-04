/* IMPORTS */
import { libraryName, KEYBOARD_KEYS as KEYS } from '../../common/constants.js';
import { Listbox, ATTRS as LISTBOX_ATTRS } from '../listbox/listbox.js';
import { keyPressedMatches } from '../../common/common.js';


/* CONSTANTS */
export const NAME = `${libraryName}-select`;

export const ATTRS = {
  TRIGGER: `${NAME}-trigger`,
  LIST: `${NAME}-list`,
  LIST_HIDDEN: `${NAME}-list-hidden`,
};


/* CLASS */
export class Select extends Listbox {
  /* CONSTRUCTOR */
  constructor() {
    super();

    /* CLASS INSTANCE CONSTANTS */

    /* GET DOM ELEMENTS */
    this.trigger = this.querySelector('button');
    this.list = this.querySelector('ul');

    /* GET DOM DATA */

    /* BIND 'THIS' TO CLASS METHODS */
    this.selectClickHandler = this.selectClickHandler.bind(this);
    this.selectKeydownHandler = this.selectKeydownHandler.bind(this);
    this.showList = this.showList.bind(this);
    this.hideList = this.hideList.bind(this);
  }


  /* CLASS METHODS */
  connectedCallback() {
    Listbox.prototype.connectedCallback.call(this);

    /* ATTACH EVENT LISTENERS */
    window.addEventListener('click', this.selectClickHandler, { passive: true });
    this.addEventListener('keydown', this.selectKeydownHandler);
    this.list.addEventListener('blur', this.hideList, { passive: true });


    /* SET INITIAL STATES */
    // Set trigger attrs
    this.trigger.id = this.trigger.id || `${this.id}-trigger`;
    this.trigger.setAttribute(ATTRS.TRIGGER, '');

    if (!this.getAttribute('aria-haspopup')) {
      this.trigger.setAttribute('aria-haspopup', 'listbox');
    }

    // Set list attrs
    this.list.setAttribute(ATTRS.LIST, '');
    this.list.setAttribute('tabindex', '-1');

    /* INITIALISATION CODE */
    this.hideList();
  }


  /*
    Handle clicks on trigger and on listbox options
  */
  selectClickHandler(e) {
    const optionClicked = e.target.closest(`[${LISTBOX_ATTRS.OPTION_INDEX}]`);
    const triggerClicked = e.target.closest(`[${ATTRS.TRIGGER}]`) === this.trigger;

    if (!optionClicked && !triggerClicked) {
      return;
    }

    if (triggerClicked) {
      this.showList();
      this.list.focus();
      return;
    }

    this.hideList();
  }


  /*
    Handle keystrokes
  */
  selectKeydownHandler(e) {
    const keydownOnTrigger = e.target.closest(`[${ATTRS.TRIGGER}]`);
    const keydownOnList = e.target.closest(`[${LISTBOX_ATTRS.LIST}]`);

    if (!keydownOnTrigger && !keydownOnList) {
      return;
    }

    const keyPressed = e.key || e.which || e.keyCode;
    if (keydownOnTrigger && keyPressedMatches(keyPressed, [KEYS.UP, KEYS.DOWN])) {
      this.showList();
      this.list.focus();
      Listbox.prototype.keydownHandler.call(this, e);
      return;
    }

    if (keydownOnList && keyPressedMatches(keyPressed, [KEYS.ENTER, KEYS.ESCAPE])) {
      e.preventDefault();
      this.hideList();
      this.trigger.focus();
      return;
    }
  }


  /*
    Hide dropdown list and update trigger text
  */
  hideList() {
    const activeOption = this.list.querySelector('[aria-selected="true"]');
    if (activeOption !== null) {
      this.trigger.textContent = activeOption.textContent;
    }

    this.trigger.removeAttribute('aria-expanded');
    this.list.setAttribute(ATTRS.LIST_HIDDEN, '');
  }


  /*
    Show dropdown list
  */
  showList() {
    this.trigger.setAttribute('aria-expanded', 'true');
    this.list.removeAttribute(ATTRS.LIST_HIDDEN);
  }
}


customElements.define(NAME, Select);
