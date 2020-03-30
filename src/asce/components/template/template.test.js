// TODO: Change 'template' to component name
import {
    NAME as templateTag,
    ATTRS as templateAttrs,
    EVENTS as templateEvents
} from './template';

// TODO: Change 'Template' to component name
context('Template', () => {
    beforeEach(() => {
        // Navigate to the docs page
        cy.visit('/template'); // TODO: Change 'template' to component name
    });

    /* CHECK DOCS PAGE IS CORRECT BEFORE TESTING EXAMPLES */
    describe('Docs Page', () => {
        // Example:
        // it('should have at least one template', () => {});
    });

    /* TEST EXAMPLES AGAINST WAI-ARIA SPEC */
    describe('WAI-ARIA Spec', () => {
        //  Should be written to mimic the statements on the WAI-ARIA Spec
        // Example:
        // it('triggers should have role of button', () => {});
    });

    /* TEST CUSTOM EVENTS ARE EMITTED */
    describe('Custom Events', () => {
        // Example:
        // it('should emit the asce-template-opened event when shown', () => {});
    });
});
