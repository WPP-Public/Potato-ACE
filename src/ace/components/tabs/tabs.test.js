import {ATTRS, EVENTS, TABS} from './tabs';


const IDS = {
  // ADD_TAB_BTN: 'add-tab-btn',
  BASIC_TABS: `${TABS}-1`,
  CUSTOM_EVENTS_TABS: 'custom-events-tabs',
  // DYNAMIC_TABS: 'dynamic-tabs',
  NEXT_TAB_BTN: 'next-tab-btn',
  NON_WRAPPING_TABS: 'non-wrapping-tabs',
  PREV_TAB_BTN: 'prev-tab-btn',
  // REMOVE_TAB_BTN: 'remove-tab-btn',
  SET_TAB_FORM: 'set-tab-form',
  VERTICAL_TABS: 'vertical-tabs',
};


const tabsBeforeEach = (id) => {
  return cy.get(`#${id}`)
    .as('tabs')
    .find(`div:not([${ATTRS.TABLIST}])`)
    .as('tabsPanels')
    .get('@tabs')
    .find(`[${ATTRS.TABLIST}]`)
    .as('tabsTablist')
    .find('button')
    .as('tabsButtons')
    .first()
    .as('tabsButton1')

    // Reset state before test
    .click()
    .blur();
};


const tabsInitChecks = (id, vertical=false) => {
  const PANEL_ID_BASE = `${id}-panel`;
  const TABLIST_ID_BASE = `${id}-tab`;

  return cy.get('@tabsTablist')
    .should('have.attr', 'role', 'tablist')
    .and('have.attr', 'aria-orientation', vertical ? 'vertical' : 'horizontal')
    .get('@tabsButtons')
    .each(($tab, index) => {
      cy.wrap($tab)
        .should('have.attr', 'aria-controls', `${PANEL_ID_BASE}-${index + 1}`)
        .and('have.attr', 'aria-selected', index === 0 ? 'true' : 'false')
        .and('have.id', `${TABLIST_ID_BASE}-${index + 1}`)
        .and('have.attr', 'role', 'tab');
    })
    .get('@tabsPanels')
    .each(($panel, index) => {
      cy.wrap($panel)
        .should('have.id', `${PANEL_ID_BASE}-${index + 1}`)
        .and('have.attr', 'aria-labelledby', `${TABLIST_ID_BASE}-${index + 1}`);
    });
};


const checkTabActive = (index) => {
  return cy.get('@tabsButtons')
    .each(($button, buttonIndex) => {
      cy.wrap($button).should('have.attr', 'aria-selected', buttonIndex === index ? 'true' : 'false');
    })
    .get('@tabsPanels')
    .each(($panel, panelIndex) => {
      cy.wrap($panel).should('have.attr', ATTRS.VISIBLE, panelIndex === index ? 'true' : 'false');
    });
};


const getExpectedDetailObj = (id, prevTabIndex, newTabIndex) => {
  const expectedDetailBase = {
    activeTab: {
      id: `${id}-tab-${newTabIndex + 1}`,
      number: newTabIndex + 1,
    },
    prevTab: {
      id: `${id}-tab-${prevTabIndex + 1}`,
      number: prevTabIndex + 1
    },
    tabsId: id,
  };
  return expectedDetailBase;
};


context(`Tabs`, () => {
  before(() => cy.visit(`/tabs`));


  it(`Tabs without ID should initialise with an ID`, () => {
    cy.get(TABS)
      .first()
      .should('have.id', `${TABS}-1`);
  });


  context(`Basic Tabs`, () => {
    const TABS_ID = IDS.BASIC_TABS;


    beforeEach(() => tabsBeforeEach(TABS_ID));


    it(`Should initialise correctly`, () => tabsInitChecks(TABS_ID));


    it('Should only activate correct tab panel when tab button is clicked', () => {
      let newIndex = 0;
      const tabSequence = [2, 0, 1];
      tabSequence.forEach((index) => {
        const oldIndex = newIndex;
        newIndex = index;
        cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, oldIndex, newIndex))
          .get('@tabsButtons')
          .eq(newIndex)
          .click();
        checkTabActive(newIndex);
      });
    });


    describe(`Keyboard interactions`, () => {
      it(`Should select previous tab, or last tab if first tab active, when LEFT pressed`, () => {
        let newIndex = 0;
        const tabSequence = [2, 1, 0];
        tabSequence.forEach((index) => {
          const oldIndex = newIndex;
          newIndex = index;
          cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, oldIndex, newIndex))
            .get('@tabsButton1')
            .focus()
            .type('{leftArrow}');
          checkTabActive(newIndex);
        });
      });


      it(`Should select next tab, or first tab if last tab active, when RIGHT pressed`, () => {
        let newIndex = 0;
        const tabSequence = [1, 2, 0];
        tabSequence.forEach((index) => {
          const oldIndex = newIndex;
          newIndex = index;
          cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, oldIndex, newIndex))
            .get('@tabsButton1')
            .focus()
            .type('{rightArrow}');
          checkTabActive(newIndex);
        });
      });


      it(`Should select the first or last tab when HOME or END pressed`, () => {
        cy.get('@tabsButton1').type('{end}');
        checkTabActive(2);

        cy.get('@tabsButton1').type('{home}');
        checkTabActive(0);
      });
    });
  });


  context(`Non-wrapping Tabs`, () => {
    const TABS_ID = IDS.NON_WRAPPING_TABS;


    beforeEach(() => tabsBeforeEach(TABS_ID));


    it(`Should initialise correctly`, () => {
      tabsInitChecks(TABS_ID);
      cy.get('@tabs').should('have.attr', ATTRS.NON_WRAPPING, '');
    });


    describe(`Keyboard interactions`, () => {
      it(`Should select previous tab when LEFT pressed`, () => {
        let newIndex = 0;
        cy.get('@tabsButton1')
          .focus()
          .type('{leftArrow}');
        checkTabActive(newIndex);

        newIndex = 2;
        cy.get('@tabsButtons')
          .eq(newIndex)
          .click();

        const tabSequence = [1, 0];
        tabSequence.forEach((index) => {
          const oldIndex = newIndex;
          newIndex = index;
          cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, oldIndex, newIndex))
            .get('@tabsButton1')
            .focus()
            .type('{leftArrow}');
          checkTabActive(newIndex);
        });
      });


      it(`Should select next tab when RIGHT pressed`, () => {
        let newIndex = 0;
        const tabSequence = [1, 2];
        tabSequence.forEach((index) => {
          const oldIndex = newIndex;
          newIndex = index;
          cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, oldIndex, newIndex))
            .get('@tabsButton1')
            .focus()
            .type('{rightArrow}');
          checkTabActive(newIndex);
        });

        cy.get('@tabsButton1')
          .focus()
          .type('{rightArrow}');
        checkTabActive(2);
      });
    });
  });


  context(`Vertical Tabs`, () => {
    const TABS_ID = IDS.VERTICAL_TABS;


    beforeEach(() => tabsBeforeEach(TABS_ID));


    it(`Should initialise correctly`, () => tabsInitChecks(TABS_ID, true));


    it('Should only activate correct tab panel when tab button is clicked', () => {
      let newIndex = 0;
      const tabSequence = [1, 0, 2];
      tabSequence.forEach((index) => {
        const oldIndex = newIndex;
        newIndex = index;
        cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, oldIndex, newIndex))
          .get('@tabsButtons')
          .eq(newIndex)
          .click();
        checkTabActive(newIndex);
      });
    });


    describe(`Keyboard interactions`, () => {
      it(`Should select previous tab, or last tab if first tab active, when UP pressed`, () => {
        let newIndex = 0;
        const tabSequence = [2, 1, 0];
        tabSequence.forEach((index) => {
          const oldIndex = newIndex;
          newIndex = index;
          cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, oldIndex, newIndex))
            .get('@tabsButton1')
            .focus()
            .type('{upArrow}');
          checkTabActive(newIndex);
        });
      });


      it(`Should select next tab, or first tab if last tab active, when DOWN pressed`, () => {
        let newIndex = 0;
        const tabSequence = [1, 2, 0];
        tabSequence.forEach((index) => {
          const oldIndex = newIndex;
          newIndex = index;
          cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, oldIndex, newIndex))
            .get('@tabsButton1')
            .focus()
            .type('{downArrow}');
          checkTabActive(newIndex);
        });
      });


      it(`Should select the first or last tab when HOME or END pressed`, () => {
        cy.get('@tabsButton1')
          .focus()
          .type('{end}');
        checkTabActive(2);

        cy.get('@tabsButton1')
          .focus()
          .type('{home}');
        checkTabActive(0);
      });


      it(`Should not change tab when LEFT or RIGHT pressed`, () => {
        cy.get('@tabsButton1').type('{leftArrow}');
        checkTabActive(0);

        cy.get('@tabsButton1').type('{rightArrow}');
        checkTabActive(0);
      });
    });
  });


  context(`Custom events Tabs`, () => {
    const TABS_ID = IDS.CUSTOM_EVENTS_TABS;


    beforeEach(() => {
      tabsBeforeEach(TABS_ID);

      cy.get(`#${IDS.PREV_TAB_BTN}`)
        .as('prevTabBtn')
        .get(`#${IDS.NEXT_TAB_BTN}`)
        .as('nextTabBtn')
        .get(`#${IDS.SET_TAB_FORM}`)
        .as('setTabForm')
        .find('input')
        .as('setTabInput');
    });


    it(`Should initialise correctly`, () => tabsInitChecks(TABS_ID));


    it('Should respond correctly when SET_PREV_TAB and SET_NEXT_TAB custom events dispatched', () => {
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, 0, 1))
        .get('@nextTabBtn')
        .click()
        .click()
        .click();
      checkTabActive(3);

      cy.get('@prevTabBtn')
        .click()
        .click();
      checkTabActive(1);
    });


    it('Should respond correctly when SET_TAB custom event dispatched', () => {
      const newIndex = 2;
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, 0, newIndex))
        .get('@setTabInput')
        .focus()
        .type(newIndex + 1)
        .get('@setTabForm')
        .submit();
      checkTabActive(newIndex);
    });
  });
});
