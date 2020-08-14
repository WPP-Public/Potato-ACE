/* FUNCTIONS THAT CAN BE USED BY ANY COMPONENT */
import {Key, UTIL_ATTRS} from './constants.js';


/*
  Automatically assign IDs to components that do not have them
*/
export const autoID = (component: string): void => {
  let i = 0;
  document.querySelectorAll(component)
    .forEach((elem) => {
      if (elem.id) {
        return;
     }

      i++;
      elem.id = `${component}-${i}`;
   });
};


/*
  Search a given container for an element using a given attribute, if not found find element using given selector, set the given attribute on it, then return the element.
*/
export const getElByAttrOrSelector = (container: Element, attr: string, selector: string): HTMLElement =>  {
  let el = container.querySelector(`[${attr}]`);
  if (!el) {
    el = container.querySelector(selector);
    el.setAttribute(attr, '');
  }
  return el as  HTMLElement;
};


/*
  Search a given container for elements using a given attribute, if none found find elements using given selector, set the given attribute on them, then return the elements.
*/
export const getElsByAttrOrSelector = (container: Element, attr: string, selector: string): NodeListOf<HTMLElement> =>  {
  let el = container.querySelectorAll(`[${attr}]`);
  if (!el.length) {
    el = container.querySelectorAll(selector);
    el.forEach(el => el.setAttribute(attr, ''));
  }
  return el as NodeListOf<HTMLElement>;
};



/*
  Check if key pressed matches any key in the provided keysToMatch array
*/
export const keyPressedMatches = (keyPressed: string | number, keysToMatch: Array<Key> | Key): boolean => {
  const keys = Array.isArray(keysToMatch) ? keysToMatch : [keysToMatch];
  return keys.some((key) => key.CODE === keyPressed || key.KEY === keyPressed);
};


/*
  Checks if an element will overflow to the bottom or the right
  of the viewport and adds utility attibutes to prevent either or both.
  Util attributes are in `./_utils.scss`
*/
export const handleOverflow = (elem: HTMLElement): void => {
  elem.removeAttribute(UTIL_ATTRS.FLOAT_LEFT);
  elem.removeAttribute(UTIL_ATTRS.FLOAT_ABOVE);
  const bounding = elem.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  if (bounding.bottom > viewportHeight && bounding.height < viewportHeight) {
    elem.setAttribute(UTIL_ATTRS.FLOAT_ABOVE, '');
  }

  if (bounding.right >
    (window.innerWidth || document.documentElement.clientWidth)
  ) {
    elem.setAttribute(UTIL_ATTRS.FLOAT_LEFT, '');
  }
};


/*
  Increments or decrements a given index based on whether DOWN or UP arrow is pressed respectively, looping around if necessary.
*/
export const getIndexOfNextItem = (startIndex: number, direction: -1|1, itemsTotal: number, loopAround=false): number => {
  let newIndex = startIndex + direction;
  if (newIndex < 0) {
    newIndex = loopAround ? itemsTotal - 1 : 0;
  } else if (newIndex === itemsTotal) {
    newIndex = loopAround ? 0 : itemsTotal - 1;
  }
  return newIndex;
};
