/* IMPORTS */
import { DISPLAY_NAME, KEYS, NAME } from '../../common/constants.js';
import { autoID, handleOverflow, keyPressedMatches } from '../../common/functions.js';
import List from '../../common/list.js';


/* COMPONENT NAME */
export const MENU = `${NAME}-menu`;


/* CONSTANTS */
export const ATTRS = {
	LIST: `${MENU}-list`,
	LIST_VISIBLE: `${MENU}-list-visible`,
	OPTION: `${MENU}-option`,
	TRIGGER: `${MENU}-trigger`,
};


export const EVENTS = {
	IN: {
		UPDATE_OPTIONS: `${MENU}-update-options`,
	},
	OUT: {
		OPTION_CHOSEN: `${MENU}-option-chosen`,
		READY: `${MENU}-ready`,
	},
};


// Time Menu will wait before considering a character as start of new string when using type-ahead search
export const SEARCH_TIMEOUT = List.SEARCH_TIMEOUT;


/* CLASS */
export default class Menu extends HTMLElement {
	private list: List | null = null;
	private listEl: HTMLUListElement | null = null;
	private listVisible = false;
	private triggerEl: HTMLButtonElement | null = null;


	constructor() {
		super();


		/* CLASS METHOD BINDINGS */
		this.chooseOption = this.chooseOption.bind(this);
		this.clickHandler = this.clickHandler.bind(this);
		this.focusOutHandler = this.focusOutHandler.bind(this);
		this.hideList = this.hideList.bind(this);
		this.keydownHandler = this.keydownHandler.bind(this);
		this.showList = this.showList.bind(this);
		this.updateOptionsHandler = this.updateOptionsHandler.bind(this);
	}


	public connectedCallback(): void {
		this.id = this.id || autoID(MENU);


		/* GET DOM ELEMENTS */
		this.triggerEl = this.querySelector('button');
		this.listEl = this.querySelector('ul');
		if (!this.triggerEl || !this.listEl) {
			return;
		}


		/* GET DOM DATA */


		/* SET DOM DATA */
		const triggerId = this.triggerEl.id || `${this.id}-trigger`;
		const listId = this.listEl.id || `${this.id}-list`;
		this.triggerEl.id = triggerId;
		this.triggerEl.setAttribute(ATTRS.TRIGGER, '');
		this.triggerEl.setAttribute('aria-controls', listId);
		this.triggerEl.setAttribute('aria-haspopup', 'true');

		this.listEl.id = listId;
		this.listEl.setAttribute(ATTRS.LIST, '');
		this.listEl.setAttribute('aria-labelledby', triggerId);
		this.listEl.setAttribute('role', 'menu');
		this.listEl.setAttribute('tabindex', '-1');

		this.list = new List(this.listEl, ATTRS.OPTION);


		/* ADD EVENT LISTENERS */
		this.addEventListener('click', this.clickHandler);
		this.addEventListener('focusout', this.focusOutHandler);
		this.addEventListener('keydown', this.keydownHandler);
		window.addEventListener(EVENTS.IN.UPDATE_OPTIONS, this.updateOptionsHandler);


		/* INITIALISATION */
		if (!this.triggerEl.textContent && !this.triggerEl.getAttribute('aria-label')) {
			console.warn(`${DISPLAY_NAME}: The action of Menu trigger with ID ${triggerId} must be labelled by text or using an aria-label attribute.`);
		}
		// Remove nested anchor tags from tab sequence
		this.listEl.querySelectorAll('a').forEach(link => link.setAttribute('tabindex', '-1'));

		window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
			'detail': {
				'id': this.id,
			}
		}));
	}


	public disconnectedCallback(): void {
		this.list?.destroy();

		/* REMOVE EVENT LISTENERS */
		this.removeEventListener('click', this.clickHandler);
		this.removeEventListener('focusout', this.focusOutHandler);
		this.removeEventListener('keydown', this.keydownHandler);
		window.removeEventListener(EVENTS.IN.UPDATE_OPTIONS, this.updateOptionsHandler);
	}


	/*
		Choose option and dispatch custom event
	*/
	private chooseOption(): void {
		if (!this.triggerEl || !this.list || !this.list.optionEls) {
			return;
		}
		this.hideList();
		this.triggerEl.focus();

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
		Handle click events
	*/
	private clickHandler(e: MouseEvent): void {
		const target = e.target as HTMLElement;
		const optionClicked = target.closest(`[${ATTRS.OPTION}]`);
		const triggerClicked = target.closest(`[${ATTRS.TRIGGER}]`);
		if (!triggerClicked && !optionClicked) {
			return;
		}

		if (optionClicked) {
			this.chooseOption();
			return;
		}

		// Trigger clicked
		this.listVisible ? this.hideList() : this.showList();
		// Firefox doesn't focus on clicked buttons automatically so we need to force focus after clicking
		this.triggerEl?.focus();
	}


	/*
		Handle focusout event
	*/
	private focusOutHandler(e: Event): void {
		const focusedEl = (e as MouseEvent).relatedTarget as HTMLElement;
		if (!focusedEl || !focusedEl.closest(MENU)) {
			this.hideList();
		}
	}


	/*
		Deselect option and hide list
	*/
	private hideList(): void {
		if (!this.list?.optionEls || !this.listVisible) {
			return;
		}

		this.listEl?.removeAttribute(ATTRS.LIST_VISIBLE);
		this.triggerEl?.removeAttribute('aria-expanded');
		this.listVisible = false;

		const selectedOption = this.list.optionEls[this.list.lastSelectedOptionIndex as number];
		if (selectedOption) {
			selectedOption.setAttribute('aria-selected', 'false');
		}
	}


	/*
		Handle keydown events
	*/
	private keydownHandler(e: KeyboardEvent): void {
		if (!this.listEl || !this.list) {
			return;
		}
		const target = e.target as HTMLElement;
		const keydownOnTrigger = target.closest(`[${ATTRS.TRIGGER}]`);
		const keydownOnList = target.closest(`[${ATTRS.LIST}]`);
		if (!keydownOnTrigger && !keydownOnList) {
			return;
		}

		const keyPressed = e.key || e.which || e.keyCode;
		// UP, DOWN, ENTER or SPACE pressed on trigger
		if (keydownOnTrigger && keyPressedMatches(keyPressed, [KEYS.UP, KEYS.DOWN, KEYS.ENTER, KEYS.SPACE])) {
			e.preventDefault();
			const optionToSelectIndex = keyPressedMatches(keyPressed, KEYS.UP) ? this.list.optionElsCount - 1 : 0;
			this.list.selectOption(optionToSelectIndex);
			this.showList();
			this.listEl.focus();
			return;
		}

		// Prevent page scroll when space pressed on list
		if (keydownOnList && keyPressedMatches(keyPressed, KEYS.SPACE)) {
			e.preventDefault();
		}

		// ENTER on list
		if (keydownOnList && keyPressedMatches(keyPressed, KEYS.ENTER)) {
			e.preventDefault();
			if (!this.list.optionEls) {
				return;
			}
			const selectedOptionEl = this.list.optionEls[this.list.lastSelectedOptionIndex as number];
			const selectedOptionLink = selectedOptionEl.querySelector('a');
			if (selectedOptionLink) {
				selectedOptionLink.click();
			} else {
				this.chooseOption();
			}
			return;
		}

		// ESC pressed on list or trigger
		if (this.listVisible && keyPressedMatches(keyPressed, KEYS.ESCAPE)) {
			this.hideList();
			this.triggerEl?.focus();
		}
	}


	/*
		Show list and handle it's overflow
	*/
	private showList(): void {
		if (!this.triggerEl || !this.listEl || this.listVisible) {
			return;
		}
		this.triggerEl.setAttribute('aria-expanded', 'true');
		this.listEl.setAttribute(ATTRS.LIST_VISIBLE, '');
		handleOverflow(this.listEl);
		this.listVisible = true;
	}


	/*
		Update options custom event handler
	*/
	private updateOptionsHandler(e: Event): void {
		const detail = (e as CustomEvent)['detail'];
		if (!detail || detail['id'] !== this.id || !this.list || !this.listEl) {
			return;
		}

		this.list.initOptionEls();
		this.listEl.querySelectorAll('a').forEach((link) => link.setAttribute('tabindex', '-1'));

		window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
			'detail': {
				'id': this.id,
			}
		}));
	}

}


/* REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
	customElements.define(MENU, Menu);
});
