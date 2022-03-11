// /* IMPORTS */
import {DISPLAY_NAME, KEYS, NAME} from '../../common/constants.js';
import {autoID, handleOverflow, keyPressedMatches} from '../../common/functions.js';
import List from '../../common/list.js';


/* COMPONENT NAME */
export const SELECT = `${NAME}-select`;


/* CONSTANTS */
export const ATTRS = {
	FOR_FORM: `${SELECT}-for-form`,
	INPUT: `${SELECT}-input`,
	LIST: `${SELECT}-list`,
	LIST_VISIBLE: `${SELECT}-list-visible`,
	OPTION: `${SELECT}-option`,
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


// Time Select will wait before considering a character as start of new string when using type-ahead search
export const SEARCH_TIMEOUT = List.SEARCH_TIMEOUT;


/* CLASS */
export default class Select extends HTMLElement {
	private chosenOptionIndex: number | undefined;
	private inputEl: HTMLInputElement | null = null;
	private list: List  | undefined;
	private listEl: HTMLUListElement | HTMLOListElement | null = null;
	private mutationObserver: MutationObserver | undefined;
	private selectForForm = false;
	private triggerEl: HTMLButtonElement | null = null;
	private triggerTextEl: HTMLSpanElement | null = null;


	constructor() {
		super();


		/* CLASS METHOD BINDINGS */
		this.cancelOptionChange = this.cancelOptionChange.bind(this);
		this.clickHandler = this.clickHandler.bind(this);
		this.confirmOptionChange = this.confirmOptionChange.bind(this);
		this.blurHandler = this.blurHandler.bind(this);
		this.hideList = this.hideList.bind(this);
		this.keydownHandler = this.keydownHandler.bind(this);
		this.showList = this.showList.bind(this);
		this.updateSelectForFormAttributes = this.updateSelectForFormAttributes.bind(this);
		this.updateOptionsHandler = this.updateOptionsHandler.bind(this);
		this.updateTriggerText = this.updateTriggerText.bind(this);
	}


	public connectedCallback(): void {
		this.id = this.id || autoID(SELECT);


		/* GET DOM ELEMENTS */
		// Get list element
		this.listEl = this.querySelector('ul') || this.querySelector('ol');
		if (!this.listEl) {
			// Error if no <ul> nor <ol> present because they can't be automatically generated because they require an 'aria-label' or an 'aria-labelledby' attribute from the user
			console.error(`${DISPLAY_NAME}: This Select requires a <ul> or <ol> descendant.`, this);
			return;
		}

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
		this.triggerEl.setAttribute('aria-expanded', 'false');
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
		this.listEl.addEventListener('blur', this.blurHandler);
		this.addEventListener('click', this.clickHandler);
		this.addEventListener('keydown', this.keydownHandler);
		window.addEventListener(EVENTS.IN.UPDATE_OPTIONS, this.updateOptionsHandler);


		/* INITIALISATION */
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
		this.list?.destroy();

		/* REMOVE EVENT LISTENERS */
		this.listEl?.removeEventListener('blur', this.blurHandler);
		this.removeEventListener('click', this.clickHandler);
		this.removeEventListener('keydown', this.keydownHandler);
		window.removeEventListener(EVENTS.IN.UPDATE_OPTIONS, this.updateOptionsHandler);
	}


	/*
		Add mutation observer to detect changes to selected options
	*/
	private updateSelectForFormAttributes(): void {
		if (!this.list?.optionEls) {
			return;
		}
		const selectedOptionEl = this.list.optionEls[this.list.lastSelectedOptionIndex as number];
		if (this.inputEl && selectedOptionEl) {
			const selectedOptionElText = selectedOptionEl.textContent;
			if (selectedOptionElText) {
				this.inputEl.value = encodeURIComponent(selectedOptionElText);
			}
			this.inputEl.setAttribute(ATTRS.SELECTED_OPTION_ID, selectedOptionEl.id);
		}
	}


	/*
		Show dropdown list
	*/
	private cancelOptionChange(): void {
		if (this.chosenOptionIndex || this.chosenOptionIndex == 0) {
			this.list?.selectOption(this.chosenOptionIndex);
		}
		this.hideList();
	}


	/*
		Handle click events
	*/
	private clickHandler(e: MouseEvent): void {
		const target = e.target as HTMLElement;
		const optionClicked = target.closest(`[${ATTRS.OPTION}]`);
		const triggerClicked = target.closest(`[${ATTRS.TRIGGER}]`);

		if (triggerClicked) {
			this.showList();
			return;
		}

		if (optionClicked) {
			this.confirmOptionChange();
		}
	}


	/*
		Confirm the change in selected option by updating the trigger text, hiding the
	*/
	private confirmOptionChange(): void {
		if (!this.list?.optionEls || !this.triggerEl) {
			return;
		}

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
					'id': this.list.optionEls[this.list.lastSelectedOptionIndex as number].id,
					'index': this.list.lastSelectedOptionIndex,
				},
				'id': this.id,
			}
		}));
	}


	/*
		Handle focus events on list
	*/
	private blurHandler(e: Event): void {
		const relatedTarget = (e as MouseEvent).relatedTarget as HTMLElement;
		if (!relatedTarget || !relatedTarget.closest(SELECT)) {
			this.cancelOptionChange();
		}
	}


	/*
		Hide dropdown list
	*/
	private hideList(): void {
		if (!this.listEl || !this.triggerEl) {
			return;
		}
		this.listEl.removeAttribute(ATTRS.LIST_VISIBLE);
		this.triggerEl.setAttribute('aria-expanded', 'false');
	}


	/*
		Handle keydown events
	*/
	private keydownHandler(e: KeyboardEvent): void {
		const target = e.target as HTMLElement;
		const keydownOnTrigger = target.closest(`[${ATTRS.TRIGGER}]`);
		const keydownOnList = target.closest(`[${ATTRS.LIST}]`);
		if (!keydownOnTrigger && !keydownOnList) {
			return;
		}

		const keyPressed = e.key;
		// Prevent TAB from changing focus when pressed on list
		if (keydownOnList && keyPressed == KEYS.TAB) {
			e.preventDefault();
			return;
		}

		// ESC pressed on list
		if (keydownOnList && keyPressed == KEYS.ESCAPE) {
			this.cancelOptionChange();
			this.triggerEl?.focus();
			return;
		}

		// ENTER or SPACE pressed on list
		if (keydownOnList && keyPressedMatches(keyPressed, [KEYS.ENTER, KEYS.SPACE])) {
			e.preventDefault();
			this.confirmOptionChange();
			return;
		}

		// UP or DOWN pressed on trigger
		if (keydownOnTrigger && keyPressedMatches(keyPressed, [KEYS.UP, KEYS.DOWN])) {
			e.preventDefault();
			this.showList();
			return;
		}

		// Letter pressed on trigger
		if (keydownOnTrigger) {
			this.list?.keydownHandler(e);
			this.confirmOptionChange();
		}
	}


	/*
		Show dropdown list
	*/
	private showList(): void {
		if (!this.listEl || !this.triggerEl) {
			return;
		}

		this.triggerEl.setAttribute('aria-expanded', 'true');
		this.listEl.setAttribute(ATTRS.LIST_VISIBLE, '');
		handleOverflow(this.listEl);
		this.listEl.focus();
	}


	/*
		Update options custom event handler
	*/
	private updateOptionsHandler(e: Event): void {
		const detail = (e as CustomEvent)['detail'];
		if (!detail || detail['id'] !== this.id || !this.list) {
			return;
		}

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
		if (!this.list?.optionEls) {
			return;
		}
		const chosenOptionEl = this.list.optionEls[this.list.lastSelectedOptionIndex as number];
		const chosenOptionElText = chosenOptionEl?.textContent?.trim();

		if (this.triggerTextEl && chosenOptionElText) {
			this.triggerTextEl.textContent = chosenOptionElText;
		}
	}
}


/* INITIALISE AND REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
	customElements.define(SELECT, Select);
});
