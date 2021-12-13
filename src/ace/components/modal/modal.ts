/* IMPORTS */
import {BROWSER_SUPPORTS_INERT, FOCUSABLE_ELEMENTS_SELECTOR, KEYS, NAME} from '../../common/constants.js';
import {autoID, isInteractable, keyPressedMatches, warnIfElHasNoAriaLabel} from '../../common/functions.js';
import FocusTrap from '../../common/focus-trap.js';


/* COMPONENT NAME */
export const MODAL = `${NAME}-modal`;


/* CONSTANTS */
export const ATTRS = {
	BACKDROP: `${MODAL}-backdrop`,
	HIDE_BTN: `${MODAL}-hide-modal-btn`,
	IS_VISIBLE: `${MODAL}-is-visible`,
	TRIGGER: `${MODAL}-trigger-for`,
	VISIBLE: `${MODAL}-visible`,
};


export const EVENTS = {
	IN: {
		UPDATE_FOCUS_TRAP: `${MODAL}-update-focus-trap`,
	},
	OUT: {
		CHANGED: `${MODAL}-changed`,
		READY: `${MODAL}-ready`,
	},
};


/* CLASS */
export default class Modal extends HTMLElement {
	private backdropEl: HTMLElement | null = null;
	private canUseInert = false;
	private firstInteractableDescendant: HTMLElement | undefined;
	private focusTrap: FocusTrap | undefined;
	private inertedEls: Array<Element> = [];
	private initialised = false;
	private lastActiveElement: HTMLElement | null = null;


	constructor() {
		super();


		/* CLASS METHOD BINDINGS */
		this.clickHandler = this.clickHandler.bind(this);
		this.customEventsHandler = this.customEventsHandler.bind(this);
		this.hide = this.hide.bind(this);
		this.keydownHandler = this.keydownHandler.bind(this);
		this.show = this.show.bind(this);
	}


	static get observedAttributes(): Array<string> {
		return [ATTRS.VISIBLE];
	}


	private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
		if (!this.initialised || oldValue === newValue) {
			return;
		}

		const show = newValue === '';
		if (show) {
			this.show();
		} else {
			this.hide();
		}

		window.dispatchEvent(new CustomEvent(EVENTS.OUT.CHANGED, {
			'detail': {
				'id': this.id,
				'visible': show,
			}
		}));
	}


	public connectedCallback(): void {
		this.id = this.id || autoID(MODAL);


		// Determine if Modal instance can use HTML inert attribute (browser supports it and Modal is a child of body)
		this.canUseInert = BROWSER_SUPPORTS_INERT && this.parentElement === document.body;


		/* GET DOM ELEMENTS */
		// Get backdrop element or create it if not present and add as last child of bodys
		this.backdropEl = document.querySelector(`[${ATTRS.BACKDROP}]`);
		if (!this.backdropEl) {
			this.backdropEl = document.createElement('div');
			this.backdropEl.setAttribute(ATTRS.BACKDROP, '');
			document.body.append(this.backdropEl);
		}

		// Create a hide Modal button if none are present and add as first child of Modal
		let hideModalBtn = this.querySelector(`button[${ATTRS.HIDE_BTN}]`);
		if (!hideModalBtn) {
			hideModalBtn = document.createElement('button');
			hideModalBtn.setAttribute(ATTRS.HIDE_BTN, '');
			hideModalBtn.setAttribute('aria-label', 'Exit modal');
			hideModalBtn.innerHTML = '&#x2715;';
			this.prepend(hideModalBtn);
		}


		/* GET DOM DATA */


		/* SET DOM DATA */
		if (this.getAttribute('role') !== 'alertdialog') {
			this.setAttribute('role', 'dialog');
		}
		this.setAttribute('aria-modal', 'true');


		/* ADD EVENT LISTENERS */
		this.addEventListener('click', this.clickHandler);
		this.addEventListener('keydown', this.keydownHandler);
		if (!this.canUseInert) {
			this.addEventListener(EVENTS.IN.UPDATE_FOCUS_TRAP, this.customEventsHandler);
		}


		/* INITIALISATION */
		warnIfElHasNoAriaLabel(this, 'Modal');


		// If HTML attribute inert can be used (supported by browser and Modal is child of body) use it to trap focus, else use FocusTrap
		if (this.canUseInert) {
			this.firstInteractableDescendant = ([...this.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR)] as Array<HTMLElement>)
				.find(isInteractable);
		} else {
			this.focusTrap = new FocusTrap(this);
			this.firstInteractableDescendant = this.focusTrap.interactableDescendants[0];
		}

		if (this.hasAttribute(ATTRS.VISIBLE)) {
			this.show();
		}

		this.initialised = true;
		window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
			'detail': {
				'id': this.id,
			}
		}));
	}


	public disconnectedCallback(): void {
		this.focusTrap?.destroy();

		/* REMOVE EVENT LISTENERS */
		this.removeEventListener('click', this.clickHandler);
		if (!this.canUseInert) {
			this.removeEventListener(EVENTS.IN.UPDATE_FOCUS_TRAP, this.customEventsHandler);
		}
	}


	/*
		Handle click events
	*/
	private clickHandler(e: MouseEvent): void {
		// Hide Modal if a hide Modal button or a trigger button for another Modal is clicked
		const hideModalBtnClicked = (e.target as HTMLElement).closest(`button[${ATTRS.HIDE_BTN}]`);
		const otherModalTriggerClicked = (e.target as HTMLElement).closest(`button[${ATTRS.TRIGGER}]`);
		if (hideModalBtnClicked || otherModalTriggerClicked) {
			this.removeAttribute(ATTRS.VISIBLE);
		}
	}


	/*
		Handle custom events
	*/
	private customEventsHandler(): void {
		if (!this.focusTrap) {
			return;
		}
		this.focusTrap.getInteractableDescendants();
		this.firstInteractableDescendant = this.focusTrap.interactableDescendants[0];
	}


	/*
		Hide the Modal
	*/
	private hide(): void {
		document.body.removeAttribute(ATTRS.IS_VISIBLE);
		this.backdropEl?.removeAttribute(ATTRS.IS_VISIBLE);

		// Remove inert HTML attribute from all body children to which it was added when Modal was shown
		if (this.canUseInert) {
			this.inertedEls.forEach((el) => (el as any).inert = false);
			this.inertedEls = [];
		}

		this.lastActiveElement?.focus();
	}


	/*
		Handle keystrokes on Modal
	*/
	private keydownHandler(e: KeyboardEvent): void {
		// Hide Modal if Esc pressed
		const keyPressed = e.key || e.which || e.keyCode;
		if (keyPressedMatches(keyPressed, KEYS.ESCAPE)) {
			this.removeAttribute(ATTRS.VISIBLE);
			return;
		}
	}


	/*
		Show the Modal
	*/
	private show(): void {
		document.body.setAttribute(ATTRS.IS_VISIBLE, '');
		this.backdropEl?.setAttribute(ATTRS.IS_VISIBLE, '');

		// Store element that was active before Modal was shown, to return focus to it when Modal is hidden
		this.lastActiveElement = document.activeElement as HTMLElement;

		// Add inert HTML attribute to all body children except backdrop and this Modal
		if (this.canUseInert) {
			[...document.body.children].forEach((child) => {
				if (child == this || child.hasAttribute(ATTRS.BACKDROP) || child.tagName === 'SCRIPT') {
					return;
				}
				(child as any).inert = true;
				this.inertedEls.push(child);
			});
		}

		this.firstInteractableDescendant?.focus();
	}
}


/* INITIALISE AND REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
	window.addEventListener('click', (e) => {
		// Show Modal if any of its triggers are clicked
		const triggerClicked = (e.target as HTMLElement).closest(`[${ATTRS.TRIGGER}]`);
		if (triggerClicked) {
			const modalId = triggerClicked.getAttribute(ATTRS.TRIGGER);
			if (!modalId) {
				return;
			}
			const modalEl = document.getElementById(modalId);
			if (modalEl) {
				modalEl.setAttribute(ATTRS.VISIBLE, '');
			}
			return;
		}

		// Hide visible Modal if backdrop clicked
		const backdropClicked = (e.target as HTMLElement).closest(`[${ATTRS.BACKDROP}]`);
		if (backdropClicked) {
			const visibleModalEl = document.querySelector(`[${ATTRS.VISIBLE}`);
			visibleModalEl?.removeAttribute(ATTRS.VISIBLE);
		}
	});

	customElements.define(MODAL, Modal);
});
