/* Common functions that can be used by all components */
export const keyPressedMatches = (keyPressed, keysToMatch) => {
  const keys = Array.isArray(keysToMatch) ? keysToMatch : [keysToMatch];

  return keys.some((key) => key.CODE === keyPressed || key.KEY === keyPressed);
};
