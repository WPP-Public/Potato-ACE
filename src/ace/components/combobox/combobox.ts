/* IMPORTS */
import { DISPLAY_NAME, KEYS, NAME } from '../../common/constants.js';
import {
	autoID,
	getElByAttrOrSelector,
	getIndexBasedOnDirection,
	handleOverflow,
	keyPressedMatches,
	warnIfElHasNoAriaLabel
} from '../../common/functions.js';
import List from '../../common/list.js';


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
	private allOptionEls: Array<Node>;
	private inputAutocompletes: boolean;
	private inputEl: HTMLInputElement;
	private lastChosenOptionIndex: number = null;
	private list: List;
	private listAutocompletes: boolean;
	private listAutoselects: boolean;
	private listEl: HTMLUListElement;
	private listVisible = false;
	private noInputUpdate: boolean;
	private query = '';
	private selectedOptionIndex: number = null;


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
		this.keydownHandler = this.keydownHandler.bind(this);
		this.showList = this.showList.bind(this);
	}


	public connectedCallback(): void {
		/* GET DOM ELEMENTS */
		this.inputEl = getElByAttrOrSelector(this, ATTRS.INPUT, 'input') as HTMLInputElement;
		this.listEl = getElByAttrOrSelector(this, ATTRS.LIST, 'ul') as HTMLUListElement;
		// Error if no <input> nor <ul> present because they can't be automatically generated as they require an 'aria-label' or an 'aria-labelledby' attribute from the user
		if (!this.inputEl) {
			console.error(`${DISPLAY_NAME}: Combobox with ID ${this.id} requires an <input> descendant element that has an aria-label or aria-labelledby attribute.`);
			return;
		}
		if (!this.listEl) {
			console.error(`${DISPLAY_NAME}: Combobox with ID ${this.id} requires a <ul> descendant element that has an aria-label describing its options.`);
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


		// Instantiate a List in the listEl
		this.list = new List(this.listEl, ATTRS.OPTION);


		/* ADD EVENT LISTENERS */
		this.addEventListener(EVENTS.IN.UPDATE_OPTIONS, this.customEventsHandler);
		this.addEventListener(EVENTS.IN.HIDE_LIST, this.customEventsHandler);
		this.addEventListener(EVENTS.IN.SHOW_LIST, this.customEventsHandler);
		this.addEventListener(EVENTS.IN.SELECT_OPTION, this.customEventsHandler);
		this.inputEl.addEventListener('focus', this.focusHandler);
		this.inputEl.addEventListener('blur', this.focusHandler);
		this.inputEl.addEventListener('keydown', this.keydownHandler);
		this.inputEl.addEventListener('input', this.inputHandler);
		this.listEl.addEventListener('click', this.clickHandler);
		this.listEl.addEventListener('mousedown', this.mousedownHandler);


		/* INITIALISATION */
		warnIfElHasNoAriaLabel(this.inputEl, 'Input element of Combobox');

		// Keep copy of original options so they may be replaced when autocomplete filter removed
		if (this.listAutocompletes) {
			this.allOptionEls = [...this.list.optionEls].map(option => option.cloneNode(true));
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
		this.inputEl.removeEventListener('focus', this.focusHandler);
		this.inputEl.removeEventListener('blur', this.focusHandler);
		this.inputEl.removeEventListener('keydown', this.keydownHandler);
		this.inputEl.removeEventListener('input', this.inputHandler);
		this.listEl.removeEventListener('click', this.clickHandler);
		this.listEl.removeEventListener('mousedown', this.mousedownHandler);
	}


	/*
		Autocomplete the input value
	*/
	private autocompleteInput(): void {
		if (!this.list.optionElsCount) {
			return;
		}
		const selectedOptionText = this.list.optionEls[0].textContent.trim();
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

		// If input value empty append all option els to list, else only append option els whose text starts with input value
		this.allOptionEls.forEach((optionEl) => {
			const optionElTextStartsWithInputVal = optionEl.textContent.trim().toLowerCase().startsWith(inputVal);
			if (inputEmpty || optionElTextStartsWithInputVal) {
				this.listEl.appendChild(optionEl.cloneNode(true));
			}
		});
		this.list.initOptionEls();

		if (this.list.optionElsCount === 0) {
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
	private changeSelectedOption(optionToSelectIndex: number): void {
		if (optionToSelectIndex === this.selectedOptionIndex) {
			return;
		}

		if (this.selectedOptionIndex !== null) {
			this.deselectSelectedOption();
		}

		this.list.selectOption(optionToSelectIndex);
		this.selectedOptionIndex = optionToSelectIndex;

		const optionElToSelectId = this.list.optionEls[optionToSelectIndex].id;
		this.inputEl.setAttribute('aria-activedescendant', optionElToSelectId);

		window.dispatchEvent(new CustomEvent(EVENTS.OUT.OPTION_SELECTED, {
			'detail': {
				'id': this.id,
				'selectedOptionId': optionElToSelectId,
			}
		}));
	}


	/*
		Run when a user confirms an option and updates the input value to that of the chosen option
	*/
	private chooseOption(optionToChooseIndex: number): void {
		this.changeSelectedOption(optionToChooseIndex);
		const chosenOption = this.list.optionEls[optionToChooseIndex];
		window.dispatchEvent(new CustomEvent(EVENTS.OUT.OPTION_CHOSEN, {
			'detail': {
				'chosenOptionId': chosenOption.id,
				'id': this.id,
			}
		}));

		if (this.noInputUpdate) {
			return;
		}

		const optionText = chosenOption.textContent.trim();
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
		const optionElClicked = (e.target as HTMLElement).closest(`[${ATTRS.OPTION}]`) as HTMLLIElement;
		if (optionElClicked) {
			const optionElClickedIndex = [...this.list.optionEls].indexOf(optionElClicked);
			this.chooseOption(optionElClickedIndex);
		}
	}


	/*
		Prevent inputEl blur event from triggering when list or a descendant of it is clicked
	*/
	private customEventsHandler(e: CustomEvent): void {
		switch (e.type) {
			case EVENTS.IN.HIDE_LIST:
				this.hideList();
				break;
			case EVENTS.IN.SELECT_OPTION: {
				const detail = e['detail'];
				if (!detail || !detail['optionId']) {
					return;
				}
				const optionEl = this.listEl.querySelector(`#${detail['optionId']}`) as HTMLLIElement;
				if (!optionEl) {
					return;
				}
				const optionElIndex = [...this.list.optionEls].indexOf(optionEl);
				this.changeSelectedOption(optionElIndex);
				break;
			}
			case EVENTS.IN.SHOW_LIST:
				this.showList();
				break;
			case EVENTS.IN.UPDATE_OPTIONS:
				this.list.initOptionEls();
				if (this.listAutocompletes) {
					this.allOptionEls = [...this.list.optionEls].map(optionEl => optionEl.cloneNode(true));
				}
				window.dispatchEvent(new CustomEvent(EVENTS.OUT.OPTIONS_UPDATED, {
					'detail': {
						'id': this.id,
					}
				}));
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

		const selectedOption = this.list.optionEls[this.selectedOptionIndex];
		selectedOption.setAttribute('aria-selected', 'false');
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
			if (this.list.optionElsCount === 0) {
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
		this.listEl.removeAttribute(ATTRS.LIST_VISIBLE);
		this.listVisible = false;

		window.dispatchEvent(new CustomEvent(EVENTS.OUT.LIST_TOGGLED, {
			'detail': {
				'id': this.id,
				'listVisible': this.listVisible,
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

		if (this.list.optionElsCount > 0) {
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
		if (this.list.optionElsCount === 0) {
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
			let optionElToSelectIndex;
			if (this.selectedOptionIndex !== null) {
				optionElToSelectIndex = getIndexBasedOnDirection(this.selectedOptionIndex, direction, this.list.optionElsCount, true);
			} else if (this.lastChosenOptionIndex !== null) {
				optionElToSelectIndex = getIndexBasedOnDirection(this.lastChosenOptionIndex, direction, this.list.optionElsCount, true);
			} else {
				optionElToSelectIndex = direction === 1 ? 0 : this.list.optionElsCount - 1;
			}
			this.changeSelectedOption(optionElToSelectIndex);


			// If input autocompletes make input value match option text
			if (this.inputAutocompletes) {
				this.inputEl.value = this.list.optionEls[this.selectedOptionIndex].textContent.trim();
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
		this.listEl.setAttribute(ATTRS.LIST_VISIBLE, '');
		handleOverflow(this.listEl, true);
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
	autoID(COMBOBOX);
	customElements.define(COMBOBOX, Combobox);
});
