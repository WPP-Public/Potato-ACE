import {ATTRS, EVENTS, TABS} from './tabs';


const IDS = {
  ADD_TAB_BTN: 'add-tab-btn',
  SIMPLE_TABS: `${TABS}-1`,
  CUSTOM_EVENTS_TABS: 'custom-events-tabs',
  DEEP_LINKED_INITIALLY_SET_TABS: 'deep-linked-tabs-2',
  DEEP_LINKED_TABS: 'deep-linked-tabs-1',
  DYNAMIC_TABS: 'dynamic-tabs',
  INFINITE_TABS: 'infinite-tabs',
  MANUAL_TABS: 'manual-tabs',
  NEXT_TAB_BTN: 'next-tab-btn',
  PREV_TAB_BTN: 'prev-tab-btn',
  REMOVE_TAB_BTN: 'remove-tab-btn',
  SET_TAB_FORM: 'set-tab-form',
  VERTICAL_TABS: 'vertical-tabs',
};


const tabsBeforeEach = (id) => {
  return cy.get(`#${id}`)
    .as('tabs')
    .find(`div:not(:first-child)`)
    .as('tabsPanels')
    .get('@tabs')
    .find(`[${ATTRS.TABLIST}]`)
    .as('tabsTablist')
    .find('button')
    .as('tabsButtons')
    .first()
    .as('tabsButton1')

    // Reset state before test
    .get('@tabsButtons')
    .eq(id === IDS.INFINITE_TABS ? 1 : 0)
    .click()
    .blur();
};


const tabsInitChecks = (id, selectedTabNumber=1, vertical=false) => {
  const selectedTabIndex = selectedTabNumber - 1;
  return cy.get('@tabs')
    .should('have.attr', ATTRS.SELECTED_TAB, selectedTabNumber)
    .get('@tabsTablist')
    .should('have.attr', ATTRS.TABLIST, '')
    .and(`${vertical ? '' : 'not.'}have.attr`, ATTRS.TABLIST_VERTICAL, '')
    .and('have.attr', 'aria-orientation', vertical ? 'vertical' : 'horizontal')
    .and('have.attr', 'role', 'tablist')
    .get('@tabsButtons')
    .each(($tab, index) => {
      const TAB_ID = `${id}-tab-${index + 1}`;
      const PANEL_ID = `${id}-panel-${index + 1}`;
      cy.wrap($tab)
        .should('have.attr', ATTRS.TAB, '')
        .and(`${vertical ? '' : 'not.'}have.attr`, ATTRS.TAB_VERTICAL, '')
        .and('have.attr', 'aria-controls', PANEL_ID)
        .and('have.attr', 'aria-selected', index === selectedTabIndex ? 'true' : 'false')
        .and('have.attr', 'role', 'tab')
        .and(`${index === selectedTabIndex ? 'not.' : ''}have.attr`, 'tabindex',  '-1')
        .and('have.id', TAB_ID)
        // check corresponding panel
        .get(`#${PANEL_ID}`)
        .should('have.attr', ATTRS.PANEL, '')
        .and('have.attr', 'aria-labelledby', TAB_ID)
        .and('have.attr', 'role', 'tabpanel');
    });
};


const checkTabSelected = (tabNumber) => {
  const tabIndex = tabNumber - 1;
  return cy.get('@tabsButtons')
    .each(($button, buttonIndex) => {
      cy.wrap($button)
        .should('have.attr', 'aria-selected', buttonIndex === tabIndex ? 'true' : 'false')
        .and(`${buttonIndex === tabIndex ? '' : 'not.'}have.attr`, ATTRS.TAB_SELECTED, '');
        if (buttonIndex === tabIndex) {
          cy.wrap($button).should('not.have.attr', 'tabindex');
        } else {
          cy.wrap($button).should('have.attr', 'tabindex', '-1');
        }
    })
    .get('@tabsPanels')
    .each(($panel, panelIndex) => {
      cy.wrap($panel).should('have.attr', ATTRS.PANEL_VISIBLE, panelIndex === tabIndex ? 'true' : 'false');
    });
};


const getExpectedDetailObj = (id, prevTabNumber, newTabNumber) => {
  const expectedDetail = {
    currentlySelectedTab: {
      id: `${id}-tab-${newTabNumber}`,
      number: newTabNumber,
    },
    id,
    previouslySelectedTab: {
      id: `${id}-tab-${prevTabNumber}`,
      number: prevTabNumber,
    },
  };
  return expectedDetail;
};


context(`Tabs`, () => {
  before(() => cy.visit(`/tabs`));


  it(`Tabs without ID should initialise with an ID`, () => {
    cy.get(TABS)
      .first()
      .should('have.id', `${TABS}-1`);
  });


  context(`Basic Tabs`, () => {
    const TABS_ID = IDS.SIMPLE_TABS;


    beforeEach(() => tabsBeforeEach(TABS_ID));


    it(`Should initialise correctly`, () => tabsInitChecks(TABS_ID));


    it(`Should only select correct tab panel when tab button is clicked`, () => {
      let newTabNumber = 1;
      const tabSequence = [3, 1, 2];
      tabSequence.forEach((index) => {
        const oldTabNumber = newTabNumber;
        newTabNumber = index;
        cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, oldTabNumber, newTabNumber))
          .get('@tabsButtons')
          .eq(newTabNumber - 1)
          .click();
        checkTabSelected(newTabNumber);
      });
    });


    describe(`Keyboard interactions`, () => {
      beforeEach(() => {
        cy.get('@tabsButtons')
          .eq(1)
          .as('tabsButton2')
          .click();
      });


      it(`Should select previous tab when LEFT pressed`, () => {
        // Check that LEFT works
        const newTabNumber = 1;
        cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, 2, newTabNumber))
          .get('@tabsButton2')
          .focus()
          .type('{leftarrow}');
        checkTabSelected(newTabNumber);

        // Check that wrapping not working
        cy.get('@tabsButton1')
          .focus()
          .type('{leftarrow}');
        checkTabSelected(newTabNumber);
      });


      it(`Should select next tab when RIGHT pressed`, () => {
        // Check that RIGHT works
        const newTabNumber = 3;
        cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, 2, newTabNumber))
          .get('@tabsButton2')
          .focus()
          .type('{rightarrow}');
        checkTabSelected(newTabNumber);

        // Check that wrapping not working
        cy.get('@tabsButton1')
          .focus()
          .type('{rightarrow}');
        checkTabSelected(newTabNumber);
      });


      it(`Should select the first or last tab when HOME or END pressed`, () => {
        cy.get('@tabsButton1').type('{end}');
        checkTabSelected(3);

        cy.get('@tabsButton1').type('{home}');
        checkTabSelected(1);
      });
    });


    describe(`Observed attributes`, () => {
      it(`Should set correct tab when observed attribute changed`, () => {
        const tabNumber = 3;
        cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, 1, tabNumber))
          .get('@tabs')
          .invoke('attr', ATTRS.SELECTED_TAB, tabNumber);
        checkTabSelected(tabNumber);

        cy.get('@tabs').invoke('attr', ATTRS.SELECTED_TAB, 1);
      });


      it(`Should activate wrapping when observed attribute added`, () => {
        cy.get('@tabs')
          .invoke('attr', ATTRS.INFINITE, '')
          .get('@tabsButton1')
          .focus()
          .type('{leftarrow}');
        checkTabSelected(3);

        cy.get('@tabs').then($tabs => $tabs.removeAttr(ATTRS.INFINITE));
      });


      it(`Should switch orientation to vertical when observed attribute added`, () => {
        cy.get('@tabs')
          .invoke('attr', ATTRS.VERTICAL, '')
          .get('@tabsTablist')
          .should('have.attr', ATTRS.TABLIST_VERTICAL, '')
          .and('have.attr', 'aria-orientation', 'vertical')
          .get('@tabsButtons')
          .each(($tab) => {
            cy.wrap($tab).should('have.attr', ATTRS.TAB_VERTICAL, '');
          })
          .get('@tabsButton1')
          .focus()
          .type('{rightarrow}');
        checkTabSelected(1);

        cy.get('@tabsButton1').type('{downarrow}');
        checkTabSelected(2);

        cy.get('@tabs').then($tabs => $tabs.removeAttr(ATTRS.VERTICAL));
      });
    });
  });


  context(`Infinite Tabs with initially set selected tab`, () => {
    const TABS_ID = IDS.INFINITE_TABS;


    beforeEach(() => tabsBeforeEach(TABS_ID));


    it(`Should initialise correctly`, () => {
      tabsInitChecks(TABS_ID, 2);
      cy.get('@tabs').should('have.attr', ATTRS.INFINITE, '');
    });


    describe(`Keyboard interactions`, () => {
      it(`Should select previous tab, or last tab if first tab selected, when LEFT pressed`, () => {
        let newTabNumber = 2;
        const tabSequence = [1, 3, 2];
        tabSequence.forEach((index) => {
          const oldTabNumber = newTabNumber;
          newTabNumber = index;
          cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, oldTabNumber, newTabNumber))
            .get('@tabsButton1')
            .focus()
            .type('{leftarrow}');
          checkTabSelected(newTabNumber);
        });
      });


      it(`Should select next tab, or first tab if last tab selected, when RIGHT pressed`, () => {
        let newTabNumber = 2;
        const tabSequence = [3, 1, 2];
        tabSequence.forEach((index) => {
          const oldTabNumber = newTabNumber;
          newTabNumber = index;
          cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, oldTabNumber, newTabNumber))
            .get('@tabsButton1')
            .focus()
            .type('{rightarrow}');
          checkTabSelected(newTabNumber);
        });
      });
    });


    describe(`Observed attributes`, () => {
      it(`Should select correct tab when observed attribute changed`, () => {
        const tabNumber = 3;
        cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, 2, tabNumber))
          .get('@tabs')
          .invoke('attr', ATTRS.SELECTED_TAB, tabNumber);
        checkTabSelected(tabNumber);

        cy.get('@tabs').invoke('attr', ATTRS.SELECTED_TAB, 2);
      });


      it(`Should deactivate wrapping when observed attribute removed`, () => {
        cy.get('@tabs')
          .then($tabs => $tabs.removeAttr(ATTRS.INFINITE))
          .get('@tabsButton1')
          .focus()
          .type('{leftarrow}{leftarrow}');
        checkTabSelected(1);

        cy.get('@tabs').invoke('attr', ATTRS.INFINITE, '');
      });


      it(`Should switch orientation to vertical when observed attribute added`, () => {
        cy.get('@tabs')
          .invoke('attr', ATTRS.VERTICAL, '')
          .get('@tabsTablist')
          .should('have.attr', ATTRS.TABLIST_VERTICAL, '')
          .and('have.attr', 'aria-orientation', 'vertical')
          .get('@tabsButtons')
          .each(($tab) => {
            cy.wrap($tab).should('have.attr', ATTRS.TAB_VERTICAL, '');
          })
          .get('@tabsButton1')
          .focus()
          .type('{rightarrow}');
        checkTabSelected(2);

        cy.get('@tabsButton1').type('{downarrow}');
        checkTabSelected(3);

        cy.get('@tabs').then($tabs => $tabs.removeAttr(ATTRS.VERTICAL));
      });
    });
  });


  context(`Vertical Tabs`, () => {
    const TABS_ID = IDS.VERTICAL_TABS;


    beforeEach(() => tabsBeforeEach(TABS_ID));


    it(`Should initialise correctly`, () => tabsInitChecks(TABS_ID, 1, true));


    it(`Should only select correct tab panel when tab button is clicked`, () => {
      let newTabNumber = 1;
      const tabSequence = [2, 1, 3];
      tabSequence.forEach((index) => {
        const oldTabNumber = newTabNumber;
        newTabNumber = index;
        cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, oldTabNumber, newTabNumber))
          .get('@tabsButtons')
          .eq(newTabNumber - 1)
          .click();
        checkTabSelected(newTabNumber);
      });
    });


    describe(`Keyboard interactions`, () => {
      beforeEach(() => {
        cy.get('@tabsButtons')
          .eq(1)
          .as('tabsButton2')
          .click();
      });


      it(`Should select previous tab when UP pressed`, () => {
        // Check that UP works
        const newTabNumber = 1;
        cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, 2, newTabNumber))
          .get('@tabsButton2')
          .focus()
          .type('{uparrow}');
        checkTabSelected(newTabNumber);

        // Check that vertical selection buttons not working
        cy.get('@tabsButton1')
          .focus()
          .type('{uparrow}');
        checkTabSelected(newTabNumber);
      });


      it(`Should select next tab when DOWN pressed`, () => {
        // Check that DOWN works
        const newTabNumber = 3;
        cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, 2, newTabNumber))
          .get('@tabsButton2')
          .focus()
          .type('{downarrow}');
        checkTabSelected(newTabNumber);

        // Check that vertical selection buttons not working
        cy.get('@tabsButton1')
          .focus()
          .type('{downarrow}');
        checkTabSelected(newTabNumber);
      });


      it(`Should select the first or last tab when HOME or END pressed`, () => {
        cy.get('@tabsButton1')
          .focus()
          .type('{end}');
        checkTabSelected(3);

        cy.get('@tabsButton1')
          .focus()
          .type('{home}');
        checkTabSelected(1);
      });


      it(`Should not change tab when LEFT or RIGHT pressed`, () => {
        cy.get('@tabsButton1').type('{leftarrow}');
        checkTabSelected(1);

        cy.get('@tabsButton1').type('{rightarrow}');
        checkTabSelected(1);
      });
    });


    describe(`Observed attributes`, () => {
      it(`Should select correct tab when observed attribute changed`, () => {
        const tabNumber = 2;
        cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, 1, tabNumber))
          .get('@tabs')
          .invoke('attr', ATTRS.SELECTED_TAB, tabNumber);
        checkTabSelected(tabNumber);

        cy.get('@tabs').invoke('attr', ATTRS.SELECTED_TAB, 1);
      });


      it(`Should de-activate wrapping when observed attribute added`, () => {
        cy.get('@tabs')
          .invoke('attr', ATTRS.NON_WRAPPING, '')
          .get('@tabsButton1')
          .focus()
          .type('{leftarrow}');
        checkTabSelected(1);

        cy.get('@tabs').then($tabs => $tabs.removeAttr(ATTRS.NON_WRAPPING));
      });


      it(`Should switch orientation to horizontal when observed attribute removed`, () => {
        cy.get('@tabs')
          .then($tabs => $tabs.removeAttr(ATTRS.VERTICAL))
          .get('@tabsTablist')
          .should('not.have.attr', ATTRS.TABLIST_VERTICAL, '')
          .and('have.attr', 'aria-orientation', 'horizontal')
          .get('@tabsButtons')
          .each(($tab) => {
            cy.wrap($tab).should('not.have.attr', ATTRS.TAB_VERTICAL, '');
          })
          .get('@tabsButton1')
          .focus()
          .type('{downarrow}');
        checkTabSelected(1);

        cy.get('@tabsButton1').type('{rightarrow}');
        checkTabSelected(2);

        cy.get('@tabs').invoke('attr', ATTRS.VERTICAL, '');
      });
    });
  });


  context(`Manual selection Tabs`, () => {
    const TABS_ID = IDS.MANUAL_TABS;


    beforeEach(() => tabsBeforeEach(TABS_ID));


    it(`Should initialise correctly`, () => tabsInitChecks(TABS_ID));


    it(`Should only select correct tab panel when tab button is clicked`, () => {
      let newTabNumber = 1;
      const tabSequence = [3, 1, 2];
      tabSequence.forEach((index) => {
        const oldTabNumber = newTabNumber;
        newTabNumber = index;
        cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, oldTabNumber, newTabNumber))
          .get('@tabsButtons')
          .eq(newTabNumber - 1)
          .click();
        checkTabSelected(newTabNumber);
      });
    });


    it(`Should remember focussable tab after tablist loses focus`, () => {
      cy.get('@tabsButton1')
        .focus()
        .type('{leftarrow}')
        .get('@tabsPanels')
        .eq(0)
        .click()
        .get('@tabsButtons')
        .eq(2)
        .as('button3')
        .should('not.have.attr', 'tabindex')
        .get('@button3')
        .focus()
        .type('{leftarrow}')
        .get('@tabsButtons')
        .eq(1)
        .should('not.have.attr', 'tabindex');
    });


    describe(`Keyboard interactions`, () => {
      beforeEach(() => {
        cy.get('@tabsButtons')
          .eq(1)
          .as('tabsButton2')
          .get('@tabsButtons')
          .eq(2)
          .as('tabsButton3');
      });


      it(`Should activate previous and next tab without selecting them when LEFT or RIGHT is pressed`, () => {
        // Check that LEFT works
        cy.get('@tabsButton1')
          .focus()
          .type('{leftarrow}')
          .should('not.have.focus')
          .and('have.attr', ATTRS.TAB_SELECTED, '')
          .and('have.attr', 'tabindex', '-1')
          .get('@tabsButton3')
          .should('have.focus')
          .and('not.have.attr', 'tabindex')
          .get('@tabsPanels')
          .eq(0)
          .should('have.attr', ATTRS.PANEL)
          .and('not.have.attr', ATTRS.TAB_SELECTED)
          .get('@tabsButton3')
          // Check that RIGHT works
          .type('{leftarrow}{leftarrow}{rightarrow}')
          .get('@tabsButton3')
          .should('not.have.focus')
          .get('@tabsButton2')
          .should('have.focus')
          .get('@tabsButton1')
          .should('have.attr', ATTRS.TAB_SELECTED, '')
          .and('have.attr', 'tabindex', '-1')
          .should('not.have.focus');
      });


      it(`Should select active tab when when SPACE or ENTER is pressed`, () => {
        cy.get('@tabsButton2')
          .click()
          .focus()
          .type('{leftarrow} ');
        checkTabSelected(1);

        cy.get('@tabsButton1')
          .focus()
          .type('{rightarrow}{rightarrow}{enter}');
        checkTabSelected(3);
      });


      it(`Should activate the first or last tab when HOME or END pressed without selecting it`, () => {
        cy.get('@tabsButton2')
          .click()
          .type('{end}')
          .should('not.have.focus')
          .and('have.attr', ATTRS.TAB_SELECTED, '')
          .and('have.attr', 'tabindex', '-1')
          .get('@tabsPanels')
          .eq(0)
          .should('have.attr', ATTRS.PANEL)
          .and('not.have.attr', ATTRS.TAB_SELECTED)
          .get('@tabsButton3')
          .should('have.focus')
          .and('not.have.attr', 'tabindex')
          .get('@tabsButton3')
          .type('{home}')
          .should('not.have.focus')
          .and('have.attr', 'tabindex', '-1')
          .get('@tabsButton1')
          .should('have.focus')
          .and('not.have.attr', 'tabindex')
          .get('@tabsButton2')
          .should('not.have.focus')
          .and('have.attr', ATTRS.TAB_SELECTED, '')
          .and('have.attr', 'tabindex', '-1');
      });
    });


    describe(`Observed attributes`, () => {
      it(`Should set correct tab when observed attribute changed`, () => {
        const tabNumber = 3;
        cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, 1, tabNumber))
          .get('@tabs')
          .invoke('attr', ATTRS.SELECTED_TAB, tabNumber);
        checkTabSelected(tabNumber);

        cy.get('@tabs').invoke('attr', ATTRS.SELECTED_TAB, 1);
      });


      it(`Should deactivate wrapping when observed attribute removed`, () => {
        cy.get('@tabs')
          .then($tabs => $tabs.removeAttr(ATTRS.INFINITE))
          .get('@tabsButton1')
          .focus()
          .type('{leftarrow}{leftarrow}');
        checkTabSelected(1);

        cy.get('@tabs').invoke('attr', ATTRS.INFINITE, '');
      });


      it(`Should switch orientation to vertical when observed attribute added`, () => {
        cy.get('@tabs')
          .invoke('attr', ATTRS.VERTICAL, '')
          .get('@tabsTablist')
          .should('have.attr', ATTRS.TABLIST_VERTICAL, '')
          .and('have.attr', 'aria-orientation', 'vertical')
          .get('@tabsButtons')
          .each(($tab) => {
            cy.wrap($tab).should('have.attr', ATTRS.TAB_VERTICAL, '');
          })
          .get('@tabsButton1')
          .focus()
          .type('{rightarrow}');
        checkTabSelected(1);

        cy.get('@tabsButton1').type('{downarrow} ');
        checkTabSelected(2);

        cy.get('@tabs').then($tabs => $tabs.removeAttr(ATTRS.VERTICAL));
      });
    });
  });


  context(`Deep-linked Tabs`, () => {
    const TABS_1_ID = IDS.DEEP_LINKED_TABS;
    const TABS_2_ID = IDS.DEEP_LINKED_INITIALLY_SET_TABS;

    beforeEach(() => {
      tabsBeforeEach(TABS_1_ID);
      cy.get(`#${TABS_2_ID}`)
        .as('tabs2')
        .find(`[${ATTRS.TABLIST}]`)
        .as('tabs2Tablist')
        .find('button')
        .as('tabs2Buttons')
        .first()
        .as('tabs2Button1');
    });


    it(`Should update URL correctly when selected tab changes`, () => {
      tabsInitChecks(TABS_1_ID);
      cy.get('@tabsButtons')
        .eq(1)
        .click()
        .get('@tabs2Buttons')
        .eq(2)
        .click();

      cy.url()
        .should('contain', `${TABS_1_ID}=2`)
        .and('contain', `${TABS_2_ID}=3`);
    });


    it(`Selected tab is set based on the URL correctly, regardless of selected tab number attribute`, () => {
      cy.visit(`/tabs?${TABS_1_ID}=2&${TABS_2_ID}=3`)
        .get('@tabs')
        .should('have.attr', ATTRS.SELECTED_TAB, '2')
        .get('@tabs2')
        .should('have.attr', ATTRS.SELECTED_TAB, '3');
    });


    it(`Selected tab is set to first tab or tab number attribute value if search param value is invalid`, () => {
      // No values
      cy.visit(`/tabs?${TABS_1_ID}=&${TABS_2_ID}=`)
        .get('@tabs')
        .should('have.attr', ATTRS.SELECTED_TAB, '1')
        .get('@tabs2')
        .should('have.attr', ATTRS.SELECTED_TAB, '2');
      // Strings
      cy.visit(`/tabs?${TABS_1_ID}=x&${TABS_2_ID}=x`)
        .get('@tabs')
        .should('have.attr', ATTRS.SELECTED_TAB, '1')
        .get('@tabs2')
        .should('have.attr', ATTRS.SELECTED_TAB, '2');
      // Out of range values
      cy.visit(`/tabs?${TABS_1_ID}=0&${TABS_2_ID}=0`)
        .get('@tabs')
        .should('have.attr', ATTRS.SELECTED_TAB, '1')
        .get('@tabs2')
        .should('have.attr', ATTRS.SELECTED_TAB, '2');
      cy.visit(`/tabs?${TABS_1_ID}=100&${TABS_2_ID}=100`)
        .get('@tabs')
        .should('have.attr', ATTRS.SELECTED_TAB, '1')
        .get('@tabs2')
        .should('have.attr', ATTRS.SELECTED_TAB, '2');
    });
  });


  context(`Custom events Tabs`, () => {
    const TABS_ID = IDS.CUSTOM_EVENTS_TABS;

    beforeEach(() => tabsBeforeEach(TABS_ID));


    it(`Should initialise correctly`, () => tabsInitChecks(TABS_ID));


    it(`Should respond correctly when SET_PREV_TAB and SET_NEXT_TAB custom events dispatched`, () => {
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, getExpectedDetailObj(TABS_ID, 1, 2))
        .get(`#${IDS.NEXT_TAB_BTN}`)
        .click()
        .click();
      checkTabSelected(3);

      cy.get(`#${IDS.PREV_TAB_BTN}`)
        .click()
        .click()
        .click();
      checkTabSelected(1);
    });


    it(`Should update Tabs when a tab is added or removed and the UPDATE custom event is dispatched`, () => {
      // Test Tabs update properly when new tab added
      const tabNumber = 3;
      const ADDED_TAB_ID = `${TABS_ID}-tab-${tabNumber}`;
      const ADDED_PANEL_ID = `${TABS_ID}-panel-${tabNumber}`;

      cy.addCustomEventListener(EVENTS.OUT.READY, {id: TABS_ID})
        .get(`#${IDS.ADD_TAB_BTN}`)
        .click()
        // Check Panel attributes
        .get('@tabs')
        .find(`[${ATTRS.PANEL}]`)
        .eq(tabNumber - 1)
        .should('have.attr', ATTRS.PANEL_VISIBLE, 'false')
        .and('have.attr', 'aria-labelledby', ADDED_TAB_ID)
        .and('have.attr', 'role', 'tabpanel')
        .and('have.attr', 'tabIndex', '0')
        .and('have.id', ADDED_PANEL_ID)
        // Check Tab attributes
        .get('@tabs')
        .find(`[${ATTRS.TAB}]`)
        .eq(tabNumber - 1)
        .and('have.attr', 'aria-controls', ADDED_PANEL_ID)
        .and('have.attr', 'aria-selected', 'false')
        .should('have.attr', 'role', 'tab')
        .and('have.id', ADDED_TAB_ID)
        .click();
      checkTabSelected(tabNumber);

      // Test Tabs update properly when new tab removed
      cy.get(`#${IDS.REMOVE_TAB_BTN}`).click();
      checkTabSelected(tabNumber);
      cy.get('@tabsButton1')
        .focus()
        .type('{leftarrow}');
      checkTabSelected(tabNumber - 1);
    });
  });
});
