// /* IMPORTS */
import {DISPLAY_NAME, KEYS, NAME} from '../../common/constants.js';
import {autoID, handleOverflow, keyPressedMatches} from '../../common/functions.js';
import List from '../../common/list.js';


/* COMPONENT NAME */
export const SELECT = `${NAME}-select`;


/* CONSTANTS */
const OPTION_ATTR = `${SELECT}-option`;

export const ATTRS = {
  FOR_FORM: `${SELECT}-for-form`,
  INPUT: `${SELECT}-input`,
  LIST: `${SELECT}-list`,
  LIST_VISIBLE: `${SELECT}-list-visible`,
  OPTION: OPTION_ATTR,
  SELECTED_OPTION_ID: `data-${SELECT}-selected-option-id`,
  TRIGGER: `${SELECT}-trigger`,
  TRIGGER_TEXT: `${SELECT}-trigger-text`,
};


export const EVENTS = {
  IN: {
    UPDATE_OPTIONS: `${SELECT}-update-options`,
  },
  OUT: {
    OPTION_CHOSEN: `${SELECT}-option-chosen`,
    READY: `${SELECT}-ready`,
  }
};


// Time Listbox will wait before considering a character as start of new string when using type-ahead search
export const SEARCH_TIMEOUT = List.SEARCH_TIMEOUT;


/* CLASS */
export default class Select extends HTMLElement {
  private chosenOptionIndex: number;
  private inputEl: HTMLInputElement;
  private list: List;
  private listEl: HTMLUListElement|HTMLOListElement;
  private mutationObserver: MutationObserver;
  private triggerEl: HTMLButtonElement;
  private selectForForm: boolean;
  private triggerTextEl: HTMLSpanElement;


  constructor() {
    super();


    /* CLASS METHOD BINDINGS */
    this.cancelOptionChange = this.cancelOptionChange.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.confirmOptionChange = this.confirmOptionChange.bind(this);
    this.hideList = this.hideList.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.showList = this.showList.bind(this);
    this.updateSelectForFormAttributes = this.updateSelectForFormAttributes.bind(this);
    this.updateOptionsHandler = this.updateOptionsHandler.bind(this);
    this.updateTriggerText = this.updateTriggerText.bind(this);
  }


  public connectedCallback(): void {
    /* GET DOM ELEMENTS */
    // Get or create trigger element
    this.triggerEl = this.querySelector('button');
    // Create <button> if not present
    if (!this.triggerEl) {
      this.triggerEl = document.createElement('button');
      this.prepend(this.triggerEl);
    }

    // Get or create trigger text element
    this.triggerTextEl = this.querySelector(`[${ATTRS.TRIGGER_TEXT}]`);
    // Create <button> if not present
    if (!this.triggerTextEl) {
      this.triggerTextEl = document.createElement('span');
      this.triggerTextEl.setAttribute(ATTRS.TRIGGER_TEXT, '');
      this.triggerEl.append(this.triggerTextEl);
    }

    // Get list element
    this.listEl = this.querySelector('ul') || this.querySelector('ol');
    // Error if no <ul> nor <ol> present because they can't be automatically generated because they require an 'aria-label' or an 'aria-labelledby' attribute from the user
    if (!this.listEl) {
      console.error(`${DISPLAY_NAME}: Select with ID '${this.id} requires a <ul> or <ol> ancestor.`);
      return;
    }

    // If Select has attribute ATTRS.FOR_FORM find or create hidden form input for submission
    this.selectForForm = this.hasAttribute(ATTRS.FOR_FORM);
    if (this.selectForForm) {
      this.inputEl = this.querySelector(`input[${ATTRS.INPUT}]`);
      if (!this.inputEl) {
        this.inputEl = document.createElement('input');
        this.inputEl.setAttribute(ATTRS.INPUT, '');
        this.append(this.inputEl);
      }
      const inputId = `${this.id}-input`;
      this.inputEl.id = this.inputEl.id || inputId;
      this.inputEl.setAttribute('name', this.inputEl.getAttribute('name') || inputId);
      this.inputEl.setAttribute('type', 'hidden');
    }


    /* GET DOM DATA */
    const listLabelElId = this.listEl.getAttribute('aria-labelledby');


    /* SET DOM DATA */
    // Set trigger attrs
    const triggerId = this.triggerEl.id || `${this.id}-trigger`;
    this.triggerEl.id = triggerId;
    this.triggerEl.setAttribute(ATTRS.TRIGGER, '');
    this.triggerEl.setAttribute('aria-haspopup', 'listbox');
    this.triggerEl.setAttribute('aria-labelledby', `${listLabelElId} ${triggerId}`);

    // Set list attrs
    this.listEl.id = `${this.id}-list`;
    this.listEl.setAttribute(ATTRS.LIST, '');
    this.listEl.setAttribute('tabindex', '-1');


    // Instantiate a List in the listEl
    this.list = new List(this.listEl, ATTRS.OPTION);
    if (this.list.optionElsCount > 0) {
      this.list.selectOption(0);
    }


    /* ADD EVENT LISTENERS */
    this.addEventListener('keydown', this.keydownHandler);
    this.addEventListener(EVENTS.IN.UPDATE_OPTIONS, this.updateOptionsHandler);
    window.addEventListener('click', this.clickHandler);


    /* INITIALISATION */
    this.hideList();
    this.chosenOptionIndex = this.list.lastSelectedOptionIndex;
    this.updateTriggerText();
    if (this.selectForForm) {
      this.updateSelectForFormAttributes();
    }

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
      'detail': {
        'id': this.id,
      }
    }));
  }


  public disconnectedCallback(): void {
    this.list.destroy();

    /* REMOVE EVENT LISTENERS */
    this.removeEventListener('keydown', this.keydownHandler);
    this.removeEventListener(EVENTS.IN.UPDATE_OPTIONS, this.updateOptionsHandler);
    window.removeEventListener('click', this.clickHandler);
  }


  /*
    Add mutation observer to detect changes to selected options
  */
  private updateSelectForFormAttributes(): void {
    const selectedOptionEl = this.list.optionEls[this.list.lastSelectedOptionIndex];
    if (selectedOptionEl) {
      this.inputEl.value = encodeURIComponent(selectedOptionEl.textContent);
      this.inputEl.setAttribute(ATTRS.SELECTED_OPTION_ID, selectedOptionEl.id);
    }
  }


  /*
    Show dropdown list
  */
  private cancelOptionChange(): void {
    if (this.chosenOptionIndex || this.chosenOptionIndex == 0) {
      this.list.selectOption(this.chosenOptionIndex);
    }
    this.hideList();
  }


  /*
    Handle click events on window
  */
  private clickHandler(e: MouseEvent): void {
    const optionClicked = (e.target as HTMLElement).closest(`#${this.id} [role="option"]`);
    const triggerClicked = (e.target as HTMLElement).closest(`#${this.id} [${ATTRS.TRIGGER}]`);
    const listHidden = this.listEl.getAttribute(ATTRS.LIST_VISIBLE) === 'false';

    if (!optionClicked && !triggerClicked && listHidden) {
      return;
    }

    if (triggerClicked) {
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
    Confirm the change in selected option by updating the trigger text, hiding the
  */
  private confirmOptionChange(): void {
    this.chosenOptionIndex = this.list.lastSelectedOptionIndex;
    this.updateTriggerText();
    this.hideList();
    this.triggerEl.focus();

    if (this.selectForForm) {
      this.updateSelectForFormAttributes();
    }

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.OPTION_CHOSEN, {
      'detail': {
        'chosenOption': {
          'id': this.list.optionEls[this.list.lastSelectedOptionIndex].id,
          'index': this.list.lastSelectedOptionIndex,
        },
        'id': this.id,
      }
    }));
  }


  /*
    Hide dropdown list and update trigger text
  */
  private hideList(): void {
    this.listEl.setAttribute(ATTRS.LIST_VISIBLE, 'false');
    this.triggerEl.setAttribute('aria-expanded', 'false');
  }


  /*
    Handle keydown events
  */
  private keydownHandler(e: KeyboardEvent): void {
    const keydownOnTrigger = (e.target as HTMLElement).closest(`[${ATTRS.TRIGGER}]`);
    const keydownOnList = (e.target as HTMLElement).closest(`[${ATTRS.LIST}]`);
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
      if (keydownOnTrigger) {
        e.preventDefault();
        this.showList();
      }
      return;
    }

    // SPACE pressed on trigger
    if (keydownOnTrigger && keyPressedMatches(keyPressed, KEYS.SPACE)) {
      e.preventDefault();
      this.showList();
      return;
    }

    // ENTER or SPACE pressed on list
    if (keydownOnList && keyPressedMatches(keyPressed, [KEYS.ENTER, KEYS.SPACE])) {
      e.preventDefault();
      this.confirmOptionChange();
      return;
    }

    // Letter pressed
    if (keydownOnTrigger) {
      this.list.keydownHandler(e);
      this.confirmOptionChange();
    }
  }


  /*
    Show dropdown list
  */
  private showList(): void {
    this.triggerEl.setAttribute('aria-expanded', 'true');
    this.listEl.setAttribute(ATTRS.LIST_VISIBLE, 'true');
    handleOverflow(this.listEl);
    this.listEl.focus();
  }


  /*
    Update options custom event handler
  */
  private updateOptionsHandler(): void {
    this.list.initOptionEls();
    if (!this.list.lastSelectedOptionIndex && this.list.lastSelectedOptionIndex !== 0) {
      this.list.selectOption(0);
    }
    this.chosenOptionIndex = this.list.lastSelectedOptionIndex;
    this.updateTriggerText();
    if (this.selectForForm) {
      this.updateSelectForFormAttributes();
    }

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
      'detail': {
        'id': this.id,
      }
    }));
  }


  /*
    Update the trigger text
  */
  private updateTriggerText(): void {
    const chosenOptionEl = this.list.optionEls[this.list.lastSelectedOptionIndex];
    if (chosenOptionEl) {
      this.triggerTextEl.textContent = chosenOptionEl.textContent.trim();
    }
  }
}


/* INITIALISE AND REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  autoID(SELECT);
  customElements.define(SELECT, Select);
});
