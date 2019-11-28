context('Disclosure', () => {
    beforeEach(() => {
        cy.visit('/disclosure');
    });

    // CHECK DOCS PAGE IS CORRECT BEFORE TESTING EXAMPLES
    describe('Docs Page', () => {
        it('should have at least one button trigger', () => {
            cy.get(`button[pa11y-disclosure-trigger-for]`).should('have.length.greaterThan', 0);
        });

        it('should have at least one non-button trigger', () => {
            cy.get(`:not(button)[pa11y-disclosure-trigger-for]`).should('have.length.greaterThan', 0);
        });

        it('should have at least one disclosure', () => {
            cy.get(`[pa11y-disclosure]`).should('have.length.greaterThan', 0);
        });
    });

    // TEST EXAMPLES AGAINST WAI-ARIA SPEC
    describe('WAI-ARIA Spec', () => {
        it('should trigger disclosure when enter is pressed', () => {
            const trigger = document.querySelector('[pa11y-disclosure-trigger-for]');
            const disclosure = document.getElementById(trigger.getAttribute('pa11y-disclosure-trigger-for'));

        });
    });
});
