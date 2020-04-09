// Keep all block comments (/* */), but remove comments starting with '//'
// Use two blank lines between each section with block comment headings
/* IMPORTS */
import {NAME} from '../../common/constants.js';
import {autoID} from '../../common/functions.js';


/* COMPONENT NAME */
// Use kebab-case for the name as this will be the attribute used to attach the class
export const COMPONENT = `${NAME}-component`; // TODO: Replace 'COMPONENT' and 'component' with actual values


/* CONSTANTS */
// Add names of HTML attributes used, prefixed with COMPONENT
// export const ATTRS = {
//   ATTR_NAME: `${COMPONENT}-attr-name`,
// };


// Add names of custom events used, prefixed with COMPONENT
// export const EVENTS = {
//   EVENT_NAME: `${COMPONENT}-event-name`,
// };


// Add any other exported constants here, using all caps and underscores, e.g.
// export const CONSTANT_NAME = 'constantName';


// Add any other constants here, using all caps and underscores, e.g.
// const CONSTANT_NAME = 'constantName';


/* CLASS */
export class Component extends HTMLElement { // TODO: Change 'Component' to actual value
  constructor() {
    super();


    /* CLASS CONSTANTS */


    /* CLASS METHOD BINDINGS */
    // Bind 'this' to class methods using '.bind(this)', e.g.:
    // this.customEventListener = this.customEventListener.bind(this);
  }


  connectedCallback() {
    /* GET DOM ELEMENTS */
    // Add suffix `El` to the names of class constants containing elements, e.g.
    // this.someEl = this.querySelector(`[${ATTRS.ATTR_NAME}]`);



    /* GET DOM DATA */
    // this.someData = this.getAttribute(ATTRS.ATTR_NAME);



    /* SET DOM DATA */
    // this.setAttribute(ATTRS.ATTR_NAME, 'some-value');



    /* ATTACH EVENT LISTENERS */
    // Use passive event listeners when possible. Please don't use anonymous functions


    /* INITIALISATION */
    // Dispatch custom events on 'window' to make it easier for components to listen for them
    // When firing custom events include class instance ID in the 'detail' property
    // window.dispatchEvent(new CustomEvent(EVENTS.EVENT_NAME, {
    //   detail: {
    //     'id': this.id,
    // }}));
  }


  /* CLASS METHODS */
  // Sort class methods in alphabetical order with two blank lines in between each pair
  // customEventListener(e) {
  //   Check if event has a 'detail' property and the id doesn't match the class instance id
  //   if (!e.detail || (e.detail.id !== this.id)) {
  //     return;
  //   }
  // }


  disconnectedCallback() {
    // Remove event listeners
  }
}


/* DEFINE CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  // Use autoID to automatically increment the IDs of class instances
  autoID(COMPONENT); // TODO: Change COMPONENT to actual name
  customElements.define(COMPONENT, Component); // TODO: Change COMPONENT and 'Component' to actual names
});
