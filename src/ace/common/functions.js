/* FUNCTIONS THAT CAN BE USED BY ANY COMPONENT */
import {UTIL_ATTRS} from './constants.js';


/*
  Automatically assign IDs to components that do not have them
*/
export const autoID = (component) => {
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
  Check if key pressed matches any key in the provided keysToMatch array
*/
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
