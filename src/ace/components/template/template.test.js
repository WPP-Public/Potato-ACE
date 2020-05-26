// TODO: Change 'TEMPLATE' and 'template' in file
// TODO: Remove 'TODO:' comments
// TODO: Remove ATTRS and/or EVENTS if not used
import {TEMPLATE, ATTRS, EVENTS} from './tempalte';


// TODO: Add IDs used to find elements here or remove object
const IDS = {
  TEMPLATE_1: 'template_1',
  TEMPLATE_VARIANT: 'template-variant',
};


context('Template', () => {
  before(() => {
    cy.visit(`/template`);
  });


  beforeEach(() => {
    // TODO: Get all elements to be tested here, using `.get` or `.find` and store them as aliases using `.as`
    cy.get(TEMPLATE)
      .as('templates')
      .first()
      .as('template1')
      .find('foos')
      .as('template1Foos');


    cy.get('@template1')
      .find('bar')
      .as('template1Bar');


    // TODO: Get and store specific instances that will be tested later, using IDS:
    cy.get(`#${IDS.TEMPLATE_VARIANT}`)
      .as('templateVariant')
      .find('foos')
      .as('templateVariantFoos');


    cy.get('@templateVariant')
      .as('templateVariant')
      .find('bar')
      .as('templateVariantBar');
  });


  // TODO: Test that component and children initialise with correctly
  describe('Initialisation', () => {
    // TODO: Try to include the word 'should' in each test description
    it('All templates should have IDs', () => {
      cy.get('@templates').each(template => {
        cy.get(template).should('have.attr', 'id');
      });
    });


    // TODO: Check that the default Template initialises with correct aria and custom attributes
    it('Template should initialise with correct attributes', () => {
      cy.get('@template1').should('have.attr', ATTRS.TEMPLATE_ATTR, 'value');
      cy.get('@template1').should('have.attr', 'aria-attribute', 'value');

      cy.get('@template1Bar').should('have.attr', ATTRS.BAR_ATTR, 'value');
      cy.get('@template1Bar').should('have.attr', 'aria-attribute', 'value');

      cy.get('@template1Foos').each((foo, index) => {
        cy.get(foo).should('have.attr', ATTRS.FOO_ATTR, `index-${index}`);
        cy.get(foo).should('have.attr', 'aria-attribute', 'value');
      });
    });


    // TODO: Check each variant of the default Template initialises with correct attributes
    it('Variant of Template should initialise with correct attributes', () => {
      cy.get('@templateVariant').should('have.attr', ATTRS.TEMPLATE_VARIANT_ATTR, 'value');
      cy.get('@templateVariant').should('have.attr', 'attribute', 'value');

      cy.get('@templateVariantBar').should('have.attr', ATTRS.TEMPLATE_VARIANT_BAR_ATTR, 'value');
      cy.get('@templateVariantBar').should('have.attr', 'attribute', 'value');

      cy.get('@templateVariantFoos').each((foo) => {
        cy.get(foo).should('have.attr', ATTRS.TEMPLATE_VARIANT_FOO_ATTR, 'value');
        cy.get(foo).should('have.attr', 'attribute', 'value');
      });
    });
  });


  // TODO: Test mouse interaction
  describe('Mouse interaction', () => {
    beforeEach(() => {
      cy.reload();
    });


    it('Clicking on something should lead to something', () => {
      cy.get('@template1Bar').click();
      cy.get('@template1Bar').should('have.attr', ATTRS.BAR_ATTR, 'value');
      cy.get('@template1Bar').should('have.attr', 'aria-attribute', 'value');
      cy.get('@template1Bar').should('have.focus');
      cy.get('body').click();
      cy.get('@template1Bar').should('not.have.focus');
    });
  });


  // TODO: Test mouse interaction
  describe('Keyboard interaction', () => {
    beforeEach(() => {
      cy.reload();
    });


    it('Pressing something should lead to something', () => {
      cy.get('@template1Bar')
        .focus()
        .type('{key}');

      cy.get('@template1Bar').should('have.attr', ATTRS.BAR_ATTR, 'value');
      cy.get('@template1Bar').should('have.attr', 'aria-attribute', 'value');
    });
  });


  // TODO: Test dispatched custom events
  describe('Some custom event', () => {
    beforeEach(() => {
      cy.reload();
    });


    it('Doing something dispatches custom event with correct details', () => {
      cy.window().then((window) => {
        window.addEventListener(EVENTS.SOME_EVENT, (e) => {
          expect(e.detail.id).to.equal(IDS.TEMPLATE_1);
          // TODO: Check other detail properties if any
        });
      });

      // TODO: Perform action that dispatches custom event
      cy.get('@template1Bar').click();
    });
  });
});
