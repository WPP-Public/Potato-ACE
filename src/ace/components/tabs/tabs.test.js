import {ATTRS, EVENTS, TABS} from './tabs';


const IDS = {
  BASIC: 'ace-tabs-basic',
  CUSTOM_EVENTS: 'ace-tabs-custom',
  NO_WRAPPING: 'ace-tabs-no-wrap',
  UPDATE_TABS: 'ace-tabs-update',
  VERTICAL: 'ace-tabs-vertical'
};


context('Tabs', () => {
  before(() => {
    cy.visit(`/tabs`);
  });


  beforeEach(() => {
    cy.get(TABS)
      .as('tabs');

    cy.get(`#${IDS.BASIC}`)
      .as('basic-tabs')
      .find(`[${ATTRS.TABLIST}]`)
      .as('basic-tabs-tablist')
      .find('button')
      .as('basic-tabs-buttons');

    cy.get(`@basic-tabs`)
      .find(`div:not([${ATTRS.TABLIST}])`)
      .as('basic-tabs-panels');

    cy.get(`#${IDS.NO_WRAPPING}`)
      .as('no-wrapping-tabs')
      .find(`[${ATTRS.TABLIST}]`)
      .as('no-wrapping-tabs-tablist')
      .find('button')
      .as('no-wrapping-tabs-buttons');

    cy.get(`@no-wrapping-tabs`)
      .find(`div:not([${ATTRS.TABLIST}])`)
      .as('no-wrapping-tabs-panels');


    cy.get(`#${IDS.VERTICAL}`)
      .as('vertical-tabs')
      .find(`[${ATTRS.TABLIST}]`)
      .as('vertical-tabs-tablist')
      .find('button')
      .as('vertical-tabs-buttons');

    cy.get(`@vertical-tabs`)
      .find(`div:not([${ATTRS.TABLIST}])`)
      .as('vertical-tabs-panels');

    cy.get(`#${IDS.CUSTOM_EVENTS}`)
      .as('custom-tabs')
      .find(`[${ATTRS.TABLIST}]`)
      .as('custom-tabs-tablist')
      .find('button')
      .as('custom-tabs-buttons');

    cy.get(`@custom-tabs`)
      .find(`div:not([${ATTRS.TABLIST}])`)
      .as('custom-tabs-panels');

    cy.get(`#${IDS.UPDATE_TABS}`)
      .as('update-tabs')
      .find(`[${ATTRS.TABLIST}]`)
      .as('update-tabs-tablist')
      .find('button')
      .as('update-tabs-buttons');

    cy.get(`@update-tabs`)
      .find(`div:not([${ATTRS.TABLIST}])`)
      .as('update-tabs-panels');
  });


  describe('Initialisation', () => {
    it('All tabs should have IDs', () => {
      cy.get('@tabs').each(tabs => {
        cy.get(tabs).should('have.attr', 'id');
      });
    });


    it('Tabs should initialise with correct attributes', () => {
      cy.get('@basic-tabs-tablist')
        .should('have.attr', 'role', 'tablist')
        .should('have.attr', 'aria-label', 'ace-tabs-basic-tablist')
        .should('have.attr', 'aria-orientation', 'horizontal');

      cy.get('@basic-tabs-buttons').each((tab, index) => {
        cy.get(tab)
          .should('have.attr', 'role', 'tab')
          .should('have.attr', 'aria-controls', `ace-tabs-basic-panel-${index + 1}`);

        if (index === 0) {
          cy.get(tab)
            .should('have.attr', 'aria-selected', 'true');
        } else {
          cy.get(tab)
            .should('have.attr', 'aria-selected', 'false');
        }
      });

      cy.get('@basic-tabs-panels').each((panel, index) => {
        cy.get(panel)
          .should('have.attr', 'aria-labelledby', `ace-tabs-basic-tab-${index + 1}`);
      });
    });

    it('Vertical tabs should initialise with correct attributes', () => {
      cy.get('@vertical-tabs-tablist')
        .should('have.attr', 'role', 'tablist')
        .should('have.attr', 'aria-label', 'vertical-tabs-tablist')
        .should('have.attr', 'aria-orientation', 'vertical');

      cy.get('@vertical-tabs-buttons').each((tab, index) => {
        cy.get(tab)
          .should('have.attr', 'role', 'tab')
          .should('have.attr', 'aria-controls', `ace-tabs-vertical-panel-${index + 1}`);

        if (index === 0) {
          cy.get(tab)
            .should('have.attr', 'aria-selected', 'true');
        } else {
          cy.get(tab)
            .should('have.attr', 'aria-selected', 'false');
        }
      });

      cy.get('@vertical-tabs-panels').each((panel, index) => {
        cy.get(panel)
          .should('have.attr', 'aria-labelledby', `ace-tabs-vertical-tab-${index + 1}`);
      });
    });
  });


  describe('Mouse interaction', () => {
    beforeEach(() => {
      cy.reload();
    });

    it('should activate a tab when clicked', () => {
      cy.get('@basic-tabs-buttons').each((tab, index) => {
        cy.get(tab).click();
        // Tab should now have aria-selected = true
        cy.get(tab).should('have.attr', 'aria-selected', 'true');
        // Panel associated with tab should have ace-tab-visible = true
        cy.get(`#${IDS.BASIC}-panel-${index + 1}`).should('have.attr', ATTRS.VISIBLE, 'true');
      });
    });
  });


  describe('Keyboard interaction', () => {
    beforeEach(() => {
      cy.reload();
    });


    it('should select the next tab when the right arrow is pressed', () => {
      cy.get('@basic-tabs-buttons')
        .first()
        .click()
        .type('{rightArrow}')
        .should('have.attr', 'aria-selected', 'false');
      // Second tab should now be selected
      cy.get('@basic-tabs-buttons')
        .eq(1)
        .should('have.attr', 'aria-selected', 'true');
    });

    it('should select the previous tab when the left arrow is pressed', () => {
      cy.get('@basic-tabs-buttons')
        .eq(1)
        .click()
        .type('{leftArrow}')
        .should('have.attr', 'aria-selected', 'false');
      // First tab should now be selected
      cy.get('@basic-tabs-buttons')
        .first()
        .should('have.attr', 'aria-selected', 'true');
    });

    it('should select the next tab when the down arrow is pressed in a vertical tablist', () => {
      cy.get('@vertical-tabs-buttons')
        .first()
        .click()
        .type('{downArrow}')
        .should('have.attr', 'aria-selected', 'false');
      // Second tab should now be selected
      cy.get('@vertical-tabs-buttons')
        .eq(1)
        .should('have.attr', 'aria-selected', 'true');
    });

    it('should select the previous tab when the up arrow is pressed in a vertical tablist', () => {
      cy.get('@vertical-tabs-buttons')
        .eq(1)
        .click()
        .type('{upArrow}')
        .should('have.attr', 'aria-selected', 'false');
      // First tab should now be selected
      cy.get('@vertical-tabs-buttons')
        .first()
        .should('have.attr', 'aria-selected', 'true');
    });

    it('should not select the next tab when the right arrow is pressed on last tab with no wrapping', () => {
      cy.get('@no-wrapping-tabs-buttons')
        .last()
        .click()
        .type('{rightArrow}')
        .should('have.attr', 'aria-selected', 'true');
      // First tab should not be selected
      cy.get('@no-wrapping-tabs-buttons')
        .first()
        .should('have.attr', 'aria-selected', 'false');
    });

    it('should not select the prev tab when the right arrow is pressed on first tab with no wrapping', () => {
      cy.get('@no-wrapping-tabs-buttons')
        .first()
        .click()
        .type('{leftArrow}')
        .should('have.attr', 'aria-selected', 'true');
      // Last tab should not be selected
      cy.get('@no-wrapping-tabs-buttons')
        .last()
        .should('have.attr', 'aria-selected', 'false');
    });

    it('should select the first tab when the home key is pressed', () => {
      cy.get('@basic-tabs-buttons')
        .last()
        .click()
        .type('{home}')
        .should('have.attr', 'aria-selected', 'false');
      // Second tab should now be selected
      cy.get('@basic-tabs-buttons')
        .first()
        .should('have.attr', 'aria-selected', 'true');
    });

    it('should select the last tab when the end key is pressed', () => {
      cy.get('@basic-tabs-buttons')
        .first()
        .click()
        .type('{end}')
        .should('have.attr', 'aria-selected', 'false');
      // Second tab should now be selected
      cy.get('@basic-tabs-buttons')
        .last()
        .should('have.attr', 'aria-selected', 'true');
    });
  });
});
