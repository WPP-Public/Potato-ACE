// TODO: Remove 'TODO:' comments
// TODO: Remove ATTRS and/or EVENTS if not used
import {ATTRS, EVENTS, TEMPLATE} from './template-kebab';


// TODO: Add IDs used to find elements here
const IDS = {
  CUSTOM_EVENTS_TEMPLATE: 'custom-events-template',
  CUSTOM_EVENT_BTN: 'custom-event-1-btn',
  SIMPLE_TEMPLATE: 'simple-template',
};


// TODO: Define templateBeforeEach function that will get Template's elements to be tested in most tests.
// Use combinations of `.get()`, `.find()`, `.first()`, `.last()` and `.eq()`, and store them as aliases using `.as()`
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


// TODO: Define set of assertions that check if Template initialised correctly
const templateInitChecks = () => {
  return cy.get('@template')
    // Access an attribute of template in JS context use if you need to access multiple attributes
    .then(($template) => {
      const TEMPLATE_ID = $template.attr('id');
      const bazId = `${TEMPLATE_ID}-baz`;
      const fooId = `${TEMPLATE_ID}-foo`;

      const templateVisible = $template.attr(ATTRS.VISIBLE) === '';

      cy.wrap($template)
        .should('have.attr', 'attribute', '')
        .get('@templateFoo')
        .should('have.id', fooId)
        .and('have.attr', 'aria-owns', bazId)
        .should(`${templateVisible ? '' : 'not.'}have.attr`, ATTRS.IS_VISIBLE)
        .get('@templateBaz')
        .should('have.id', bazId)
        .should('have.attr', 'aria-labelledby', fooId)
        // Access an attribute of templateBaz in Cypress context
        .invoke('attr', ATTRS.VISIBLE)
        .then((visibleAttrVal) => {
          const visible = visibleAttrVal === '';
          cy.get('@templateBaz')
            .should(`${visible ? '' : 'not.'}have.attr`, ATTRS.IS_VISIBLE)
            .get('@templateBars')
            .each(($bar, index) => {
              const selected = index === 0 ? 'true' : 'false';
              cy.wrap($bar)
                .should('have.id', `${TEMPLATE_ID}-bar-${index + 1}`)
                .and('have.attr', ATTRS.BAR, '')
                .and('have.attr', 'aria-selected', selected);
            });
        });
    });
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
  context(`Simple Template`, () => {
    const TEMPLATE_ID = IDS.SIMPLE_TEMPLATE;


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


  context(`Custom events controlled Template`, () => {
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
