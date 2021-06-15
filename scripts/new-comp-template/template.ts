// Keep block comments (/* */) even for unused sections
// Remove all comments starting with '//'
// Use two blank lines between each section with block comment headings
/* IMPORTS */
import { NAME } from '../../common/constants.js';
import { autoID } from '../../common/functions.js';


/* COMPONENT NAME */
export const TEMPLATE = `${NAME}-template`;


/* CONSTANTS */
// Add names of any HTML attributes used, prefixed with TEMPLATE
// export const ATTRS = {
//	 ATTR_NAME: `${TEMPLATE}-attr-name`,
// };


// Add names of any custom events used, prefixed with TEMPLATE
export const EVENTS = {
	IN: {
		INCOMING_EVENT: `${TEMPLATE}-incoming-event`,
	},
	OUT: {
		READY: `${TEMPLATE}-ready`,
	},
};

// Add any other exported constants here, using all caps and underscores:
// export const CONSTANT_NAME = 'constantName';


// Add any other constants here, using all caps and underscores:
// const CONSTANT_NAME = 'constantName';


/* CLASS */
export default class Template extends HTMLElement {
	// private classConst: <typescript-type>;
	// private classConstWithSetValue = 'value';


	constructor() {
		super();


		/* CLASS METHOD BINDINGS */
		// Bind 'this' to class methods using '.bind(this)':
		// this.customEventListener = this.customEventListener.bind(this);
	}


	public connectedCallback(): void {
		/* GET DOM ELEMENTS */
		// Add suffix `El` to the names of class constants containing elements:
		// this.someEl = this.querySelector(`[${ATTRS.ATTR_NAME}]`);


		/* GET DOM DATA */
		// this.someData = this.getAttribute(ATTRS.ATTR_NAME);


		/* SET DOM DATA */
		// this.setAttribute(ATTRS.ATTR_NAME, 'some-value');


		/* ADD EVENT LISTENERS */


		/* INITIALISATION */
		// Add any initialisation code here


		// Dispatch 'ready' event
		window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
			'detail': {
				'id': this.id,
			}
		}));
		// CUSTOM EVENT NOTES:
		// Dispatch custom events on 'window'
		// When dispatching custom events include class instance ID in the 'detail' property
	}


	public disconnectedCallback(): void {
		/* REMOVE EVENT LISTENERS */
	}


	// OTHER CLASS METHODS
	// Sort methods alphabetically, excluding constructor, connectedCallback & disconnectedCallback
	// For each method, first add a block comment that describes the method
	// Use two blank lines between methods
	// /*
	//	 Handler for incoming custom events
	// */
	// customEventsHandler(e: CustomEvent): void {
	//	 // Check if event has a 'detail' property and if detail has an id that matches this class instance id
	//	 const detail = e['detail'];
	//	 if (!detail || (detail['id'] !== this.id)) {
	//		 return;
	//	 }
	// }
}


/* REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
	autoID(TEMPLATE);
	customElements.define(TEMPLATE, Template);
});
