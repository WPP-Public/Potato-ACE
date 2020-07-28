/* IMPORTS */
import {KEYS, NAME} from '../../common/constants.js';
import {autoID, keyPressedMatches} from '../../common/functions.js';


/* TEMPLATE NAME */
export const TABS = `${NAME}-tabs`;


/* CONSTANTS */
export const TAB = `${TABS}-tab`;


export const ATTRS = {
  ACTIVE_TAB: `${TABS}-active-tab`,
  MANUAL_ACTIVATION: `${TABS}-manual-activation`,
  NO_WRAPPING: `${TABS}-no-wrapping`,
  PANEL: `${TABS}-panel`,
  TAB,
  TABLIST: `${TABS}-tablist`,
  TABLIST_VERTICAL: `${TABS}-tablist-vertical`,
  VERTICAL: `${TABS}-vertical`,
  VISIBLE: `${TAB}-visible`
};


export const EVENTS = {
  READY: `${TABS}-ready`,
  SET_NEXT_TAB: `${TABS}-next-tab`,
  SET_PREV_TAB: `${TABS}-prev-tab`,
  SET_TAB: `${TABS}-set-tab`,
  TABS_PANEL_CHANGED: `${TABS}-changed`,
  UPDATE_TABS: `${TABS}-update`
};


/* CLASS */
export default class Tabs extends HTMLElement {
  private activeTabIndex = 0;
  private automaticActivation = true;
  private nextTabKey = KEYS.RIGHT;
  private panelEls: NodeListOf<HTMLElement>;
  private prevTabKey = KEYS.LEFT;
  private tabCount = 0;
  private tabEls: NodeListOf<HTMLElement>;
  private tablistEl: HTMLElement | null = null;
  private vertical = false;
  private wrapping = false;

  constructor() {
    super();


    /* CLASS METHOD BINDINGS */
    this.initTab = this.initTab.bind(this);
    this.activatePanel = this.activatePanel.bind(this);
    this.setTabBasedOnDirection = this.setTabBasedOnDirection.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.customEventsHander = this.customEventsHander.bind(this);
    this.updateTabs = this.updateTabs.bind(this);
  }


  public connectedCallback(): void {
    /* GET DOM ELEMENTS */
    this.tablistEl = this.querySelector(`[${ATTRS.TABLIST}]`);
    if (!this.tablistEl && this.childNodes.length > 0) {
      // If a ace-tabs-tablist element is not found take the first child
      this.tablistEl = this.firstChild as HTMLElement;
    }


    /* GET DOM DATA */
    this.automaticActivation = !this.hasAttribute(ATTRS.MANUAL_ACTIVATION);
    this.vertical = this.hasAttribute(ATTRS.VERTICAL);
    this.wrapping = !this.hasAttribute(ATTRS.NO_WRAPPING);


    /* SET DOM DATA */
    this.tablistEl.setAttribute('role', 'tablist');
    this.tablistEl.setAttribute('aria-orientation', this.vertical ? 'vertical' : 'horizontal');
    this.prevTabKey = this.vertical ? KEYS.UP : KEYS.LEFT;
    this.nextTabKey = this.vertical ? KEYS.DOWN : KEYS.RIGHT;

    if (this.vertical) {
      this.tablistEl.setAttribute(ATTRS.TABLIST_VERTICAL, '');
    }


    /* ADD EVENT LISTENERS */
    window.addEventListener(EVENTS.SET_NEXT_TAB, this.customEventsHander);
    window.addEventListener(EVENTS.SET_PREV_TAB, this.customEventsHander);
    window.addEventListener(EVENTS.SET_TAB, this.customEventsHander);
    window.addEventListener(EVENTS.UPDATE_TABS, this.customEventsHander);
    this.tablistEl.addEventListener('click', this.clickHandler);
    this.tablistEl.addEventListener('keydown', this.keydownHandler);


    /* INITIALISATION */
    this.updateTabs();
    this.activatePanel(this.activeTabIndex);
  }


  public disconnectedCallback(): void {
    /* REMOVE EVENT LISTENERS */
    window.removeEventListener(EVENTS.SET_NEXT_TAB, this.customEventsHander);
    window.removeEventListener(EVENTS.SET_PREV_TAB, this.customEventsHander);
    window.removeEventListener(EVENTS.SET_TAB, this.customEventsHander);
    this.tablistEl.removeEventListener('click', this.clickHandler);
    this.tablistEl.removeEventListener('keydown', this.keydownHandler);
  }


  /*
    Hides all non-active panels and reveals active panel
  */
  private activatePanel(panelToActivateIndex: number): void {
    if (panelToActivateIndex === this.activeTabIndex) {
      return;
    }

    // De-activate the previously selected tab
    const oldTabEl = this.tabEls[this.activeTabIndex];
    oldTabEl.removeAttribute(ATTRS.ACTIVE_TAB);
    oldTabEl.setAttribute('aria-selected', 'false');
    oldTabEl.setAttribute('tabindex', '-1');

    // Activate the newly selected tab
    const newTabEl = this.tabEls[panelToActivateIndex];
    newTabEl.setAttribute(ATTRS.ACTIVE_TAB, '');
    newTabEl.setAttribute('aria-selected', 'true');
    newTabEl.setAttribute('tabindex', '');
    this.panelEls.forEach((panelEl, index) => panelEl.setAttribute(ATTRS.VISIBLE, index === panelToActivateIndex ? 'true' : 'false'));
    newTabEl.focus();

    const oldTabIndex = this.activeTabIndex;
    this.activeTabIndex = panelToActivateIndex;

    window.dispatchEvent(new CustomEvent(EVENTS.TABS_PANEL_CHANGED, {
      'detail': {
        'activeTab': {
          'id': newTabEl.id,
          'number': this.activeTabIndex + 1
        },
        'prevTab': {
          'id': oldTabEl.id,
          'number': oldTabIndex + 1
        },
        'tabsId': this.id
      }
    }));
  }


  /*
    Handles a tab being clicked
  */
  private clickHandler(e: MouseEvent): void {
    const tab = (e.target as HTMLElement).closest('[role=tab]') as HTMLElement;
    const index = [...this.tabEls].indexOf(tab);
    this.activatePanel(index);
  }


  /*
    Handles custom events for the tabs element
  */
  private customEventsHander(e: CustomEvent): void {
    // Check if event has a 'detail' property and if detail has an id that matches this class instance id
    const detail = e['detail'];
    if (!detail || (detail['id'] !== this.id)) {
      return;
    }

    // Depending on event type trigger appropriate action
    switch (e.type) {
      case EVENTS.SET_NEXT_TAB:
        this.setTabBasedOnDirection(1);
        break;
      case EVENTS.SET_PREV_TAB:
        this.setTabBasedOnDirection(-1);
        break;
      case EVENTS.SET_TAB:
        {
          const detail = e['detail'];
          if (!detail) {
            return;
          }
          const tabNumber = detail['tab'];
          if (tabNumber < 0 || tabNumber > this.tabCount || typeof tabNumber !== 'number') {
            return;
          }
          this.activatePanel(tabNumber - 1);
        }
        break;
      case EVENTS.UPDATE_TABS:
        this.updateTabs();
        break;
    }
  }


  /*
    Adds all the relevant attributes to a tab element and its corresponding panel
  */
  private initTab(tab: HTMLElement, index: number): void {
    // Sets appropriate role and attributes for the element
    tab.setAttribute(ATTRS.TAB, '');
    tab.setAttribute('role', 'tab');

    // If the tab doesn't have a ID then one is generated for it
    tab.id = tab.id || `${this.id}-tab-${index + 1}`;

    // If this is the first tab then set it as the active tab
    if (index === 0) {
      tab.setAttribute('aria-selected', 'true');
    } else {  // Otherwise set it as an inactive tab
      tab.setAttribute('tabindex', '-1');
      tab.setAttribute('aria-selected', 'false');
    }

    // Set the corresponding panel attributes and assign ID if needed
    this.panelEls[index].setAttribute('role', 'tabpanel');
    this.panelEls[index].setAttribute('tabindex', '0');
    const panelId = this.panelEls[index].id || `${this.id}-panel-${index + 1}`;
    this.panelEls[index].id = panelId;
    tab.setAttribute('aria-controls', panelId);
    this.panelEls[index].setAttribute('aria-labelledby', tab.id);
  }


  /*
    Handles keyddown event on tab elements
  */
  private keydownHandler(e: KeyboardEvent): void {
    const keyPressed = e.key || e.which || e.keyCode;

    // LEFT/UP key pressed
    if (keyPressedMatches(keyPressed, this.prevTabKey)) {
      e.preventDefault();
      this.setTabBasedOnDirection(-1);
      return;
    }

    // RIGHT/DOWN key pressed
    if (keyPressedMatches(keyPressed, this.nextTabKey)) {
      e.preventDefault();
      this.setTabBasedOnDirection(1);
      return;
    }

    // HOME key pressed
    if (keyPressedMatches(keyPressed, KEYS.HOME)) {
      e.preventDefault();
      // Activates the first tab in the tablist
      if (this.automaticActivation) {
        this.activatePanel(0);
      }
      return;
    }

    // END key pressed
    if (keyPressedMatches(keyPressed, KEYS.END)) {
      e.preventDefault();
      // Activates the last tab in the tablist
      if (this.automaticActivation) {
        this.activatePanel(this.tabCount - 1);
      }
      return;
    }
  }


  private setTabBasedOnDirection(direction: -1|1): void {
    let indexOfTabToActivate = this.activeTabIndex + direction;
    if (indexOfTabToActivate < 0) {
      if (!this.wrapping) {
        return;
      }
      indexOfTabToActivate = this.tabCount - 1;
    } else if (indexOfTabToActivate === this.tabCount) {
      if (!this.wrapping) {
        return;
      }
      indexOfTabToActivate = 0;
    }

    this.activatePanel(indexOfTabToActivate);
  }


  /*
    Updates the tab element, reinitialises tabs and panels
  */
  private updateTabs(): void {
    this.tabEls = this.tablistEl.querySelectorAll('button');
    this.tabCount = this.tabEls.length;
    let panelEls = this.querySelectorAll(`${ATTRS.PANEL}`);
    if (!panelEls.length && this.childNodes.length > 1) {
      panelEls = this.querySelectorAll(`${TABS} > :not([${ATTRS.TABLIST}])`);
    }
    this.panelEls = panelEls as NodeListOf<HTMLElement>;

    // Check number of tabs matches number of panels
    if (this.tabCount !== this.panelEls.length) {
      console.error(`Number of tabs doesn't match number of panels!`);
      return;
    }

    // Initialise tabs and tablist attributes
    this.tabEls.forEach(this.initTab);

    // Check the tablist is labelled otherwise print a warning and assign a default value
    const isTablistLabelled = this.querySelector('label') || this.tablistEl.hasAttribute('aria-label');
    if (!isTablistLabelled) {
      console.warn(`Please provide a <label> or 'aria-labelledby' attribute for the tablist in #${this.id}`);
      this.tablistEl.setAttribute('aria-label', `${this.id}-tablist`);
    }

    // Hide non-selected panel
    this.panelEls.forEach((panelEl, index) => panelEl.setAttribute(ATTRS.VISIBLE, index === this.activeTabIndex ? 'true' : 'false'));

    // Dispatch 'ready' event
    window.dispatchEvent(new CustomEvent(EVENTS.READY, {
      'detail': {
        'id': this.id,
      }
    }));
  }
}


/* REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  // Use autoID to automatically increment the IDs of class instances
  autoID(TABS);
  customElements.define(TABS, Tabs);
});
