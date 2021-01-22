/* IMPORTS */
import {DISPLAY_NAME, NAME} from '../../common/constants.js';
import {autoID, getElsByAttrOrSelector} from '../../common/functions.js';


/* COMPONENT NAME */
export const ACCORDION = `${NAME}-accordion`;


/* CONSTANTS */
const HEADER = `${ACCORDION}-header`;
const PANEL = `${ACCORDION}-panel`;


export const ATTRS = {
  HEADER,
  ONE_VISIBLE_PANEL: `${ACCORDION}-one-visible-panel`,
  PANEL,
  PANEL_VISIBLE: `${PANEL}-visible`,
  TRIGGER: `${ACCORDION}-trigger`,
};


// Add names of any custom events used, prefixed with ACCORDION
export const EVENTS = {
  DETAIL_PROPS: {
    PANEL_NUMBER: 'panelNumber',
    PANEL_VISIBLE: 'panelVisible',
  },
  IN: {
    HIDE_PANEL: `${ACCORDION}-hide-panel`,
    HIDE_PANELS: `${ACCORDION}-hide-panels`,
    SHOW_PANEL: `${ACCORDION}-show-panel`,
    SHOW_PANELS: `${ACCORDION}-show-panels`,
    TOGGLE_PANEL: `${ACCORDION}-toggle-panel`,
    UPDATE: `${ACCORDION}-update`,
  },
  OUT: {
    CHANGED: `${ACCORDION}-panel-visibility-changed`,
    READY: `${ACCORDION}-ready`,
  },
};


/* CLASS */
export default class Accordion extends HTMLElement {
  private headerEls: NodeListOf<HTMLElement>;
  private initialised = false;
  private panelEls: NodeListOf<HTMLElement>;
  private triggerEls: Array<HTMLButtonElement>;
  private singleVisiblePanel: boolean;


  constructor() {
    super();


    /* CLASS METHOD BINDINGS */
    this.clickHandler = this.clickHandler.bind(this);
    this.customEventsHander = this.customEventsHander.bind(this);
    this.hidePanel = this.hidePanel.bind(this);
    this.initAccordion = this.initAccordion.bind(this);
    this.setAccordionAttributes = this.setAccordionAttributes.bind(this);
    this.showPanel = this.showPanel.bind(this);
    this.togglePanel = this.togglePanel.bind(this);
  }


  public connectedCallback(): void {
    /* GET DOM ELEMENTS */


    /* GET DOM DATA */
    this.singleVisiblePanel = this.hasAttribute(ATTRS.ONE_VISIBLE_PANEL);


    /* SET DOM DATA */


    /* ADD EVENT LISTENERS */
    this.addEventListener('click', this.clickHandler);
    this.addEventListener(EVENTS.IN.HIDE_PANEL, this.customEventsHander);
    this.addEventListener(EVENTS.IN.HIDE_PANELS, this.customEventsHander);
    this.addEventListener(EVENTS.IN.SHOW_PANEL, this.customEventsHander);
    this.addEventListener(EVENTS.IN.SHOW_PANELS, this.customEventsHander);
    this.addEventListener(EVENTS.IN.TOGGLE_PANEL, this.customEventsHander);
    this.addEventListener(EVENTS.IN.UPDATE, this.customEventsHander);


    /* INITIALISATION */
    if (this.singleVisiblePanel) {
      const visiblePanelEls = this.querySelectorAll(`[${ATTRS.PANEL_VISIBLE}="true"]`);
      if (visiblePanelEls.length > 1) {
        visiblePanelEls.forEach((visiblePanelEl, index) => {
          if (index === 0) {
            return;
          }
          visiblePanelEl.setAttribute(ATTRS.PANEL_VISIBLE, 'false');
        });
      }
    }

    this.initAccordion();
    this.initialised = true;

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
      'detail': {
        'id': this.id,
      }
    }));
  }


  public disconnectedCallback(): void {
    /* REMOVE EVENT LISTENERS */
    this.removeEventListener('click', this.clickHandler);
    this.removeEventListener(EVENTS.IN.HIDE_PANEL, this.customEventsHander);
    this.removeEventListener(EVENTS.IN.HIDE_PANELS, this.customEventsHander);
    this.removeEventListener(EVENTS.IN.SHOW_PANEL, this.customEventsHander);
    this.removeEventListener(EVENTS.IN.SHOW_PANELS, this.customEventsHander);
    this.removeEventListener(EVENTS.IN.TOGGLE_PANEL, this.customEventsHander);
    this.removeEventListener(EVENTS.IN.UPDATE, this.customEventsHander);
  }


  /*
    Handle click events
  */
  private clickHandler(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    const triggerClicked = target.closest(`[${ATTRS.TRIGGER}]`) as HTMLButtonElement;

    if (!triggerClicked) {
      return;
    }
    this.togglePanel(this.triggerEls.indexOf(triggerClicked));
  }


  /*
    Handler for incoming custom events
  */
  private customEventsHander(e: CustomEvent): void {
    switch (e.type) {
      case EVENTS.IN.HIDE_PANEL:
      case EVENTS.IN.SHOW_PANEL:
      case EVENTS.IN.TOGGLE_PANEL: {
        const detail = e['detail'];
        if (!detail || !detail[EVENTS.DETAIL_PROPS.PANEL_NUMBER]) {
          return;
        }
        const panelIndex = detail[EVENTS.DETAIL_PROPS.PANEL_NUMBER] - 1;
        if (e.type === EVENTS.IN.HIDE_PANEL) {
          this.hidePanel(panelIndex);
        } else if (e.type === EVENTS.IN.SHOW_PANEL) {
          this.showPanel(panelIndex);
        } else {
          this.togglePanel(panelIndex);
        }
        break;
      }
      case EVENTS.IN.HIDE_PANELS:
      case EVENTS.IN.SHOW_PANELS:
        this.panelEls.forEach((panelEl, index) => {
          if (e.type === EVENTS.IN.HIDE_PANELS) {
            this.hidePanel(index);
          } else {
            this.showPanel(index);
          }
        });
        break;
      case EVENTS.IN.UPDATE:
        this.initAccordion();
        break;
    }
  }


  /*
    Hide panel
  */
  private hidePanel(panelIndex: number): void {
    const panelEl = this.panelEls[panelIndex];
    if (panelEl.getAttribute(ATTRS.PANEL_VISIBLE) === 'false') {
      return;
    }

    panelEl.setAttribute(ATTRS.PANEL_VISIBLE, 'false');
    this.triggerEls[panelIndex].setAttribute('aria-expanded', 'false');

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.CHANGED, {
      'detail': {
        'id': this.id,
        [EVENTS.DETAIL_PROPS.PANEL_NUMBER]: panelIndex + 1,
        [EVENTS.DETAIL_PROPS.PANEL_VISIBLE]: false,
      }
    }));
  }


  /*
    Initialises Accordion headers, triggers and panels. To be run whenever Accordion headers, triggers or panels change
  */
  private initAccordion(): void {
    let error = false;

    // HEADERS AND TRIGGERS
    this.triggerEls = [];
    this.headerEls = getElsByAttrOrSelector(this, ATTRS.HEADER, 'h1,h2,h3,h4,h5,h6');
    this.headerEls.forEach((headerEl, index) => {
      if (error) {
        return;
      }

      // Warn if any header is not a heading element
      if (!(headerEl instanceof HTMLHeadingElement)) {
        error = true;
        console.error(`${DISPLAY_NAME}: This header of Accordion with ID ${this.id} must be a heading element.`, headerEl);
        return;
      }

      // Warn if any header has a different element type to the other headers
      if (index > 0 && headerEl.nodeName !== this.headerEls[0].nodeName) {
        error = true;
        console.error(`${DISPLAY_NAME}: All headers of Accordion with ID ${this.id} must be of same type, e.g. all <h2>, all <h3> etc.`);
        return;
      }

      // Warn if any header has more than a single child element or that element is not a button
      const triggerEl = headerEl.querySelector(`[${ATTRS.HEADER}] > button`) as HTMLButtonElement;
      if (headerEl.childElementCount !== 1 || !triggerEl) {
        error = true;
        console.error(`${DISPLAY_NAME}: This header of Accordion with ID ${this.id} must have a single child <button> element.`, headerEl);
        return;
      }

      this.triggerEls.push(triggerEl);
    });

    if (error) {
      return;
    }

    // PANELS
    // If ATTRS.PANEL not given to any elements take all children that are not headings
    this.panelEls = getElsByAttrOrSelector(this, ATTRS.PANEL, `${ACCORDION} > :not([${ATTRS.HEADER}])`);
    const panelsCount = this.panelEls.length;
    // Check number of panels matches number of triggers
    if (panelsCount !== this.triggerEls.length) {
      console.error(`${DISPLAY_NAME}: Number of panels doesn't match number of triggers for Accordion with ID ${this.id}.`);
      return;
    }

    this.setAccordionAttributes();

    if (this.initialised) {
      window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
        'detail': {
          'id': this.id,
        }
      }));
    }
  }


  /*
    Set panel and trigger attributes
  */
  private setAccordionAttributes(): void {
    this.triggerEls.forEach((triggerEl, index) => {
      // Set IDs
      if (!triggerEl.id || triggerEl.id.includes(`${this.id}-trigger-`)) {
        triggerEl.id = `${this.id}-trigger-${index + 1}`;
      }
      const correspondingPanel = this.panelEls[index];
      if (!correspondingPanel.id || correspondingPanel.id.includes(`${this.id}-panel-`)) {
        correspondingPanel.id = `${this.id}-panel-${index + 1}`;
      }

      // Set trigger attributes
      const panelVisible = correspondingPanel.getAttribute(ATTRS.PANEL_VISIBLE) === 'true';
      triggerEl.setAttribute(ATTRS.TRIGGER, '');
      triggerEl.setAttribute('aria-controls', `${this.id}-panel-${index + 1}`);
      triggerEl.setAttribute('aria-expanded', panelVisible ? 'true' : 'false');

      // Set panel attributes
      correspondingPanel.setAttribute('aria-labelledby', triggerEl.id);
      correspondingPanel.setAttribute('role', 'region');
      if (!panelVisible) {
        correspondingPanel.setAttribute(ATTRS.PANEL_VISIBLE, 'false');
      }
    });
  }


  /*
    Show panel
  */
  private showPanel(panelIndex: number): void {
    const panelEl = this.panelEls[panelIndex];
    if (panelEl.getAttribute(ATTRS.PANEL_VISIBLE) === 'true') {
      return;
    }

    panelEl.setAttribute(ATTRS.PANEL_VISIBLE, 'true');
    this.triggerEls[panelIndex].setAttribute('aria-expanded', 'true');

    // Hide all other panels if single visible panel Accordion
    if (this.singleVisiblePanel) {
      this.panelEls.forEach((panelEl, index) => {
        if (index === panelIndex) {
          return;
        }
        panelEl.setAttribute(ATTRS.PANEL_VISIBLE, 'false');
        this.triggerEls[index].setAttribute('aria-expanded', 'false');
      });
    }

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.CHANGED, {
      'detail': {
        'id': this.id,
        [EVENTS.DETAIL_PROPS.PANEL_NUMBER]: panelIndex + 1,
        [EVENTS.DETAIL_PROPS.PANEL_VISIBLE]: true,
      }
    }));
  }


  /*
    Toggle panel visibility
  */
  private togglePanel(panelIndex: number): void {
    const panelVisible = this.panelEls[panelIndex].getAttribute(ATTRS.PANEL_VISIBLE) === 'true';
    if (panelVisible) {
      this.hidePanel(panelIndex);
    } else {
      this.showPanel(panelIndex);
    }
  }
}


/* REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  // Use autoID to automatically increment the IDs of class instances
  autoID(ACCORDION);
  customElements.define(ACCORDION, Accordion);
});
