import { KEYBOARD_KEYS as KEYS } from '../../common/constants';

// CONSTANTS
export const CONSTS = {
  ELEM: `a11y-listbox`,
  UPDATE_OPTIONS_EVENT: `a11yupdateListOptionsboxOptions`,
}

// CLASS
export class Listbox {
  constructor(elem) {
    // DEFINE CONSTANTS
    this.elem = elem;
    this.options = null;
    this.activeOptionIndex = null;
    this.allSelected = false;

    // GET DOM ELEMENTS

    // GET DOM DATA
    this.instanceId = elem.id;
    this.multiselect = this.elem.getAttribute('aria-multiselectable') ? true : false;

    // SET DOM DATA
    // Set list attrs
    this.elem.setAttribute('tabindex', '0');
    this.elem.setAttribute('role', 'listbox');

    // BIND 'THIS'
    this.updateListOptions = this.updateListOptions.bind(this);
    this.setActiveAndSelectedOption = this.setActiveAndSelectedOption.bind(this);
    this.updateActiveOptionIndex = this.updateActiveOptionIndex.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.toggleActiveOptionAriaSelected = this.toggleActiveOptionAriaSelected.bind(this);
    this.updateOptionsHandler = this.updateOptionsHandler.bind(this);

    // EVENT LISTENERS
    this.elem.addEventListener('click', this.clickHandler);
    this.elem.addEventListener('keydown', this.keydownHandler);
    this.elem.addEventListener(`${CONSTS.UPDATE_OPTIONS_EVENT}`, this.updateOptionsHandler);

    this.updateListOptions();
  }


  // METHODS
  static attachTo(elem) {
    return new Listbox(elem);
  }


  // Update the list and set the first option as selected
  // if the list options are dynamically changed
  updateListOptions() {
    this.options = this.elem.querySelectorAll('li');
    if (this.options.length === 0) {
      return;
    }

    this.options.forEach((option, i) => {
      option.id = `${this.instanceId}-option${i + 1}`;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
    });
    this.activeOptionIndex = 0;
    this.setActiveAndSelectedOption();
  }


  // Select the option at index this.activeOptionIndex
  setActiveAndSelectedOption() {
    // Deselect previously selected option
    const previouslyActiveOption = this.elem.querySelector(`[${CONSTS.ELEM}-active-option]`);
    if (previouslyActiveOption) {
      previouslyActiveOption.removeAttribute(`${CONSTS.ELEM}-active-option`);
    }

    // Select new option
    const activeOption = this.options[this.activeOptionIndex];
    activeOption.setAttribute(`${CONSTS.ELEM}-active-option`, '');


    // Single select actions for selecting active option
    if (!this.multiselect) {
      if (previouslyActiveOption) {
        previouslyActiveOption.setAttribute('aria-selected', 'false');
      }
      activeOption.setAttribute('aria-selected', 'true');
    }

    // Scroll selected option into view
    activeOption.scrollIntoView({
      behaviour: 'smooth',
      block: 'nearest',
      inline: 'start',
    });

    // Set activedescendant of listbox to id of selected option
    this.elem.setAttribute('aria-activedescendant', activeOption.id);
    return;
  }


  // Updates this.activeOptionIndex based on the direction
  // and wraps around if you are at the top or bottom
  // then runs setActiveAndSelectedOption to activate it
  updateActiveOptionIndex(direction) {
    // If previous option selected
    if (direction === 'prev') {
      if (this.activeOptionIndex === 0) {
        this.activeOptionIndex = this.options.length - 1;
      } else {
        this.activeOptionIndex--;
      }
      this.setActiveAndSelectedOption();
      return;
    }

    // If next option selected
    if (this.activeOptionIndex === this.options.length - 1) {
      this.activeOptionIndex = 0;
    } else {
      this.activeOptionIndex++;
    }
    this.setActiveAndSelectedOption();
  }


  // Handle clicks on options
  clickHandler(e) {
    if (e.target.closest('[role="option"]')) {
      // Get index of clicked option in parent
      this.activeOptionIndex = [...e.target.parentElement.children]
        .indexOf(e.target);

      if (this.multiselect) {
        this.toggleActiveOptionAriaSelected();
      }

      this.setActiveAndSelectedOption();
    }
  }


  // Handle UP, DOWN, HOME and END keys
  keydownHandler(e) {
    const keyPressed = e.key || e.which || e.keyCode;
    // console.log(e.which);
    // console.log(e.key);

    if (keyPressed === KEYS.UP.CODE ||
        keyPressed === KEYS.UP.KEY) {
      e.preventDefault();
      this.updateActiveOptionIndex('prev');

      if (this.multiselect && e.shiftKey) {
        this.toggleActiveOptionAriaSelected();
      }
      return;
    }

    if (keyPressed === KEYS.DOWN.CODE ||
        keyPressed === KEYS.DOWN.KEY) {
      e.preventDefault();
      this.updateActiveOptionIndex('next');

      if (this.multiselect && e.shiftKey) {
        this.toggleActiveOptionAriaSelected();
      }
      return;
    }

    if (keyPressed === KEYS.HOME.CODE ||
        keyPressed === KEYS.HOME.KEY) {
      e.preventDefault();

      // If Ctrl + Shift + HOME select active option and all options up until first
      if (this.multiselect && (e.ctrlKey || e.metaKey) &&  e.shiftKey) {
        for (let i = this.activeOptionIndex; i >=0; i--) {
          this.options[i].setAttribute('aria-selected', 'true');
        }
      }

      this.activeOptionIndex = 0;
      this.setActiveAndSelectedOption();
      return;
    }

    if (keyPressed === KEYS.END.CODE ||
        keyPressed === KEYS.END.KEY) {
      e.preventDefault();

      // If Ctrl + Shift + END select active option and all options down until last
      if (this.multiselect && (e.ctrlKey || e.metaKey) &&  e.shiftKey) {
        for (let i = this.activeOptionIndex; i < this.options.length; i++) {
          this.options[i].setAttribute('aria-selected', 'true');
        }
      }

      this.activeOptionIndex = this.options.length - 1;
      this.setActiveAndSelectedOption();
      return;
    }

    if (keyPressed === KEYS.SPACE.CODE ||
        keyPressed === KEYS.SPACE.KEY) {
      e.preventDefault();

      if (!this.multiselect) {
        return;
      }

      // if (e.shiftKey) {
      //   for (let i = this.activeOptionIndex; i >= 0; i--) {
      //     if (this.options[i].getAttribute('aria-selected') === 'true') {
      //       break;
      //     }
      //     this.options[i].setAttribute('aria-selected', 'true');
      //   };
      //   return;
      // }

      this.toggleActiveOptionAriaSelected();
    }

    if (!this.multiselect) {
      return;
    }

    // Select or deselect all with 'Ctrl + A'
    if (keyPressed === KEYS.A.CODE ||
        keyPressed === KEYS.A.KEY) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        this.options.forEach(option => {
          option.setAttribute('aria-selected', !this.allSelected)
        });
        this.allSelected = !this.allSelected;
      }
    }
  }


  // Select the previous and current options in multiselect listboxes
  // (to be used when 'shift + <arrow>' pressed)
  toggleActiveOptionAriaSelected() {
    const activeOption = this.options[this.activeOptionIndex];
    const newSelectedState = (activeOption.getAttribute('aria-selected') === 'true')
      ? false
      : true;
    activeOption.setAttribute('aria-selected', newSelectedState);
  }


  // Event handler for updating list options custom event.
  // Checks if id in event matched this class instance then updates list options
  updateOptionsHandler(e) {
    if (e.detail.id === this.elem.id) {
      this.updateListOptions();
    }
  }
}
