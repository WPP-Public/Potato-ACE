/* IMPORTS */
import { NAME } from '../../common/constants.js';
import { autoID } from '../../common/functions.js';


/* COMPONENT NAME */
export const DISCLOSURE = `${NAME}-disclosure`;


/* CONSTANTS */
export const ATTRS = {
	TRIGGER: `${DISCLOSURE}-trigger-for`,
	TRIGGER_HIDE: `${DISCLOSURE}-trigger-hide`,
	TRIGGER_SHOW: `${DISCLOSURE}-trigger-show`,
	VISIBLE: `${DISCLOSURE}-visible`,
};


export const EVENTS = {
	IN: {
		TOGGLE: `${DISCLOSURE}-toggle`,
	},
	OUT: {
		CHANGED: `${DISCLOSURE}-changed`,
		READY: `${DISCLOSURE}-ready`,
	},
};


/* CLASS */
export default class Disclosure extends HTMLElement {
	private initialised = false;
	private triggerEls: NodeListOf<Element>;


	constructor() {
		super();


		/* CLASS METHOD BINDINGS */
		this.toggleCustomEventHandler = this.toggleCustomEventHandler.bind(this);
	}


	static get observedAttributes(): Array<string> {
		return [ATTRS.VISIBLE];
	}


	private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		if (!this.initialised || oldValue === newValue) {
			return;
		}

		const disclosureVisible = newValue === '';
		this.triggerEls.forEach(triggerEl => triggerEl.setAttribute('aria-expanded', disclosureVisible.toString()));

		window.dispatchEvent(new CustomEvent(EVENTS.OUT.CHANGED, {
			'detail': {
				'id': this.id,
				'visible': disclosureVisible,
			}
		}));
	}


	public connectedCallback(): void {
		this.id = this.id || autoID(DISCLOSURE);


		/* GET DOM ELEMENTS */
		this.triggerEls = document.querySelectorAll(`[${ATTRS.TRIGGER}=${this.id}]`);


		/* GET DOM DATA */


		/* SET DOM DATA */
		this.triggerEls.forEach((triggerEl) => {
			triggerEl.setAttribute('aria-controls', this.id);
			triggerEl.setAttribute('aria-expanded', this.hasAttribute(ATTRS.VISIBLE).toString());
		});


		/* ADD EVENT LISTENERS */
		this.addEventListener(EVENTS.IN.TOGGLE, this.toggleCustomEventHandler);


		/* INITIALISATION */
		this.initialised = true;

		window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
			'detail': {
				'id': this.id,
			}
		}));
	}


	public disconnectedCallback(): void {
		/* REMOVE EVENT LISTENERS */
		this.removeEventListener(EVENTS.IN.TOGGLE, this.toggleCustomEventHandler);
	}


	/*
		Handle custom events
	*/
	private toggleCustomEventHandler(): void {
		if (this.hasAttribute(ATTRS.VISIBLE)) {
			this.removeAttribute(ATTRS.VISIBLE);
		} else {
			this.setAttribute(ATTRS.VISIBLE, '');
		}
	}
}


/* INITIALISE AND REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
	// Add window click handler for Disclosure triggers
	window.addEventListener('click', (e) => {
		const triggerClicked = (e.target as HTMLElement).closest(`[${ATTRS.TRIGGER}]`);
		if (!triggerClicked) {
			return;
		}

		const disclosureId = triggerClicked.getAttribute(ATTRS.TRIGGER);
		const disclosureEl = document.getElementById(disclosureId);

		let showDisclosure: boolean = null;
		if (triggerClicked.hasAttribute(ATTRS.TRIGGER_SHOW)) {
			showDisclosure = true;
		}
		else if (triggerClicked.hasAttribute(ATTRS.TRIGGER_HIDE)) {
			showDisclosure = false;
		}
		else {
			// Trigger is toggle
			showDisclosure = !disclosureEl.hasAttribute(ATTRS.VISIBLE);
		}

		if (showDisclosure) {
			disclosureEl.setAttribute(ATTRS.VISIBLE, '');
		} else {
			disclosureEl.removeAttribute(ATTRS.VISIBLE);
		}
	});

	customElements.define(DISCLOSURE, Disclosure);
});
