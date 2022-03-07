/* IMPORTS */
import { DISPLAY_NAME, FOCUSABLE_ELEMENTS_SELECTOR, KEYS, NAME } from '../../common/constants.js';
import { autoID, handleOverflow, keyPressedMatches } from '../../common/functions.js';


/* COMPONENT NAME */
export const TOOLTIP = `${NAME}-tooltip`;


/* CONSTANTS */
export const ATTRS = {
	DELAY: `${TOOLTIP}-delay`,
	TARGET: `${TOOLTIP}-target`,
	VISIBLE: `${TOOLTIP}-visible`,
};


export const EVENTS = {
	IN: {
		HIDE: `${TOOLTIP}-hide`,
		SHOW: `${TOOLTIP}-show`,
	},
	OUT: {
		READY: `${TOOLTIP}-ready`,
		VISIBILITY_CHANGED: `${TOOLTIP}-visibility-changed`,
	},
};

export const DEFAULT_DELAY = 750;


/* CLASS */
export default class Tooltip extends HTMLElement {
	private delay = DEFAULT_DELAY;
	private isDisabled = false;
	private showTimeout: number | undefined;
	private targetEl: Element | null = null;


	constructor() {
		super();


		/* CLASS METHOD BINDINGS */
		this.customEventsHander = this.customEventsHander.bind(this);
		this.hide = this.hide.bind(this);
		this.keydownHandler = this.keydownHandler.bind(this);
		this.show = this.show.bind(this);
		this.tooltipIsPrimaryLabel = this.tooltipIsPrimaryLabel.bind(this);
	}


	static get observedAttributes(): Array<string> {
		return ['disabled'];
	}


	private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		if (oldValue !== newValue) {
			this.isDisabled = !(newValue === null);
		}
	}


	public connectedCallback(): void {
		this.id = this.id || autoID(TOOLTIP);


		/* GET DOM ELEMENTS */
		this.targetEl = this.parentElement;
		if (!this.targetEl) {
			return;
		}

		// If target is not focusable then tooltip is not accessible to keyboard users
		if (
			!this.targetEl.closest(FOCUSABLE_ELEMENTS_SELECTOR) &&
			(this.targetEl.getAttribute('tabindex') && parseInt(this.targetEl.getAttribute('tabindex') as string) <= 0)
		) {
			console.error(`${DISPLAY_NAME}: The target of Tooltip with ID ${this.id} is not a focusable element which means the tooltip is inaccessible to keyboard users. Try adding a 'tabindex="0"'.`);
			return;
		}


		/* GET DOM DATA */
		const delay = parseInt(this.getAttribute(ATTRS.DELAY) as string);
		this.delay = (delay || delay === 0) ? delay : DEFAULT_DELAY;


		/* SET DOM DATA */
		this.setAttribute('role', 'tooltip');
		this.targetEl.setAttribute(ATTRS.TARGET, '');

		// If target has no text content nor aria-label, nor aria-labelledby then tooltip is set to it's aria-labelledby attribute, otherwise it's set to the target's aria-describedby attribute
		const isPrimaryLabel = this.tooltipIsPrimaryLabel();
		this.targetEl.setAttribute(isPrimaryLabel ? 'aria-labelledby' : 'aria-describedby', this.id);


		/* ADD EVENT LISTENERS */
		this.targetEl.addEventListener('blur', this.hide);
		this.targetEl.addEventListener('click', this.hide);
		this.targetEl.addEventListener('focus', this.show);
		this.targetEl.addEventListener('keydown', this.keydownHandler);
		this.targetEl.addEventListener('mouseenter', this.show);
		this.targetEl.addEventListener('mouseleave', this.hide);
		window.addEventListener(EVENTS.IN.HIDE, this.customEventsHander);
		window.addEventListener(EVENTS.IN.SHOW, this.customEventsHander);


		/* INITIALISATION */
		handleOverflow(this);
		window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
			'detail': {
				'id': this.id,
			}
		}));
	}


	public disconnectedCallback(): void {
		/* REMOVE EVENT LISTENERS */

		this.targetEl?.removeEventListener('blur', this.hide);
		this.targetEl?.removeEventListener('click', this.hide);
		this.targetEl?.removeEventListener('focus', this.show);
		this.targetEl?.removeEventListener('keydown', this.keydownHandler);
		this.targetEl?.removeEventListener('mouseenter', this.show);
		this.targetEl?.removeEventListener('mouseleave', this.hide);
		window.removeEventListener(EVENTS.IN.HIDE, this.customEventsHander);
		window.removeEventListener(EVENTS.IN.SHOW, this.customEventsHander);
	}


	/*
		Handler for incoming custom events
	*/
	private customEventsHander(e: Event): void {
		const detail = (e as CustomEvent)['detail'];
		if (!detail || detail['id'] !== this.id) {
			return;
		}

		switch (e.type) {
			case EVENTS.IN.HIDE: {
				this.hide();
				break;
			}
			case EVENTS.IN.SHOW:
				this.show();
				break;
		}
	}


	/*
		Hide tooltip
	*/
	private hide(): void {
		clearTimeout(this.showTimeout);
		this.removeAttribute(ATTRS.VISIBLE);

		window.dispatchEvent(new CustomEvent(EVENTS.OUT.VISIBILITY_CHANGED, {
			'detail': {
				'id': this.id,
				'visible': false,
			}
		}));
	}


	/*
		Handle keydown event
	*/
	private keydownHandler(e: Event): void {
		const keyPressed = (e as KeyboardEvent).key || (e as KeyboardEvent).which || (e as KeyboardEvent).keyCode;
		if (keyPressedMatches(keyPressed, KEYS.ESCAPE)) {
			if (!this.hasAttribute(ATTRS.VISIBLE)) {
				return;
			}

			// stop propagation to prevent Esc from affecting ancestors, e.g. closing a modal the tooltip target is in
			e.stopPropagation();
			this.hide();
		}
	}


	/*
		Show tooltip
	*/
	private show(): void {
		if (this.isDisabled) {
			return;
		}

		clearTimeout(this.showTimeout);
		handleOverflow(this);
		this.showTimeout = window.setTimeout(() => this.setAttribute(ATTRS.VISIBLE, ''), this.delay);

		window.dispatchEvent(new CustomEvent(EVENTS.OUT.VISIBILITY_CHANGED, {
			'detail': {
				'id': this.id,
				'visible': true,
			}
		}));
	}


	/*
		Determine if tooltip text is a primary or secondary label based on whether the tooltip target has text or is labelled
	*/
	private tooltipIsPrimaryLabel(): boolean {
		if (!this.targetEl) {
			return false;
		}

		if (this.targetEl.textContent && this.textContent) {
			if (this.targetEl.textContent.trim().length - this.textContent.trim().length) {
				return false;
			}
		}

		const targetAriaLabel = this.targetEl.getAttribute('aria-label');
		if (targetAriaLabel?.length) {
			return false;
		}

		const targetLabellingElId = this.targetEl.getAttribute('aria-labelledby');
		const targetLabellingEl = document.getElementById(targetLabellingElId as string);
		return !(targetLabellingEl && targetLabellingEl.textContent?.length);
	}
}


/* REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
	customElements.define(TOOLTIP, Tooltip);
});
