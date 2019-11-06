import { KEYBOARD_KEYS as KEYS } from '../../common/constants';


// CONSTANTS
const BASE_CONST = 'a11y-listbox';
export const CONSTS = {
  OPTION_INDEX: `${BASE_CONST}-option-index`,
  ACTIVE_OPTION: `${BASE_CONST}-active-option`,
  UPDATE_OPTIONS_EVENT: `a11yupdateListOptionsboxOptions`,
}


// CLASS
export class Listbox {
  constructor(elem) {
    // DEFINE CONSTANTS
    this.elem = elem;
    this.options = null;
    this.activeOptionIndex = null;
    this.lastSelectedOptionIndex = null;
    this.allSelected = false;

    // GET DOM ELEMENTS

    // GET DOM DATA
    this.instanceId = elem.id;
    this.multiselectable = elem.getAttribute('aria-multiselectable') ? true : false;

    // SET DOM DATA
    // Set list attrs
    this.elem.setAttribute('tabindex', '0');
    this.elem.setAttribute('role', 'listbox');

    // BIND 'THIS'
    this.initialiseList = this.initialiseList.bind(this);
    this.makeOptionActive = this.makeOptionActive.bind(this);
    this.makeOptionSelected = this.makeOptionSelected.bind(this);
    this.focusHandler = this.focusHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.toggleOptionState = this.toggleOptionState.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.updateActiveOptionIndex = this.updateActiveOptionIndex.bind(this);
    this.scrollOptionIntoView = this.scrollOptionIntoView.bind(this);
    this.updateOptionsHandler = this.updateOptionsHandler.bind(this);
    this.selectContiguousOptions = this.selectContiguousOptions.bind(this);

    // EVENT LISTENERS
    this.elem.addEventListener('focus', this.focusHandler, {passive: true});
    this.elem.addEventListener('blur', this.focusHandler, {passive: true});
    this.elem.addEventListener('click', this.clickHandler, {passive: true});
    this.elem.addEventListener('keydown', this.keydownHandler);
    this.elem.addEventListener(`${CONSTS.UPDATE_OPTIONS_EVENT}`, this.updateOptionsHandler, {passive: true});

    this.initialiseList();
  }


  // METHODS
  static attachTo(elem) {
    return new Listbox(elem);
  }


  // Update the list and set the first option as active
  // if the list options are dynamically changed
  initialiseList() {
    this.options = this.elem.querySelectorAll('li') ||
      this.elem.querySelectorAll('role="option"');

    if (this.options.length === 0) {
      return;
    }

    // set options attributes and IDs
    this.options.forEach((option, i) => {
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      option.setAttribute(`${CONSTS.OPTION_INDEX}`, i);

      if (!option.id) {
        option.id = `${this.instanceId}-option${i + 1}`;
      }
    });

    if (!this.multiselectable) {
      this.lastSelectedOptionIndex = 0;
      this.makeOptionSelected(0);
      this.scrollOptionIntoView(0);
    }
  }


  // Make option at given index active
  makeOptionActive(index) {
    // Deactivate previously active option
    this.options[this.activeOptionIndex].removeAttribute(`${CONSTS.ACTIVE_OPTION}`);

    // Activate new option
    const optionToMakeActive = this.options[index];
    optionToMakeActive.setAttribute(`${CONSTS.ACTIVE_OPTION}`, '')
    this.elem.setAttribute('aria-activedescendant', optionToMakeActive.id);
    this.activeOptionIndex = index;

    if (!this.multiselectable) {
      this.makeOptionSelected(index);
    }
  }


  // Select option at given index
  makeOptionSelected(index) {
    // If single select list and an item is currently selected
    if (!this.multiselectable && (this.lastSelectedOptionIndex !== null)) {
      this.options[this.lastSelectedOptionIndex]
        .setAttribute('aria-selected', 'false');
    }

    this.options[index].setAttribute('aria-selected', 'true');
    this.lastSelectedOptionIndex = index;

  }


  // Handle focus and blur events on list
  focusHandler(e) {
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
    this.options[this.activeOptionIndex].removeAttribute(`${CONSTS.ACTIVE_OPTION}`);
    this.elem.removeAttribute('aria-activedescendant');
  }


  // Handle clicks on options
  clickHandler(e) {
    if (e.target.closest('[role="option"]')) {
      // get index of clicked option
      const clickedOptionIndex = parseInt(
        e.target.getAttribute(`${CONSTS.OPTION_INDEX}`),
        10
      );

      // set clicked option to active
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
  }


  // Toggle the selected state of the option at given index
  toggleOptionState(index) {
    const option = this.options[index];
    const newSelectedState = (option.getAttribute('aria-selected') === 'true')
      ? false
      : true;
    option.setAttribute('aria-selected', newSelectedState);
    this.lastSelectedOptionIndex = newSelectedState ? index : null;
  }


  // Handle keystrokes
  keydownHandler(e) {
    const keyPressed = e.key || e.which || e.keyCode;
    // console.log(e.which);
    // console.log(e.key);

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

      // If Ctrl + Shift + HOME select active option and all options up until first
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

      // If Ctrl + Shift + END select active option and all options down until last
      if (this.multiselectable && (e.ctrlKey || e.metaKey) &&  e.shiftKey) {
        for (let i = this.activeOptionIndex; i < this.options.length; i++) {
          this.options[i].setAttribute('aria-selected', 'true');
        }
      }

      this.makeOptionActive(this.options.length - 1);
      this.scrollOptionIntoView(this.activeOptionIndex);
      return;
    }

    if (keyPressed === KEYS.SPACE.CODE ||
        keyPressed === KEYS.SPACE.KEY) {
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

    if (keyPressed === KEYS.A.CODE ||
        keyPressed === KEYS.A.KEY) {
      if (this.multiselectable) {
        if (e.ctrlKey || e.metaKey) {
          // Select or deselect all with 'Ctrl + A'
          e.preventDefault();
          this.options.forEach(option => {
            option.setAttribute('aria-selected', !this.allSelected)
          });
          this.allSelected = !this.allSelected;
        }
      }
    }
  }


  // Calculates and returns index to move to based on the direction
  // and wraps around if you are at the top or bottom
  updateActiveOptionIndex(direction) {
    let newIndex = null;

    // If previous option selected
    if (direction === 'prev') {
      // if at first
      if (this.activeOptionIndex === 0) {
        newIndex = this.options.length - 1;
      } else {
        newIndex = this.activeOptionIndex - 1;
      }
      return newIndex;
    }

    // If next option selected
    if (this.activeOptionIndex === this.options.length - 1) {
      newIndex = 0;
    } else {
      newIndex = this.activeOptionIndex + 1;
    }
    return newIndex;
  }


  // Scroll option at given index into view
  scrollOptionIntoView(index) {
    this.options[index]
      .scrollIntoView({
        behaviour: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
  }


  // Select all options from last selected option to active option
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


  // Event handler for updating list options custom event
  // Checks if id in event matches class instance then updates options
  updateOptionsHandler(e) {
    if (e.detail.id === this.elem.id) {
      this.activeOptionIndex = null;
      this.initialiseList();
    }
  }
}
