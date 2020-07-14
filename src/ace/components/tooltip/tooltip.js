/* IMPORTS */
import { NAME } from '../../common/constants.js';
import { autoID } from '../../common/functions.js';
export const TOOLTIP = `${NAME}-tooltip`;
/* CONSTANTS */
export const ATTRS = {
    TRIGGER: `aria-describedby`,
    VISIBILITY: `${TOOLTIP}-visible`,
};
// export const EVENTS = {
//   CHANGED: `${DISCLOSURE}-changed`,
//   HIDE: `${DISCLOSURE}-hide`,
//   SHOW: `${DISCLOSURE}-show`,
//   TOGGLE: `${DISCLOSURE}-toggle`,
// };
/* CLASS */
export default class Tooltip extends HTMLElement {
    /* CONSTRUCTOR */
    constructor() {
        super();
        this.triggerElement = document.querySelector(`[${ATTRS.TRIGGER}=${this.id}]`);
        /* CLASS METHOD BINDINGS */
        this.hoverHandler = this.hoverHandler.bind(this);
        this.focusHandler = this.focusHandler.bind(this);
    }
    connectedCallback() {
        this.triggerElement.addEventListener('mouseover', this.hoverHandler);
        this.triggerElement.addEventListener('mouseout', this.hoverHandler);
        this.triggerElement.addEventListener('focus', this.focusHandler);
        this.triggerElement.addEventListener('blur', this.focusHandler);
    }
    /*
      Handles clicks on the window and if a trigger for this instance clicked run setDisclosure
    */
    hoverHandler(e) {
        if (e.type === 'mouseover') {
            this.setAttribute(ATTRS.VISIBILITY, 'true');
        }
        else if (e.type === 'mouseout') {
            this.setAttribute(ATTRS.VISIBILITY, 'false');
        }
    }
    /*
      Handles clicks on the window and if a trigger for this instance clicked run setDisclosure
    */
    focusHandler(e) {
        const { type } = e;
        const isHidden = this.getAttribute(ATTRS.VISIBILITY) === 'false';
        if (type === 'blur') {
            if (isHidden) {
                return;
            }
            else {
                this.setAttribute(ATTRS.VISIBILITY, 'false');
            }
        }
        else {
            isHidden ?
                this.setAttribute(ATTRS.VISIBILITY, 'true') :
                this.setAttribute(ATTRS.VISIBILITY, 'false');
        }
    }
}
/* INITIALISE AND REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
    autoID(TOOLTIP);
    customElements.define(TOOLTIP, Tooltip);
});
