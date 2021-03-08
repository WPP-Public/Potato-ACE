import { KeysType } from './types.js';


/*
	Does browser support HTML attribute `inert`?
*/
const documentBody = (document.body as any);
export const BROWSER_SUPPORTS_INERT = (documentBody.inert === true || documentBody.inert === false);


export const DISPLAY_NAME = 'ACE';


/*
	Focusable element selectors
*/
const FOCUSABLE_ELEMENT_SELECTORS = [
	'a[href]',
	'area[href]',
	'audio controls',
	'button',
	'[contentEditable="true"]',
	'datalist',
	'details',
	'embed',
	'iframe',
	'input',
	'object',
	'progress',
	'select',
	'summary',
	'[tabindex]',
	'textarea',
	'video controls',
];
export const FOCUSABLE_ELEMENTS_SELECTOR = FOCUSABLE_ELEMENT_SELECTORS.join(':not([tabindex="-1"]),');


export const KEYS: KeysType = {
	A: {
		CODE: 65,
		KEY: 'a',
	},
	DOWN: {
		CODE: 40,
		KEY: 'ArrowDown',
	},
	END: {
		CODE: 35,
		KEY: 'End',
	},
	ENTER: {
		CODE: 13,
		KEY: 'Enter',
	},
	ESCAPE: {
		CODE: 72,
		KEY: 'Escape',
	},
	HOME: {
		CODE: 36,
		KEY: 'Home',
	},
	LEFT: {
		CODE: 37,
		KEY: 'ArrowLeft'
	},
	RIGHT: {
		CODE: 39,
		KEY: 'ArrowRight'
	},
	SPACE: {
		CODE: 32,
		KEY: ' ',
	},
	TAB: {
		CODE: 9,
		KEY: 'Tab',
	},
	UP: {
		CODE: 38,
		KEY: 'ArrowUp',
	},
};


export const NAME = 'ace';


/*
	Browser-specific, page visibility API strings
	From https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
*/
let HIDDEN, VISIBILITY_CHANGE;
if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
	HIDDEN = 'hidden';
	VISIBILITY_CHANGE = 'visibilitychange';
} else if (typeof (document as any).msHidden !== 'undefined') {
	HIDDEN = 'msHidden';
	VISIBILITY_CHANGE = 'msvisibilitychange';
} else if (typeof (document as any).webkitHidden !== 'undefined') {
	HIDDEN = 'webkitHidden';
	VISIBILITY_CHANGE = 'webkitvisibilitychange';
}
export const PAGE_VISIBILITY_API_STRINGS = { HIDDEN, VISIBILITY_CHANGE };


export const UTIL_ATTRS = {
	FLOAT_ABOVE: `${NAME}-u-float-above`,
	FLOAT_LEFT: `${NAME}-u-float-left`,
	FLOAT_RIGHT: `${NAME}-u-float-right`,
};
