import {ATTRS, EVENTS} from './modal';


const IDS = {
  MODAL_FROM_MODAL: 'modal-from-modal',
  SIMPLE_MODAL: 'simple-modal',
};


const getEls = (id) => {
  cy.get(`#${id}`)
    .as('modal')
    .find(`[${ATTRS.HIDE_BTN}]`)
    .as('modalHideBtn')
    .get(`[${ATTRS.TRIGGER}="${id}"]`)
    .as('modalTriggers')
    .get(`[${ATTRS.BACKDROP}]`)
    .as('modalBackdrop');
};


const initChecks = () => {
  return cy.get('@modal')
    .should('have.attr', 'aria-modal', 'true')
    .and('have.attr', 'role', 'dialog')
    .invoke('attr', ATTRS.VISIBLE)
    .then((visibleString) => {
      const visible = visibleString === '';
      cy.get('body')
        .should(`${visible ? '' : 'not.'}have.attr`, ATTRS.IS_VISIBLE)
        .get('@modalBackdrop')
        .should(`${visible ? '' : 'not.'}have.attr`, ATTRS.IS_VISIBLE);
    });
};


const checkModalState = (visible) => {
  cy.get('@modal')
    .should(`${visible ? '' : 'not.'}have.attr`, ATTRS.VISIBLE)
    .get('body')
    .should(`${visible ? '' : 'not.'}have.attr`, ATTRS.IS_VISIBLE)
    .get('@modalBackdrop')
    .should(`${visible ? '' : 'not.'}have.attr`, ATTRS.IS_VISIBLE);
  if (visible) {
    cy.get('@modalHideBtn').should(`have.focus`);
  }
};


context(`Modal`, () => {
  before(() => cy.visit(`/modal`));


  context(`Simple Modal`, () => {
    const ID = IDS.SIMPLE_MODAL;


    beforeEach(() => getEls(ID));


    it(`Should initialise correctly`, () => {
      cy.get('@modal').should('have.attr', ATTRS.VISIBLE, '');
      initChecks();
    });


    it(`Should be hidden or shown in response to observed attribute changes`, () => {
      // Check that Modal hidden when observed attribute removed
      let visible = false;
      let expectedDetail = {
        id: ID,
        visible: visible,
      };
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail)
        .get('@modal')
        .invoke('removeAttr', ATTRS.VISIBLE);
      checkModalState(visible);

      // Check that Modal shown when observed attribute re-added
      visible = true;
      expectedDetail = {
        id: ID,
        visible: visible,
      };
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail)
        .get('@modal')
        .invoke('attr', ATTRS.VISIBLE, '');
      checkModalState(visible);
    });


    it(`Should be hidden when it's hide button clicked and become visible when any of it's triggers clicked`, () => {
      // Check that Modal hidden by hide button
      let visible = false;
      let expectedDetail = {
        id: ID,
        visible: visible,
      };
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail)
        .get('@modalHideBtn')
        .click();
      checkModalState(visible);


      // Check that Modal shown by trigger button
      visible = true;
      expectedDetail = {
        id: ID,
        visible: visible,
      };
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail);
        cy.get('@modalTriggers')
        .eq(0)
        .click()
        .get(`#${IDS.MODAL_FROM_MODAL}`)
        .should('not.have.attr', ATTRS.VISIBLE);
      checkModalState(visible);

      // Check that focus is returned to trigger after Modal hidden
      cy.get('@modal')
        .invoke('removeAttr', ATTRS.VISIBLE)
        .get('@modalTriggers')
        .eq(0)
        .should('have.focus')

      // Check second trigger shows Modal
        .get('@modalTriggers')
        .eq(1)
        .click()
        .get(`#${IDS.MODAL_FROM_MODAL}`)
        .should('not.have.attr', ATTRS.VISIBLE);
      checkModalState(visible);

      // Check that focus is returned to trigger after Modal hidden
      cy.get('@modal')
        .invoke('removeAttr', ATTRS.VISIBLE)
        .get('@modalTriggers')
        .eq(1)
        .should('have.focus')
        .click();
    });


    it(`Should be hidden when backdrop clicked`, () => {
      // Check that Modal hidden by clicking on backdrop
      const visible = false;
      const expectedDetail = {
        id: ID,
        visible: visible,
      };
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail)
        .get('@modalBackdrop')
        .click({force: true});
      checkModalState(visible);

      // Reset state
      cy.get('@modalTriggers')
        .eq(0)
        .click();
    });


    it(`Should be hidden when ESC key pressed`, () => {
      // Check that Modal hidden by clicking on backdrop
      const visible = false;
      const expectedDetail = {
        id: ID,
        visible: visible,
      };
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail)
        .get('@modalHideBtn')
        .type('{esc}');
      checkModalState(visible);

      // Reset state
      cy.get('@modalTriggers')
        .eq(0)
        .click();
    });
  });


  context(`Modal that opens another Modal`, () => {
    const ID = IDS.MODAL_FROM_MODAL;


    beforeEach(() => {
      cy.get(`#${IDS.SIMPLE_MODAL}`)
        .as('simpleModal')
        .invoke('removeAttr', ATTRS.VISIBLE);
      getEls(ID);
    });


    it(`Should initialise correctly`, () => initChecks());


    it(`Should be hidden when another Modal is triggered from it`, () => {
      // Check that Modal is shown when trigger clicked
      const visible = true;
      const expectedDetail = {
        id: ID,
        visible: visible,
      };
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail)
        .get('@modalTriggers')
        .eq(0)
        .click()
        .get('@simpleModal')
        .should('not.have.attr', ATTRS.VISIBLE);
      checkModalState(visible);

      cy.get('@modal')
        .find(`[${ATTRS.TRIGGER}="${IDS.SIMPLE_MODAL}"]`)
        .click()
        .get('@modal')
        .should('not.have.attr', ATTRS.VISIBLE)
        .get('@simpleModal')
        .should('have.attr', ATTRS.VISIBLE, '')
        .get('body')
        .should('have.attr', ATTRS.IS_VISIBLE, '')
        .get('@modalBackdrop')
        .should('have.attr', ATTRS.IS_VISIBLE, '');
    });
  });
});
