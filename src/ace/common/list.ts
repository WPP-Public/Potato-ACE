/*
	Class that instantiates a single-select or multi-select list in a given element.

	It adds focus, click and keydown handlers, as well as public methods to change the active and/or selected options.

	Conforms to the Listbox spec found here:
	https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
*/
import { DISPLAY_NAME, KEYS, NAME } from './constants.js';
import { getIndexBasedOnDirection, keyPressedMatches, warnIfElHasNoAriaLabel } from './functions.js';


const DEFAULT_OPTION_ATTR = `${NAME}-list-option`;

export default class List {
	public activeOptionAttr = `${DEFAULT_OPTION_ATTR}-active`;
	private activeOptionIndex = 0;
	private allSelected = false;
	private isMenu = false;
	public lastSelectedOptionIndex: number | undefined;
	private listEl!: HTMLUListElement | HTMLOListElement;
	public multiselectable = false;
	public optionAttr = DEFAULT_OPTION_ATTR;
	public optionEls: NodeListOf<HTMLLIElement> | undefined;
	public optionElsCount = 0;
	private query = '';
	private searchTimeout: number | undefined;

	// Time List will wait before considering a character as start of new string when using type-ahead search
	static SEARCH_TIMEOUT = 500;


	constructor(element: HTMLUListElement | HTMLOListElement, optionAttr?: string) {
		if (!(element instanceof HTMLUListElement) && !(element instanceof HTMLOListElement)) {
			return;
		}

		/* CLASS METHOD BINDINGS */
		this.clickHandler = this.clickHandler.bind(this);
		this.destroy = this.destroy.bind(this);
		this.findOption = this.findOption.bind(this);
		this.focusHandler = this.focusHandler.bind(this);
		this.initOptionEls = this.initOptionEls.bind(this);
		this.keydownHandler = this.keydownHandler.bind(this);
		this.makeOptionActive = this.makeOptionActive.bind(this);
		this.scrollOptionIntoView = this.scrollOptionIntoView.bind(this);
		this.selectOption = this.selectOption.bind(this);
		this.selectOptionOrMakeActive = this.selectOptionOrMakeActive.bind(this);
		this.selectRangeOfOptions = this.selectRangeOfOptions.bind(this);
		this.toggleOptionSelection = this.toggleOptionSelection.bind(this);


		/* GET DOM DATA */
		this.listEl = element;
		this.isMenu = this.listEl.getAttribute('role') === 'menu';
		this.multiselectable = this.listEl.getAttribute('aria-multiselectable') === 'true';


		/* SET DOM DATA */
		if (!this.listEl.hasAttribute('role')) {
			this.listEl.setAttribute('role', 'listbox');
		}


		/* ADD EVENT LISTENERS */
		this.listEl.addEventListener('blur', this.focusHandler);
		this.listEl.addEventListener('click', this.clickHandler);
		this.listEl.addEventListener('focus', this.focusHandler);
		this.listEl.addEventListener('keydown', this.keydownHandler);


		/* INITIALISATION */
		if (!this.listEl.id) {
			console.warn(`${DISPLAY_NAME}: This list requires an ID:`, this.listEl);
			return;
		}

		warnIfElHasNoAriaLabel(this.listEl, 'List');

		if (optionAttr) {
			this.optionAttr = optionAttr;
			this.activeOptionAttr = `${optionAttr}-active`;
		}

		this.initOptionEls();
	}


	public destroy(): void {
		/* REMOVE EVENT LISTENERS */
		this.listEl.removeEventListener('blur', this.focusHandler);
		this.listEl.removeEventListener('click', this.clickHandler);
		this.listEl.removeEventListener('focus', this.focusHandler);
		this.listEl.removeEventListener('keydown', this.keydownHandler);
	}


	/*
		Handle clicks on list options
	*/
	private clickHandler(e: Event): void {
		if (!this.optionEls) {
			return;
		}

		const optionClicked = (e.target as Element).closest('li');
		if (!optionClicked) {
			return;
		}

		// Make clicked option active
		const clickedOptionIndex = [...this.optionEls].indexOf(optionClicked);
		if (!this.multiselectable) {
			if (clickedOptionIndex !== this.lastSelectedOptionIndex) {
				this.selectOption(clickedOptionIndex);
			}
			return;
		}

		if ((e as MouseEvent).shiftKey) {
			if (this.lastSelectedOptionIndex || this.lastSelectedOptionIndex === 0) {
				this.selectRangeOfOptions(clickedOptionIndex, this.lastSelectedOptionIndex);
				this.makeOptionActive(clickedOptionIndex);
			}
		} else {
			this.toggleOptionSelection(clickedOptionIndex);
		}
	}


	/*
		Finds options who's text content starts with a given query
	*/
	private findOption(query: string): void {
		clearTimeout(this.searchTimeout);
		this.query += query;
		let i = this.activeOptionIndex;

		if (this.query.length === 1) {
			// If it's the first letter of a new search, we start searching after the currently selected option
			i = getIndexBasedOnDirection(i, 1, this.optionElsCount, true);
		}

		const startingIndex = i;
		do {
			if (this.optionEls) {
				const optionText = this.optionEls[i]
					.textContent
					?.trim()
					.toLowerCase();

				if (optionText?.startsWith(this.query)) {
					this.selectOptionOrMakeActive(i);
					break;
				}
			}

			i = getIndexBasedOnDirection(i, 1, this.optionElsCount, true);
		} while (i !== startingIndex); // Terminates if every option has been checked


		this.searchTimeout = window.setTimeout(() => this.query = '', List.SEARCH_TIMEOUT);
	}


	/*
		Handle focus and blur events on the list
		On blur: remove active option
		On focus: set option that was active before blur as active
	*/
	private focusHandler(e: Event): void {
		if (this.optionElsCount === 0) {
			return;
		}

		// If list focused
		if (e.type === 'focus') {
			this.makeOptionActive(this.activeOptionIndex);
			return;
		}

		// If list blurred
		if (this.optionEls) {
			this.optionEls[this.activeOptionIndex].removeAttribute(this.activeOptionAttr);
		}

		this.listEl.removeAttribute('aria-activedescendant');
	}


	/*
		Add appropriate attributes to the list options.
		Will select last option with aria-selected="true" and make active the last option with attribute LIST_OPTION_ACTIVE
		Must be run after options are dynamically changed, i.e. added or removed.
	*/
	public initOptionEls(): void {
		let allSelected = true;

		this.optionEls = this.listEl.querySelectorAll('li');
		this.optionElsCount = this.optionEls.length;
		this.optionEls.forEach((optionEl, i) => {
			const optionIsSelected = optionEl.getAttribute('aria-selected') === 'true';
			const optionIsActive = optionEl.hasAttribute(this.activeOptionAttr);

			// Set ID only if it was not given or we have previously provided it automatically
			if (!optionEl.id || optionEl.id.includes(`${this.listEl.id}-option-`)) {
				optionEl.id = `${this.listEl.id}-option-${i + 1}`;
			}

			optionEl.setAttribute(this.optionAttr, '');
			optionEl.setAttribute('aria-selected', optionIsSelected.toString());
			optionEl.setAttribute('role', this.isMenu ? 'menuitem' : 'option');


			if (optionIsSelected) {
				this.selectOption(i);
			} else if (this.multiselectable && allSelected) {
				// If multi-select list and any option not selected set allSelected to false, used for Ctrl + A keypress
				allSelected = false;
			}

			// If option is active option then set activeOptionIndex to its index
			if (optionIsActive) {
				this.activeOptionIndex = i;
			}

			// If list not focused then make active option inactive
			if (document.activeElement !== this.listEl) {
				optionEl.removeAttribute(this.activeOptionAttr);
				this.listEl.removeAttribute('aria-activedescendant');
			}
		});

		if (this.multiselectable) {
			this.allSelected = allSelected;
		}
	}


	/*
		Handle keystrokes on list
	*/
	public keydownHandler(e: Event): void {
		const keyboardEvent = e as KeyboardEvent;
		const keyPressed = keyboardEvent.key;

		if (keyPressedMatches(keyPressed, [KEYS.UP, KEYS.DOWN])) {
			e.preventDefault();
			const direction = keyPressed == KEYS.UP ? -1 : 1;
			const indexOfOptionToUpdate = getIndexBasedOnDirection(this.activeOptionIndex, direction, this.optionElsCount, true);
			if (this.multiselectable) {
				if (keyboardEvent.shiftKey) {
					this.toggleOptionSelection(indexOfOptionToUpdate);
				} else {
					this.makeOptionActive(indexOfOptionToUpdate);
				}
			} else {
				this.selectOption(indexOfOptionToUpdate);
			}
			return;
		}

		if (keyPressedMatches(keyPressed, [KEYS.HOME, KEYS.END])) {
			e.preventDefault();
			const homeKeyPressed = keyPressed == KEYS.HOME;
			const optionIndex = homeKeyPressed ? 0 : this.optionElsCount - 1;
			if (this.multiselectable) {
				// If Ctrl + Shift + Home pressed select all options between active and first options inclusive
				if ((keyboardEvent.ctrlKey || keyboardEvent.metaKey) && keyboardEvent.shiftKey) {
					this.selectRangeOfOptions(
						homeKeyPressed ? 0 : this.activeOptionIndex,
						homeKeyPressed ? this.activeOptionIndex : this.optionElsCount - 1
					);
				}
			}
			this.selectOptionOrMakeActive(optionIndex);
			return;
		}

		if (this.multiselectable && keyPressed == KEYS.SPACE) {
			e.preventDefault();
			if (keyboardEvent.shiftKey) {
				if (this.lastSelectedOptionIndex || this.lastSelectedOptionIndex === 0) {
					this.selectRangeOfOptions(this.lastSelectedOptionIndex, this.activeOptionIndex);
				}
			} else {
				this.toggleOptionSelection(this.activeOptionIndex);
			}
			return;
		}

		// Select or deselect all with 'Ctrl + A'
		if (this.multiselectable && keyPressed == KEYS.A && (keyboardEvent.ctrlKey || keyboardEvent.metaKey)) {
			e.preventDefault();
			this.allSelected = !this.allSelected;
			if (this.optionEls) {
				this.optionEls.forEach(option => option.setAttribute('aria-selected', (this.allSelected).toString()));
			}
			return;
		}

		// "Type-ahead" search functionality
		// Ignore non-alphanumeric keys
		if (keyPressed.length > 1 || keyboardEvent.ctrlKey || keyboardEvent.metaKey) {
			return;
		}

		this.findOption(keyPressed.toLowerCase());
	}


	/*
		Make option at given index active by adding attribute and setting the list's [aria-activedescendant].
		An "active" option is the one that currently has perceived focus
		There can be only one active option at any given time.
		For more info on the difference between "active" and "selected" see
		https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_vs_selection
	*/
	private makeOptionActive(index: number): void {
		if (!this.optionEls) {
			return;
		}

		// Make currently active option inactive
		const currentlyActiveOption = this.optionEls[this.activeOptionIndex];
		if (currentlyActiveOption) {
			currentlyActiveOption.removeAttribute(this.activeOptionAttr);
		}

		this.activeOptionIndex = index;

		if (document.activeElement !== this.listEl) {
			return;
		}
		// Make option at given index active
		const optionElToMakeActive = this.optionEls[index];
		optionElToMakeActive.setAttribute(this.activeOptionAttr, '');
		this.listEl.setAttribute('aria-activedescendant', optionElToMakeActive.id);
		if (this.multiselectable) {
			this.scrollOptionIntoView(index);
		}
	}


	/*
		Scroll option at given index into view
	*/
	private scrollOptionIntoView(index: number): void {
		if (this.optionEls) {
			const listElRect = this.listEl.getBoundingClientRect();
			const optionElRect = this.optionEls[index].getBoundingClientRect();
			const optionElTop = optionElRect.top;
			const listElTop = listElRect.top;
			const optionElBottom = optionElRect.bottom;
			const listElBottom = listElRect.bottom;

			// Scroll list up to show option
			if (optionElTop < listElTop) {
				this.listEl.scrollBy({
					left: 0,
					top: optionElTop - listElTop,
				});
				return;
			}

			// Scroll list down to show option
			if (optionElBottom > listElBottom) {
				this.listEl.scrollBy({
					left: 0,
					top: optionElBottom - listElBottom,
				});
			}
		}
	}


	/*
		Select option at given index
	*/
	public selectOption(index: number): void {
		if (!this.optionEls) {
			return;
		}

		if (!this.multiselectable) {
			// Deselect currently selected option
			if (this.lastSelectedOptionIndex || this.lastSelectedOptionIndex === 0) {
				const currentlySelectedOption = this.optionEls[this.lastSelectedOptionIndex];
				if (currentlySelectedOption) {
					currentlySelectedOption.setAttribute('aria-selected', 'false');
				}
			}
			this.makeOptionActive(index);
		}

		// Select option at given index
		this.optionEls[index].setAttribute('aria-selected', 'true');
		this.scrollOptionIntoView(index);
		this.lastSelectedOptionIndex = index;
	}


	/*
		Selects option at given index if single-select list or makes it active if multi-select list
	*/
	private selectOptionOrMakeActive(index: number): void {
		if (this.multiselectable) {
			this.makeOptionActive(index);
		} else {
			this.selectOption(index);
		}
	}


	/*
		Select range of options
	*/
	private selectRangeOfOptions(firstIndex: number, secondIndex: number): void {
		const countUp = firstIndex < secondIndex;
		for (let i = firstIndex; countUp ? i <= secondIndex : i >= secondIndex; countUp ? i++ : i--) {
			this.selectOption(i);
		}
	}


	/*
		Toggle selection of option at given index
	*/
	private toggleOptionSelection(index: number): void {
		if (!this.optionEls) {
			return;
		}

		const optionElToToggle = this.optionEls[index];
		const newSelectedState = optionElToToggle.getAttribute('aria-selected') !== 'true';
		if (index !== this.activeOptionIndex) {
			this.makeOptionActive(index);
		}

		optionElToToggle.setAttribute('aria-selected', newSelectedState.toString());
		if (newSelectedState) {
			this.lastSelectedOptionIndex = index;
		}
	}
}
