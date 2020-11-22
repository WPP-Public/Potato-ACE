// // TODO: Remove 'TODO:' comments
// // TODO: Remove ATTRS and/or EVENTS if not used
// import {ATTRS, EVENTS, MODAL} from './modal';


// // TODO: Add IDs used to find elements here
// const IDS = {
//   CUSTOM_EVENTS_MODAL: 'custom-events-modal',
//   CUSTOM_EVENT_BTN: 'custom-event-1-btn',
//   SIMPLE_MODAL: 'simple-modal',
// };


// // TODO: Define modalBeforeEach function that will get Modal's elements to be tested in most tests.
// // Use combinations of `.get()`, `.find()`, `.first()`, `.last()` and `.eq()`, and store them as aliases using `.as()`
// // Call this function in the beforeEach of each variant test block giving it the variant ID, as shown below.
// const getEls = (id) => {
//   return cy.get(`#${id}`)
//     .as('modal')
//     .find('foo')
//     .as('modalFoo')
//     .find('bars')
//     .as('modalBars')
//     .first()
//     .as('modalBar1')
//     .get('@modal')
//     .find('baz')
//     .as('modalBaz');
// };


// // TODO: Define set of assertions that indicate that Modal initialised correctly
// const modalInitChecks = (id) => {
//   const FOO_ID = `${id}-foo`;
//   const BAZ_ID = `${id}-baz`;

//   return cy.get('@modal')
//     .should('have.id', id)
//     .get('@modalFoo')
//     .should('have.id', FOO_ID)
//     .and('have.attr', ATTRS.FOO, '')
//     .and('have.attr', 'aria-owns', BAZ_ID)
//     .get('@modalBars')
//     .each(($bar, index) => {
//       const selected = index === 0 ? 'true' : 'false';
//       cy.wrap($bar)
//         .should('have.id', `${id}-bar-${index + 1}`)
//         .and('have.attr', ATTRS.BAR, '')
//         .and('have.attr', 'aria-selected', selected);
//     })
//     .get('@modalBaz')
//     .should('have.id', BAZ_ID)
//     .and('have.attr', ATTRS.BAZ, '')
//     .and('have.attr', 'aria-describedby', FOO_ID)
//     .and('not.have.attr', ATTRS.ACTIVE_BAZ);
// };



// // TODO: If there are sets of assertions you make a lot then define them in functions
// const setOfAssertions = () => {
//   return cy.get('@modalFoo')
//     .should('have.attr', ATTRS.SOME_ATTR, 'true')
//     .and('have.attr', 'aria-selected', 'true')
//     .get('@modalBaz')
//     .should('have.attr', ATTRS.SOME_OTHER_ATTR, '');
// };



// context(`Modal`, () => {
//   before(() => cy.visit(`/modal`));


//   // TODO: test that at least one Modal without an ID will be automatically given one by the autoID function
//   it(`Modal without ID should initialise with an ID`, () => {
//     cy.get(MODAL)
//       .first()
//       .should('have.id', `${MODAL}-1`);
//   });


//   // TODO: Group tests for different variants together using `context`
//   context(`Simple Modal`, () => {
//     const MODAL_ID = IDS.SIMPLE_MODAL;


//     beforeEach(() => getEls(MODAL_ID));


//     // TODO: Check that Modal and children initialise with correct IDs and a11y attributes
//     it(`Should initialise correctly`, () => modalInitChecks());


//     // TODO: Undo effects of test, resetting components to initial state, either at the end of each test or in the
//     // `beforeEach()`.
//     it(`Should do something else`, () => {
//       // TODO: If test results in Modal dispatching a custom event, add listener to check custom event dispatched correctly
//       const expectedDetail = {
//         foo: 'bar',
//         id: MODAL_ID,
//       };
//       cy.addCustomEventListener(EVENTS.OUT.SOME_EVENT, expectedDetail);

//       cy.get('@modalFoo').click();
//       setOfAssertions();

//       // TODO: Undo effects of test, resetting components to initial state, e.g.
//       cy.get('@modalFoo')
//         .click()
//         .blur();
//     });


//     describe(`Mouse interactions`, () => {
//       // TODO: Group mouse interaction tests together here
//     });


//     describe(`Keyboard interactions`, () => {
//       // TODO: Group keyboard interaction tests together here
//     });


//     // TODO: Group other similar tests together
//   });


//   context(`Custom events Modal`, () => {
//     const MODAL_ID = IDS.CUSTOM_EVENTS_MODAL;


//     beforeEach(() => {
//       getEls(MODAL_ID);
//       // TODO: Check attributes that are unique to this variant
//       cy.get('@modal').should('have.attr', ATTRS.VARIANT_ATTR, '');
//       cy.get(`#${IDS.CUSTOM_EVENT_BTN}`).as('customEventBtn');
//     });


//     // TODO: Test dispatched custom events
//     it(`Dipatching custom event 1 should lead to something`, () => {
//       // TODO: Perform action that dispatches custom event
//       cy.get('@customEvent1Btn')
//         .click()
//         // TODO: Check that custom event results in expected behaviour
//         .get('@customEventModal').should('have.attr', ATTRS.CUSTOM_EVENT_TRIGGERED, '');

//       // TODO: Undo effects of test, resetting components to initial state
//     });
//   });
// });
