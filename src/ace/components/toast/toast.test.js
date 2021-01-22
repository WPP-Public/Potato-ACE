import {DEFAULT_SHOW_TIME, ATTRS, EVENTS, TOAST} from './toast';


const IDS = {
  LONG_SHOW_TIME_TOAST: 'ace-toast-2',
  SIMPLE_TOAST: 'ace-toast-1',
  SIMPLE_TOAST_BTN: 'simple-toast-btn',
  LONG_SHOW_TIME_TOAST_BTN: 'long-show-time-toast-btn',
};


const toastInitChecks = () => {
  return cy.get('@toast')
    .should('have.attr', ATTRS.VISIBLE, 'false')
    .should('have.attr', 'aria-live', 'polite')
    .should('have.attr', 'role', 'status');
};


context(`Toast`, () => {
  before(() => cy.visit(`/toast`));


  it(`Toast without ID should initialise with an ID`, () => {
    cy.get(TOAST)
      .first()
      .should('have.id', `${TOAST}-1`);
  });


  context(`Simple Toast`, () => {
    const TOAST_ID = IDS.SIMPLE_TOAST;


    beforeEach(() => cy.get(`#${TOAST_ID}`).as('toast'));


    it(`Should initialise correctly`, () => toastInitChecks());


    it(`Should show when attribute ace-toast-visible is set to 'true' and hide after default show time`, () => {
      let expectedDetail = {
        [EVENTS.DETAIL_PROPS.VISIBLE]: true,
        id: TOAST_ID,
      };
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail)
        .get('@toast')
        .invoke('attr', ATTRS.VISIBLE, 'true')
        .then(() => {
          expectedDetail = {
            [EVENTS.DETAIL_PROPS.VISIBLE]: false,
            id: TOAST_ID,
          };
          cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail)
            .wait(DEFAULT_SHOW_TIME)
            .get('@toast')
            .should('have.attr', ATTRS.VISIBLE, 'false')
        });
    });
  });


  context(`Long delay time Toast`, () => {
    const TOAST_ID = IDS.LONG_SHOW_TIME_TOAST;


    beforeEach(() => cy.get(`#${TOAST_ID}`).as('toast'));


    it(`Should initialise correctly`, () => toastInitChecks());


    it(`Should show when attribute ace-toast-visible is set to 'true' and hide after specified show time`, () => {
      let expectedDetail = {
        [EVENTS.DETAIL_PROPS.VISIBLE]: true,
        id: TOAST_ID,
      };
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail)
        .get('@toast')
        .invoke('attr', ATTRS.SHOW_TIME)
        .then((showTime) => {
          cy.get('@toast')
            .invoke('attr', ATTRS.VISIBLE, 'true')
            .then(() => {
              expectedDetail = {
                [EVENTS.DETAIL_PROPS.VISIBLE]: false,
                id: TOAST_ID,
              };
              cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail)
                .wait(+showTime)
                .get('@toast')
                .should('have.attr', ATTRS.VISIBLE, 'false')
            });
        })

    });
  });
});
