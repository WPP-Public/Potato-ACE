import {ASCE_CONSTANTS} from './constants.js';


/* Common functions that can be used by all components */
export const keyPressedMatches = (keyPressed, keysToMatch) => {
  const keys = Array.isArray(keysToMatch) ? keysToMatch : [keysToMatch];
  return keys.some((key) => key.CODE === keyPressed || key.KEY === keyPressed);
};


/*
  Checks if an element will overflow to the bottom or the right
  of the viewport and adds utility attibutes to prevent either or both.
  Util attributes are in `./_utils.scss`
*/
export const handleOverflow = (elem) => {
  elem.removeAttribute(ASCE_CONSTANTS.FLOAT_LEFT);
  elem.removeAttribute(ASCE_CONSTANTS.FLOAT_ABOVE);
  const bounding = elem.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  if (bounding.bottom > viewportHeight && bounding.height < viewportHeight) {
    elem.setAttribute(ASCE_CONSTANTS.FLOAT_ABOVE, '');
  }

  if (bounding.right >
    (window.innerWidth || document.documentElement.clientWidth)
  ) {
    elem.setAttribute(ASCE_CONSTANTS.FLOAT_LEFT, '');
  }
};
