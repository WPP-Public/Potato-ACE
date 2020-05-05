import {LISTBOX as LB, ATTRS, searchTimeoutTime} from './listbox';


const IDS = {
  ADD_OPTION_BTN: 'add-option',
  DYNAMIC_LB: 'dynamic-listbox',
  MULTI_SELECT_LB: 'multi-select-listbox',
  REMOVE_OPTION_BTN: 'remove-option',
  SINGLE_SELECT_LB: `single-select-listbox`,
};


context('Listbox', () => {
  before(() => {
    cy.visit(`/listbox`);
  });


  beforeEach(() => {
    cy.get(LB).as('listboxes');

    // Get single-select listbox elements
    cy.get(`#${IDS.SINGLE_SELECT_LB}`)
      .as('singleSelectListbox')
      .find('ul')
      .as('singleSelectListboxList')
      .find('li')
      .as('singleSelectListboxOptions');


    // Get multi-select listbox elements
    cy.get(`#${IDS.MULTI_SELECT_LB}`).as('multiSelectListbox');
    cy.get('@multiSelectListbox')
      .children()
      .as('multiSelectListboxList');
    cy.get('@multiSelectListboxList')
      .find('li')
      .as('multiSelectListboxOptions');

    cy.get(`#${IDS.DYNAMIC_LB}`).as('dynamicListbox');
  });


  describe('Initialisation', () => {
    it('All listboxes should have IDs', () => {
      cy.get('@listboxes').each(listbox => {
        cy.get(listbox).should('have.attr', 'id');
      });
    });


    it('Listbox should add a <ul> if neither a <ul> nor a <ol> is not present', () => {
      cy.get('@dynamicListbox').find('ul').should('have.length', 1);
    });


    it('Single-select listboxes should initialise with correct attributes', () => {
      // Check listbox attributes
      cy.get('@singleSelectListbox').should('not.have.attr', ATTRS.MULTISELECT);

      // Check listbox lists attributes
      cy.get('@singleSelectListboxList').should('have.attr', ATTRS.LIST);
      cy.get('@singleSelectListboxList').should('have.attr', 'role', 'listbox');
      cy.get('@singleSelectListboxList').should('have.attr', 'tabindex', '0');
      cy.get('@singleSelectListboxList').should('not.have.attr', 'aria-activedescendant');
      cy.get('@singleSelectListboxList').should('not.have.attr', 'aria-multiselectable');

      // Check listbox options attributes
      cy.get('@singleSelectListboxOptions').each((listboxOption, index) => {
        cy.get(listboxOption).should('have.attr', ATTRS.OPTION_INDEX, index.toString());
        cy.get(listboxOption).should('have.attr', 'id', `${IDS.SINGLE_SELECT_LB}-option-${(index + 1).toString()}`);
        cy.get(listboxOption).should('have.attr', 'role', 'option');
        cy.get(listboxOption).should('not.have.attr', ATTRS.ACTIVE_OPTION);

        // All listbox options except the first of a single-select listbox should have aria-selected false
        const ariaSelected = (index === 0) ? 'true' : 'false';
        cy.get(listboxOption).should('have.attr', 'aria-selected', ariaSelected);
      });
    });


    it('Multi-select listboxes should initialise with correct attributes', () => {
      // Check listbox attributes
      cy.get('@multiSelectListbox').should('have.attr', ATTRS.MULTISELECT);

      // Check listbox lists attributes
      cy.get('@multiSelectListboxList').should('have.attr', ATTRS.LIST);
      cy.get('@multiSelectListboxList').should('have.attr', 'role', 'listbox');
      cy.get('@multiSelectListboxList').should('have.attr', 'tabindex', '0');
      cy.get('@multiSelectListboxList').should('have.attr', 'aria-multiselectable');
      cy.get('@multiSelectListboxList').should('not.have.attr', 'aria-activedescendant');

      // Check listbox options attributes
      cy.get('@multiSelectListboxOptions').each((listboxOption, index) => {
        cy.get(listboxOption).should('have.attr', ATTRS.OPTION_INDEX, index.toString());
        cy.get(listboxOption).should('have.attr', 'aria-selected', 'false');
        cy.get(listboxOption).should('have.attr', 'id', `${IDS.MULTI_SELECT_LB}-option-${(index + 1).toString()}`);
        cy.get(listboxOption).should('have.attr', 'role', 'option');
        cy.get(listboxOption).should('not.have.attr', ATTRS.ACTIVE_OPTION);
      });
    });


    it('Single-select listbox should set first option as active on initial focus and remove it on blur', () => {
      // Focus on listbox list
      cy.get('@singleSelectListboxList').focus();

      // Check that aria-activedescendant is set
      cy.get('@singleSelectListboxList').should('have.attr', 'aria-activedescendant', `${IDS.SINGLE_SELECT_LB}-option-1`);

      // Check that asce-listbox-active-option is set on first option
      cy.get('@singleSelectListboxOptions')
        .first()
        .should('have.attr', ATTRS.ACTIVE_OPTION);

      // Remove focus from listbox list
      cy.get('@singleSelectListboxList').blur();

      // Check that aria-activedescendant is removed
      cy.get('@singleSelectListboxList').should('not.have.attr', 'aria-activedescendant');

      // Check that asce-listbox-active-option is removed
      cy.get('@singleSelectListboxOptions')
        .first()
        .should('not.have.attr', ATTRS.ACTIVE_OPTION);
    });


    it('Multi-select listbox should set first option as active on initial focus and remove it on blur', () => {
      // Focus on listbox list
      cy.get('@multiSelectListboxList').focus();

      // Check that aria-activedescendant is set
      cy.get('@multiSelectListboxList').should('have.attr', 'aria-activedescendant', `${IDS.MULTI_SELECT_LB}-option-1`);

      // Check that asce-listbox-active-option is set on first option
      cy.get('@multiSelectListboxOptions')
        .first()
        .should('have.attr', ATTRS.ACTIVE_OPTION);

      // Remove focus from listbox list
      cy.get('@multiSelectListboxList').blur();

      // Check that aria-activedescendant is removed
      cy.get('@multiSelectListboxList').should('not.have.attr', 'aria-activedescendant');

      // Check that asce-listbox-active-option is removed
      cy.get('@multiSelectListboxOptions')
        .first()
        .should('not.have.attr', ATTRS.ACTIVE_OPTION);
    });
  });


  describe('Mouse selection', () => {
    beforeEach(() => {
      cy.reload();
    });


    it('Single-select listbox should only allow selection of a single option at a time', () => {
      cy.get('@singleSelectListboxList').focus();

      cy.get('@singleSelectListboxOptions')
        .eq(3)
        .click();

      cy.get('@singleSelectListboxOptions')
        .eq(1)
        .click();

      cy.get('@singleSelectListboxList').should('have.attr', 'aria-activedescendant', `${IDS.SINGLE_SELECT_LB}-option-2`);

      cy.get('@singleSelectListboxOptions').each((option, index) => {
        if (index === 1) {
          cy.get(option).should('have.attr', ATTRS.ACTIVE_OPTION);
          cy.get(option).should('have.attr', 'aria-selected', 'true');
        } else {
          cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
          cy.get(option).should('have.attr', 'aria-selected', 'false');
        }
      });

      cy.get('@singleSelectListboxList').blur();
      cy.get('@singleSelectListboxList').should('not.have.attr', 'aria-activedescendant');

      cy.get('@singleSelectListboxOptions').each((option, index) => {
        cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
        if (index === 1) {
          cy.get(option).should('have.attr', 'aria-selected', 'true');
        } else {
          cy.get(option).should('have.attr', 'aria-selected', 'false');
        }
      });

      cy.get('@singleSelectListboxList').focus();
      cy.get('@singleSelectListboxList').should('have.attr', 'aria-activedescendant', `${IDS.SINGLE_SELECT_LB}-option-2`);

      cy.get('@singleSelectListboxOptions').each((option, index) => {
        if (index === 1) {
          cy.get(option).should('have.attr', ATTRS.ACTIVE_OPTION);
        } else {
          cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
        }
      });
    });


    it('Multi-select listbox should allow selection of multiple options and de-selection', () => {
      cy.get('@multiSelectListboxList').focus();

      // Click on 3rd option
      cy.get('@multiSelectListboxOptions')
        .eq(2)
        .click();

      // Click on 8th option
      cy.get('@multiSelectListboxOptions')
        .eq(7)
        .click();

      // Check listbox list's aria-activedescendant is 8th option
      cy.get('@multiSelectListboxList').should('have.attr', 'aria-activedescendant', `${IDS.MULTI_SELECT_LB}-option-8`);

      // Check 3rd and 8th options are selected and 8th option is active option
      cy.get('@multiSelectListboxOptions').each((option, index) => {
        if (index === 2 || index === 7) {
          cy.get(option).should('have.attr', 'aria-selected', 'true');
        } else {
          cy.get(option).should('have.attr', 'aria-selected', 'false');
        }
        if (index === 7) {
          cy.get(option).should('have.attr', ATTRS.ACTIVE_OPTION);
        } else {
          cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
        }
      });

      // Remove focus and check listbox list has no aria-activedescendant
      cy.get('@multiSelectListboxList').blur();
      cy.get('@multiSelectListboxList').should('not.have.attr', 'aria-activedescendant');

      // Check 3rd and 8th options are selected and 8th option there is no active option
      cy.get('@multiSelectListboxOptions').each((option, index) => {
        cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
        if (index === 2 || index === 7) {
          cy.get(option).should('have.attr', 'aria-selected', 'true');
        } else {
          cy.get(option).should('have.attr', 'aria-selected', 'false');
        }
      });

      // Refocus and check listbox list's aria-activedescendant is 8th option
      cy.get('@multiSelectListboxList').focus();
      cy.get('@multiSelectListboxList').should('have.attr', 'aria-activedescendant', `${IDS.MULTI_SELECT_LB}-option-8`);

      // Check 3rd and 8th options are selected and 8th option is active option
      cy.get('@multiSelectListboxOptions').each((option, index) => {
        if (index === 2 || index === 7) {
          cy.get(option).should('have.attr', 'aria-selected', 'true');
        } else {
          cy.get(option).should('have.attr', 'aria-selected', 'false');
        }
        if (index === 7) {
          cy.get(option).should('have.attr', ATTRS.ACTIVE_OPTION);
        } else {
          cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
        }
      });

      // Deselect options
      cy.get('@multiSelectListboxOptions')
        .eq(2)
        .click();

      // Check listbox list's aria-activedescendant is now 3rd option
      cy.get('@multiSelectListboxList').should('have.attr', 'aria-activedescendant', `${IDS.MULTI_SELECT_LB}-option-3`);

      // Check 3rd option is active option and only 8th option is selected
      cy.get('@multiSelectListboxOptions').each((option, index) => {
        if (index === 7) {
          cy.get(option).should('have.attr', 'aria-selected', 'true');
        } else {
          cy.get(option).should('have.attr', 'aria-selected', 'false');
        }
        if (index === 2) {
          cy.get(option).should('have.attr', ATTRS.ACTIVE_OPTION);
        } else {
          cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
        }
      });
    });


    it('Multi-select listbox should allow selection of range using shift key', () => {
      cy.get('@multiSelectListboxList').focus();

      cy.get('@multiSelectListboxOptions')
        .eq(4)
        .click();

      cy.get('body')
        .type('{shift}', { release: false })
        .get('@multiSelectListboxOptions')
        .eq(1)
        .click();

      // Check listbox list's aria-activedescendant is 2nd option
      cy.get('@multiSelectListboxList').should('have.attr', 'aria-activedescendant', `${IDS.MULTI_SELECT_LB}-option-2`);

      // Check all options between 2nd and 5th inclusive are selected and that 2nd option is active
      cy.get('@multiSelectListboxOptions').each((option, index) => {
        if (index > 0 && index < 5) {
          cy.get(option).should('have.attr', 'aria-selected', 'true');
        } else {
          cy.get(option).should('have.attr', 'aria-selected', 'false');
        }
        if (index === 1) {
          cy.get(option).should('have.attr', ATTRS.ACTIVE_OPTION);
        } else {
          cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
        }
      });
    });
  });


  describe('Keyboard interaction', () => {
    beforeEach(() => {
      cy.reload();
    });


    it('UP & DOWN should change active & selected option for single-select listbox correctly', () => {
      // Test Up key
      cy.get('@singleSelectListboxList')
        .focus()
        .type('{uparrow}')
        .should('have.attr', 'aria-activedescendant', `${IDS.SINGLE_SELECT_LB}-option-12`);

      // Check that only one option is active and that active option is selected
      cy.get('@singleSelectListboxOptions').each((option, index) => {
        if (index === 11) {
          cy.get(option).should('have.attr', ATTRS.ACTIVE_OPTION);
          cy.get(option).should('have.attr', 'aria-selected', 'true');
        } else {
          cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
          cy.get(option).should('have.attr', 'aria-selected', 'false');
        }
      });

      cy.get('@singleSelectListboxList')
        .type('{uparrow}')
        .type('{uparrow}')
        .should('have.attr', 'aria-activedescendant', `${IDS.SINGLE_SELECT_LB}-option-10`);
      cy.get('@singleSelectListboxOptions')
        .eq(9)
        .should('have.attr', ATTRS.ACTIVE_OPTION);


      // Test Down key
      cy.get('@singleSelectListboxList')
        .type('{downarrow}')
        .type('{downarrow}')
        .type('{downarrow}')
        .should('have.attr', 'aria-activedescendant', `${IDS.SINGLE_SELECT_LB}-option-1`);
      cy.get('@singleSelectListboxOptions')
        .first()
        .should('have.attr', ATTRS.ACTIVE_OPTION);

      cy.get('@singleSelectListboxList')
        .type('{downarrow}')
        .should('have.attr', 'aria-activedescendant', `${IDS.SINGLE_SELECT_LB}-option-2`);
      cy.get('@singleSelectListboxOptions')
        .eq(1)
        .should('have.attr', ATTRS.ACTIVE_OPTION);
    });


    it('UP & DOWN should change active option correctly for multi-select listbox', () => {
      // Test UP
      cy.get('@multiSelectListboxList')
        .focus()
        .type('{uparrow}')
        .should('have.attr', 'aria-activedescendant', `${IDS.MULTI_SELECT_LB}-option-12`);

      // Check that only one option is active and that selected option has not changed
      cy.get('@multiSelectListboxOptions').each((option, index) => {
        cy.get(option).should('have.attr', 'aria-selected', 'false');

        if (index === 11) {
          cy.get(option).should('have.attr', ATTRS.ACTIVE_OPTION);
        } else {
          cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
        }
      });

      // Test multiple UP presses
      cy.get('@multiSelectListboxList')
        .type('{uparrow}')
        .type('{uparrow}')
        .type('{uparrow}')
        .should('have.attr', 'aria-activedescendant', `${IDS.MULTI_SELECT_LB}-option-9`);
      cy.get('@multiSelectListboxOptions')
        .eq(8)
        .should('have.attr', ATTRS.ACTIVE_OPTION);


      // Test multiple DOWN presses
      cy.get('@multiSelectListboxList')
        .type('{downarrow}')
        .type('{downarrow}')
        .type('{downarrow}')
        .type('{downarrow}')
        .type('{downarrow}')
        .should('have.attr', 'aria-activedescendant', `${IDS.MULTI_SELECT_LB}-option-2`);
      cy.get('@multiSelectListboxOptions')
        .eq(1)
        .should('have.attr', ATTRS.ACTIVE_OPTION);


      // Test DOWN
      cy.get('@multiSelectListboxList')
        .type('{downarrow}')
        .should('have.attr', 'aria-activedescendant', `${IDS.MULTI_SELECT_LB}-option-3`);
      cy.get('@multiSelectListboxOptions')
        .eq(2)
        .should('have.attr', ATTRS.ACTIVE_OPTION);

      // Check that only one option is active and that selected option has not changed
      cy.get('@multiSelectListboxOptions').each((option, index) => {
        cy.get(option).should('have.attr', 'aria-selected', 'false');

        if (index === 2) {
          cy.get(option).should('have.attr', ATTRS.ACTIVE_OPTION);
        } else {
          cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
        }
      });
    });


    it('Keyboard keys should select options in multi-select listbox correctly', () => {
      /*
        Expected state from w3.org (https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox):

        Space: changes the selection state of the focused option.
        Shift + Space (Optional): Selects contiguous items from the most recently selected item to the focused item.
        Shift + Down Arrow (Optional): Moves focus to and toggles the selected state of the next option.
        Shift + Up Arrow (Optional): Moves focus to and toggles the selected state of the previous option.
        Control + A (Optional): Selects all options in the list. Optionally, if all options are selected, it may also unselect all options.
        Control + Shift + Home (Optional): Selects the focused option and all options up to the first option. Optionally, moves focus to the first option.
        Control + Shift + End (Optional): Selects the focused option and all options down to the last option. Optionally, moves focus to the last option.
      */

      // Test SPACE selection
      cy.get('@multiSelectListboxList')
        .focus()
        .type(' ');
      cy.get('@multiSelectListboxOptions')
        .first()
        .should('have.attr', ATTRS.ACTIVE_OPTION);
      cy.get('@multiSelectListboxOptions')
        .first()
        .should('have.attr', 'aria-selected', 'true');

      // Test SPACE deselection
      cy.get('@multiSelectListboxList')
        .type(' ');
      cy.get('@multiSelectListboxOptions')
        .first()
        .should('have.attr', ATTRS.ACTIVE_OPTION);
      cy.get('@multiSelectListboxOptions')
        .first()
        .should('have.attr', 'aria-selected', 'false');


      // Test SHIFT + SPACE when only first option in range is selected
      cy.get('@multiSelectListboxList')
        .type('{downarrow}')
        .type(' ')
        .type('{downarrow}')
        .type('{downarrow}')
        .type('{shift} ');

      cy.get('@multiSelectListboxOptions').each((option, index) => {
        if (index === 3) {
          cy.get(option).should('have.attr', ATTRS.ACTIVE_OPTION);
        } else {
          cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
        }
        if (0 < index && index < 4) {
          cy.get(option).should('have.attr', 'aria-selected', 'true');
        } else {
          cy.get(option).should('have.attr', 'aria-selected', 'false');
        }
      });

      // Test SHIFT + SPACE selection when some options in range are selected
      cy.get('@multiSelectListboxList')
        .type('{downarrow}')
        .type('{downarrow}')
        .type(' ')
        .type('{uparrow}')
        .type('{uparrow}')
        .type('{uparrow}')
        .type('{uparrow}')
        .type('{shift} ');
      cy.get('@multiSelectListboxOptions').each((option, index) => {
        if (index === 1) {
          cy.get(option).should('have.attr', ATTRS.ACTIVE_OPTION);
        } else {
          cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
        }
        if (0 < index && index < 6) {
          cy.get(option).should('have.attr', 'aria-selected', 'true');
        } else {
          cy.get(option).should('have.attr', 'aria-selected', 'false');
        }
      });

      // Test SHIFT + SPACE after looping around
      cy.get('@multiSelectListboxList')
        .type('{uparrow}')
        .type('{uparrow}')
        .type('{uparrow}')
        .type('{uparrow}')
        .type('{shift} ');
      cy.get('@multiSelectListboxOptions').each((option, index) => {
        if (index === 9) {
          cy.get(option).should('have.attr', ATTRS.ACTIVE_OPTION);
        } else {
          cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
        }
        if (0 < index && index < 10) {
          cy.get(option).should('have.attr', 'aria-selected', 'true');
        } else {
          cy.get(option).should('have.attr', 'aria-selected', 'false');
        }
      });

      // Test SHIFT + DOWN
      cy.get('@multiSelectListboxList')
        .type('{shift}{downarrow}')
        .type('{shift}{downarrow}')
        .type('{shift}{downarrow}')
        .type('{shift}{downarrow}')
        .type('{shift}{downarrow}');
      cy.get('@multiSelectListboxOptions').each((option, index) => {
        if (index === 2) {
          cy.get(option).should('have.attr', ATTRS.ACTIVE_OPTION);
        } else {
          cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
        }
        if (index === 1 || index === 2) {
          cy.get(option).should('have.attr', 'aria-selected', 'false');
        } else {
          cy.get(option).should('have.attr', 'aria-selected', 'true');
        }
      });

      // Test SHIFT + UP
      cy.get('@multiSelectListboxList')
        .type('{downarrow}')
        .type('{downarrow}')
        .type('{shift}{uparrow}')
        .type('{shift}{uparrow}')
        .type('{shift}{uparrow}')
        .type('{shift}{uparrow}')
        .type('{shift}{uparrow}')
        .type('{shift}{uparrow}')
        .type('{shift}{uparrow}')
        .type('{shift}{uparrow}');
      cy.get('@multiSelectListboxOptions').each((option, index) => {
        if (index === 8) {
          cy.get(option).should('have.attr', ATTRS.ACTIVE_OPTION);
        } else {
          cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
        }
        if (index === 0 || index === 3 || index > 7) {
          cy.get(option).should('have.attr', 'aria-selected', 'false');
        } else {
          cy.get(option).should('have.attr', 'aria-selected', 'true');
        }
      });

      // Test CTRL + A selection & deselection
      cy.get('@multiSelectListboxList')
        .type('{ctrl}a');
      cy.get('@multiSelectListboxOptions').each((option, index) => {
        cy.get(option).should('have.attr', 'aria-selected', 'true');
        if (index === 8) {
          cy.get(option).should('have.attr', ATTRS.ACTIVE_OPTION);
        } else {
          cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
        }
      });
      cy.get('@multiSelectListboxList')
        .type('{uparrow}')
        .type('{ctrl}a');
      cy.get('@multiSelectListboxOptions').each((option, index) => {
        cy.get(option).should('have.attr', 'aria-selected', 'false');
        if (index === 7) {
          cy.get(option).should('have.attr', ATTRS.ACTIVE_OPTION);
        } else {
          cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
        }
      });

      // Test CTRL + SHIFT + END
      cy.get('@multiSelectListboxList')
        .type('{ctrl}{shift}{end}');
      cy.get('@multiSelectListboxOptions').each((option, index) => {
        if (index === 11) {
          cy.get(option).should('have.attr', ATTRS.ACTIVE_OPTION);
        } else {
          cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
        }
        if (index > 6) {
          cy.get(option).should('have.attr', 'aria-selected', 'true');
        } else {
          cy.get(option).should('have.attr', 'aria-selected', 'false');
        }
      });

      // Test CTRL + SHIFT + HOME
      cy.get('@multiSelectListboxList')
        .type('{downarrow}')
        .type('{downarrow}')
        .type('{downarrow}')
        .type('{ctrl}{shift}{home}');
      cy.get('@multiSelectListboxOptions').each((option, index) => {
        if (index === 0) {
          cy.get(option).should('have.attr', ATTRS.ACTIVE_OPTION);
        } else {
          cy.get(option).should('not.have.attr', ATTRS.ACTIVE_OPTION);
        }
        if (index < 3 || index > 6) {
          cy.get(option).should('have.attr', 'aria-selected', 'true');
        } else {
          cy.get(option).should('have.attr', 'aria-selected', 'false');
        }
      });
    });
  });


  describe('Type-ahead interaction', () => {
    beforeEach(() => {
      cy.reload();
    });


    it('Typing a character that leads to no match should not change active option', () => {
      cy.get('@singleSelectListboxList')
        .focus()
        .type('z')
        .should('have.attr', 'aria-activedescendant', `${IDS.SINGLE_SELECT_LB}-option-1`);
    });


    it('Typing a single character should select first matching option', () => {
      cy.get('@singleSelectListboxList')
        .focus()
        .type('h')
        .should('have.attr', 'aria-activedescendant', `${IDS.SINGLE_SELECT_LB}-option-3`);
    });


    it('Typing character sequence should select first matching option', () => {
      cy.get('@singleSelectListboxList')
        .focus()
        .type('s')
        .type('p')
        .type('i')
        .should('have.attr', 'aria-activedescendant', `${IDS.SINGLE_SELECT_LB}-option-10`);
    });


    it('Typing a single character should select first matching option even if it\'s above active option', () => {
      cy.get('@singleSelectListboxList')
        .focus()
        .type('{downarrow}')
        .type('i')
        .should('have.attr', 'aria-activedescendant', `${IDS.SINGLE_SELECT_LB}-option-1`);
    });


    it('Typing character sequence should select first matching option even if it\'s above active option', () => {
      cy.get('@singleSelectListboxList')
        .focus()
        .type('{uparrow}')
        .type('{uparrow}')
        .type('{uparrow}')
        .type('{uparrow}')
        .type('{uparrow}')
        .type('s')
        .type('c')
        .should('have.attr', 'aria-activedescendant', `${IDS.SINGLE_SELECT_LB}-option-7`);
    });


    it('Typing a character twice without delay should select first matching option', () => {
      cy.get('@singleSelectListboxList')
        .focus()
        .type('c')
        .type('c')
        .should('have.attr', 'aria-activedescendant', `${IDS.SINGLE_SELECT_LB}-option-5`);
    });


    it('Typing a character twice with short delay should select second matching option', () => {
      cy.get('@singleSelectListboxList')
        .focus()
        .type('b', {delay: searchTimeoutTime})
        .type('b')
        .should('have.attr', 'aria-activedescendant', `${IDS.SINGLE_SELECT_LB}-option-9`);
    });


    it('Typing a character twice with short delay should select second matching option even if it\'s above active option', () => {
      cy.get('@singleSelectListboxList')
        .focus()
        .type('{uparrow}')
        .type('{uparrow}')
        .type('{uparrow}')
        .type('{uparrow}')
        .type('{uparrow}')
        .type('b', {delay: searchTimeoutTime})
        .type('b')
        .should('have.attr', 'aria-activedescendant', `${IDS.SINGLE_SELECT_LB}-option-6`);
    });
  });


  describe('Listbox with dynamic options', () => {
    beforeEach(() => {
      cy.reload();

      cy.get(`#${IDS.ADD_OPTION_BTN}`).as('addOptionBtn');
      cy.get(`#${IDS.REMOVE_OPTION_BTN}`).as('removeOptionBtn');

      cy.get('@dynamicListbox')
        .find('ul')
        .as('dynamicListboxList');
    });


    it('Listbox with dynamically added options should intiialise correctly', () => {
      cy.get('@addOptionBtn')
        .click()
        .click()
        .click();

      cy.get('@dynamicListbox')
        .find('li')
        .as('dynamicListboxOptions');

      // Check listbox lists attributes
      cy.get('@dynamicListboxList').should('have.attr', ATTRS.LIST);
      cy.get('@dynamicListboxList').should('have.attr', 'role', 'listbox');
      cy.get('@dynamicListboxList').should('have.attr', 'tabindex', '0');
      cy.get('@dynamicListboxList').should('not.have.attr', 'aria-activedescendant');
      cy.get('@dynamicListboxList').should('not.have.attr', 'aria-multiselectable');

      // Check listbox options attributes
      cy.get('@dynamicListboxOptions').each((listboxOption, index) => {
        cy.get(listboxOption).should('have.attr', ATTRS.OPTION_INDEX, index.toString());
        cy.get(listboxOption).should('have.attr', 'id', `${IDS.DYNAMIC_LB}-option-${(index + 1).toString()}`);
        cy.get(listboxOption).should('have.attr', 'role', 'option');
        cy.get(listboxOption).should('not.have.attr', ATTRS.ACTIVE_OPTION);

        // All listbox options except the first of a single-select listbox should have aria-selected false
        const ariaSelected = (index === 0) ? 'true' : 'false';
        cy.get(listboxOption).should('have.attr', 'aria-selected', ariaSelected);
      });
    });


    it('Listbox with dynamically removed option should re-intialise correctly', () => {
      cy.get('@addOptionBtn')
        .click()
        .click();
      cy.get('@removeOptionBtn').click();

      cy.get('@dynamicListbox')
        .find('li')
        .as('dynamicListboxOptions');

      cy.get('@dynamicListboxOptions').each((listboxOption, index) => {
        cy.get(listboxOption).should('have.attr', ATTRS.OPTION_INDEX, index.toString());
        cy.get(listboxOption).should('have.attr', 'role', 'option');
        cy.get(listboxOption).should('not.have.attr', ATTRS.ACTIVE_OPTION);

        // All listbox options except the first of a single-select listbox should have aria-selected false
        const ariaSelected = (index === 0) ? 'true' : 'false';
        cy.get(listboxOption).should('have.attr', 'aria-selected', ariaSelected);
      });
    });
  });
});
