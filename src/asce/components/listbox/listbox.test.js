context('Listbox', () => {
    const componentName = 'listbox';
    const pkgName = Cypress.env('pkg_name');
    const listboxTag = `${pkgName}-${componentName}`;
    const listboxListAttr = `${listboxTag}-list`;
    const multiSelectAttr = `${listboxTag}-multiselect`;
    const optionIndexAttr = `${listboxTag}-option-index`;
    const activeOptionAttr = `${listboxTag}-active-option`;

    beforeEach(() => {
        // Navigate to the docs page
        cy.visit(`/${componentName}`);
    });

    /* TEST EXAMPLES KEYBAORD INTERACTION */
    describe('Keyboard Interaction', () => {
         it('on initial focus single-select listbox focuses first option', () => {
            cy.get(`[${listboxListAttr}]:not([${multiSelectAttr}])`).first().within(listbox => {
                listbox.focus();
                cy.get('li').first().should('have.attr', 'aria-selected', 'true');
            });
        });

         it('on re-focus single-select listbox focuses the selected option', () => {
            cy.get(`[${listboxListAttr}]:not([${multiSelectAttr}])`).first().as('listbox').focus();
            // Select the third option
            cy.get(`[${listboxListAttr}]:not([${multiSelectAttr}])>li`).eq(3).click();
            // Unfocus listbox
            cy.get('body').focus();
            // Re-focus listbox
            cy.get(`@listbox`).first().within(listbox => {
                // Focus listbox
                listbox.focus();
                // Observe 3rd option is selected
                cy.get('li').eq(3).should('have.attr', 'aria-selected', 'true');
            });
        });

        it('single-select listbox should select next option when down arrow is pressed', () => {
            cy.get(`[${listboxListAttr}]:not([${multiSelectAttr}])`).first().focus().type('{downarrow}')
                .within(() => {
                    // Check the second option is selected
                    cy.get('li').eq(1).should('have.attr', 'aria-selected', 'true');
                });
        });

        it('single-select listbox should select first option when down arrow is pressed on last option', () => {
            cy.get(`[${listboxListAttr}]:not([${multiSelectAttr}])`).first().as('listbox');
            cy.get('@listbox').focus().within(() => {
                // Select last option
                cy.get('li').last().click();
            });
            cy.get('@listbox').type('{downarrow}').within(() => {
                // Check the first option is selected
                cy.get('li').first().should('have.attr', 'aria-selected', 'true');
            });
        });

        it('single-select listbox should select previous option when up arrow is pressed', () => {
            cy.get(`[${listboxListAttr}]:not([${multiSelectAttr}])`).first().as('listbox');
            cy.get('@listbox').focus().within(() => {
                // Select second option
                cy.get('li').eq(1).click();
            });
            cy.get('@listbox').type('{uparrow}').within(() => {
                // Check the first option is selected
                cy.get('li').first().should('have.attr', 'aria-selected', 'true');
            });
        });

        it('single-select listbox should select last option when up arrow is pressed on first option', () => {
            cy.get(`[${listboxListAttr}]:not([${multiSelectAttr}])`).first().as('listbox');
            cy.get('@listbox').focus().within(() => {
                // Select first option
                cy.get('li').first().click();
            });
            cy.get('@listbox').type('{uparrow}').within(() => {
                // Check the last option is selected
                cy.get('li').last().should('have.attr', 'aria-selected', 'true');
            });
        });

        it('single-select listbox should select first option when home key is pressed', () => {
            cy.get(`[${listboxListAttr}]:not([${multiSelectAttr}])`).first().as('listbox');
            cy.get('@listbox').focus().within(() => {
                // Select last option
                cy.get('li').last().click();
            });
            cy.get('@listbox').type('{home}').within(() => {
                // Check the first option is selected
                cy.get('li').first().should('have.attr', 'aria-selected', 'true');
            });
        });

        it('single-select listbox should select last option when end key is pressed', () => {
            cy.get(`[${listboxListAttr}]:not([${multiSelectAttr}])`).first().as('listbox');
            cy.get('@listbox').focus().within(() => {
                // Select first option
                cy.get('li').first().click();
            });
            cy.get('@listbox').type('{end}').within(() => {
                // Check the last option is selected
                cy.get('li').last().should('have.attr', 'aria-selected', 'true');
            });
        });

        it('multi-select listbox should focus next option when down arrow is pressed', () => {});

        it('multi-select listbox should focus first option when down arrow is pressed on last option', () => {});

        it('multi-select listbox should focus previous option when up arrow is pressed', () => {});

        it('multi-select listbox should focus last option when up arrow is pressed on first option', () => {});

        it('multi-select listbox should focus first option when home key is pressed', () => {});

        it('multi-select listbox should focus last option when end key is pressed', () => {});
    });

    /* TEST EXAMPLES AGAINST WAI-ARIA SPEC */
    describe('WAI-ARIA Spec', () => {
         it('elements with ${listboxListAttr} attribute should have the role listbox', () => {
            cy.get(`[${listboxListAttr}]`).should('have.attr', 'role', 'listbox');
        });

         it('listbox options should have the role option', () => {
            cy.get(`[${listboxListAttr}]>li`).should('have.attr', 'role', 'option');
        });

         it('single-select listbox should have first option selected by default', () => {
            cy.get(`[${listboxListAttr}]:not([${multiSelectAttr}])>li`).first().should('have.attr', 'aria-selected', 'true');
        });

         it('multi-select listbox should have no options selected by default', () => {
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]>li`).should('not.have.attr', 'aria-selected', 'true');
        });

         it('multi-select listbox should have aria-multiselectable set to true', () => {
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]>li`).should('not.have.attr', 'aria-multiselectable', 'true');
        });

         it('selected option in single-select listbox should have aria-selected set to true', () => {
            cy.get(`[${listboxListAttr}]:not([${multiSelectAttr}])`).first().within(listbox => {
                // Get random option
                const numOptions = listbox.children().length;
                const randomIdx = Math.round(Math.random() * (numOptions - 1));
                // Focus listbox
                listbox.focus();
                // Click option and check aria-selected is true
                cy.get('li').eq(randomIdx).click().should('have.attr', 'aria-selected', 'true');
            });

        });

         it('Options in multi-select listbox should have aria-selected set correctly', () => {
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]`).first().within(listbox => {
                const numOptions = listbox.children().length;
                let selectedIdxs = [2, 3, 5, 7];
                // Focus listbox
                listbox.focus();
                // For each index select that option
                for (let i = 0; i < selectedIdxs.length; i++) {
                    cy.get(`[${optionIndexAttr}="${selectedIdxs[i]}"]`).click();
                }
                // Check selected elements have aria-selected true and non-selected have set to false
                for (let i = 0; i < numOptions; i++) {
                    if (selectedIdxs.includes(i)) {
                        cy.get(`[${optionIndexAttr}="${i}"]`).should('have.attr', 'aria-selected', 'true');
                    } else {
                        cy.get(`[${optionIndexAttr}="${i}"]`).should('have.attr', 'aria-selected', 'false');
                    }
                }
            });
        });
    });
});
