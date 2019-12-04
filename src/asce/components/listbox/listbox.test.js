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

    /* CHECK DOCS PAGE IS CORRECT BEFORE TESTING EXAMPLES */
    describe('Docs Page', () => {
        it('should have at least one example', () => {
            cy.get(`${listboxTag}`).should('have.length.greaterThan', 0);
        });
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
            cy.get(`[${listboxListAttr}]:not([${multiSelectAttr}])`).first().focus().within(listbox => {
                // Select last option
                cy.get('li').last().click();
                // Type down arrow
                cy.wrap(listbox).type('{downarrow}');
                // Check the first option is selected
                cy.get('li').first().should('have.attr', 'aria-selected', 'true');
            });
        });

        it('single-select listbox should select previous option when up arrow is pressed', () => {
            cy.get(`[${listboxListAttr}]:not([${multiSelectAttr}])`).first().focus().within(listbox => {
                // Select second option
                cy.get('li').eq(1).click();
                // Type up arrow
                cy.wrap(listbox).type('{uparrow}');
                // Check the first option is selected
                cy.get('li').first().should('have.attr', 'aria-selected', 'true');
            });
        });

        it('single-select listbox should select last option when up arrow is pressed on first option', () => {
            cy.get(`[${listboxListAttr}]:not([${multiSelectAttr}])`).first().focus().within(listbox => {
                // Select first option
                cy.get('li').first().click();
                // Type up arrow
                cy.wrap(listbox).type('{uparrow}');
                // Check the last option is selected
                cy.get('li').last().should('have.attr', 'aria-selected', 'true');
            });
        });

        it('single-select listbox should select first option when home key is pressed', () => {
            cy.get(`[${listboxListAttr}]:not([${multiSelectAttr}])`).first().focus().within(listbox => {
                // Select last option
                cy.get('li').last().click();
                // Type home key
                cy.wrap(listbox).type('{home}');
                // Check the first option is selected
                cy.get('li').first().should('have.attr', 'aria-selected', 'true');
            });
        });

        it('single-select listbox should select last option when end key is pressed', () => {
            cy.get(`[${listboxListAttr}]:not([${multiSelectAttr}])`).first().focus().within(listbox => {
                // Select first option
                cy.get('li').first().click();
                // Type end key
                cy.wrap(listbox).type('{end}');
                // Check the last option is selected
                cy.get('li').last().should('have.attr', 'aria-selected', 'true');
            });
        });

        it('multi-select listbox should select focused option when space is pressed', () => {
            // Focus first option and press down arrow
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]`).first().focus().type(' ')
                .within(() => {
                    // Check the second option is selected
                    cy.get('li').first().should('have.attr', activeOptionAttr);
                    cy.get('li').first().should('have.attr', 'aria-selected', 'true');
                });
        });

        it('multi-select listbox should focus next option when down arrow is pressed', () => {
            // Focus first option and press down arrow
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]`).first().focus().type('{downarrow}')
                .within(() => {
                    // Check the second option is selected
                    cy.get('li').eq(1).should('have.attr', activeOptionAttr);
                });
        });

        it('multi-select listbox should focus first option when down arrow is pressed on last option', () => {
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]`).first().focus().within(listbox => {
                // Focus last option
                cy.get('li').last().click();
                // Type down arrow
                cy.wrap(listbox).type('{downarrow}');
                // Check the first option is focused
                cy.get('li').first().should('have.attr', activeOptionAttr);
            });
        });

        it('multi-select listbox should focus previous option when up arrow is pressed', () => {
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]`).first().focus().within(listbox => {
                // Focus second option
                cy.get('li').eq(1).click();
                // Type up arrow
                cy.wrap(listbox).type('{uparrow}');
                // Check the first option is focused
                cy.get('li').first().should('have.attr', activeOptionAttr);
            });
        });

        it('multi-select listbox should focus last option when up arrow is pressed on first option', () => {
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]`).first().focus().within(listbox => {
                // Focus first option
                cy.get('li').first().click();
                // Type up arrow
                cy.wrap(listbox).type('{uparrow}');
                // Check the last option is focused
                cy.get('li').last().should('have.attr', activeOptionAttr);
            });
        });

        it('multi-select listbox should focus first option when home key is pressed', () => {
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]`).first().focus().within(listbox => {
                // Focus second option
                cy.get('li').eq(1).click();
                // Type home key
                cy.wrap(listbox).type('{home}');
                // Check the first option is focused
                cy.get('li').first().should('have.attr', activeOptionAttr);
            });
        });

        it('multi-select listbox should focus last option when end key is pressed', () => {
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]`).first().focus().within(listbox => {
                // Focus first option
                cy.get('li').first().click();
                // Type end key
                cy.wrap(listbox).type('{end}');
                // Check the last option is focused
                cy.get('li').last().should('have.attr', activeOptionAttr);
            });
        });

        it('multi-select listbox should focus and select next option when shift + down arrow is pressed', () => {
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]`).first().within(listbox => {
                // Focus first option
                cy.get('li').first().click();
                // Type shift + up arrow
                cy.wrap(listbox).type('{shift}{downarrow}');
                // Check the second option is focused and selected
                cy.get('li').eq(1).should('have.attr', activeOptionAttr);
                cy.get('li').eq(1).should('have.attr', 'aria-selected', 'true');
            });
        });

        it('multi-select listbox should focus and select previous option when shift + up arrow is pressed', () => {
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]`).first().focus().within(listbox => {
                // Focus second option
                cy.get('li').eq(1).click();
                // Type shift + up arrow
                cy.wrap(listbox).type('{shift}{uparrow}');
                // Check the first option is focused and selected
                cy.get('li').first().should('have.attr', activeOptionAttr);
                cy.get('li').first().should('have.attr', 'aria-selected', 'true');
            });
        });

        it('multi-select listbox should select all options between focus and last selected when shift + space is pressed', () => {
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]`).first().focus().within(listbox => {
                // Focus and select first option
                cy.get('li').first().click();
                // Focus 3rd option
                cy.get('li').eq(2);
                // Type shift + space arrow
                cy.wrap(listbox).type('{downarrow}{downarrow}{shift} ');
                // Check the first, second, and third option is focused and selected
                cy.get('li').first().should('have.attr', 'aria-selected', 'true');
                cy.get('li').eq(1).should('have.attr', 'aria-selected', 'true');
                cy.get('li').eq(2).should('have.attr', activeOptionAttr);
                cy.get('li').eq(2).should('have.attr', 'aria-selected', 'true');
            });
        });

        it('multi-select listbox should select all options between focus and first when ctrl + shift + home is pressed', () => {
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]`).first().focus().within(listbox => {
                // Focus and select third option
                cy.get('li').eq(2).click();
                // Type shift + home arrow
                cy.wrap(listbox).type('{ctrl}{shift}{home}');
                // Check the first, second, and third option is focused and selected
                cy.get('li').first().should('have.attr', activeOptionAttr);
                cy.get('li').first().should('have.attr', 'aria-selected', 'true');
                cy.get('li').eq(1).should('have.attr', 'aria-selected', 'true');
                cy.get('li').eq(2).should('have.attr', 'aria-selected', 'true');
            });
        });

        it('multi-select listbox should select all options between focus and last when ctrl + shift + end is pressed', () => {
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]`).first().focus().within(listbox => {
                // Focus and select third from last option
                cy.get('li').eq(9).click();
                // Type shift + home arrow
                cy.wrap(listbox).type('{ctrl}{shift}{end}');
                // Check the first, second, and third option is focused and selected
                cy.get('li').last().should('have.attr', activeOptionAttr);
                cy.get('li').last().should('have.attr', 'aria-selected', 'true');
                cy.get('li').eq(10).should('have.attr', 'aria-selected', 'true');
                cy.get('li').eq(9).should('have.attr', 'aria-selected', 'true');
            });
        });

        it('multi-select listbox should select all options when Ctrl + A is pressed', () => {
            cy.get(`[${multiSelectAttr}]>[${listboxListAttr}]`).first().focus().within(listbox => {
                // Type Ctrl + A arrow
                cy.wrap(listbox).type('{ctrl}a');
                // Check the first, second, and third option is focused and selected
                cy.get('li').first().should('have.attr', activeOptionAttr);
                cy.get('li').should('have.attr', 'aria-selected', 'true');
            });
        });
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

    /* MISC */
    describe('Misc. Tests', () => {
        it('should be able to dynamically populate listbox with options', () => {
            // Get the list box and check it has no options
            cy.get('#dynamic-listbox').as('listbox').find('li').should('have.length', 0);
            // Click the button to populate listbox
            cy.get('#dynamic-listbox-btn').click();
            // Check the list box has options
            cy.get('@listbox').find('li').should('not.have.length', 0);
            // Check that the listbox has the correct role
            cy.get('@listbox').find(`[${listboxListAttr}]`).should('have.attr', 'role', 'listbox');
            // Check that the first option is selected and that they all have the correct role
            cy.get('@listbox').find(`[${listboxListAttr}]>li[aria-selected="true"]`).should('have.length', 1);
            cy.get('@listbox').find(`[${listboxListAttr}]>li`).should('have.attr', 'role', 'option');
        });
    });
});
