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
                cy.get('@disclosure').should('not.have.attr', 'style', 'display: none;');
            });
        });

        // TODO: Work out how to trigger button with enter/space
        // it('should trigger disclosure when enter is pressed', () => {
        //     // Get the trigger and disclosure
        //     cy.get(`[${pkgName}-disclosure-trigger-for]`).first().as('trigger');
        //     cy.get('@trigger').then((trigger) => {
        //         const disclosureId = trigger.attr(`${pkgName}-disclosure-trigger-for`);
        //         cy.get(`#${disclosureId}`).as('disclosure');
        //         // Check disclosure is hidden before
        //         cy.get('@disclosure').should('have.attr', 'style', 'display: none;');
        //         // Focus the trigger
        //         cy.get('@trigger').then(el => {
        //             el.focus();
        //             el.trigger('keypress', { keycode: 13, which: 13 });
        //         });
        //         // Check disclosure is now visible and trigger has `aria-expanded` set to true
        //         cy.get('@disclosure').should('not.have.attr', 'style', 'display: none;');
        //     });
        // });

        it('triggers should have role of button', () => {
            cy.get(`[${pkgName}-disclosure-trigger-for]`).should('have.attr', 'role', 'button');
        });

        it('trigger should have aria-controls set to id of disclosaure', () => {
            // Get the trigger and disclosure
            cy.get(`[${pkgName}-disclosure-trigger-for]`).first().as('trigger');
            cy.get('@trigger').then((trigger) => {
                const disclosureId = trigger.attr(`${pkgName}-disclosure-trigger-for`);
                cy.get('@trigger').should('have.attr', 'aria-controls', disclosureId);
            });
        });

        it('trigger should have aria-expanded set to true when disclosure visible', () => {
            // Get the trigger and disclosure
            cy.get(`[${pkgName}-disclosure-trigger-for]`).first().as('trigger');
            cy.get('@trigger').click().wait(150).should('have.attr', 'aria-expanded', 'true');
        });
    });
});
