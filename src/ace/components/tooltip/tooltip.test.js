import {ATTRS, EVENTS, TOOLTIP} from './tooltip';


const IDS = {
  CUSTOM_EVENT_HIDE_BTN: 'custom-event-hide-btn',
  CUSTOM_EVENT_SHOW_BTN: 'custom-event-show-btn',
  CUSTOM_EVENT_TOOLTIP: 'custom-event-triggered-tooltip',
  TOOLTIP_1: 'tooltip-1',
  TOOLTIP_2: 'tooltip-2',
};


context('Tooltip', () => {
  before(() => {
    cy.visit('/tooltip');
  });

  beforeEach(() => {
    // Get tooltips
    cy.get(`#${IDS.TOOLTIP_1}`).as('tooltip1');
    cy.get(`#${IDS.TOOLTIP_2}`).as('tooltip2');

    // Get tooltip triggers
    cy.get(`[${ATTRS.TRIGGER}="${IDS.TOOLTIP_1}"]`).as('tooltip1Triggers');
    cy.get(`[${ATTRS.TRIGGER}="${IDS.TOOLTIP_2}"]`).as('tooltip2Triggers');
  });

  describe('Initialisation', () => {
    it('Tooltips should initialise with correct attributes', () => {
      cy.get(TOOLTIP).each(tooltip => {
        cy.get(tooltip).should('have.attr', ATTRS.VISIBILITY).then((visible) => {
          if (visible === 'true') {
            cy.get(tooltip)
              .should('have.attr', ATTRS.VISIBILITY, 'true')
              .and('not.have.css', 'display', 'none');
          } else {
            cy.get(tooltip)
              .should('have.attr', ATTRS.VISIBILITY, 'false')
              .and('have.css', 'display', 'none');
          }
        });
      });
    });
  });
});
