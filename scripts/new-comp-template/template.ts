// Keep block comments (/* */) even for unused sections
// Remove all comments starting with '//'
// Use two blank lines between each section with block comment headings
/* IMPORTS */
import {NAME} from '../../common/constants.js';
import {autoID} from '../../common/functions.js';


/* COMPONENT NAME */
export const TEMPLATE = `${NAME}-template`;


/* CONSTANTS */
// Add names of any HTML attributes used, prefixed with TEMPLATE
// export const ATTRS = {
//   ATTR_NAME: `${TEMPLATE}-attr-name`,
// };


// Add names of any custom events used, prefixed with TEMPLATE
// export const EVENTS = {
//   EVENT_NAME: `${TEMPLATE}-event-name`,
// };


// Add any other exported constants here, using all caps and underscores:
// export const CONSTANT_NAME = 'constantName';


// Add any other constants here, using all caps and underscores:
// const CONSTANT_NAME = 'constantName';


/* CLASS */
export default class Template extends HTMLElement {
  constructor() {
    super();


    /* CLASS CONSTANTS */


    /* CLASS METHOD BINDINGS */
    // Bind 'this' to class methods using '.bind(this)':
    // this.customEventListener = this.customEventListener.bind(this);
  }


  public connectedCallback(): void {
    /* GET DOM ELEMENTS */
    // Add suffix `El` to the names of class constants containing elements:
    // this.someEl = this.querySelector(`[${ATTRS.ATTR_NAME}]`);


    /* GET DOM DATA */
    // this.someData = this.getAttribute(ATTRS.ATTR_NAME);


    /* SET DOM DATA */
    // this.setAttribute(ATTRS.ATTR_NAME, 'some-value');


    /* ADD EVENT LISTENERS */


    /* INITIALISATION */
    // Add any initialisation code here

    // NOTE:
    // Dispatch custom events on 'window' to make it easier for templates to listen for them
    // When firing custom events include class instance ID in the 'detail' property
    // window.dispatchEvent(new CustomEvent(
    //   EVENTS.EVENT_NAME,
    //   {
    //     'detail': {
    //       'id': this.id,
    //     }
    //   },
    // ));
  }


  public disconnectedCallback(): void {
    /* REMOVE EVENT LISTENERS */
  }


  // OTHER CLASS METHODS
  // Sort methods alphabetically, excluding constructor, connectedCallback & disconnectedCallback
  // For each method, first add a block comment that describes the method
  // Use two blank lines between methods
  // /*
  //   Custom event handler
  // */
  // customEventHandler(e) {
  //   // Check if event has a 'detail' property and if detail has an id that matches this class instance id
  //   const detail = e['detail'];
  //   if (!detail || (detail['id'] !== this.id)) {
  //     return;
  //   }
  // }
}


/* REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  // Use autoID to automatically increment the IDs of class instances
  autoID(TEMPLATE);
  customElements.define(TEMPLATE, Template);
});
