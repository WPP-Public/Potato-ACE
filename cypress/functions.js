import { KEYBOARD_KEYS } from '../src/asce/common/constants';

/* Common functions that can be used by all tests */
export const getKeycodeAndWhich = (key) => {
  return {
    keycode: KEYBOARD_KEYS[key]['KEY'],
    which: KEYBOARD_KEYS[key]['CODE'],
  };
};
