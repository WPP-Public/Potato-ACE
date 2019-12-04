/* Common functions that can be used by all components */
export const keyPressedMatches = (keyPressed, keysToMatch) => {
  const keys = Array.isArray(keysToMatch) ? keysToMatch : [keysToMatch];

  return keys.some((key) => key.CODE === keyPressed || key.KEY === keyPressed);
};

/*
  Checks if an element will overflow to the bottom or the right
  of the viewport and adds utility attibutes to prevent either or both.
  Util attributes are in `asce/common/_common.scss`
*/
export const handleOverflow = (elem) => {
  elem.removeAttribute('asce-u-float-left');
  elem.removeAttribute('asce-u-float-above');
  const bounding = elem.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  if (bounding.bottom > viewportHeight && bounding.height < viewportHeight) {
    elem.setAttribute('asce-u-float-above', '');
  }

  if (bounding.right >
    (window.innerWidth || document.documentElement.clientWidth)
  ) {
    elem.setAttribute('asce-u-float-left', '');
  }
};
