import { KEYBOARD_KEYS as KEYS } from '../../common/constants';

// CONSTANTS
export const CONSTS = {
  UPDATE_OPTIONS_EVENT: `a11yUpdateListboxOptions`,
}

// CLASS
export class Listbox {
  constructor(elem) {
    // DEFINE CONSTANTS
    this.elem = elem;
    this.options = null;
    this.activeOptionIndex = null;

    // GET DOM ELEMENTS

    // GET DOM DATA
    this.instanceId = elem.id;
    // this.multiSelect = this.elem.getAttribute('aria-multiselectable') ? true : false;

    // SET DOM DATA
    // Set list attrs
    this.elem.setAttribute('tabindex', '0');
    this.elem.setAttribute('role', 'listbox');

    // BIND 'THIS'
    this.updateList = this.updateList.bind(this);
    this.setOption = this.setOption.bind(this);
    this.setPrevOrNextOption = this.setPrevOrNextOption.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.updateOptionsHandler = this.updateOptionsHandler.bind(this);

    // EVENT LISTENERS
    this.elem.addEventListener('click', this.clickHandler);
    this.elem.addEventListener('keydown', this.keydownHandler);
    this.elem.addEventListener(`${CONSTS.UPDATE_OPTIONS_EVENT}`, this.updateOptionsHandler);

    this.updateList();
  }


  // METHODS
  static attachTo(elem) {
    return new Listbox(elem);
  }


  // Update the list and set the first option as selected
  // if the list options are dynamically changed
  updateList() {
    this.options = this.elem.querySelectorAll('li');
    if (this.options.length === 0) {
      return;
    }

    this.options.forEach((option, i) => {
      option.id = `${this.instanceId}-option${i + 1}`;
      option.setAttribute('role', 'option');
    });
    this.activeOptionIndex = 0;
    this.setOption();
  }


  // Select the option at index this.activeOptionIndex
  setOption() {
    // Deselect previously selected option
    const previouslySelected = this.elem.querySelector('[aria-selected="true"]');
    if (previouslySelected) {
      previouslySelected.setAttribute('aria-selected', 'false');
    }

    // Select new option
    const selectedOption = this.options[this.activeOptionIndex];
    selectedOption.setAttribute('aria-selected', 'true');

    // Scroll selected option into view
    selectedOption.scrollIntoView({
      behaviour: 'smooth',
      block: 'nearest',
      inline: 'start',
    });

    // Set activedescendant of listbox to id of selected option
    this.elem.setAttribute('aria-activedescendant', selectedOption.id);
    return;
  }


  // Sets this.activeOptionIndex based on the direction
  // and wraps around if you are at the top or bottom
  setPrevOrNextOption(direction) {
    // If previous option selected
    if (direction === 'prev') {
      if (this.activeOptionIndex === 0) {
        this.activeOptionIndex = this.options.length - 1;
      } else {
        this.activeOptionIndex--;
      }
      this.setOption();
      return;
    }

    // If next option selected
    if (this.activeOptionIndex === this.options.length - 1) {
      this.activeOptionIndex = 0;
    } else {
      this.activeOptionIndex++;
    }
    this.setOption();
  }


  // Handle clicks on options
  clickHandler(e) {
    if (e.target.closest('[role="option"]')) {
      // Get index of clicked option in parent
      this.activeOptionIndex = [...e.target.parentElement.children]
        .indexOf(e.target);
      this.setOption();
    }
  }


  // Handle UP, DOWN, HOME and END keys
  keydownHandler(e) {
    const keyPressed = e.key || e.which || e.keyCode;

    if (keyPressed === KEYS.UP.CODE ||
        keyPressed === KEYS.UP.KEY) {
      e.preventDefault();
      this.setPrevOrNextOption('prev');
      return;
    }

    if (keyPressed === KEYS.DOWN.CODE ||
        keyPressed === KEYS.DOWN.KEY) {
      e.preventDefault();
      this.setPrevOrNextOption('next');
      return;
    }

    if (keyPressed === KEYS.HOME.CODE ||
        keyPressed === KEYS.HOME.KEY) {
      e.preventDefault();
      this.activeOptionIndex = 0;
      this.setOption();
      return;
    }

    if (keyPressed === KEYS.END.CODE ||
        keyPressed === KEYS.END.KEY) {
      e.preventDefault();
      this.activeOptionIndex = this.options.length - 1;
      this.setOption();
      return;
    }
  }


  // Update options event handler
  updateOptionsHandler(e) {
    if (e.detail.id === this.elem.id) {
      this.updateList();
    }
  }
}
