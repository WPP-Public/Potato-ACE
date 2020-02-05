/* IMPORTS */
import { libraryName } from '../../common/constants.js';

/* CONSTANTS */
export const NAME = `${libraryName}-template`;  // TODO: Change 'template' to component name

export const ATTRS = {
  // Add in attributes for selecting element etc.
};

export const EVENTS = {
  // Add names of custom events for animations etc.
};

/* CLASS */
export class Template extends HTMLElement {  // TODO: Change 'Template' to component name
  constructor() {
    super();

    /* BIND 'THIS' TO CLASS METHODS */
  }

  /* CLASS METHODS */
  connectedCallback() {
    /* ATTACH EVENT LISTENERS */

    /* GET RELATED ELEMENTS */

    /* SET ATTRIBUTES */
  }

  /* EVENT HANDLERS */
}

/* DEFINE CUSTOM ELEMENT */
customElements.define(NAME, Template);  // TODO: Change 'Template' to component class
