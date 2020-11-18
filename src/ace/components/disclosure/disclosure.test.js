import {ATTRS, DISCLOSURE, EVENTS} from './disclosure';


const IDS = {
  CUSTOM_EVENTS_DISCLOSURE: 'custom-events-disclosure',
  INIT_VISIBLE_DISCLOSURE: 'initially-visible-disclosure',
  SIMPLE_DISCLOSURE: 'simple-disclosure',
  TOGGLE_CUSTOM_EVENT_BTN: 'toggle-custom-event-btn',
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


  it(`Should initialise with an ID even if one not provided`, () => {
    cy.get(DISCLOSURE)
      .first()
      .should('have.id', `${DISCLOSURE}-1`);
  });


  context(`Simple Disclosure`, () => {
    const ID = IDS.SIMPLE_DISCLOSURE;


    beforeEach(() => getEls(ID));


    it(`Should initialise correctly`, () => initChecks(false));


    it(`Should only toggle its own visibility and update all of it's own triggers when any toggle trigger clicked`, () => {
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


    it(`Should change visibility when observed attribute changed`, () => {
      let expectedDetail = {
        id: ID,
        visible: true,
      };
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail);

      cy.get('@disclosure')
        .invoke('attr', ATTRS.VISIBLE, 'true')
        .get('@disclosureTriggers')
        .each(($trigger) => {
          cy.wrap($trigger).should('have.attr', 'aria-expanded', 'true');
        });

      expectedDetail = {
        id: ID,
        visible: false,
      };
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail);
      cy.get('@disclosure')
        .invoke('attr', ATTRS.VISIBLE, 'false')
        .get('@disclosureTriggers')
        .each(($trigger) => {
          cy.wrap($trigger).should('have.attr', 'aria-expanded', 'false');
        });
    });
  });


  context(`Initially visible Disclosure`, () => {
    const ID = IDS.INIT_VISIBLE_DISCLOSURE;


    beforeEach(() => getEls(ID));


    it(`Should initialise correctly`, () => initChecks(true));


    it(`Should only toggle its own visibility and update all of it's own triggers when any toggle trigger clicked`, () => {
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


    it(`Should only show or only hide itself only and update all of it's own triggers when show or hide trigger clicked, repectively`, () => {
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


    it(`Should change visibility when observed attribute changed`, () => {
      let expectedDetail = {
        id: ID,
        visible: false,
      };
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail);

      cy.get('@disclosure')
        .invoke('attr', ATTRS.VISIBLE, 'false')
        .get('@disclosureTriggers')
        .each(($trigger) => {
          cy.wrap($trigger).should('have.attr', 'aria-expanded', 'false');
        });

      expectedDetail = {
        id: ID,
        visible: true,
      };
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail);
      cy.get('@disclosure')
        .invoke('attr', ATTRS.VISIBLE, 'true')
        .get('@disclosureTriggers')
        .each(($trigger) => {
          cy.wrap($trigger).should('have.attr', 'aria-expanded', 'true');
        });
    });
  });


  it(`Should toggle visibility when toggle custom event dispatched on it`, () => {
    cy.get(`#${IDS.CUSTOM_EVENTS_DISCLOSURE}`)
      .as('disclosure')
      .get(`#${IDS.TOGGLE_CUSTOM_EVENT_BTN}`)
      .as('toggleBtn')
      .click()
      .get('@disclosure')
      .should('have.attr', ATTRS.VISIBLE, 'true')
      .get('@toggleBtn')
      .click()
      .get('@disclosure')
      .should('have.attr', ATTRS.VISIBLE, 'false');
  });
});
