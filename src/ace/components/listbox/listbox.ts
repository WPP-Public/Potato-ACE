/* IMPORTS */
import {KEYS, NAME} from '../../common/constants.js';
import {autoID, getIndexAfterArrowKeyPress, keyPressedMatches} from '../../common/functions.js';


/* COMPONENT NAME */
export const LISTBOX = `${NAME}-listbox`;


/* CONSTANTS */
export const ATTRS = {
  ACTIVE_OPTION: `${LISTBOX}-active-option`,
  LIST: `${LISTBOX}-list`,
  MULTISELECT: `${LISTBOX}-multiselect`,
  OPTION_INDEX: `${LISTBOX}-option-index`,
};


export const EVENTS = {
  READY: `${LISTBOX}-ready`,
  UPDATE_OPTIONS: `${LISTBOX}-update-options`,
};


export const searchTimeoutTime = 500;


/* CLASS */
export default class Listbox extends HTMLElement {
  public activeOptionIndex: number;
  private allSelected: boolean;
  private lastSelectedOptionIndex: number;
  public listEl: HTMLElement;
  private multiselectable: boolean;
  private options: Array<HTMLElement>;
  private query: string;
  private searchTimeout: number;

  constructor() {
    super();


    /* CLASS CONSTANTS */
    this.activeOptionIndex = null;
    this.allSelected = false;
    this.lastSelectedOptionIndex = null;
    this.options = [];
    this.query = '';
    this.searchTimeout = null;


    /* CLASS METHOD BINDINGS */
    this.clearListSearch = this.clearListSearch.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.findInList = this.findInList.bind(this);
    this.focusHandler = this.focusHandler.bind(this);
    this.initialiseList = this.initialiseList.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.makeOptionActive = this.makeOptionActive.bind(this);
    this.makeOptionSelected = this.makeOptionSelected.bind(this);
    this.scrollOptionIntoView = this.scrollOptionIntoView.bind(this);
    this.selectContiguousOptions = this.selectContiguousOptions.bind(this);
    this.toggleOptionState = this.toggleOptionState.bind(this);
    this.updateActiveOption = this.updateActiveOption.bind(this);
    this.updateOptionsHandler = this.updateOptionsHandler.bind(this);
  }


  public connectedCallback(): void {
    /* GET DOM ELEMENTS */
    this.listEl =
      this.querySelector(`[${ATTRS.LIST}]`) ||
      this.querySelector('ul') ||
      this.querySelector('ol');
    // Create <ul> if neither <ul> nor <ol> present
    if (!this.listEl) {
      this.listEl = document.createElement('ul');
      this.appendChild(this.listEl);
    }


    /* GET DOM DATA */
    this.multiselectable = this.hasAttribute(ATTRS.MULTISELECT);


    /* SET DOM DATA */
    this.listEl.setAttribute(ATTRS.LIST, '');
    this.listEl.setAttribute('role', 'listbox');

    if (this.multiselectable) {
      this.listEl.setAttribute('aria-multiselectable', 'true');
    }

    if (!this.listEl.getAttribute('tabindex')) {
      this.listEl.setAttribute('tabindex', '0');
    }


    /* ADD EVENT LISTENERS */
    this.listEl.addEventListener('focus', this.focusHandler);
    this.listEl.addEventListener('blur', this.focusHandler);
    this.listEl.addEventListener('keydown', this.keydownHandler);
    this.listEl.addEventListener('click', this.clickHandler);
    window.addEventListener(EVENTS.UPDATE_OPTIONS, this.updateOptionsHandler);


    /* INITIALISATION */
    this.initialiseList();

    // Dispatch 'ready' event
    window.dispatchEvent(new CustomEvent(EVENTS.READY, {
      'detail': {
        'id': this.id,
      }
    }));
  }


  public disconnectedCallback(): void {
    /* REMOVE EVENT LISTENERS */
    this.listEl.removeEventListener('focus', this.focusHandler);
    this.listEl.removeEventListener('blur', this.focusHandler);
    this.listEl.removeEventListener('keydown', this.keydownHandler);
    this.listEl.removeEventListener('click', this.clickHandler);
    window.removeEventListener(EVENTS.UPDATE_OPTIONS, this.updateOptionsHandler);
  }


  /*
    Clears the search query
  */
  private clearListSearch(): void {
    this.query = '';
  }


  /*
    Handle clicks on listbox options by setting clicked option to selected
  */
  private clickHandler(e: MouseEvent): void {
    const optionClicked = (e.target as HTMLElement).closest(`[${ATTRS.OPTION_INDEX}]`);
    if (!optionClicked) {
      return;
    }

    // Get index of clicked option
    const clickedOptionIndex = parseInt(
      optionClicked.getAttribute(ATTRS.OPTION_INDEX),
      10
    );

    // Set clicked option to active
    this.makeOptionActive(clickedOptionIndex);

    if (!this.multiselectable) {
      return;
    }

    if (e.shiftKey) {
      this.selectContiguousOptions();
      return;
    }

    this.toggleOptionState(clickedOptionIndex);
  }


  /*
    Finds options starting with given keyPressed wrapping around
  */
  private findInList(): void {
    let i = this.activeOptionIndex;
    const maxIndex = this.options.length - 1;

    if (this.query.length === 1) {
      // If it's the first letter of a new search, we start searching _after_ the currently selected option
      i = (i === maxIndex) ? 0 : i + 1;
    }

    const startingIndex = i;

    do {
      if (this.options[i].textContent.toLowerCase().startsWith(this.query)) {
        this.makeOptionActive(i);
        break;
      }

      i = (i === maxIndex) ? 0 : i + 1;
    } while (i !== startingIndex); // Terminates if every option has been checked
  }


  /*
    Handle focus and blur events on the listbox.
    On focus: set first option or last active option as active
    On blur: unset active option
  */
  private focusHandler(e: Event): void {
    if (this.options.length === 0) {
      return;
    }

    // If list focussed
    if (e.type === 'focus') {
      // set first option as active
      if (this.activeOptionIndex === null) {
        this.activeOptionIndex = 0;
      }
      this.makeOptionActive(this.activeOptionIndex);
      return;
    }

    // If list blurred
    this.options[this.activeOptionIndex].removeAttribute(ATTRS.ACTIVE_OPTION);
    this.listEl.removeAttribute('aria-activedescendant');
  }


  /*
    Update the listbox by recalculating the indices and setting the first option as active.
    Should be run if the list ID or options are dynamically changed to update indices.
  */
  public initialiseList(): void {
    // Get all child <li> elements
    this.options = Array.from(this.listEl.querySelectorAll('li'));

    if (this.options.length === 0) {
      return;
    }

    // Set option attributes and IDs
    this.options.forEach((option, i) => {
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      option.setAttribute(ATTRS.OPTION_INDEX, i.toString());
      // If no ID given create an ID from parent ID and index
      option.id = option.id || `${this.id}-option-${i + 1}`;
    });

    // If single-select list set first option to active
    if (!this.multiselectable) {
      this.makeOptionSelected(0);
      this.scrollOptionIntoView(0);
    }
  }


  /*
    Handle keystrokes
  */
  public keydownHandler(e: KeyboardEvent): void {
    const keyPressed = e.key || e.which || e.keyCode;

    if (keyPressedMatches(keyPressed, [KEYS.UP, KEYS.DOWN])) {
      e.preventDefault();
      const optionToMakeActiveIndex = getIndexAfterArrowKeyPress(this.activeOptionIndex, keyPressed, this.options.length);
      this.updateActiveOption(optionToMakeActiveIndex);

      if (this.multiselectable && e.shiftKey) {
        this.toggleOptionState(this.activeOptionIndex);
      }

      return;
    }

    if (keyPressedMatches(keyPressed, KEYS.HOME)) {
      e.preventDefault();

      // If Ctrl + Shift + Home select active option and all options up until first
      if (this.multiselectable && (e.ctrlKey || e.metaKey) &&  e.shiftKey) {
        this.makeOptionRangeSelected(0, this.activeOptionIndex + 1);
      }

      this.makeOptionActive(0);
      return;
    }

    if (keyPressedMatches(keyPressed, KEYS.END)) {
      e.preventDefault();

      // If Ctrl + Shift + End select active option and all options down until last
      if (this.multiselectable && (e.ctrlKey || e.metaKey) &&  e.shiftKey) {
        this.makeOptionRangeSelected(this.activeOptionIndex, this.options.length);
      }

      this.makeOptionActive(this.options.length - 1);
      return;
    }

    // If space bar pressed on a multiselect listbox option, set it to selected
    if (keyPressedMatches(keyPressed, KEYS.SPACE)) {
      e.preventDefault();

      if (!this.multiselectable) {
        return;
      }

      if (e.shiftKey) {
        this.selectContiguousOptions();
        return;
      }

      this.toggleOptionState(this.activeOptionIndex);
      return;
    }

    // Select or deselect all with 'Ctrl + A'
    if (keyPressedMatches(keyPressed, KEYS.A)) {
      if (this.multiselectable) {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.options.forEach(option => {
            option.setAttribute('aria-selected', (!this.allSelected).toString());
          });
          this.allSelected = !this.allSelected;
          return;
        }
      }
    }

    // Ignore non-alphanumeric keys
    if (e.key.length > 1) {
      return;
    }

    // "type-ahead" search functionality
    clearTimeout(this.searchTimeout);
    this.query+=e.key.toLowerCase();
    this.findInList();
    this.searchTimeout = window.setTimeout(this.clearListSearch, searchTimeoutTime);
  }


  /*
    Make option at given index active by adding attribute ATTRS.ACTIVE_OPTION
    and setting the listbox list's [aria-activedescendant] to the ID of the selected option.
    An "active" option is one currently has keyboard focus. There can be only one active option at any given time.
    For more info on the difference between "active" and "selected" visit https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_focus_vs_selection
  */
  public makeOptionActive(index: number): void {
    // Deactivate previously active option
    if (this.activeOptionIndex !== null && this.activeOptionIndex !== undefined) {
      this.options[this.activeOptionIndex].removeAttribute(ATTRS.ACTIVE_OPTION);
    }

    // Activate new option
    const optionToMakeActive = this.options[index];
    optionToMakeActive.setAttribute(ATTRS.ACTIVE_OPTION, '');
    this.listEl.setAttribute('aria-activedescendant', optionToMakeActive.id);
    this.activeOptionIndex = index;

    // If single-select list make option selected
    if (!this.multiselectable) {
      this.makeOptionSelected(index);
    }

    this.scrollOptionIntoView(this.activeOptionIndex);
  }


  /*
    Make a range of options selected
  */
  private makeOptionRangeSelected(startIndex: number, endIndex: number): void {
    for (let i = startIndex; i < endIndex; i++) {
      this.options[i].setAttribute('aria-selected', 'true');
    }
  }


  /*
    Make option at given index selected by adding attribute [${ATTRS.ACTIVE_OPTION}].
    An "active" option is one that is selected. For multi-select listboxes there could be multiple "active" options.
    For more info on the difference between "active" and "selected" visit https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_focus_vs_selection
  */
  private makeOptionSelected(index: number): void {
    // If single select list and an item is currently selected
    if (!this.multiselectable && (this.lastSelectedOptionIndex !== null)) {
      this.options[this.lastSelectedOptionIndex]
        .setAttribute('aria-selected', 'false');
    }

    this.options[index].setAttribute('aria-selected', 'true');
    this.lastSelectedOptionIndex = index;
  }


  /*
    Scroll option at given index into view
  */
  private scrollOptionIntoView(index: number): void {
    this.options[index]
      .scrollIntoView({
        behaviour: 'smooth',
        block: 'nearest',
        inline: 'start',
      } as ScrollIntoViewOptions);
  }


  /*
    Select all options from last selected option to active option
  */
  private selectContiguousOptions(): void {
    if (this.lastSelectedOptionIndex === null) {
      return;
    }

    let startIndex: number, endIndex: number;
    if (this.lastSelectedOptionIndex < this.activeOptionIndex) {
      startIndex = this.lastSelectedOptionIndex + 1;
      endIndex = this.activeOptionIndex;
    } else {
      startIndex = this.activeOptionIndex;
      endIndex = this.lastSelectedOptionIndex - 1;
    }

    for (let i = startIndex; i <= endIndex; i++) {
      this.makeOptionSelected(i);
    }
  }


  /*
    Toggle the selected state of the option at given index
  */
  private toggleOptionState(index: number): void {
    const option = this.options[index];
    const newSelectedState = option.getAttribute('aria-selected') !== 'true';
    option.setAttribute('aria-selected', newSelectedState.toString());
    this.lastSelectedOptionIndex = newSelectedState ? index : null;
  }


  /*
    Makes option with given index active
  */
  private updateActiveOption(index: number): void {
    this.makeOptionActive(index);
    this.scrollOptionIntoView(this.activeOptionIndex);
  }


  /*
    Custom event handler for updating list options
    Run when the EVENTS.UPDATE_OPTIONS event is fired and updates
    the listbox options and indices
  */
  private updateOptionsHandler(e: CustomEvent): void {
    const detail = e['detail'];
    if (!detail || (detail['id'] !== this.id)) {
      return;
    }

    this.activeOptionIndex = null;
    this.initialiseList();
  }
}


/* REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  autoID(LISTBOX);
  customElements.define(LISTBOX, Listbox);
});
