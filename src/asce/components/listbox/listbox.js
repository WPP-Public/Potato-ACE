/* IMPORTS */
import { libraryName, KEYBOARD_KEYS as KEYS } from '../../common/constants.js';


/* CONSTANTS */
// Constants to be exported and used in other modules
const COMP_NAME = `${libraryName}-listbox`;
const instanceCount = 0;


export const CONSTS = {
  LISTBOX: COMP_NAME,
  LIST: `${COMP_NAME}-list`,
  MULTISELECT: `${COMP_NAME}-multiselect`,
  OPTION_INDEX: `${COMP_NAME}-option-index`,
  ACTIVE_OPTION: `${COMP_NAME}-active-option`,
  UPDATE_OPTIONS_EVENT: `${libraryName}UpdateListboxOtions`,
};


/* CLASS */
export class Listbox extends HTMLElement {
  /* CONSTRUCTOR */
  constructor() {
    super();

    /* CLASS INSTANCE CONSTANTS */
    this.options = null;
    this.activeOptionIndex = null;
    this.lastSelectedOptionIndex = null;
    this.allSelected = false;

    /* GET DOM ELEMENTS */
    this.list = this.querySelector('ul');

    /* GET DOM DATA */
    this.id = this.id || `${CONSTS.LISTBOX}-${instanceCount}`;
    this.multiselectable = this.hasAttribute(CONSTS.MULTISELECT);

    /* BIND 'THIS' TO CLASS METHODS */
    this.initialiseList = this.initialiseList.bind(this);
    this.makeOptionActive = this.makeOptionActive.bind(this);
    this.makeOptionSelected = this.makeOptionSelected.bind(this);
    this.focusHandler = this.focusHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.toggleOptionState = this.toggleOptionState.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.updateActiveOptionIndex = this.updateActiveOptionIndex.bind(this);
    this.scrollOptionIntoView = this.scrollOptionIntoView.bind(this);
    this.selectContiguousOptions = this.selectContiguousOptions.bind(this);
    this.updateOptionsHandler = this.updateOptionsHandler.bind(this);
  }

  connectedCallback() {
    /* ATTACH EVENT LISTENERS */
    this.list.addEventListener('focus', this.focusHandler, { passive: true });
    this.list.addEventListener('blur', this.focusHandler, { passive: true });
    this.list.addEventListener('keydown', this.keydownHandler);
    this.list.addEventListener('click', this.clickHandler, { passive: true });
    this.addEventListener(`${CONSTS.UPDATE_OPTIONS_EVENT}`, this.updateOptionsHandler, { passive: true });

    // Set list attrs
    this.list.setAttribute(CONSTS.LIST, '');
    this.list.setAttribute('role', 'listbox');

    if (this.multiselectable) {
      this.list.setAttribute('aria-multiselectable', 'true');
    }

    if (!this.list.getAttribute('tabindex')) {
      this.list.setAttribute('tabindex', '0');
    }

    /* INITIALISATION CODE */
    this.initialiseList();
  }

  /* CLASS METHODS */
  /*
    Update the listbox by recalculating the indices and setting the first option as active.
    Should be run if the list ID or options are dynamically changed to update indices.
  */
  initialiseList() {
    // Get all child <li> elements or children with [role="option"]
    this.options = this.list.querySelectorAll('li') ||
      this.querySelectorAll('role="option"');

    if (this.options.length === 0) {
      return;
    }

    // Set option attributes and IDs
    this.options.forEach((option, i) => {
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      option.setAttribute(`${CONSTS.OPTION_INDEX}`, i);
      // If no ID given create an ID from parent ID and index
      option.id = option.id || `${this.id}-option${i + 1}`;
    });

    // If single-select list set first option to active
    if (!this.multiselectable) {
      this.lastSelectedOptionIndex = 0;
      this.makeOptionSelected(0);
      this.scrollOptionIntoView(0);
    }
  }


  /*
    Make option at given index active by adding attribute CONSTS.ACTIVE_OPTION
    and setting the listbox list's [aria-activedescendant] to the ID of the selected option
  */
  makeOptionActive(index) {
    // Deactivate previously active option
    this.options[this.activeOptionIndex].removeAttribute(`${CONSTS.ACTIVE_OPTION}`);

    // Activate new option
    const optionToMakeActive = this.options[index];
    optionToMakeActive.setAttribute(`${CONSTS.ACTIVE_OPTION}`, '');
    this.list.setAttribute('aria-activedescendant', optionToMakeActive.id);
    this.activeOptionIndex = index;

    // If single-select list set first option to selected
    if (!this.multiselectable) {
      this.makeOptionSelected(index);
    }
  }


  /*
    Make option at given index selected by adding attribute [${CONSTS.ACTIVE_OPTION}]
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
      this.scrollOptionIntoView(this.activeOptionIndex);
      return;
    }

    // If list blurred
    this.options[this.activeOptionIndex].removeAttribute(`${CONSTS.ACTIVE_OPTION}`);
    this.list.removeAttribute('aria-activedescendant');
  }


  /*
    Handle clicks on listbox options by setting clicked option to selected
  */
  clickHandler(e) {
    const optionClicked = e.target.closest(`[${CONSTS.OPTION_INDEX}]`);
    if (!optionClicked) {
      return;
    }

    // Get index of clicked option
    const clickedOptionIndex = parseInt(
      optionClicked.getAttribute(`${CONSTS.OPTION_INDEX}`),
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
    const newSelectedState = (option.getAttribute('aria-selected') === 'true')
      ? false
      : true;
    option.setAttribute('aria-selected', newSelectedState);
    this.lastSelectedOptionIndex = newSelectedState ? index : null;
  }


  /*
    Handle keystrokes
  */
  keydownHandler(e) {
    const keyPressed = e.key || e.which || e.keyCode;

    if (keyPressed === KEYS.UP.CODE ||
        keyPressed === KEYS.UP.KEY ||
        keyPressed === KEYS.DOWN.CODE ||
        keyPressed === KEYS.DOWN.KEY) {
      e.preventDefault();
      const direction =
        keyPressed === KEYS.UP.CODE || keyPressed === KEYS.UP.KEY
        ? 'prev'
        : 'next';

      const newActiveItemIndex = this.updateActiveOptionIndex(direction);
      this.makeOptionActive(newActiveItemIndex);
      this.scrollOptionIntoView(this.activeOptionIndex);

      if (this.multiselectable && e.shiftKey) {
        this.toggleOptionState(this.activeOptionIndex);
      }

      return;
    }

    if (keyPressed === KEYS.HOME.CODE ||
        keyPressed === KEYS.HOME.KEY) {
      e.preventDefault();

      // If Ctrl + Shift + Home select active option and all options up until first
      if (this.multiselectable && (e.ctrlKey || e.metaKey) &&  e.shiftKey) {
        for (let i = this.activeOptionIndex; i >=0; i--) {
          this.options[i].setAttribute('aria-selected', 'true');
        }
      }

      this.makeOptionActive(0);
      this.scrollOptionIntoView(this.activeOptionIndex);
      return;
    }

    if (keyPressed === KEYS.END.CODE ||
        keyPressed === KEYS.END.KEY) {
      e.preventDefault();

      // If Ctrl + Shift + End select active option and all options down until last
      if (this.multiselectable && (e.ctrlKey || e.metaKey) &&  e.shiftKey) {
        for (let i = this.activeOptionIndex; i < this.options.length; i++) {
          this.options[i].setAttribute('aria-selected', 'true');
        }
      }

      this.makeOptionActive(this.options.length - 1);
      this.scrollOptionIntoView(this.activeOptionIndex);
      return;
    }

    // If space bar pressed on a multiselect listbox option, set it to selected
    if (keyPressed === KEYS.SPACE.CODE ||
        keyPressed === KEYS.SPACE.KEY) {
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
    if (keyPressed === KEYS.A.CODE ||
        keyPressed === KEYS.A.KEY) {
      if (this.multiselectable) {
        // @mstrutt: not using early return here as the 'A' key will be used in the "type-ahead",
        // search function to be added at the end of this handler
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this.options.forEach(option => {
            option.setAttribute('aria-selected', !this.allSelected);
          });
          this.allSelected = !this.allSelected;
        }
      }
    }

    // "type-ahead" search function goes here. It takes keyPressed and finds the nearest option starting with that key
    // this.search(keyPressed);
  }


  /*
    Calculate and return index to move to based on the direction
    and wraps around if you are at the top or bottom
  */
  updateActiveOptionIndex(direction) {
    let newIndex = null;

    if (direction === 'prev') {
      // If at first option wrap around to last option
      if (this.activeOptionIndex === 0) {
        newIndex = this.options.length - 1;
      } else {
        newIndex = this.activeOptionIndex - 1;
      }
      return newIndex;
    }

    // If at last option wrap around to first option
    if (this.activeOptionIndex === this.options.length - 1) {
      newIndex = 0;
    } else {
      newIndex = this.activeOptionIndex + 1;
    }
    return newIndex;
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


  /* CUSTOM EVENT HANDLERS */
  /*
    Custom event handler for updating list options
    Run when the CONSTS.UPDATE_OPTIONS_EVENT event is fired and updates
    the listbox options and indices
  */
  updateOptionsHandler(e) {
  // Checks if id in event matches class instance then updates options
    if (e.detail.id === this.id) {
      this.activeOptionIndex = null;
      this.initialiseList();
    }
  }
}

customElements.define(COMP_NAME, Listbox);
