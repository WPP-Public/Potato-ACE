/* FUNCTIONS THAT CAN BE USED BY ANY COMPONENT */
import { DISPLAY_NAME, UTIL_ATTRS } from './constants.js';


/*
	Automatically assign IDs to components that do not have them
*/
const autoIdCounts:{ [idPrefix: string]: number } = {};
export const autoID = (idPrefix: string): string => {
	if (autoIdCounts[idPrefix]) {
		++autoIdCounts[idPrefix];
	} else {
		autoIdCounts[idPrefix] = 1;
	}
	return `${idPrefix}-${autoIdCounts[idPrefix]}`;
};


/*
	Search a given container for an element using a given attribute, if not found find element using given selector, set the given attribute on it, then return the element.
*/
export const getElByAttrOrSelector = (container: Element, attr: string, selector: string): HTMLElement | null => {
	let el = container.querySelector(`[${attr}]`);
	if (!el) {
		el = container.querySelector(selector);
		if (el) {
			el.setAttribute(attr, '');
		}
	}
	return el as HTMLElement;
};


/*
	Search a given container for elements using a given attribute, if none found find elements using given selector, set the given attribute on them, then return the elements.
*/
export const getElsByAttrOrSelector = (container: Element, attr: string, selector: string): NodeListOf<HTMLElement> => {
	let el = container.querySelectorAll(`[${attr}]`);
	if (!el.length) {
		el = container.querySelectorAll(selector);
		el.forEach(el => el.setAttribute(attr, ''));
	}
	return el as NodeListOf<HTMLElement>;
};


/*
	Increments or decrements a given index based on direction and total number of items, looping around if necessary, and returns new index.
*/
export const getIndexBasedOnDirection = (startIndex: number, direction: -1 | 1, itemsTotal: number, loopAround = false): number => {
	let newIndex = startIndex + direction;
	if (newIndex < 0) {
		newIndex = loopAround ? itemsTotal - 1 : 0;
	} else if (newIndex === itemsTotal) {
		newIndex = loopAround ? 0 : itemsTotal - 1;
	}
	return newIndex;
};


/*
	Checks if an element will overflow to the bottom or the right
	of the viewport and adds utility attibutes to prevent either or both.
	Util attributes are in `./_utils.scss`
*/
export const handleOverflow = (elem: HTMLElement, verticalOnly = false): void => {
	if (!verticalOnly) {
		elem.removeAttribute(UTIL_ATTRS.FLOAT_RIGHT);
		elem.removeAttribute(UTIL_ATTRS.FLOAT_LEFT);
	}
	elem.removeAttribute(UTIL_ATTRS.FLOAT_ABOVE);
	const bounding = elem.getBoundingClientRect();
	const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

	if (bounding.bottom > viewportHeight && bounding.height < viewportHeight) {
		elem.setAttribute(UTIL_ATTRS.FLOAT_ABOVE, '');
	}

	if (verticalOnly) {
		return;
	}

	if (bounding.left < 0) {
		elem.setAttribute(UTIL_ATTRS.FLOAT_RIGHT, '');
		return;
	}

	if (bounding.right > (window.innerWidth || document.documentElement.clientWidth)) {
		elem.setAttribute(UTIL_ATTRS.FLOAT_LEFT, '');
	}
};


/*
	Checks if a given element is interactable, i.e. isn't disabled and doesn't have `display: none` nor `visibility: hidden`
*/
export const isInteractable = (element: HTMLElement): boolean => {
	const elComputedStyle = window.getComputedStyle(element);
	return (
		!(element as any).disabled &&
		elComputedStyle.getPropertyValue('display') !== 'none' &&
		elComputedStyle.getPropertyValue('visibility') !== 'hidden'
	);
};


/*
	Check if key pressed matches any key in the provided keysToMatch array
*/
export const keyPressedMatches = (keyPressed: string, keysToMatch: Array<string>): boolean => {
	return keysToMatch.some(keyToMatch => keyToMatch === keyPressed);
};


/*
	Warn user if element doesn't have aria-label nor aria-labelledby, or aria-labelledby is set to a non-existing element or an element with no text content
*/
export const warnIfElHasNoAriaLabel = (element: HTMLElement, elementName: string, ancestorElWithId?: HTMLElement): void => {
	const elementHasLabel = element.hasAttribute('aria-label');
	const elementLabelledById = element.getAttribute('aria-labelledby');
	const elementWithId = ancestorElWithId || element;
	if (elementLabelledById) {
		const labelEl = document.getElementById(elementLabelledById);
		if (!labelEl) {
			console.warn(`${DISPLAY_NAME}: ${elementName} with ID ${elementWithId.id} has aria-labelledby attribute set to an element that does not exist.`);
		} else if (!labelEl.textContent || !labelEl.textContent.length) {
			console.warn(`${DISPLAY_NAME}: ${elementName} with ID ${elementWithId.id} has aria-labelledby attribute set to an element with no text content.`);
		}
	} else if (!elementHasLabel) {
		console.warn(`${DISPLAY_NAME}: ${elementName} with ID ${elementWithId.id} requires an aria-label or aria-labelledby attribute.`);
	}
};
