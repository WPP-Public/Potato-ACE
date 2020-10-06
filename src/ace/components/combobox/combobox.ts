/* IMPORTS */
import {KEYS, NAME} from '../../common/constants.js';
import {autoID, getElByAttrOrSelector, getIndexOfNextItem, keyPressedMatches} from '../../common/functions.js';


/* COMPONENT NAME */
export const COMBOBOX = `${NAME}-combobox`;


/* CONSTANTS */
export const ATTRS = {
  AUTOSELECT: `${COMBOBOX}-autoselect`,
  INPUT: `${COMBOBOX}-input`,
  LIST: `${COMBOBOX}-list`,
  LIST_VISIBLE: `${COMBOBOX}-list-visible`,
  NO_INPUT_UPDATE: `${COMBOBOX}-no-input-update`,
  OPTION: `${COMBOBOX}-option`,
  OPTION_SELECTED: `${COMBOBOX}-option-selected`,
};


export const EVENTS = {
  IN: {
    HIDE_LIST: `${COMBOBOX}-hide-list`,
    SELECT_OPTION: `${COMBOBOX}-select-option`,
    SHOW_LIST: `${COMBOBOX}-show-list`,
    UPDATE_OPTIONS: `${COMBOBOX}-update-options`,
  },
  OUT: {
    LIST_TOGGLED: `${COMBOBOX}-list-toggled`,
    OPTIONS_UPDATED: `${COMBOBOX}-options-updated`,
    OPTION_CHOSEN: `${COMBOBOX}-option-chosen`,
    OPTION_SELECTED: `${COMBOBOX}-option-selected`,
    READY: `${COMBOBOX}-ready`,
  },
};


/* CLASS */
export default class Combobox extends HTMLElement {
  /* CLASS CONSTANTS */
  private allOptions: Array<Node>;
  private inputAutocompletes: boolean;
  private inputEl: HTMLInputElement;
  private lastChosenOptionIndex: number = null;
  private listAutocompletes: boolean;
  private listAutoselects: boolean;
  private listEl: HTMLUListElement;
  private listVisible = false;
  private noInputUpdate: boolean;
  private options: NodeListOf<HTMLLIElement>;
  private selectedOptionIndex: number = null;
  private query = '';


  constructor() {
    super();


    /* CLASS METHOD BINDINGS */
    this.autocompleteList = this.autocompleteList.bind(this);
    this.autocompleteInput = this.autocompleteInput.bind(this);
    this.inputHandler = this.inputHandler.bind(this);
    this.changeSelectedOption = this.changeSelectedOption.bind(this);
    this.chooseOption = this.chooseOption.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.customEventsHandler = this.customEventsHandler.bind(this);
    this.deselectSelectedOption = this.deselectSelectedOption.bind(this);
    this.focusHandler = this.focusHandler.bind(this);
    this.hideList = this.hideList.bind(this);
    this.initialiseListOptions = this.initialiseListOptions.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.showList = this.showList.bind(this);
  }


  public connectedCallback(): void {
    /* GET DOM ELEMENTS */
    this.inputEl = getElByAttrOrSelector(this, ATTRS.INPUT, 'input') as HTMLInputElement;
    this.listEl =  getElByAttrOrSelector(this, ATTRS.LIST, 'ul') as HTMLUListElement;
    // Error if no <input> nor <ul> present because they can't be automatically generated as they require an 'aria-label' or an 'aria-labelledby' attribute from the user
    if (!this.inputEl) {
      console.error(`ACE: Combobox with ID '${this.id}' requires an <input> ancestor element, which has an 'aria-label' or an 'aria-labelledby' attribute.`);
      return;
    }
    if (!this.listEl) {
      console.error(`ACE: Combobox with ID '${this.id}' requires a <ul> ancestor element, which has an 'aria-label' describing its options.`);
      return;
    }


    /* GET DOM DATA */
    this.listAutoselects = this.hasAttribute(ATTRS.AUTOSELECT);
    this.noInputUpdate = this.hasAttribute(ATTRS.NO_INPUT_UPDATE);

    // Get <input> 'aria-autocomplete' value or set to 'none' if not given
    const inputAriaAutocompleteType = this.inputEl.getAttribute('aria-autocomplete');
    this.listAutocompletes = (inputAriaAutocompleteType === 'list' || inputAriaAutocompleteType === 'both');
    this.inputAutocompletes = (inputAriaAutocompleteType === 'both');


    /* SET DOM DATA */
    // Set listEl attributes
    this.listEl.id = this.listEl.id || `${this.id}-list`;
    this.listEl.setAttribute(ATTRS.LIST, '');
    this.listEl.setAttribute(ATTRS.LIST_VISIBLE, 'false');
    this.listEl.setAttribute('role', 'listbox');

    // Set inputEl attributes
    this.inputEl.id = this.inputEl.id || `${this.id}-input`;
    this.inputEl.setAttribute(ATTRS.INPUT, '');
    if (!inputAriaAutocompleteType) {
      this.inputEl.setAttribute('aria-autocomplete', 'none');
    }
    this.inputEl.setAttribute('aria-expanded', 'false');
    this.inputEl.setAttribute('aria-multiline', 'false');
    this.inputEl.setAttribute('aria-haspopup', 'true');
    this.inputEl.setAttribute('aria-owns', this.listEl.id);
    this.inputEl.setAttribute('role', 'combobox');
    this.inputEl.setAttribute('type', 'text');


    /* ADD EVENT LISTENERS */
    this.addEventListener(EVENTS.IN.UPDATE_OPTIONS, this.customEventsHandler);
    this.addEventListener(EVENTS.IN.HIDE_LIST, this.customEventsHandler);
    this.addEventListener(EVENTS.IN.SHOW_LIST, this.customEventsHandler);
    this.addEventListener(EVENTS.IN.SELECT_OPTION, this.customEventsHandler);
    this.listEl.addEventListener('click', this.clickHandler);
    this.inputEl.addEventListener('focus', this.focusHandler);
    this.inputEl.addEventListener('blur', this.focusHandler);
    this.inputEl.addEventListener('keydown', this.keydownHandler);
    this.inputEl.addEventListener('input', this.inputHandler);
    this.listEl.addEventListener('mousedown', this.mousedownHandler);


    /* INITIALISATION */
    // Check that input is labelled
    const inputHasLabel = this.inputEl.hasAttribute('aria-label');
    const inputLabelElId = this.inputEl.getAttribute('aria-labelledby');
    if (inputLabelElId) {
      const labelEl = document.getElementById(inputLabelElId);
      if (!labelEl) {
        console.warn(`ACE: Input element of Combobox with ID '${this.id}' has 'aria-labelledby' attribute set to an element that does not exist.`);
      } else if (!labelEl.textContent.length) {
        console.warn(`ACE: Input element of Combobox with ID '${this.id}' has 'aria-labelledby' attribute set to an element with no text content.`);
      }
    } else if (!inputHasLabel) {
      console.warn(`ACE: Input element of Combobox with ID '${this.id}' requires an 'aria-label' or an 'aria-labelledby' attribute.`);
    }

    // Check that list is labelled
    if (!this.listEl.hasAttribute('aria-label')) {
      console.warn(`ACE: List element of Combobox with ID '${this.id}' requires an 'aria-label' attribute describing its options.`);
    }

    this.initialiseListOptions();

    // Keep copy of original options so they may be replaced when autocomplete filter removed
    if (this.listAutocompletes) {
      this.allOptions = [...this.options].map(option => option.cloneNode(true));
    }

    // Dispatch 'Ready' event
    window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
      'detail': {
        'id': this.id,
      }
    }));
  }


  public disconnectedCallback(): void {
    /* REMOVE EVENT LISTENERS */
    this.removeEventListener(EVENTS.IN.UPDATE_OPTIONS, this.customEventsHandler);
    this.removeEventListener(EVENTS.IN.HIDE_LIST, this.customEventsHandler);
    this.removeEventListener(EVENTS.IN.SHOW_LIST, this.customEventsHandler);
    this.removeEventListener(EVENTS.IN.SELECT_OPTION, this.customEventsHandler);
    this.listEl.removeEventListener('click', this.clickHandler);
    this.inputEl.removeEventListener('focus', this.focusHandler);
    this.inputEl.removeEventListener('blur', this.focusHandler);
    this.inputEl.removeEventListener('keydown', this.keydownHandler);
    this.inputEl.removeEventListener('input', this.inputHandler);
    this.listEl.removeEventListener('mousedown', this.mousedownHandler);
  }


  /*
    Autocomplete the input value
  */
  private autocompleteInput(): void {
    if (this.options.length === 0) {
      return;
    }
    const selectedOptionText = this.options[0].textContent;
    this.inputEl.value = selectedOptionText;
    this.inputEl.setSelectionRange(this.query.length, selectedOptionText.length);
  }


  /*
    Autocomplete the list options
  */
  private autocompleteList(): void {
    const inputVal = this.inputEl.value.toLowerCase();
    const inputEmpty = inputVal.length === 0;
    this.listEl.innerHTML = '';
    this.deselectSelectedOption();

    // For all options, if input value empty append all options to list, else only append options whose text starts with input string
    this.allOptions.forEach((option) => {
      const optionTextStartsWithInputVal = option.textContent.toLowerCase().startsWith(inputVal);
      if (inputEmpty || optionTextStartsWithInputVal) {
        this.listEl.appendChild(option.cloneNode(true));
      }
    });
    this.initialiseListOptions();

    if (this.options.length === 0) {
      this.hideList();
      return;
    }

    if (this.listAutoselects && !this.inputAutocompletes) {
      this.changeSelectedOption(0);
    }
  }


  /*
    Changes the selected option in the list
  */
  private changeSelectedOption(optionToSelectIndex?: number): void {
    if (optionToSelectIndex === this.selectedOptionIndex) {
      return;
    }

    if (this.selectedOptionIndex !== null) {
      this.deselectSelectedOption();
    }

    const optionToSelect = this.options[optionToSelectIndex];
    const optionToSelectId = optionToSelect.id;
    optionToSelect.setAttribute('aria-selected', 'true');
    optionToSelect.setAttribute(ATTRS.OPTION_SELECTED, '');
    this.inputEl.setAttribute('aria-activedescendant', optionToSelectId);
    this.selectedOptionIndex = optionToSelectIndex;

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.OPTION_SELECTED, {
      'detail': {
        'id': this.id,
        'selectedOptionId': optionToSelectId,
      }
    }));
  }


  /*
    Run when a user confirms an option and updates the input value to that of the chosen option
  */
  private chooseOption(optionToChooseIndex: number): void {
    this.changeSelectedOption(optionToChooseIndex);
    const chosenOption = this.options[optionToChooseIndex];
    window.dispatchEvent(new CustomEvent(EVENTS.OUT.OPTION_CHOSEN, {
      'detail': {
        'chosenOptionId': chosenOption.id,
        'id': this.id,
      }
    }));

    if (this.noInputUpdate) {
      return;
    }

    const optionText = chosenOption.textContent;
    if (optionText.length > 0) {
      this.inputEl.value = optionText;

      if (this.inputAutocompletes && this.listAutoselects) {
        const inputValLength = this.inputEl.value.length;
        this.inputEl.setSelectionRange(inputValLength, inputValLength);
      }
    }

    if (this.listAutocompletes) {
      this.autocompleteList();
    } else {
      this.lastChosenOptionIndex = optionToChooseIndex;
    }
    this.hideList();
  }


  /*
    Click event handler:
    Clicking on input should show list if list autocomplete not set
    Clicking an option should choose that option
  */
  private clickHandler(e: MouseEvent): void {
    const targetEl = e.target as HTMLElement;
    const optionClicked = targetEl.closest(`[${ATTRS.OPTION}]`) as HTMLLIElement;
    if (optionClicked) {
      const optionClickedIndex = [...this.options].indexOf(optionClicked);
      this.chooseOption(optionClickedIndex);
    }
  }


  /*
    Prevent inputEl blur event from triggering when list or a descendant of it is clicked
  */
  private customEventsHandler(e: CustomEvent): void {
    switch(e.type) {
      case EVENTS.IN.HIDE_LIST:
        this.hideList();
        break;
      case EVENTS.IN.SELECT_OPTION: {
        const detail = e['detail'];
        if (!detail || !detail['optionId']) {
          return;
        }
        const option = this.listEl.querySelector(`#${detail['optionId']}`) as HTMLLIElement;
        if (!option) {
          return;
        }
        const optionIndex = [...this.options].indexOf(option);
        this.changeSelectedOption(optionIndex);
        break;
      }
      case EVENTS.IN.SHOW_LIST:
        this.showList();
        break;
      case EVENTS.IN.UPDATE_OPTIONS:
        this.initialiseListOptions();
        if (this.listAutocompletes) {
          this.allOptions = [...this.options].map(option => option.cloneNode(true));
        }
        break;
    }
  }


  /*
    Deselct currectly delected option
  */
  private deselectSelectedOption(): void {
    if (this.selectedOptionIndex === null) {
      return;
    }

    const selectedOption = this.options[this.selectedOptionIndex];
    selectedOption.setAttribute('aria-selected', 'false');
    selectedOption.removeAttribute(ATTRS.OPTION_SELECTED);
    this.inputEl.removeAttribute('aria-activedescendant');
    this.selectedOptionIndex = null;
  }


  /*
    Input element focus event handler:
    On focus show list if list autocomplete not set
    On blur hide list
  */
  private focusHandler(e: FocusEvent): void {
    // FOCUS
    if (e.type === 'focus' && !this.listAutocompletes) {
      if (this.options.length === 0) {
        return;
      }

      if (this.listAutoselects) {
        this.changeSelectedOption(0);
      }

      this.showList();
      return;
    }

    // BLUR
    this.lastChosenOptionIndex = null;
    if (this.selectedOptionIndex !== null) {
      this.chooseOption(this.selectedOptionIndex);
      return;
    }
    this.hideList();
  }


  /*
    Hide list
  */
  private hideList(): void {
    if (!this.listVisible) {
      return;
    }

    this.deselectSelectedOption();
    this.inputEl.setAttribute('aria-expanded', 'false');
    this.listEl.setAttribute(ATTRS.LIST_VISIBLE, 'false');
    this.listVisible = false;

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.LIST_TOGGLED, {
      'detail': {
        'id': this.id,
        'listVisible': this.listVisible,
      }
    }));
  }


  /*
    Initialises the list options by setting their ids and attributes
  */
  public initialiseListOptions(): void {
    this.selectedOptionIndex = null;
    this.lastChosenOptionIndex = null;

    // Set option attributes and IDs
    this.options = this.listEl.querySelectorAll('li');
    this.options.forEach((option, i) => {
      option.id = option.id || `${this.id}-option-${i + 1}`;
      option.setAttribute(ATTRS.OPTION, '');
      option.setAttribute('aria-selected', 'false');
      option.setAttribute('role', 'option');
    });

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.OPTIONS_UPDATED, {
      'detail': {
        'id': this.id,
      }
    }));
  }


  /*
    Handle input events on input element:
    Deselect selected option, remove stored lastChosenOptionIndex then show list
  */
  private inputHandler(e: InputEvent): void {
    const stringInput = e.data;
    this.lastChosenOptionIndex = null;

    // If list autocompletes remove options whose text doesn't start with input value
    if (this.listAutocompletes) {
      this.autocompleteList();
    }

    if (this.inputAutocompletes) {
      this.query = this.inputEl.value || '';

      // If list autocompletes and autoselects, and user has entered char or string (not deleted)
      if (this.listAutocompletes && this.listAutoselects && stringInput) {
        this.autocompleteInput();
      }
    }

    if (this.options.length > 0) {
      this.showList();
    }
  }


  /*
    Input element keydown event handler:
    ESC hides the list
    ENTER chooses the selected option
    UP/DOWN changes the selected option (wrapping around if necesary)
  */
  public keydownHandler(e: KeyboardEvent): void {
    if (this.options.length === 0) {
      return;
    }

    const keyPressed = e.key || e.which || e.keyCode;

    if (keyPressedMatches(keyPressed, KEYS.ESCAPE)) {
      if (this.inputAutocompletes) {
        this.inputEl.value = this.query;

        if (this.listAutoselects) {
          const inputValLength = this.inputEl.value.length;
          this.inputEl.setSelectionRange(inputValLength, inputValLength);
        }
      }
      this.hideList();
      return;
    }

    if (keyPressedMatches(keyPressed, KEYS.ENTER)) {
      if (this.selectedOptionIndex !== null) {
        this.chooseOption(this.selectedOptionIndex);
      }
      return;
    }

    if (keyPressedMatches(keyPressed, [KEYS.UP, KEYS.DOWN])) {
      // Prevent up/down arrows from moving cursor
      e.preventDefault();

      // Determine which option to select and select it
      const direction = keyPressedMatches(keyPressed, KEYS.UP) ? -1 : 1;
      const optionsCount = this.options.length;
      let optionToSelectIndex;
      if (this.selectedOptionIndex !== null) {
        optionToSelectIndex = getIndexOfNextItem(this.selectedOptionIndex, direction, optionsCount, true);
      } else if (this.lastChosenOptionIndex !== null) {
        optionToSelectIndex = getIndexOfNextItem(this.lastChosenOptionIndex, direction, optionsCount, true);
      } else {
        optionToSelectIndex = direction === 1 ? 0 : optionsCount - 1;
      }
      this.changeSelectedOption(optionToSelectIndex);


      // If input autocompletes make input value match option text
      if (this.inputAutocompletes) {
        this.inputEl.value = this.options[this.selectedOptionIndex].textContent;
        const inputValLength = this.inputEl.value.length;
        this.inputEl.setSelectionRange(inputValLength, inputValLength);
      }

      this.showList();
    }
  }


  /*
    Prevent inputEl blur event from triggering when list or a descendant of it is clicked
  */
  public mousedownHandler(e: MouseEvent): void {
    e.preventDefault();
  }


  /*
    Show list
  */
  private showList(): void {
    if (this.listVisible) {
      return;
    }

    this.inputEl.setAttribute('aria-expanded', 'true');
    this.listEl.setAttribute(ATTRS.LIST_VISIBLE, 'true');
    this.listVisible = true;

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.LIST_TOGGLED, {
      'detail': {
        'id': this.id,
        'listVisible': this.listVisible,
      }
    }));
  }
}


/* REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  // Use autoID to automatically increment the IDs of class instances
  autoID(COMBOBOX);
  customElements.define(COMBOBOX, Combobox);
});
