/* IMPORTS */
import {DISPLAY_NAME, NAME} from '../../common/constants.js';
import List from '../../common/list.js';
import {autoID} from '../../common/functions.js';


/* COMPONENT NAME */
export const LISTBOX = `${NAME}-listbox`;


/* CONSTANTS */
export const ATTRS = {
	ACTIVE_OPTION: `${LISTBOX}-option-active`,
	FOR_FORM: `${LISTBOX}-for-form`,
	INPUT: `${LISTBOX}-input`,
	LIST: `${LISTBOX}-list`,
	MULTISELECT: `${LISTBOX}-multiselect`,
	OPTION: `${LISTBOX}-option`,
	SELECTED_OPTION_IDS: `data-${LISTBOX}-selected-option-ids`,
};


export const EVENTS = {
	IN: {
		UPDATE_OPTIONS: `${LISTBOX}-update-options`,
	},
	OUT: {
		READY: `${LISTBOX}-ready`,
	}
};


// Time Listbox will wait before considering a character as start of new string when using type-ahead search
export const SEARCH_TIMEOUT = List.SEARCH_TIMEOUT;


/* CLASS */
export default class Listbox extends HTMLElement {
	private inputEl: HTMLInputElement;
	private list: List;
	private listEl: HTMLUListElement|HTMLOListElement;
	private mutationObserver: MutationObserver;


	constructor() {
		super();

		/* CLASS METHOD BINDINGS */
		this.addSelectedOptionMutationObserver = this.addSelectedOptionMutationObserver.bind(this);
		this.updateOptionsHandler = this.updateOptionsHandler.bind(this);
	}


	private connectedCallback(): void {
		/* GET DOM ELEMENTS */
		this.listEl = this.querySelector('ul') || this.querySelector('ol');
		// Error if no <ul> nor <ol> present because they can't be automatically generated because they require an 'aria-label' or an 'aria-labelledby' attribute from the user
		if (!this.listEl) {
			console.error(`${DISPLAY_NAME}: Listbox with ID ${this.id} requires a <ul> or <ol> ancestor.`);
			return;
		}

		// If Listbox has attribute ATTRS.FOR_FORM find or create hidden form input for submission
		const listboxForForm = this.hasAttribute(ATTRS.FOR_FORM);
		if (listboxForForm) {
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

			this.addSelectedOptionMutationObserver();
		}


		/* GET DOM DATA */


		/* SET DOM DATA */
		this.listEl.id = `${this.id}-list`;
		this.listEl.setAttribute(ATTRS.LIST, '');
		this.listEl.setAttribute('tabindex', '0');

		if (this.hasAttribute(ATTRS.MULTISELECT)) {
			this.listEl.setAttribute('aria-multiselectable', 'true');
		}


		// Instantiate a List on the listEl
		this.list = new List(this.listEl, ATTRS.OPTION);
		if (!this.list.multiselectable && this.list.optionElsCount > 0) {
			this.list.selectOption(0);
		}


		/* ADD EVENT LISTENERS */
		this.addEventListener(EVENTS.IN.UPDATE_OPTIONS, this.updateOptionsHandler);


		/* INITIALISATION */
		window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
			'detail': {
				'id': this.id,
			}
		}));
	}


	private disconnectedCallback(): void {
		this.mutationObserver.disconnect();
		this.list.destroy();

		/* REMOVE EVENT LISTENERS */
		this.removeEventListener(EVENTS.IN.UPDATE_OPTIONS, this.updateOptionsHandler);
	}


	/*
		Add mutation observer to detect changes to selected options
	*/
	private addSelectedOptionMutationObserver(): void {
		const mutationObserverOptions = {
			attributeFilter: ['aria-selected'],
			childList: true,
			subtree: true,
		};
		this.mutationObserver = new MutationObserver(() => {
			const selectedIds: Array<string> = [];
			const selectedValues: Array<string> = [];
			this.listEl.querySelectorAll(`[aria-selected="true"]`)
				.forEach((selectedOption: Element) => {
					selectedValues.push(selectedOption.textContent);
					selectedIds.push(selectedOption.id);
				});

			this.inputEl.value = encodeURIComponent(JSON.stringify(selectedValues));
			this.inputEl.setAttribute(ATTRS.SELECTED_OPTION_IDS, JSON.stringify(selectedIds));
		});
		this.mutationObserver.observe(this.listEl, mutationObserverOptions);
	}


	/*
		Custom event handler for updating options
	*/
	private updateOptionsHandler(): void {
		this.list.initOptionEls();

		window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
			'detail': {
				'id': this.id,
			}
		}));
	}
}


/* REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
	autoID(LISTBOX);
	customElements.define(LISTBOX, Listbox);
});
