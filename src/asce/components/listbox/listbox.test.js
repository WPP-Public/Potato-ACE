context('Listbox', () => {
    const componentName = 'listbox';
    const pkgName = Cypress.env('pkg_name');
    const listboxTag = `${pkgName}-${componentName}`;
    const listboxListAttr = `${listboxTag}-list`;
    const multiSelectAttr = `${listboxTag}-multiselect`;
    const optionIndexAttr = `${listboxTag}-option-index`;

    beforeEach(() => {
        // Navigate to the docs page
        cy.visit(`/${componentName}`);
    });

    /* TEST EXAMPLES KEYBAORD INTERACTION */
    describe('Keyboard Interaction', () => {});

    /* TEST EXAMPLES AGAINST WAI-ARIA SPEC */
    describe('WAI-ARIA Spec', () => {
        it(`${listboxListAttr} should have the role listbox`, () => {
            cy.get(`[${listboxListAttr}]`).should('have.attr', 'role', 'listbox');
        });

        it(`${componentName} options should have the role option`, () => {
            cy.get(`[${listboxListAttr}]>li`).should('have.attr', 'role', 'option');
        });

        it(`Single-select ${componentName} should have first option selected by default`, () => {
            cy.get(`[${listboxListAttr}]:not([${multiSelectAttr}])>li`).first().should('have.attr', 'aria-selected', 'true');
        });

        it(`Multi-select ${componentName} should have no options selected by default`, () => {
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]>li`).should('not.have.attr', 'aria-selected', 'true');
        });

        it(`Multi-select ${componentName} should have aria-multiselectable set to true`, () => {
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]>li`).should('not.have.attr', 'aria-multiselectable', 'true');
        });

        it(`Selected option in single-select ${componentName} should have aria-selected set to true`, () => {
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

        it(`Options in multi-select ${componentName} should have aria-selected set correctly`, () => {
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]`).first().within(listbox => {
                const numOptions = listbox.children().length;
                // Select a random amount of options to select (between 1 and number of options)
                const numSelected = Math.round(Math.random() * (numOptions - 1));
                // Select random options and store indexes in array
                let selectedIdxs = [];
                for (let i = 0; i < numSelected; i++) {
                    // Add random index
                    selectedIdxs.push(Math.round(Math.random() * (numOptions - 1)));
                }
                console.log(selectedIdxs);
                // Focus listbox
                listbox.focus();
                // For each index select that option
                for (let i = 0; i < numSelected; i++) {
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
