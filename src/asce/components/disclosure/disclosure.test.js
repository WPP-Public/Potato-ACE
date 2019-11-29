context('Disclosure', () => {
    beforeEach(() => {
        // Navigate to the docs page
        cy.visit('/disclosure');
    });

    // CHECK DOCS PAGE IS CORRECT BEFORE TESTING EXAMPLES
    describe('Docs Page', () => {
        // Store the package name from environment for use later
        const pkgName = Cypress.env('pkg_name');

        it('should have at least one button trigger', () => {
            cy.get(`button[${pkgName}-disclosure-trigger-for]`).should('have.length.greaterThan', 0);
        });

        it('should have at least one non-button trigger', () => {
            cy.get(`:not(button)[${pkgName}-disclosure-trigger-for]`).should('have.length.greaterThan', 0);
        });

        it('should have at least one disclosure', () => {
            cy.get(`${pkgName}-disclosure`).should('have.length.greaterThan', 0);
        });
    });

    // TEST EXAMPLES AGAINST WAI-ARIA SPEC
    describe('WAI-ARIA Spec', () => {
        // Store the package name from environment for use later
        const pkgName = Cypress.env('pkg_name');

        it('triggers should have role of button', () => {
            cy.get(`[${pkgName}-disclosure-trigger-for]`).should('have.attr', 'role', 'button');
        });

        it('should trigger disclosure when clicked', () => {
            // Get the trigger and disclosure
            cy.get(`[${pkgName}-disclosure-trigger-for]`).first().as('trigger');
            cy.get('@trigger').then((trigger) => {
                const disclosureId = trigger.attr(`${pkgName}-disclosure-trigger-for`);
                cy.get(`#${disclosureId}`).as('disclosure');
                // Check disclosure is hidden before
                cy.get('@disclosure').should('have.attr', 'style', 'display: none;');
                // Click the trigger
                cy.get('@trigger').wait(150).click();
                // Check disclosure is now visible and trigger has `aria-expanded` set to true
                cy.get('@disclosure').should('have.not.have.attr', 'style', 'display: none;');
            });
        });
    });
});
