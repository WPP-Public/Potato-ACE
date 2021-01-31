/* IMPORTS */
import {DISPLAY_NAME, KEYS, NAME} from '../../common/constants.js';
import {
  autoID,
  getElByAttrOrSelector,
  getElsByAttrOrSelector,
  getIndexBasedOnDirection,
  keyPressedMatches,
  warnIfElHasNoAriaLabel
} from '../../common/functions.js';


/* COMPONENT NAME */
export const TABS = `${NAME}-tabs`;


/* CONSTANTS */
export const TABLIST = `${TABS}-tablist`;
export const TAB = `${TABS}-tab`;
export const PANEL = `${TABS}-panel`;


export const ATTRS = {
  DEEP_LINKED: `${TABS}-deep-linked`,
  INFINITE: `${TABS}-infinite`,
  MANUAL: `${TABS}-manual`,
  PANEL,
  PANEL_VISIBLE: `${PANEL}-visible`,
  SELECTED_TAB: `${TABS}-selected-tab`,
  TAB,
  TABLIST,
  TAB_SELECTED: `${TAB}-selected`,
  VERTICAL: `${TABS}-vertical`,
};


export const EVENTS = {
  IN: {
    SET_NEXT_TAB: `${TABS}-set-next-tab`,
    SET_PREV_TAB: `${TABS}-set-prev-tab`,
    UPDATE: `${TABS}-update`
  },
  OUT: {
    CHANGED: `${TAB}-changed`,
    READY: `${TABS}-ready`,
  }
};


/* CLASS */
export default class Tabs extends HTMLElement {
  private activeTabIndex: number;
  private deepLinked: boolean;
  private infinite: boolean;
  private initialised = false;
  private manualSelection = true;
  private nextTabKey = KEYS.RIGHT;
  private panelEls: NodeListOf<Element>;
  private prevTabKey = KEYS.LEFT;
  private selectedTabIndex: number;
  private tabCount: number;
  private tabEls: NodeListOf<HTMLButtonElement>;
  private tablistEl: HTMLElement;
  private vertical: boolean;


  constructor() {
    super();


    /* CLASS METHOD BINDINGS */
    this.clickHandler = this.clickHandler.bind(this);
    this.customEventsHander = this.customEventsHander.bind(this);
    this.determineStartingSelectedTab = this.determineStartingSelectedTab.bind(this);
    this.initTabs = this.initTabs.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.selectTab = this.selectTab.bind(this);
    this.setOrientation = this.setOrientation.bind(this);
    this.setSelectedTab = this.setSelectedTab.bind(this);
    this.setTabNumberInUrl = this.setTabNumberInUrl.bind(this);
    this.setTabsAttributes = this.setTabsAttributes.bind(this);
  }


  static get observedAttributes(): Array<string> {
    return [ATTRS.SELECTED_TAB, ATTRS.INFINITE, ATTRS.VERTICAL];
  }


  private attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (!this.initialised || oldValue === newValue) {
      return;
    }

    switch (name) {
      case ATTRS.SELECTED_TAB: {
        const selectedTabNumber = +newValue;
        if (selectedTabNumber) {
          this.selectTab(selectedTabNumber - 1);
        }
        break;
      }
      case ATTRS.INFINITE:
        this.infinite = (newValue === '');
        break;
      case ATTRS.VERTICAL:
        this.vertical = (newValue === '');
        this.setOrientation();
        break;
    }
  }


  public connectedCallback(): void {
    /* GET DOM ELEMENTS */
    this.tablistEl = getElByAttrOrSelector(this, ATTRS.TABLIST, `#${this.id} > div`);
    if (!this.tablistEl) {
      console.error(`${DISPLAY_NAME}: Tabs with ID ${this.id} requires a child <div> or a descendant with attribute ${ATTRS.TABLIST} that will be used as a tablist.`);
      return;
    }


    /* GET DOM DATA */
    this.deepLinked = this.hasAttribute(ATTRS.DEEP_LINKED);
    this.infinite = this.hasAttribute(ATTRS.INFINITE);
    this.manualSelection = this.hasAttribute(ATTRS.MANUAL);
    this.vertical = this.hasAttribute(ATTRS.VERTICAL);


    /* SET DOM DATA */
    this.tablistEl.setAttribute('role', 'tablist');


    /* ADD EVENT LISTENERS */
    this.addEventListener(EVENTS.IN.SET_NEXT_TAB, this.customEventsHander);
    this.addEventListener(EVENTS.IN.SET_PREV_TAB, this.customEventsHander);
    this.addEventListener(EVENTS.IN.UPDATE, this.customEventsHander);
    this.tablistEl.addEventListener('click', this.clickHandler);
    this.tablistEl.addEventListener('keydown', this.keydownHandler);


    /* INITIALISATION */
    warnIfElHasNoAriaLabel(this.tablistEl, 'Tabs');
    this.initTabs();
    this.initialised = true;

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
      'detail': {
        'id': this.id,
      }
    }));
  }


  public disconnectedCallback(): void {
    /* REMOVE EVENT LISTENERS */
    this.removeEventListener(EVENTS.IN.SET_NEXT_TAB, this.customEventsHander);
    this.removeEventListener(EVENTS.IN.SET_PREV_TAB, this.customEventsHander);
    this.tablistEl.removeEventListener('click', this.clickHandler);
    this.tablistEl.removeEventListener('keydown', this.keydownHandler);
  }


  /*
    Handles clicked on tabs
  */
  private clickHandler(e: MouseEvent): void {
    const tabClicked = (e.target as HTMLElement).closest(`[${ATTRS.TAB}]`) as HTMLButtonElement;
    if (!tabClicked) {
      return;
    }
    const tabIndex = [...this.tabEls].indexOf(tabClicked);
    this.setSelectedTab(tabIndex);
  }


  /*
    Handler for incoming custom events
  */
  private customEventsHander(e: CustomEvent): void {
    switch (e.type) {
      case EVENTS.IN.SET_PREV_TAB:
      case EVENTS.IN.SET_NEXT_TAB: {
        const direction = (e.type === EVENTS.IN.SET_PREV_TAB) ? -1 : 1;
        const newTabIndex = getIndexBasedOnDirection(this.selectedTabIndex, direction, this.tabCount, this.infinite);
        this.setSelectedTab(newTabIndex);
        break;
      }
      case EVENTS.IN.UPDATE:
        this.initTabs();
        break;
    }
  }


  /*
    Determines what the starting selected tab index should be based on valid search parameter if deep-linked, or valid observed attribute or defaults to 0;
  */
  private determineStartingSelectedTab(): void {
    let urlStartingTabNumber;
    let startingSelectedTabNumber = +this.getAttribute(ATTRS.SELECTED_TAB) || 1;

    // If Tabs previously initialised (updating) and index is greater than max, default to last tab (means last tab was selected and subsequently deleted)
    if (startingSelectedTabNumber > this.tabCount && this.initialised) {
      startingSelectedTabNumber = this.tabCount;
    }

    // if Tabs deep-linked and not initialised yet, get starting tab number from URL
    if (this.deepLinked && !this.initialised) {
      const params = new URLSearchParams(location.search);
      urlStartingTabNumber = +params.get(this.id);
      if (urlStartingTabNumber > 0 && urlStartingTabNumber <= this.tabCount) {
        startingSelectedTabNumber = urlStartingTabNumber;
      }
    }

    this.setAttribute(ATTRS.SELECTED_TAB, startingSelectedTabNumber.toString());
    this.selectedTabIndex = startingSelectedTabNumber - 1;
    this.activeTabIndex = this.selectedTabIndex;
    // Initial tab number search param value invalid then set it to the correct value
    if (this.deepLinked && urlStartingTabNumber !== startingSelectedTabNumber) {
      this.setTabNumberInUrl();
    }
  }


  /*
    Initialises Tabs panel and tab elements. Should be run whenever Tabs markup changes
  */
  private initTabs(): void {
    this.tabEls = this.tablistEl.querySelectorAll('button');
    this.tabCount = this.tabEls.length;

    // If ATTRS.PANEL not given then take all children except first (which is the tablist)
    this.panelEls = getElsByAttrOrSelector(this, ATTRS.PANEL, `${TABS} > :not(:first-child)`);

    // Check number of panels matches number of tabs
    if (this.panelEls.length !== this.tabCount) {
      console.error(`${DISPLAY_NAME}: Number of panels doesn't match number of tabs for Tabs with ID ${this.id}.`);
      return;
    }

    this.determineStartingSelectedTab();
    this.setTabsAttributes();
    this.setOrientation();

    if (!this.initialised) {
      return;
    }

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.READY, {
      'detail': {
        'id': this.id,
      }
    }));
  }


  /*
    Handles keydown events on tab elements
  */
  private keydownHandler(e: KeyboardEvent): void {
    const keyPressed = e.key || e.which || e.keyCode;
    const homeKeyPressed = keyPressedMatches(keyPressed, KEYS.HOME);
    const endKeyPressed = keyPressedMatches(keyPressed, KEYS.END);
    const prevTabKeyPressed = keyPressedMatches(keyPressed, this.prevTabKey);
    const nextTabKeyPressed = keyPressedMatches(keyPressed, this.nextTabKey);

    // SPACE or ENTER key pressed
    if (this.manualSelection && keyPressedMatches(keyPressed, [KEYS.ENTER, KEYS.SPACE])) {
      e.preventDefault();
      this.setSelectedTab(this.activeTabIndex);
      return;
    }

    // LEFT/UP/RIGHT/DOWN/HOME/END key pressed
    if (!homeKeyPressed && !endKeyPressed && !prevTabKeyPressed && !nextTabKeyPressed) {
      return;
    }

    e.preventDefault();
    let desiredTabIndex = homeKeyPressed ? 0 : this.tabCount - 1;
    if (prevTabKeyPressed || nextTabKeyPressed) {
      const direction = prevTabKeyPressed ? -1 : 1;
      const startingPoint = this.manualSelection ? this.activeTabIndex : this.selectedTabIndex;
      desiredTabIndex = getIndexBasedOnDirection(startingPoint, direction, this.tabCount, this.infinite);
    }
    if (this.manualSelection) {
      this.tabEls[this.activeTabIndex].setAttribute('tabindex', '-1');
      this.activeTabIndex = desiredTabIndex;
      const desiredTabEl = this.tabEls[desiredTabIndex];
      desiredTabEl.removeAttribute('tabindex');
      desiredTabEl.focus();
    } else {
      this.setSelectedTab(desiredTabIndex);
    }
  }


  /*
    Select a tab by revealing the tab's panel and hiding all other panels
  */
  private selectTab(tabToSelectIndex: number): void {
    if (
      tabToSelectIndex === this.selectedTabIndex ||
      !this.tabEls ||
      !this.panelEls ||
      tabToSelectIndex < 0 ||
      tabToSelectIndex >= this.tabCount
    ) {
      return;
    }

    // De-select previously selected tab and panel
    const oldTabIndex = this.selectedTabIndex;
    const oldTabEl = this.tabEls[oldTabIndex];
    const oldPanelEl = this.panelEls[oldTabIndex];
    oldTabEl.removeAttribute(ATTRS.TAB_SELECTED);
    oldTabEl.setAttribute('aria-selected', 'false');
    oldTabEl.setAttribute('tabindex', '-1');
    oldPanelEl.removeAttribute(ATTRS.PANEL_VISIBLE);

    // Select tab and panel
    const tabToSelectEl = this.tabEls[tabToSelectIndex];
    const panelToSelectEl = this.panelEls[tabToSelectIndex];
    tabToSelectEl.setAttribute(ATTRS.TAB_SELECTED, '');
    tabToSelectEl.setAttribute('aria-selected', 'true');
    tabToSelectEl.removeAttribute('tabindex');
    panelToSelectEl.setAttribute(ATTRS.PANEL_VISIBLE, '');

    this.selectedTabIndex = tabToSelectIndex;

    this.setTabNumberInUrl();

    tabToSelectEl.focus();

    window.dispatchEvent(new CustomEvent(EVENTS.OUT.CHANGED, {
      'detail': {
        'currentlySelectedTab': {
          'id': tabToSelectEl.id,
          'number': tabToSelectIndex + 1
        },
        'id': this.id,
        'previouslySelectedTab': {
          'id': oldTabEl.id,
          'number': oldTabIndex + 1
        },
      }
    }));
  }


  /*
    Set orientation attributes based on whether Tabs is horizontal or vertical
  */
  private setOrientation(): void {
    this.prevTabKey = this.vertical ? KEYS.UP : KEYS.LEFT;
    this.nextTabKey = this.vertical ? KEYS.DOWN : KEYS.RIGHT;
    this.tablistEl.setAttribute('aria-orientation', this.vertical ? 'vertical' : 'horizontal');
  }


  /*
    Changes the selected tab by changing the observed attribute ATTRS.SELECTED_TAB
  */
  private setSelectedTab(panelToSelectIndex: number): void {
    this.activeTabIndex = panelToSelectIndex;
    this.setAttribute(ATTRS.SELECTED_TAB, (panelToSelectIndex + 1).toString());
  }


  /*
    Set the search parameter value in the URL
  */
  private setTabNumberInUrl(): void {
    if (!this.deepLinked) {
      return;
    }

    const tabNumber = (this.selectedTabIndex + 1).toString();
    const params = new URLSearchParams(location.search);
    params.set(this.id, tabNumber);
    window.history.replaceState({}, '', `${location.pathname}?${params}`);
  }


  /*
    Set panel and tab attributes
  */
  private setTabsAttributes(): void {
    this.tabEls.forEach((tabEl, index) => {
      const correspondingPanel = this.panelEls[index];

      // Set IDs
      if (!tabEl.id || tabEl.id.includes(`${this.id}-tab-`)) {
        tabEl.id = `${this.id}-tab-${index + 1}`;
      }
      if (!correspondingPanel.id || correspondingPanel.id.includes(`${this.id}-panel-`)) {
        correspondingPanel.id = `${this.id}-panel-${index + 1}`;
      }

      // Set tab attributes
      tabEl.setAttribute(ATTRS.TAB, '');
      tabEl.setAttribute('aria-controls', correspondingPanel.id);
      tabEl.setAttribute('aria-selected', index === this.selectedTabIndex ? 'true' : 'false');
      tabEl.setAttribute('role', 'tab');
      if (index === this.selectedTabIndex) {
        tabEl.setAttribute(ATTRS.TAB_SELECTED, '');
        tabEl.removeAttribute('tabindex');
      } else {
        tabEl.setAttribute('tabindex', '-1');
      }

      // Set panel attributes
      correspondingPanel.setAttribute(ATTRS.PANEL, '');
      correspondingPanel.setAttribute('aria-labelledby', tabEl.id);
      correspondingPanel.setAttribute('role', 'tabpanel');
      correspondingPanel.setAttribute('tabindex', '0');
      if (index === this.selectedTabIndex) {
        correspondingPanel.setAttribute(ATTRS.PANEL_VISIBLE, '');
      } else {
        correspondingPanel.removeAttribute(ATTRS.PANEL_VISIBLE);
      }
    });
  }
}


/* REGISTER CUSTOM ELEMENT */
document.addEventListener('DOMContentLoaded', () => {
  autoID(TABS);
  customElements.define(TABS, Tabs);
});
