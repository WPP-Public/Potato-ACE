/* Common functions that can be used by all components */

/*
  Automatically assign IDs to components that do not have them
*/
export const autoID = (component) => {
  document.querySelectorAll(component)
    .forEach((elem, i) => {
      elem.id = elem.id || `${component}-${i+1}`;
    });
};


/*
  Check if key pressed matches any key in the provided keysToMatch array
*/
export const keyPressedMatches = (keyPressed, keysToMatch) => {
  const keys = Array.isArray(keysToMatch) ? keysToMatch : [keysToMatch];

  return keys.some((key) => key.CODE === keyPressed || key.KEY === keyPressed);
};
