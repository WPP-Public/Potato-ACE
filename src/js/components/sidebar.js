/* IMPORTS */
import FocusTrap from '../../ace/common/focus-trap.js';
import {KEYS} from '../../ace/common/constants.js';
import {keyPressedMatches} from '../../ace/common/functions.js';


const SIDEBAR = 'sidebar';


const ATTRS = {
  SIDEBAR_BTN: `${SIDEBAR}-btn`,
  SIDEBAR_VISIBLE: `${SIDEBAR}-visible`,
};


export default class Sidebar extends HTMLElement {
  constructor() {
    super();

    this.animEndHandler = this.animEndHandler.bind(this);
    this.animStartHandler = this.animStartHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
  }


  connectedCallback() {
    this.focusTrap = new FocusTrap(this);
    this.sidebarBtn = document.querySelector(`[${ATTRS.SIDEBAR_BTN}]`);

    this.addEventListener('animationend', this.animEndHandler);
    this.addEventListener('animationstart', this.animStartHandler);
    this.addEventListener('keydown', this.keydownHandler);
    this.sidebarBtn.addEventListener('click', this.clickHandler);
  }


  disconnectedCallback() {
    this.focusTrap.destroy();

    this.removeEventListener('animationend', this.animEndHandler);
    this.removeEventListener('animationstart', this.animStartHandler);
    this.removeEventListener('keydown', this.keydownHandler);
    this.sidebarBtn.removeEventListener('click', this.clickHandler);
  }


  animEndHandler() {
    if (this.hasAttribute(ATTRS.SIDEBAR_VISIBLE)) {
      this.focusTrap.getInteractableDescendants();
      this.focusTrap.interactableDescendants[0].focus();
    } else {
      this.style.visibility = '';
      this.sidebarBtn.focus();
    }

    this.sidebarBtn.blur();
  }


  animStartHandler() {
    if (this.hasAttribute(ATTRS.SIDEBAR_VISIBLE)) {
      this.style.visibility = 'visible';
    }
  }


  clickHandler() {
    this.sidebarBtn.toggleAttribute(ATTRS.SIDEBAR_VISIBLE);
    this.toggleAttribute(ATTRS.SIDEBAR_VISIBLE);
  }


  keydownHandler(e) {
    const keyPressed = e.key || e.which || e.keyCode;

    // If ESC pressed when sidebar is open
    const sidebarVisible = this.hasAttribute(ATTRS.SIDEBAR_VISIBLE);
    if (sidebarVisible && keyPressedMatches(keyPressed, KEYS.ESCAPE)) {
      this.sidebarBtn.removeAttribute(ATTRS.SIDEBAR_VISIBLE);
      this.removeAttribute(ATTRS.SIDEBAR_VISIBLE);
    }
  }
}


document.addEventListener('DOMContentLoaded', () => {
  customElements.define(`${SIDEBAR}-comp`, Sidebar);
});
