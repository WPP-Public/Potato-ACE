context('Disclosure', () => {
    const pkgName = Cypress.env('pkg_name');
    const disclosureTag = `${pkgName}-disclosure`;
    const triggerAttr = `${disclosureTag}-trigger-for`;

    beforeEach(() => {
        // Navigate to the docs page
        cy.visit('/disclosure');
    });

    /* CHECK DOCS PAGE IS CORRECT BEFORE TESTING EXAMPLES */
    describe('Docs Page', () => {
        it('should have at least one button trigger', () => {
            cy.get(`button[${triggerAttr}]`).should('have.length.greaterThan', 0);
        });

        it('should have at least one non-button trigger', () => {
            cy.get(`:not(button)[${triggerAttr}]`).should('have.length.greaterThan', 0);
        });

        it('should have at least one disclosure', () => {
            cy.get(`${disclosureTag}`).should('have.length.greaterThan', 0);
        });
    });

    /* TEST EXAMPLES AGAINST WAI-ARIA SPEC */
    describe('WAI-ARIA Spec', () => {
        it('should be hidden on page load', () => {
            // Check only the disclosures which have trigger which don't expand by default.
            cy.get(`[${triggerAttr}]:not([aria-expanded='true'])`).each(trigger => {
                const disclosureId = trigger.attr(`${triggerAttr}`);
                cy.get(`#${disclosureId}`).as('disclosure').should('have.attr', 'aria-hidden', 'true');
            });
        });

        it('should trigger disclosure when button trigger clicked', () => {
            // Get the trigger and disclosure
            cy.get(`[${triggerAttr}]`).first().as('trigger');
            cy.get('@trigger').then(trigger => {
                const disclosureId = trigger.attr(`${triggerAttr}`);
                cy.get(`#${disclosureId}`).as('disclosure');
                // Check disclosure is hidden before
                cy.get('@disclosure').should('not.be.visible').and('have.attr', 'aria-hidden', 'true');
                // Click the trigger
                cy.get('@trigger').click();
                // Check disclosure is now visible and has `aria-hidden` set to false
                cy.get('@disclosure').should('be.visible').and('have.attr', 'aria-hidden', 'false');
            });
        });

        it('should trigger disclosure when div trigger clicked', () => {
            // Get the trigger and disclosure
            cy.get(`div[${triggerAttr}]`).first().as('trigger');
            cy.get('@trigger').then(trigger => {
                const disclosureId = trigger.attr(`${triggerAttr}`);
                cy.get(`#${disclosureId}`).as('disclosure');
                // Check disclosure is hidden before
                cy.get('@disclosure').should('not.be.visible').and('have.attr', 'aria-hidden', 'true');
                // Click the trigger
                cy.get('@trigger').click();
                // Check disclosure is now visible and has `aria-hidden` set to false
                cy.get('@disclosure').should('be.visible').and('have.attr', 'aria-hidden', 'false');
            });
        });

        it('should trigger disclosure when enter is pressed', () => {
            // Get the trigger and disclosure
            cy.get(`[${triggerAttr}]`).first().as('trigger');
            cy.get('@trigger').then(trigger => {
                const disclosureId = trigger.attr(`${triggerAttr}`);
                cy.get(`#${disclosureId}`).as('disclosure');
                // Check disclosure is hidden before
                cy.get('@disclosure').should('not.be.visible').and('have.attr', 'aria-hidden', 'true');
                // Focus the trigger and press enter
                cy.get('@trigger').focus().trigger('keydown', { keyCode: 13, which: 13 });
                // Check disclosure is now visible and trigger has `aria-expanded` set to true
                cy.get('@disclosure').should('be.visible').and('have.attr', 'aria-hidden', 'false');
                // Focus the trigger and press enter
                cy.get('@trigger').focus().trigger('keydown', { keyCode: 13, which: 13 });
                // Check disclosure is hidden before
                cy.get('@disclosure').should('not.be.visible').and('have.attr', 'aria-hidden', 'true');
            });
        });

        it('should trigger disclosure when space is pressed', () => {
            // Get the trigger and disclosure
            cy.get(`[${triggerAttr}]`).first().as('trigger');
            cy.get('@trigger').then(trigger => {
                const disclosureId = trigger.attr(`${triggerAttr}`);
                cy.get(`#${disclosureId}`).as('disclosure');
                // Check disclosure is hidden before
                cy.get('@disclosure').should('not.be.visible').and('have.attr', 'aria-hidden', 'true');
                // Focus the trigger and press enter
                cy.get('@trigger').focus().trigger('keydown', { keyCode: 32, which: 32 });
                // Check disclosure is now visible and trigger has `aria-expanded` set to true
                cy.get('@disclosure').should('be.visible').and('have.attr', 'aria-hidden', 'false');
                // Focus the trigger and press enter
                cy.get('@trigger').focus().trigger('keydown', { keyCode: 32, which: 32 });
                // Check disclosure is hidden before
                cy.get('@disclosure').should('not.be.visible').and('have.attr', 'aria-hidden', 'true');
            });
        });

        it('should be initially expanded if trigger has aria-expanded set to true', () => {
            cy.get(`[${triggerAttr}][aria-expanded='true']`).then(trigger => {
                const disclosureId = trigger.attr(`${triggerAttr}`);
                cy.get(`#${disclosureId}`).as('disclosure');
                // Check disclosure is visible and trigger has `aria-expanded` set to true
                cy.get('@disclosure').should('be.visible').and('have.attr', 'aria-hidden', 'false');
            });
        });

        it('should not be initially expanded if trigger has aria-expanded set to false', () => {
            cy.get(`[${triggerAttr}][aria-expanded='false']`).then(trigger => {
                const disclosureId = trigger.attr(`${triggerAttr}`);
                cy.get(`#${disclosureId}`).as('disclosure');
                // Check disclosure is hidden
                cy.get('@disclosure').should('not.be.visible').and('have.attr', 'aria-hidden', 'true');
            });
        });

        it('triggers should have role of button', () => {
            cy.get(`:not(button)[${triggerAttr}]`).should('have.attr', 'role', 'button');
        });

        it('triggers which are not buttons should have a tabindex of 0', () => {
            cy.get(`div[${triggerAttr}]`).should('have.attr', 'tabindex', '0');
        });

        it('trigger should have aria-controls set to id of disclosure', () => {
            // Get the trigger and disclosure
            cy.get(`[${triggerAttr}]`).first().as('trigger');
            cy.get('@trigger').then(trigger => {
                const disclosureId = trigger.attr(`${triggerAttr}`);
                cy.get('@trigger').should('have.attr', 'aria-controls', disclosureId);
            });
        });

        it('trigger should have aria-expanded set to true when disclosure visible', () => {
            // Get the trigger and disclosure
            cy.get(`[${triggerAttr}]`).first().as('trigger');
            cy.get('@trigger').should('not.have.attr', 'aria-expanded');
            cy.get('@trigger').click();
            cy.get('@trigger').should('have.attr', 'aria-expanded', 'true');
        });

        it('trigger should only open assigned disclosure', () => {
            // Get all closed disclosures
            cy.get(`${disclosureTag}[aria-hidden='true']`).as('closedDisclosures');
            // Get trigger
            cy.get(`[${triggerAttr}]`).first().as('trigger');
            cy.get('@trigger').then(trigger => {
                // Click Trigger
                trigger.click();
                // Get disclosure and check it is visible.
                const disclosureId = trigger.attr(`${triggerAttr}`);
                cy.get(`#${disclosureId}`).as('disclosure');
                cy.get('@disclosure').should('be.visible').and('have.attr', 'aria-hidden', 'false');
                // Check all other disclosures are closed
                cy.get('@closedDisclosures').each(elem => {
                    if (elem.attr('id') !== disclosureId) {
                        cy.wrap(elem).as('otherDisclosure');
                        cy.get('@otherDisclosure').should('not.be.visible').and('have.attr', 'aria-hidden', 'true');
                    }
                });
            });
        });
    });

    /* TEST CUSTOM EVENTS ARE EMITTED */
    describe('Custom Events', () => {
        // TODO: Test other custom events (using spies?)
        it('should toggle disclosure when toggle event is emitted', () => {
            // Get disclosure
            cy.get(`${disclosureTag}`).first().as('disclosure');
            // Check disclosure is hidden
            cy.get('@disclosure').should('not.be.visible').and('have.attr', 'aria-hidden', 'true');
            // Dispatch toggle event
            cy.get('@disclosure').then(disclosure => {
                cy.window().then(window => {
                    window.dispatchEvent(new CustomEvent(`${disclosureTag}-toggle`, { detail: { id: disclosure[0].id } }));
                });
            });
            // Check disclosure is visible
            cy.get('@disclosure').should('be.visible').and('have.attr', 'aria-hidden', 'false');
        });

        it.skip('should emit the asce-disclosure-opened event when shown', () => {});

        it.skip('should emit the asce-disclosure-closed event when hidden', () => {});

        it.skip('should update trigger list when asce-disclosure-update-triggers event is dispatched', () => {});
    });
});
