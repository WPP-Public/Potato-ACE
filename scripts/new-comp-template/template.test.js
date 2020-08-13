// TODO: Remove 'TODO:' comments
// TODO: Remove ATTRS and/or EVENTS if not used
import {ATTRS, EVENTS, TEMPLATE} from './template-kebab';


// TODO: Add IDs used to find elements here
const IDS = {
  BASIC_TEMPLATE: 'basic-template',
  CUSTOM_EVENTS_TEMPLATE: 'custom-events-template',
  CUSTOM_EVENT_BTN: 'custom-event-1-btn',
};


// TODO: Define templateBeforeEach function that will get Template's elements to be tested in most tests.
// Use combinations of `.get()`, `.find()`, `.first()`, `.last()` and `.eq()`, and store them as aliases using `.as`
// Call this function in the beforeEach of each variant test block giving it the variant ID, as shown below.
const getEls = (id) => {
  return cy.get(`#${id}`)
    .as('template')
    .find('foo')
    .as('templateFoo')
    .find('bars')
    .as('templateBars')
    .first()
    .as('templateBar1')
    .get('@template')
    .find('baz')
    .as('templateBaz');
};


// TODO: Define set of assertions that indicate that Template initialised correctly
const templateInitChecks = (id) => {
  const FOO_ID = `${id}-foo`;
  const BAZ_ID = `${id}-baz`;

  return cy.get('@template')
    .should('have.id', id)
    .get('@templateFoo')
    .should('have.id', FOO_ID)
    .and('have.attr', ATTRS.FOO, '')
    .and('have.attr', 'aria-owns', BAZ_ID)
    .get('@templateBars')
    .each(($bar, index) => {
      const selected = index === 0 ? 'true' : 'false';
      cy.wrap($bar)
        .should('have.id', `${id}-bar-${index + 1}`)
        .and('have.attr', ATTRS.BAR, '')
        .and('have.attr', 'aria-selected', selected);
    })
    .get('@templateBaz')
    .should('have.id', BAZ_ID)
    .and('have.attr', ATTRS.BAZ, '')
    .and('have.attr', 'aria-describedby', FOO_ID)
    .and('not.have.attr', ATTRS.ACTIVE_BAZ);
};



// TODO: If there are sets of assertions you make a lot then define them in functions
const setOfAssertions = () => {
  return cy.get('@templateFoo')
    .should('have.attr', ATTRS.SOME_ATTR, 'true')
    .and('have.attr', 'aria-selected', 'true')
    .get('@templateBaz')
    .should('have.attr', ATTRS.SOME_OTHER_ATTR, '');
};



context(`Template`, () => {
  before(() => cy.visit(`/template-kebab`));


  // TODO: test that at least one Template without an ID will be automatically given one by the autoID function
  it(`Template without ID should initialise with an ID`, () => {
    cy.get(TEMPLATE)
      .first()
      .should('have.id', `${TEMPLATE}-1`);
  });


  // TODO: Group tests for different variants together using `context`
  context(`Basic Template`, () => {
    const TEMPLATE_ID = IDS.BASIC_TEMPLATE;


    beforeEach(() => getEls(TEMPLATE_ID));


    // TODO: Check that Template and children initialise with correct IDs and a11y attributes
    it(`Should initialise correctly`, () => templateInitChecks());


    // TODO: Undo effects of test, resetting components to initial state, either at the end of each test or in the
    // `beforeEach()`.
    it(`Should do something else`, () => {
      // TODO: If test results in Template dispatching a custom event, add listener to check custom event dispatched correctly
      const expectedDetail = {
        foo: 'bar',
        id: TEMPLATE_ID,
      };
      cy.addCustomEventListener(EVENTS.OUT.SOME_EVENT, expectedDetail);

      cy.get('@templateFoo').click();
      setOfAssertions();

      // TODO: Undo effects of test, resetting components to initial state, e.g.
      cy.get('@templateFoo')
        .click()
        .blur();
    });


    describe(`Mouse interactions`, () => {
      // TODO: Group mouse interaction tests together here
    });


    describe(`Keyboard interactions`, () => {
      // TODO: Group keyboard interaction tests together here
    });


    // TODO: Group other similar tests together
  });


  context(`Custom events Template`, () => {
    const TEMPLATE_ID = IDS.CUSTOM_EVENTS_TEMPLATE;


    beforeEach(() => {
      getEls(TEMPLATE_ID);
      // TODO: Check attributes that are unique to this variant
      cy.get('@template').should('have.attr', ATTRS.VARIANT_ATTR, '');
      cy.get(`#${IDS.CUSTOM_EVENT_BTN}`).as('customEventBtn');
    });


    // TODO: Test dispatched custom events
    it(`Dipatching custom event 1 should lead to something`, () => {
      // TODO: Perform action that dispatches custom event
      cy.get('@customEvent1Btn')
        .click()
        // TODO: Check that custom event results in expected behaviour
        .get('@customEventTemplate').should('have.attr', ATTRS.CUSTOM_EVENT_TRIGGERED, '');

      // TODO: Undo effects of test, resetting components to initial state
    });
  });
});
