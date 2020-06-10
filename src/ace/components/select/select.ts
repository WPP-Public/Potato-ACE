/* IMPORTS */
import {KEYS, NAME} from '../../common/constants.js';
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
  UPDATE_OPTIONS: `${SELECT}-update-options`,
};


/* CLASS */
export default class Select extends Listbox {
  private triggerEl: HTMLElement;
  private triggerOptionIndex: number;
  private selectedOptionEl: HTMLElement;

  constructor() {
    super();

    /* CLASS CONSTANTS */


    /* CLASS METHOD BINDINGS */
    this.cancelOptionChange = this.cancelOptionChange.bind(this);
    this.confirmOptionChange = this.confirmOptionChange.bind(this);
    this.dispatchOptionSelectedEvent = this.dispatchOptionSelectedEvent.bind(this);
    this.hideList = this.hideList.bind(this);
    this.selectClickHandler = this.selectClickHandler.bind(this);
    this.selectKeydownHandler = this.selectKeydownHandler.bind(this);
    this.selectUpdateOptionsHandler = this.selectUpdateOptionsHandler.bind(this);
    this.showList = this.showList.bind(this);
    this.updateTriggerText = this.updateTriggerText.bind(this);
  }


  /* CLASS METHODS */
  public connectedCallback(): void {
    super.connectedCallback();


    /* GET DOM ELEMENTS */
    this.listEl = this.querySelector('ul') || this.querySelector('ol');
    this.triggerEl = this.querySelector('button');
    // Create <button> if not present
    if (!this.triggerEl) {
      this.prepend(document.createElement('button'));
      this.triggerEl = this.querySelector('button');
    }


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
    this.addEventListener('keydown', this.selectKeydownHandler);
    window.addEventListener('click', this.selectClickHandler, {passive: true});
    window.addEventListener(EVENTS.UPDATE_OPTIONS, this.selectUpdateOptionsHandler, {passive: true});


    /* INITIALISATION */
    this.activeOptionIndex = 0;
    this.hideList();
    this.updateTriggerText();
  }


  /*
    Show dropdown list
  */
  private cancelOptionChange(): void {
    if (this.triggerOptionIndex || this.triggerOptionIndex == 0) {
      this.makeOptionActive(this.triggerOptionIndex);
    }
    this.hideList();
  }


  /*
    Confirm the change in selected option by updating the trigger text, hiding the
  */
  private confirmOptionChange(): void {
    this.updateTriggerText();
    this.hideList();
    this.triggerEl.focus();
    this.dispatchOptionSelectedEvent();
  }


  /*
    Show dropdown list
  */
  private dispatchOptionSelectedEvent(): void {
    const optionSelectedEl = this.listEl.querySelector('[aria-selected="true"]');

    window.dispatchEvent(
      new CustomEvent(EVENTS.OPTION_SELECTED, {
        'detail': {
          'id': this.id,
          'option': {
            'id': optionSelectedEl.id,
            'index': +optionSelectedEl.getAttribute(LISTBOX_ATTRS.OPTION_INDEX),
          },
        }
      })
    );
  }


  /*
    Hide dropdown list and update trigger text
  */
  private hideList(): void {
    this.listEl.setAttribute(ATTRS.LIST_HIDDEN, '');
    this.triggerEl.setAttribute('aria-expanded', 'false');
  }


  /*
    Handle clicks on trigger and on listbox options
  */
  private selectClickHandler(e: MouseEvent): void {
    const optionClicked = (e.target as HTMLElement).closest(`#${this.id} [${LISTBOX_ATTRS.OPTION_INDEX}]`);
    const triggerClicked = (e.target as HTMLElement).closest(`[${ATTRS.TRIGGER}]`) === this.triggerEl;
    const listHidden = this.listEl.hasAttribute(ATTRS.LIST_HIDDEN);

    if (!optionClicked && !triggerClicked && listHidden) {
      return;
   }

    if (triggerClicked) {
      this.selectedOptionEl = this.listEl.querySelector('[aria-selected="true"]');
      this.showList();
      return;
    }

    if (optionClicked) {
      this.confirmOptionChange();
      return;
    }

    this.cancelOptionChange();
  }


  /*
    Handle keystrokes on select
  */
  private selectKeydownHandler(e: KeyboardEvent): void {
    const keydownOnTrigger = (e.target as HTMLElement).closest(`[${ATTRS.TRIGGER}]`);
    const keydownOnList = (e.target as HTMLElement).closest(`[${LISTBOX_ATTRS.LIST}]`);

    if (!keydownOnTrigger && !keydownOnList) {
      return;
    }

    const keyPressed = e.key || e.which || e.keyCode;
    // TAB pressed on list
    if (keydownOnList && keyPressedMatches(keyPressed, KEYS.TAB)) {
      e.preventDefault();
      return;
    }

    // ESC pressed on list
    if (keydownOnList && keyPressedMatches(keyPressed, KEYS.ESCAPE)) {
      this.cancelOptionChange();
      this.triggerEl.focus();
      return;
    }

    // UP or DOWN pressed
    if (keyPressedMatches(keyPressed, [KEYS.UP, KEYS.DOWN])) {
      // UP or DOWN on trigger
      if (keydownOnTrigger) {
        e.preventDefault();
        this.showList();
      }
      return;
    }

    // ENTER or SPACE pressed on list
    if (keydownOnList && keyPressedMatches(keyPressed, [KEYS.ENTER, KEYS.SPACE])) {
      e.preventDefault();
      this.confirmOptionChange();
      return;
    }

    // Letter pressed
    this.keydownHandler(e);

    if (keydownOnTrigger) {
      this.confirmOptionChange();
    }
  }


  /*
    Update options custom event handler
  */
  private selectUpdateOptionsHandler(e: CustomEvent): void {
    if (!e.detail || (e.detail.id !== this.id)) {
      return;
    }

    this.activeOptionIndex = null;
    this.initialiseList();
    this.updateTriggerText();
  }


  /*
    Show dropdown list
  */
  private showList(): void {
    this.triggerEl.setAttribute('aria-expanded', 'true');
    this.listEl.removeAttribute(ATTRS.LIST_HIDDEN);
    handleOverflow(this.listEl);
    this.listEl.focus();
  }


  /*
    Update the trigger text
  */
  private updateTriggerText(): void {
    const activeOption = this.listEl.querySelector('[aria-selected="true"]');
    if (activeOption !== null) {
      this.triggerEl.textContent = activeOption.textContent;
      this.triggerOptionIndex = +activeOption.getAttribute(LISTBOX_ATTRS.OPTION_INDEX);
    }
  }


  public disconnectedCallback(): void {
    /* REMOVE EVENT LISTENERS */
    this.removeEventListener('keydown', this.selectKeydownHandler);
    window.removeEventListener('click', this.selectClickHandler, {passive: true} as AddEventListenerOptions);
    window.removeEventListener(EVENTS.UPDATE_OPTIONS, this.selectUpdateOptionsHandler, {passive: true} as AddEventListenerOptions);

    super.disconnectedCallback();
  }
}


/* INITIALISE AND REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  autoID(SELECT);
  customElements.define(SELECT, Select);
});
