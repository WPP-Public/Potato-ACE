import {ATTRS, DISCLOSURE, EVENTS} from './disclosure';


const IDS = {
  CUSTOM_EVENTS_DISCLOSURE: 'custom-events-disclosure',
  HIDE_BTN: 'custom-events-hide-btn',
  INIT_VISIBLE_DISCLOSURE: 'initially-visible-disclosure',
  SHOW_BTN: 'custom-events-show-btn',
  SIMPLE_DISCLOSURE: 'simple-disclosure',
  TOGGLE_BTN: 'custom-events-toggle-btn',
};


const getEls = (id) => {
  return cy.get(`#${id}`)
    .as('disclosure')
    .get(`[${ATTRS.TRIGGER}="${id}"]`)
    .as('disclosureTriggers');
};


const initChecks = (visible) => {
  const visibleString = visible.toString();

  return cy.get('@disclosure')
    .then(($disclosure) => {
      cy.wrap($disclosure)
        .should('have.attr', ATTRS.VISIBLE, visibleString)
        .get('@disclosureTriggers')
        .each($trigger => {
          cy.wrap($trigger)
            .should('have.attr', 'aria-controls', $disclosure.attr('id'))
            .and('have.attr', 'aria-expanded', visibleString);
        });
    });
};


const checkDislosureState = (visible) => {
  const visibleString = visible.toString();
  return cy.get('@disclosure')
    .should('have.attr', ATTRS.VISIBLE, visibleString)
    .get('@disclosureTriggers')
    .each($trigger => {
      cy.wrap($trigger).should('have.attr', 'aria-expanded', visibleString);
    });
};


context(`Disclosure`, () => {
  before(() => cy.visit(`/disclosure`));


  it(`Disclosure without ID should initialise with an ID`, () => {
    cy.get(DISCLOSURE)
      .first()
      .should('have.id', `${DISCLOSURE}-1`);
  });


  context(`Basic Disclosure`, () => {
    const ID = IDS.SIMPLE_DISCLOSURE;


    beforeEach(() => getEls(ID));


    it(`Should initialise correctly`, () => initChecks(false));


    it(`Toggle triggers should toggle Disclosure and update all it's triggers`, () => {
      let expectedDetail = {
        id: ID,
        visible: true,
      };
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail);


      // Check that disclosure's first toggle trigger toggles it
      cy.get('@disclosureTriggers')
        .first()
        .click();
      checkDislosureState(true);

      // Check that other disclosure is not affected
      cy.get(`#${IDS.INIT_VISIBLE_DISCLOSURE}`)
        .as('anotherDisclosure')
        .should('have.attr', ATTRS.VISIBLE, 'true')
        .get(`[${ATTRS.TRIGGER}="${IDS.INIT_VISIBLE_DISCLOSURE}"]`)
        .as('anotherDisclosureTriggers')
        .each($trigger => {
          cy.wrap($trigger).should('have.attr', 'aria-expanded', 'true');
        });

      expectedDetail = {
        id: ID,
        visible: false,
      };
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail);

      // Check that disclosure's second toggle trigger toggles it
      cy.get('@disclosureTriggers')
        .eq(1)
        .click();
      checkDislosureState(false);

      // Check that other disclosure is not affected
      cy.get('@anotherDisclosure')
        .should('have.attr', ATTRS.VISIBLE, 'true')
        .get('@anotherDisclosureTriggers')
        .each($trigger => {
          cy.wrap($trigger).should('have.attr', 'aria-expanded', 'true');
        });
    });
  });


  context(`Initially visible Disclosure`, () => {
    const ID = IDS.INIT_VISIBLE_DISCLOSURE;


    beforeEach(() => getEls(ID));


    it(`Should initialise correctly`, () => initChecks(true));


    it(`Toggle triggers should toggle Disclosure and update all its triggers`, () => {
      // Check that disclosure's first toggle trigger toggles it
      cy.get('@disclosureTriggers')
        .first()
        .click();
      checkDislosureState(false);

      // Check that other disclosure not affected
      cy.get(`#${IDS.SIMPLE_DISCLOSURE}`)
        .as('anotherDisclosure')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .get(`[${ATTRS.TRIGGER}="${IDS.SIMPLE_DISCLOSURE}"]`)
        .as('anotherDisclosureTriggers')
        .each($trigger => {
          cy.wrap($trigger).should('have.attr', 'aria-expanded', 'false');
        })

      // Check that disclosure's second toggle trigger toggles it
        .get('@disclosureTriggers')
        .eq(1)
        .click();
      checkDislosureState(true);

      // Check that other disclosure not affected
      cy.get('@anotherDisclosure')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .get('@anotherDisclosureTriggers')
        .each($trigger => {
          cy.wrap($trigger).should('have.attr', 'aria-expanded', 'false');
        });
    });


    it(`Show and Hide triggers should only show and only hide Disclosure`, () => {
      cy.get(`[${ATTRS.TRIGGER}="${ID}"][${ATTRS.TRIGGER_SHOW}]`)
        .as('disclosureShowTrigger')
        .get(`[${ATTRS.TRIGGER}="${ID}"][${ATTRS.TRIGGER_HIDE}]`)
        .as('disclosureHideTrigger')
        .click()
        .get('@disclosure')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .get('@disclosureHideTrigger')
        .click()
        .get('@disclosure')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .get('@disclosureShowTrigger')
        .click()
        .get('@disclosure')
        .should('have.attr', ATTRS.VISIBLE, 'true')
        .get('@disclosureShowTrigger')
        .click()
        .get('@disclosure')
        .should('have.attr', ATTRS.VISIBLE, 'true');
    });
  });


  it(`Disclosure should respond to custom events correctly`, () => {
    cy.get(`#${IDS.CUSTOM_EVENTS_DISCLOSURE}`)
      .as('disclosure')
      .get(`#${IDS.SHOW_BTN}`)
      .as('showBtn')
      .get(`#${IDS.HIDE_BTN}`)
      .as('hideBtn')
      .get(`#${IDS.TOGGLE_BTN}`)
      .as('toggleBtn')
      // Test Show button
      .get('@showBtn')
      .click()
      .get('@disclosure')
      .should('have.attr', ATTRS.VISIBLE, 'true')
      .get('@showBtn')
      .click()
      .get('@disclosure')
      .should('have.attr', ATTRS.VISIBLE, 'true')
      // Test hide button
      .get('@hideBtn')
      .click()
      .get('@disclosure')
      .should('have.attr', ATTRS.VISIBLE, 'false')
      .get('@hideBtn')
      .click()
      .get('@disclosure')
      .should('have.attr', ATTRS.VISIBLE, 'false')
      // Test toggle button
      .get('@toggleBtn')
      .click()
      .get('@disclosure')
      .should('have.attr', ATTRS.VISIBLE, 'true')
      .get('@toggleBtn')
      .click()
      .get('@disclosure')
      .should('have.attr', ATTRS.VISIBLE, 'false');
  });
});
