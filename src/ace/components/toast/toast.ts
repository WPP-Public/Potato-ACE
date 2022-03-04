/* IMPORTS */
import { NAME } from '../../common/constants.js';
import { autoID } from '../../common/functions.js';


/* COMPONENT NAME */
export const TOAST = `${NAME}-toast`;


/* CONSTANTS */
export const ATTRS = {
	INNER: `${TOAST}-inner`,
	SHOW_TIME: `${TOAST}-show-time`,
	VISIBLE: `${TOAST}-visible`,
};


export const EVENTS = {
	OUT: {
		READY: `${TOAST}-ready`,
		VISIBILITY_CHANGED: `${TOAST}-visibility-changed`,
	},
};


export const DEFAULT_SHOW_TIME = 4000;


/* CLASS */
export default class Toast extends HTMLElement {
	private initialised = false;
	private showTime = DEFAULT_SHOW_TIME;
	private showTimeout: number | undefined;
	private innerEl!: Element | null;


	constructor() {
		super();


		/* CLASS METHOD BINDINGS */
	}


	static get observedAttributes(): Array<string> {
		return [ATTRS.VISIBLE, ATTRS.SHOW_TIME];
	}


	private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		if (!this.initialised || oldValue === newValue) {
			return;
		}

		if (name === ATTRS.SHOW_TIME) {
			this.showTime = parseInt(newValue);
		}

		const visible = (newValue === '');
		window.dispatchEvent(new CustomEvent(EVENTS.OUT.VISIBILITY_CHANGED, {
			'detail': {
				'id': this.id,
				'visible': visible,
			}
		}));

		clearTimeout(this.showTimeout);
		if (visible) {
			this.showTimeout = window.setTimeout(() => this.removeAttribute(ATTRS.VISIBLE), this.showTime);
		}
	}


	public connectedCallback(): void {
		this.id = this.id || autoID(TOAST);


		/* GET DOM ELEMENTS */
		this.innerEl = this.querySelector(`[${ATTRS.INNER}]`);

		if (!this.innerEl) {
			this.innerEl = document.createElement('div');
			this.innerEl.setAttribute(ATTRS.INNER, '');
			this.innerEl.append(...this.childNodes);
			this.append(this.innerEl);
		}


		/* GET DOM DATA */
		const userDefinedShowTime = this.getAttribute(ATTRS.SHOW_TIME);
		if (userDefinedShowTime !== null) {
			this.showTime = parseInt(userDefinedShowTime);
		}


		/* SET DOM DATA */
		this.innerEl.setAttribute('aria-live', 'polite');
		this.innerEl.setAttribute('role', 'status');


		/* ADD EVENT LISTENERS */


		/* INITIALISATION */
		this.initialised = true;

		window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
			'detail': {
				'id': this.id,
			}
		}));
	}
}


/* REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
	customElements.define(TOAST, Toast);
});
