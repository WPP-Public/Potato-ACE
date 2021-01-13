import {KEYS} from '../src/ace/common/constants';

/* Common functions that can be used by all tests */
export const getKeycodeAndWhich = (key) => {
  return {
    keycode: KEYS[key]['KEY'],
    which: KEYS[key]['CODE'],
  };
};


export const getOptionId = (id, index) => { return `${id}-list-option-${index + 1}`; };
