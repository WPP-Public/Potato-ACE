/* IMPORTS */
import {NAME} from '../../common/constants.js';
import {autoID} from '../../common/functions.js';


export const TOOLTIP = `${NAME}-tooltip`;


/* CONSTANTS */
export const ATTRS = {
  TRIGGER: `ace-tooltip-trigger-for`,
  VISIBILITY: `${TOOLTIP}-visible`,
};


export const EVENTS = {
  CHANGED: `${TOOLTIP}-changed`,
  HIDE: `${TOOLTIP}-hide`,
  READY: `${TOOLTIP}-ready`,
  SHOW: `${TOOLTIP}-show`,
};


/* CLASS */
export default class Tooltip extends HTMLElement {
  private triggerElement: HTMLElement;

  /* CONSTRUCTOR */
  constructor() {
    super();

    this.triggerElement = document.querySelector(`[${ATTRS.TRIGGER}=${this.id}]`);

    /* CLASS METHOD BINDINGS */
    this.hoverHandler = this.hoverHandler.bind(this);
    this.focusHandler = this.focusHandler.bind(this);
    this.customEventsHandler = this.customEventsHandler.bind(this);

    /* INITIALISATION */
    window.dispatchEvent(new CustomEvent(
      EVENTS.READY,
      {
        'detail': {
          'id': this.id,
        }
      },
    ));
  }

  connectedCallback(): void  {
    this.triggerElement.addEventListener('mouseover', this.hoverHandler);
    this.triggerElement.addEventListener('mouseout', this.hoverHandler);
    this.triggerElement.addEventListener('focus', this.focusHandler);
    this.triggerElement.addEventListener('blur', this.focusHandler);
    window.addEventListener(EVENTS.HIDE, this.customEventsHandler);
    window.addEventListener(EVENTS.SHOW, this.customEventsHandler);
    window.addEventListener(EVENTS.TOGGLE, this.customEventsHandler);
  }


 /*
  Handles custom events.
 */
 private customEventsHandler(e: CustomEvent): void {
  const detail = e['detail'];

  if (!detail || (detail['id'] !== this.id) || !e.type) {
    return;
  }

  if (e.type === EVENTS.SHOW) {
    this.setAttribute(ATTRS.VISIBILITY, 'true');
  }
  if (e.type === EVENTS.HIDE) {
    this.setAttribute(ATTRS.VISIBILITY, 'false');
  }
 }

 /*
  Handles tooltip trigger mouseover and mouseout events.
 */
 hoverHandler(e: MouseEvent): void {
   const {type} = e;
   const isVisible = this.getAttribute(ATTRS.VISIBILITY) === 'true';

    if (type === 'mouseover') {
      this.setAttribute(ATTRS.VISIBILITY, 'true');
    } else if (type === 'mouseout') {
      this.setAttribute(ATTRS.VISIBILITY, 'false');
    }

    if (type === 'mouseover' || type === 'mouseout') {
      window.dispatchEvent(new CustomEvent(
        EVENTS.CHANGED,
        {
          'detail': {
            'id': this.id,
            'visible': isVisible,
          }
        }
      ));
    }
  }

 /*
  Handles focus events on the tooltip trigger.
 */
 focusHandler(e: KeyboardEvent): void {
    const {type} = e;
    const isVisible = this.getAttribute(ATTRS.VISIBILITY) === 'true';

    if (type === 'blur') {
      if (!isVisible) {
        return;
      } else {
        this.setAttribute(ATTRS.VISIBILITY, 'false');
      }
    } else {
      !isVisible ?
        this.setAttribute(ATTRS.VISIBILITY, 'true') :
        this.setAttribute(ATTRS.VISIBILITY, 'false');
    }
  }

  public disconnectedCallback(): void {
    /* REMOVE EVENT LISTENERS */
    this.triggerElement.removeEventListener('mouseover', this.hoverHandler);
    this.triggerElement.removeEventListener('mouseout', this.hoverHandler);
    this.triggerElement.removeEventListener('focus', this.focusHandler);
    this.triggerElement.removeEventListener('blur', this.focusHandler);
    window.removeEventListener(EVENTS.HIDE, this.customEventsHandler);
    window.removeEventListener(EVENTS.SHOW, this.customEventsHandler);
    window.removeEventListener(EVENTS.TOGGLE, this.customEventsHandler);
  }
}


/* INITIALISE AND REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  autoID(TOOLTIP);
  customElements.define(TOOLTIP, Tooltip);
});
