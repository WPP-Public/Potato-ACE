/* IMPORTS */
import {NAME, KEYS} from '../../common/constants.js';
import {autoID, keyPressedMatches} from '../../common/functions.js';


/* CONSTANTS */
// Exported constants
export const NAME = `${NAME}-listbox`;

export const ATTRS = {
  LIST: `${NAME}-list`,
  MULTISELECT: `${NAME}-multiselect`,
  OPTION_INDEX: `${NAME}-option-index`,
  ACTIVE_OPTION: `${NAME}-active-option`,
};

export const EVENTS = {
  UPDATE_OPTIONS: `${NAME}-update-options`,
};

// Other constants
const searchTimeoutTime = 500;


/* CLASS */
export class Listbox extends HTMLElement {
  constructor() {
    super();

    // Class instance constants
    this.options = [];
    this.activeOptionIndex = null;
    this.lastSelectedOptionIndex = null;
    this.allSelected = false;
    this.query = '';
    this.searchTimeout = null;

    // Get DOM elements
    this.list = this.querySelector('ul');
    // Create <ul> if none given
    if (!this.list) {
      this.appendChild(document.createElement('ul'));
      this.list = this.querySelector('ul');
    }

    // Get DOM data
    this.multiselectable = this.hasAttribute(ATTRS.MULTISELECT);

    // Bind this to class methods
    this.initialiseList = this.initialiseList.bind(this);
    this.makeOptionActive = this.makeOptionActive.bind(this);
    this.makeOptionSelected = this.makeOptionSelected.bind(this);
    this.focusHandler = this.focusHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.toggleOptionState = this.toggleOptionState.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.updateActiveOption = this.updateActiveOption.bind(this);
    this.scrollOptionIntoView = this.scrollOptionIntoView.bind(this);
    this.selectContiguousOptions = this.selectContiguousOptions.bind(this);
    this.updateOptionsHandler = this.updateOptionsHandler.bind(this);
    this.findInList = this.findInList.bind(this);
    this.clearListSearch = this.clearListSearch.bind(this);
  }


  /* CLASS METHODS */
  connectedCallback() {
    // Attach event listeners
    this.list.addEventListener('focus', this.focusHandler, { passive: true });
    this.list.addEventListener('blur', this.focusHandler, { passive: true });
    this.list.addEventListener('keydown', this.keydownHandler);
    this.list.addEventListener('click', this.clickHandler, { passive: true });
    this.addEventListener(EVENTS.UPDATE_OPTIONS, this.updateOptionsHandler, { passive: true });

    // Set list attrs
    this.list.setAttribute(ATTRS.LIST, '');
    this.list.setAttribute('role', 'listbox');

    if (this.multiselectable) {
      this.list.setAttribute('aria-multiselectable', 'true');
    }

    if (!this.list.getAttribute('tabindex')) {
      this.list.setAttribute('tabindex', '0');
    }

    // Initialisation code
    this.initialiseList();
  }


  /*
    Update the listbox by recalculating the indices and setting the first option as active.
    Should be run if the list ID or options are dynamically changed to update indices.
  */
  initialiseList() {
    // Get all child <li> elements
    this.options = [...this.list.querySelectorAll('li')];

    if (this.options.length === 0) {
      return;
    }

    // Set option attributes and IDs
    this.options.forEach((option, i) => {
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      option.setAttribute(ATTRS.OPTION_INDEX, i);
      // If no ID given create an ID from parent ID and index
      option.id = option.id || `${this.id}-option${i + 1}`;
    });

    // If single-select list set first option to active
    if (!this.multiselectable) {
      this.makeOptionSelected(0);
      this.scrollOptionIntoView(0);
    }
  }


  /*
    Make option at given index active by adding attribute ATTRS.ACTIVE_OPTION
    and setting the listbox list's [aria-activedescendant] to the ID of the selected option.
    An "active" option is one currently has keyboard focus. There can be only one active option at any given time.
    For more info on the difference between "active" and "selected" visit https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_focus_vs_selection
  */
  makeOptionActive(index) {
    // Deactivate previously active option
    this.options[this.activeOptionIndex].removeAttribute(ATTRS.ACTIVE_OPTION);

    // Activate new option
    const optionToMakeActive = this.options[index];
    optionToMakeActive.setAttribute(ATTRS.ACTIVE_OPTION, '');
    this.list.setAttribute('aria-activedescendant', optionToMakeActive.id);
    this.activeOptionIndex = index;

    // If single-select list make option selected
    if (!this.multiselectable) {
      this.makeOptionSelected(index);
    }

    this.scrollOptionIntoView(this.activeOptionIndex);
  }


  /*
    Make option at given index selected by adding attribute [${ATTRS.ACTIVE_OPTION}].
    An "active" option is one that is selected. For multi-select listboxes there could be multiple "active" options.
    For more info on the difference between "active" and "selected" visit https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_focus_vs_selection
  */
  makeOptionSelected(index) {
    // If single select list and an item is currently selected
    if (!this.multiselectable && (this.lastSelectedOptionIndex !== null)) {
      this.options[this.lastSelectedOptionIndex]
        .setAttribute('aria-selected', 'false');
    }

    this.options[index].setAttribute('aria-selected', 'true');
    this.lastSelectedOptionIndex = index;
  }


  /*
    Handle focus and blur events on the listbox.
    On focus: set first option or last active option as active
    On blur: unset active option
  */
  focusHandler(e) {
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
    this.list.removeAttribute('aria-activedescendant');
  }


  /*
    Handle clicks on listbox options by setting clicked option to selected
  */
  clickHandler(e) {
    const optionClicked = e.target.closest(`[${ATTRS.OPTION_INDEX}]`);
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
    Toggle the selected state of the option at given index
  */
  toggleOptionState(index) {
    const option = this.options[index];
    const newSelectedState = option.getAttribute('aria-selected') !== 'true';
    option.setAttribute('aria-selected', newSelectedState);
    this.lastSelectedOptionIndex = newSelectedState ? index : null;
  }


  /*
    Handle keystrokes
  */
  keydownHandler(e) {
    const keyPressed = e.key || e.which || e.keyCode;

    if (keyPressedMatches(keyPressed, [KEYS.UP, KEYS.DOWN])) {
      e.preventDefault();
      const direction = keyPressedMatches(keyPressed, KEYS.UP) ? -1 : 1;
      this.updateActiveOption(direction);

      if (this.multiselectable && e.shiftKey) {
        this.toggleOptionState(this.activeOptionIndex);
      }

      return;
    }

    if (keyPressedMatches(keyPressed, KEYS.HOME)) {
      e.preventDefault();

      // If Ctrl + Shift + Home select active option and all options up until first
      if (this.multiselectable && (e.ctrlKey || e.metaKey) &&  e.shiftKey) {
        this.makeOptionRangeSelected(0, this.activeOptionIndex);
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
      if (!this.multiselectable) {
        return;
      }

      e.preventDefault();

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
            option.setAttribute('aria-selected', !this.allSelected);
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
    this.searchTimeout = setTimeout(this.clearListSearch, searchTimeoutTime);
  }


  /*
    Calculate and return index to move to based on the direction
    and wraps around if you are at the top or bottom
  */
  updateActiveOption(direction) {
    let newIndex = this.activeOptionIndex + direction;
    if (newIndex < 0) {
      newIndex = this.options.length - 1;
    } else if (newIndex === this.options.length) {
      newIndex = 0;
    }
    this.makeOptionActive(newIndex);
    this.scrollOptionIntoView(this.activeOptionIndex);
  }


  /*
    Make a range of options selected
  */
  makeOptionRangeSelected(startIndex, endIndex) {
    for (let i = startIndex; i < endIndex; i++) {
      this.options[i].setAttribute('aria-selected', 'true');
    }
  }


  /*
    Scroll option at given index into view
  */
  scrollOptionIntoView(index) {
    this.options[index]
      .scrollIntoView({
        behaviour: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
  }


  /*
    Select all options from last selected option to active option
  */
  selectContiguousOptions() {
    if (this.lastSelectedOptionIndex === null) {
      return;
    }

    let startIndex, endIndex;
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
    Finds options starting with given keyPressed wrapping around
  */
  findInList() {
    let i = this.activeOptionIndex;
    let maxIndex = this.options.length - 1;

    if (this.query.length === 1) {
      // If it's the first letter of a new search, we start searching _after_ the currently selected option
      i++;
    }

    let startingIndex = i;

    do {
      // If i has gone past the end, loop back around to the start of the list
      if (i > maxIndex) {
        i = 0;
      }

      if (this.options[i].textContent.toLowerCase().startsWith(this.query)) {
        this.makeOptionActive(i);
        break;
      }

      i++;
    } while (i !== startingIndex); // Terminates if every option has been checked
  }


  /*
    Clears the search query
  */
  clearListSearch() {
    this.query = '';
  }


  /* CUSTOM EVENT HANDLERS */
  /*
    Custom event handler for updating list options
    Run when the EVENTS.UPDATE_OPTIONS event is fired and updates
    the listbox options and indices
  */
  updateOptionsHandler(e) {
    // Checks if id in event matches class instance then updates options
    if (e.detail.id === this.id) {
      this.activeOptionIndex = null;
      this.initialiseList();
    }
  }


  disconnectedCallback() {
    /* ATTACH EVENT LISTENERS */
    this.list.removeEventListener('focus', this.focusHandler, { passive: true });
    this.list.removeEventListener('blur', this.focusHandler, { passive: true });
    this.list.removeEventListener('keydown', this.keydownHandler);
    this.list.removeEventListener('click', this.clickHandler, { passive: true });
    this.removeEventListener(EVENTS.UPDATE_OPTIONS, this.updateOptionsHandler, { passive: true });
  }
}


/* INITIALISATION CODE */
document.addEventListener('DOMContentLoaded', () => {
  // Auto-generate IDs for elements that don't have one
  autoID(NAME);
  customElements.define(NAME, Listbox);
});
