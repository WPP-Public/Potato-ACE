/* CONSTANTS AVAILABLE TO ALL COMPONENTS */

export const NAME = 'ace';

export const UTIL_ATTRS = {
  FLOAT_ABOVE: `${NAME}-u-float-above`,
  FLOAT_LEFT: `${NAME}-u-float-left`,
};

export type Key = {
  CODE: number;
  KEY: string;
}

export type Keys = {
  [name: string]: Key;
}

export const KEYS: Keys = {
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
