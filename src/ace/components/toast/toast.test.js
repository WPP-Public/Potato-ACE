// // TODO: Remove 'TODO:' comments
// // TODO: Remove ATTRS and/or EVENTS if not used
// import {ATTRS, EVENTS, TOAST} from './toast';


// // TODO: Add IDs used to find elements here
// const IDS = {
//   CUSTOM_EVENTS_TOAST: 'custom-events-toast',
//   CUSTOM_EVENT_BTN: 'custom-event-1-btn',
//   SIMPLE_TOAST: 'simple-toast',
// };


// // TODO: Define toastBeforeEach function that will get Toast's elements to be tested in most tests.
// // Use combinations of `.get()`, `.find()`, `.first()`, `.last()` and `.eq()`, and store them as aliases using `.as()`
// // Call this function in the beforeEach of each variant test block giving it the variant ID, as shown below.
// const getEls = (id) => {
//   return cy.get(`#${id}`)
//     .as('toast')
//     .find('foo')
//     .as('toastFoo')
//     .find('bars')
//     .as('toastBars')
//     .first()
//     .as('toastBar1')
//     .get('@toast')
//     .find('baz')
//     .as('toastBaz');
// };


// // TODO: Define set of assertions that check if Toast initialised correctly
// const toastInitChecks = () => {
//   return cy.get('@toast')
//     // Access an attribute of toast in JS context use if you need to access multiple attributes
//     .then(($toast) => {
//       const TOAST_ID = $toast.attr('id');
//       const bazId = `${TOAST_ID}-baz`;
//       const fooId = `${TOAST_ID}-foo`;

//       const toastVisible = $toast.attr(ATTRS.VISIBLE) === '';

//       cy.wrap($toast)
//         .should('have.attr', 'attribute', '')
//         .get('@toastFoo')
//         .should('have.id', fooId)
//         .and('have.attr', 'aria-owns', bazId)
//         .should(`${toastVisible ? '' : 'not.'}have.attr`, ATTRS.IS_VISIBLE)
//         .get('@toastBaz')
//         .should('have.id', bazId)
//         .should('have.attr', 'aria-labelledby', fooId)
//         // Access an attribute of toastBaz in Cypress context
//         .invoke('attr', ATTRS.VISIBLE)
//         .then((visibleAttrVal) => {
//           const visible = visibleAttrVal === '';
//           cy.get('@toastBaz')
//             .should(`${visible ? '' : 'not.'}have.attr`, ATTRS.IS_VISIBLE)
//             .get('@toastBars')
//             .each(($bar, index) => {
//               const selected = index === 0 ? 'true' : 'false';
//               cy.wrap($bar)
//                 .should('have.id', `${TOAST_ID}-bar-${index + 1}`)
//                 .and('have.attr', ATTRS.BAR, '')
//                 .and('have.attr', 'aria-selected', selected);
//             });
//         });
//     });
// };



// // TODO: If there are sets of assertions you make a lot then define them in functions
// const setOfAssertions = () => {
//   return cy.get('@toastFoo')
//     .should('have.attr', ATTRS.SOME_ATTR, 'true')
//     .and('have.attr', 'aria-selected', 'true')
//     .get('@toastBaz')
//     .should('have.attr', ATTRS.SOME_OTHER_ATTR, '');
// };



// context(`Toast`, () => {
//   before(() => cy.visit(`/toast`));


//   // TODO: test that at least one Toast without an ID will be automatically given one by the autoID function
//   it(`Toast without ID should initialise with an ID`, () => {
//     cy.get(TOAST)
//       .first()
//       .should('have.id', `${TOAST}-1`);
//   });


//   // TODO: Group tests for different variants together using `context`
//   context(`Simple Toast`, () => {
//     const TOAST_ID = IDS.SIMPLE_TOAST;


//     beforeEach(() => getEls(TOAST_ID));


//     // TODO: Check that Toast and children initialise with correct IDs and a11y attributes
//     it(`Should initialise correctly`, () => toastInitChecks());


//     // TODO: Undo effects of test, resetting components to initial state, either at the end of each test or in the
//     // `beforeEach()`.
//     it(`Should do something else`, () => {
//       // TODO: If test results in Toast dispatching a custom event, add listener to check custom event dispatched correctly
//       const expectedDetail = {
//         foo: 'bar',
//         id: TOAST_ID,
//       };
//       cy.addCustomEventListener(EVENTS.OUT.SOME_EVENT, expectedDetail);

//       cy.get('@toastFoo').click();
//       setOfAssertions();

//       // TODO: Undo effects of test, resetting components to initial state, e.g.
//       cy.get('@toastFoo')
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


//   context(`Custom events controlled Toast`, () => {
//     const TOAST_ID = IDS.CUSTOM_EVENTS_TOAST;


//     beforeEach(() => {
//       getEls(TOAST_ID);
//       // TODO: Check attributes that are unique to this variant
//       cy.get('@toast').should('have.attr', ATTRS.VARIANT_ATTR, '');
//       cy.get(`#${IDS.CUSTOM_EVENT_BTN}`).as('customEventBtn');
//     });


//     // TODO: Test dispatched custom events
//     it(`Dipatching custom event 1 should lead to something`, () => {
//       // TODO: Perform action that dispatches custom event
//       cy.get('@customEvent1Btn')
//         .click()
//         // TODO: Check that custom event results in expected behaviour
//         .get('@customEventToast').should('have.attr', ATTRS.CUSTOM_EVENT_TRIGGERED, '');

//       // TODO: Undo effects of test, resetting components to initial state
//     });
//   });
// });
