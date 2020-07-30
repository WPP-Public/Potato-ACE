import {ATTRS, COMBOBOX, EVENTS} from './combobox';


const IDS = {
  AC_BOTH_AS_CB: `${COMBOBOX}-ac-both-as`,
  AC_BOTH_CB: `${COMBOBOX}-ac-both`,
  AC_LIST_AS_CB: `${COMBOBOX}-ac-list-as`,
  AC_LIST_CB: `${COMBOBOX}-ac-list`,
  ADD_OPTIONS_BTN: 'add-options-btn',
  BASIC_AS_CB: `${COMBOBOX}-basic-as`,
  BASIC_CB: `${COMBOBOX}-basic`,
  CUSTOM_EVENTS_CB: `${COMBOBOX}-custom-events`,
  DYNAMIC_CB: `${COMBOBOX}-dynamic-options`,
  HIDE_LIST_BTN: 'hide-list-btn',
  SEARCH_CB: 'search-combobox',
  SELECT_OPTION_BTN: 'select-option-btn',
  SELECT_OPTION_NUMBER_INPUT: 'select-option-number-input',
  SHOW_LIST_BTN: 'show-list-btn',
};


context(`Combobox`, () => {
  before(() => {
    cy.visit(`/combobox`);
  });


  context(`Manual selection Comboboxes`, () => {
    describe(`Basic Combobox`, () => {
      beforeEach(() => {
        cy.get(`#${IDS.BASIC_CB}`)
          .as('basicCb')
          .find('input')
          .as('basicCbInput');
        cy.get('@basicCb')
          .find('ul')
          .as('basicCbList');
        cy.get('@basicCb')
          .find('label')
          .as('basicCbLabel');
        cy.get('@basicCb')
          .find('li')
          .as('basicCbOptions');

        // Reset input state before each test
        cy.get('@basicCbInput').focus().clear().type('{esc}').blur();
      });


      it(`Should initialise with correct attributes`, () => {
        const INPUT_ID = `${IDS.BASIC_CB}-input`;
        const LIST_ID = `${IDS.BASIC_CB}-list`;

        cy.get('@basicCbLabel').should('have.attr', 'for', INPUT_ID);

        cy.get('@basicCbInput')
          .should('have.attr', 'id', INPUT_ID)
          .and('have.attr', 'aria-autocomplete', 'none')
          .and('have.attr', 'aria-expanded', 'false')
          .and('have.attr', 'aria-haspopup', 'true')
          .and('have.attr', 'aria-owns', LIST_ID)
          .and('have.attr', 'role', 'combobox')
          .and('have.attr', 'type', 'text');

        cy.get('@basicCbList')
          .should('have.attr', 'id', `${IDS.BASIC_CB}-list`)
          .and('have.attr', ATTRS.LIST, '')
          .and('have.attr', ATTRS.LIST_VISIBLE, 'false')
          .and('have.attr', 'role', 'listbox')
          .and('not.have.attr', 'tabindex');

        cy.get('@basicCbOptions').each(($option, index) => {
          cy.wrap($option)
            .should('have.attr', 'id', `${IDS.BASIC_CB}-option-${index + 1}`)
            .and('have.attr', ATTRS.OPTION, '')
            .and('have.attr', 'aria-selected', 'false')
            .and('have.attr', 'role', 'option')
            .and('not.have.attr', ATTRS.OPTION_SELECTED);
        });
      });


      describe(`Focus interactions`, () => {
        it(`Focusing on input should show list and losing focus should hide list`, () => {
          cy.get('@basicCbInput').focus();
          cy.get('@basicCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');

          cy.get('@basicCbInput').blur();
          cy.get('@basicCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');
        });


        it(`Input losing focus with option selected should choose option`, () => {
          cy.get('@basicCbInput')
            .focus()
            .type('{downarrow}')
            .blur()
            .should('have.value', 'Iron Man')
            .and('have.attr', 'aria-expanded', 'false');
          cy.get('@basicCbOptions').eq(0).should('have.attr', 'aria-selected', 'false');
        });
      });


      it(`Clicking an option should hide list and change input's text to match the option's`, () => {
        cy.window().then((window) => {
          window.addEventListener(EVENTS.OUT.OPTION_CHOSEN, (e) => {
            expect(e.detail.id).to.equal(IDS.BASIC_CB);
            expect(e.detail.chosenOptionId).to.equal(`${IDS.BASIC_CB}-option-4`);
          }, {once: true});
        });

        cy.get('@basicCbInput').focus().type('{downarrow}');
        cy.get('@basicCbOptions').eq(3).click();
        cy.get('@basicCbInput').should('have.value', 'Thor');
        cy.get('@basicCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');
      });


      describe(`Keyboard interactions`, () => {
        it(`ESC on input should hide the list without choosing selected option`, () => {
          cy.get('@basicCbInput')
            .focus()
            .type('{uparrow}')
            .type('{esc}')
            .should('have.value', '');
          cy.get('@basicCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');
        });


        it(`ENTER on input when list hidden should have no effect`, () => {
          cy.get('@basicCbInput')
            .focus()
            .type('{downarrow}{esc}{enter}')
            .should('have.value', '');
        });


        it(`ENTER should choose selected option, updating input value to match it's value, and hide the list`, () => {
          cy.window().then((window) => {
            window.addEventListener(EVENTS.OUT.OPTION_CHOSEN, (e) => {
              expect(e.detail.id).to.equal(IDS.BASIC_CB);
              expect(e.detail.chosenOptionId).to.equal(`${IDS.BASIC_CB}-option-9`);
            }, {once: true});
          });

          cy.get('@basicCbInput')
            .focus()
            .type('{uparrow}{uparrow}{uparrow}{uparrow}{enter}')
            .should('have.attr', 'aria-expanded', 'false')
            .and('have.value', 'Black Panther');
        });


        it(`DOWN arrow should show list and change selected option correctly`, () => {
          cy.get('@basicCbInput')
            .focus()
            .type('{downarrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.BASIC_CB}-option-1`);
          cy.get('@basicCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
          cy.get('@basicCbOptions').eq(0)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');

          cy.get('@basicCbInput')
            .type('{downarrow}{downarrow}{downarrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.BASIC_CB}-option-4`);
          cy.get('@basicCbOptions').eq(3)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');
        });


        it(`UP arrow should show list and change selected option correctly`, () => {
          cy.get('@basicCbInput')
            .focus()
            .type('{uparrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.BASIC_CB}-option-12`);
          cy.get('@basicCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
          cy.get('@basicCbOptions').eq(11)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');

          cy.get('@basicCbInput')
            .type('{uparrow}{uparrow}{uparrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.BASIC_CB}-option-9`);

          cy.get('@basicCbOptions').eq(8)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');
        });


        it(`Selected option position in list should not reset when list hidden after choosing option`, () => {
          cy.get('@basicCbInput')
            .focus()
            .type('{uparrow}{uparrow}{uparrow}{enter}{downarrow}{downarrow}{downarrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.BASIC_CB}-option-1`);

          cy.get('@basicCbInput')
            .focus()
            .type('{uparrow}');
          cy.get('@basicCbOptions').eq(7).click();
          cy.get('@basicCbInput')
            .type('{uparrow}{uparrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.BASIC_CB}-option-6`);
        });


        it(`Typing string in input should show list`, () => {
          cy.get('@basicCbInput')
            .focus()
            .type('c');
          cy.get('@basicCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
          cy.get('@basicCbOptions').should('have.length', 12);
        });
      });
    });


    describe(`Autocomplete list Combobox`, () => {
      beforeEach(() => {
        cy.get(`#${IDS.AC_LIST_CB}`)
          .as('acListCb')
          .find('input')
          .as('acListCbInput');
        cy.get('@acListCb')
          .find('ul')
          .as('acListCbList');
        cy.get('@acListCb')
          .find('label')
          .as('acListCbLabel');
        cy.get('@acListCb')
          .find('li')
          .as('acListCbOptions');

        // Reset input state before each test
        cy.get('@acListCbInput').focus().clear().type('{esc}').blur();
      });


      it(`Should initialise with correct attributes`, () => {
        const INPUT_ID = `${IDS.AC_LIST_CB}-input`;
        const LIST_ID = `${IDS.AC_LIST_CB}-list`;

        cy.get('@acListCbLabel').should('have.attr', 'for', INPUT_ID);

        cy.get('@acListCbInput')
          .should('have.attr', 'id', INPUT_ID)
          .and('have.attr', 'aria-autocomplete', 'list')
          .and('have.attr', 'aria-expanded', 'false')
          .and('have.attr', 'aria-haspopup', 'true')
          .and('have.attr', 'aria-owns', LIST_ID)
          .and('have.attr', 'role', 'combobox')
          .and('have.attr', 'type', 'text');

        cy.get('@acListCbList')
          .should('have.attr', 'id', `${IDS.AC_LIST_CB}-list`)
          .and('have.attr', ATTRS.LIST, '')
          .and('have.attr', ATTRS.LIST_VISIBLE, 'false')
          .and('have.attr', 'role', 'listbox')
          .and('not.have.attr', 'tabindex');

        cy.get('@acListCbOptions').each(($option, index) => {
          cy.wrap($option)
            .should('have.attr', 'id', `${IDS.AC_LIST_CB}-option-${index + 1}`)
            .and('have.attr', ATTRS.OPTION, '')
            .and('have.attr', 'aria-selected', 'false')
            .and('have.attr', 'role', 'option')
            .and('not.have.attr', ATTRS.OPTION_SELECTED);
        });
      });


      describe(`Focus interactions`, () => {
        it(`Focusing on input should not show list and losing focus should hide list`, () => {
          cy.get('@acListCbInput').focus();
          cy.get('@acListCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');

          cy.get('@acListCbInput')
            .type('{downarrow}')
            .type('{esc}');
          cy.get('@acListCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');
        });


        it(`Input losing focus with option selected should choose option`, () => {
          cy.get('@acListCbInput')
            .focus()
            .type('{uparrow}')
            .blur()
            .should('have.value', 'Captain Marvel')
            .and('have.attr', 'aria-expanded', 'false');
        });
      });


      it(`Clicking an option should remove all other options from list and hide it, and change input's text to match the option's`, () => {
        cy.get('@acListCbInput')
          .focus()
          .type('{downarrow}');
        cy.get('@acListCbOptions').eq(2)
          .click();
        cy.get('@acListCbOptions').should('have.length', 1);
        cy.get('@acListCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');
        cy.get('@acListCbInput').should('have.value', 'Hulk');
      });


      describe(`Keyboard interactions`, () => {
        it(`ESC on input should hide the list without choosing selected option`, () => {
          cy.get('@acListCbInput')
            .focus()
            .type('{uparrow}')
            .type('{esc}')
            .should('have.value', '');
          cy.get('@acListCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');
        });


        it(`ENTER on input when list hidden should have no effect`, () => {
          cy.get('@acListCbInput')
            .focus()
            .type('{downarrow}{esc}{enter}')
            .should('have.value', '');
        });


        it(`ENTER should choose selected option, updating input value to match it's value, reduce list to selected value and hide the list`, () => {
          cy.get('@acListCbInput')
            .focus()
            .type('{uparrow}{uparrow}{uparrow}{enter}')
            .should('have.attr', 'aria-expanded', 'false')
            .and('have.value', 'Spider-man');
          cy.get('@acListCbOptions').should('have.length', 1);
        });


        it(`DOWN arrow should show list and change selected option correctly`, () => {
          cy.get('@acListCbInput')
            .focus()
            .type('{downarrow}{downarrow}{downarrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.AC_LIST_CB}-option-3`);
          cy.get('@acListCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
          cy.get('@acListCbOptions').eq(2)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');

          cy.get('@acListCbInput')
            .type('{downarrow}{downarrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.AC_LIST_CB}-option-5`);
          cy.get('@acListCbOptions').eq(4)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');
        });


        it(`UP arrow should show list and change selected option correctly`, () => {
          cy.get('@acListCbInput')
            .focus()
            .type('{uparrow}{uparrow}{uparrow}{uparrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.AC_LIST_CB}-option-9`);
          cy.get('@acListCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
          cy.get('@acListCbOptions').eq(8)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');

          cy.get('@acListCbInput')
            .type('{uparrow}{uparrow}{uparrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.AC_LIST_CB}-option-6`);

          cy.get('@acListCbOptions').eq(5)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');
        });


        it(`Typing string in input should show list and remove options with text that doesn't start with string`, () => {
          cy.get('@acListCbInput')
            .focus()
            .type('sp');
          cy.get('@acListCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
          cy.get('@acListCbOptions').should('have.length', 1);

          cy.get('@acListCbInput').type('a');
          cy.get('@acListCbOptions').should('have.length', 0);

          cy.get('@acListCbInput').type('{backspace}{backspace}');
          cy.get('@acListCbOptions').should('have.length', 2);
        });
      });
    });


    describe(`Autocomplete both Combobox`, () => {
      beforeEach(() => {
        cy.get(`#${IDS.AC_BOTH_CB}`)
          .as('acBothCb')
          .find('input')
          .as('acBothCbInput');
        cy.get('@acBothCb')
          .find('ul')
          .as('acBothCbList');
        cy.get('@acBothCb')
          .find('label')
          .as('acBothCbLabel');
        cy.get('@acBothCb')
          .find('li')
          .as('acBothCbOptions');

        // Reset input state before each test
        cy.get('@acBothCbInput').focus().clear().type('{esc}').blur();
      });


      it(`Should initialise with correct attributes`, () => {
        const INPUT_ID = `${IDS.AC_BOTH_CB}-input`;
        const LIST_ID = `${IDS.AC_BOTH_CB}-list`;

        cy.get('@acBothCbLabel').should('have.attr', 'for', INPUT_ID);

        cy.get('@acBothCbInput')
          .should('have.attr', 'id', INPUT_ID)
          .and('have.attr', 'aria-autocomplete', 'both')
          .and('have.attr', 'aria-expanded', 'false')
          .and('have.attr', 'aria-haspopup', 'true')
          .and('have.attr', 'aria-owns', LIST_ID)
          .and('have.attr', 'role', 'combobox')
          .and('have.attr', 'type', 'text');

        cy.get('@acBothCbList')
          .should('have.attr', 'id', `${IDS.AC_BOTH_CB}-list`)
          .and('have.attr', ATTRS.LIST, '')
          .and('have.attr', ATTRS.LIST_VISIBLE, 'false')
          .and('have.attr', 'role', 'listbox')
          .and('not.have.attr', 'tabindex');

        cy.get('@acBothCbOptions').each(($option, index) => {
          cy.wrap($option)
            .should('have.attr', 'id', `${IDS.AC_BOTH_CB}-option-${index + 1}`)
            .and('have.attr', ATTRS.OPTION, '')
            .and('have.attr', 'aria-selected', 'false')
            .and('have.attr', 'role', 'option')
            .and('not.have.attr', ATTRS.OPTION_SELECTED);
        });
      });


      describe(`Focus interactions`, () => {
        it(`Focusing on input should not show list and losing focus should hide list`, () => {
          cy.get('@acBothCbInput').focus();
          cy.get('@acBothCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');

          cy.get('@acBothCbInput')
            .type('{downarrow}')
            .type('{esc}');
          cy.get('@acBothCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');
        });


        it(`Input losing focus with option selected should choose option`, () => {
          cy.get('@acBothCbInput')
            .focus()
            .type('{uparrow}')
            .blur()
            .should('have.value', 'Captain Marvel')
            .and('have.attr', 'aria-expanded', 'false');
        });
      });


      describe(`Mouse interactions`, () => {
        it(`Clicking an option should remove all other options from list and hide it, and change input's text to match the option's`, () => {
          cy.get('@acBothCbInput')
            .focus()
            .type('{downarrow}');
          cy.get('@acBothCbOptions').eq(10)
            .click();
          cy.get('@acBothCbOptions').should('have.length', 1);
          cy.get('@acBothCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');
          cy.get('@acBothCbInput').should('have.value', 'Doctor Strange');
        });
      });


      describe(`Keyboard interactions`, () => {
        it(`ESC on input should hide the list without choosing selected option`, () => {
          cy.get('@acBothCbInput')
            .focus()
            .type('{uparrow}')
            .type('{esc}')
            .should('have.value', '');
          cy.get('@acBothCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');
        });


        it(`ENTER on input when list hidden should have no effect`, () => {
          cy.get('@acBothCbInput')
            .focus()
            .type('{downarrow}{esc}{enter}')
            .should('have.value', '');
        });


        it(`ENTER should choose selected option, updating input value to match it's value, reduce list to selected value and hide the list`, () => {
          cy.get('@acBothCbInput')
            .focus()
            .type('{uparrow}{uparrow}{enter}')
            .should('have.attr', 'aria-expanded', 'false')
            .and('have.value', 'Doctor Strange');
          cy.get('@acBothCbOptions').should('have.length', 1);
        });


        it(`DOWN arrow should show list, change selected option correctly and autocomplete input`, () => {
          cy.get('@acBothCbInput')
            .focus()
            .type('{downarrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.AC_BOTH_CB}-option-1`)
            .and('have.value', 'Iron Man');
          cy.get('@acBothCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
          cy.get('@acBothCbOptions').eq(0)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');

          cy.get('@acBothCbInput')
            .type('{downarrow}{downarrow}{downarrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.AC_BOTH_CB}-option-4`)
            .and('have.value', 'Thor');
          cy.get('@acBothCbOptions').eq(3)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');
        });


        it(`UP arrow should show list, change selected option correctly and autocomplete input`, () => {
          cy.get('@acBothCbInput')
            .focus()
            .type('{uparrow}{uparrow}{uparrow}{uparrow}{uparrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.AC_BOTH_CB}-option-8`)
            .and('have.value', 'Ant-Man');
          cy.get('@acBothCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
          cy.get('@acBothCbOptions').eq(7)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');

          cy.get('@acBothCbInput')
            .type('{uparrow}{uparrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.AC_BOTH_CB}-option-6`)
            .and('have.value', 'Black Widow');
          cy.get('@acBothCbOptions').eq(5)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');
        });


        it(`ESC after input autocomplete should revert input value to typed string`, () => {
          cy.get('@acBothCbInput')
            .focus()
            .type('n{downarrow}{downarrow}')
            .should('have.value', 'Nick Fury')
            .type('{esc}')
            .should('have.value', 'n');
        });


        it(`Typing string in input should autocomplete input, show list and remove options with text that doesn't start with string`, () => {
          cy.get('@acBothCbInput')
            .focus()
            .type('sp');
          cy.get('@acBothCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
          cy.get('@acBothCbOptions').should('have.length', 1);

          cy.get('@acBothCbInput').type('a');
          cy.get('@acBothCbOptions').should('have.length', 0);

          cy.get('@acBothCbInput').type('{backspace}{backspace}');
          cy.get('@acBothCbOptions').should('have.length', 2);
        });
      });
    });
  });


  context(`Automatic selection Comboboxes`, () => {
    describe(`Basic Combobox`, () => {
      beforeEach(() => {
        cy.get(`#${IDS.BASIC_AS_CB}`)
          .as('basicAsCb')
          .find('input')
          .as('basicAsCbInput');
        cy.get('@basicAsCb')
          .find('ul')
          .as('basicAsCbList');
        cy.get('@basicAsCb')
          .find('label')
          .as('basicAsCbLabel');
        cy.get('@basicAsCb')
          .find('li')
          .as('basicAsCbOptions');

        // Reset input state before each test
        cy.get('@basicAsCbInput').focus().clear().type('{esc}').blur();
      });


      it(`Focusing on input should show list with first option selected, losing focus should hide list`, () => {
        cy.get('@basicAsCbInput').focus();
        cy.get('@basicAsCbOptions').eq(0).should('have.attr', 'aria-selected', 'true');
        cy.get('@basicAsCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');

        cy.get('@basicAsCbInput').blur();
        cy.get('@basicAsCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');

        cy.get('@basicAsCbInput').focus().clear().type('{esc}').blur();
      });


      describe(`Keyboard interactions`, () => {
        it(`DOWN arrow should show list and change selected option correctly`, () => {
          cy.get('@basicAsCbInput')
            .focus()
            .should('have.attr', 'aria-activedescendant', `${IDS.BASIC_AS_CB}-option-1`);
          cy.get('@basicAsCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
          cy.get('@basicAsCbOptions').eq(0)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');

          cy.get('@basicAsCbInput')
            .type('{downarrow}{downarrow}{downarrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.BASIC_AS_CB}-option-4`);
          cy.get('@basicAsCbOptions').eq(3)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');
        });


        it(`UP arrow should show list and change selected option correctly`, () => {
          cy.get('@basicAsCbInput')
            .focus()
            .type('{uparrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.BASIC_AS_CB}-option-12`);
          cy.get('@basicAsCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
          cy.get('@basicAsCbOptions').eq(11)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');

          cy.get('@basicAsCbInput')
            .type('{uparrow}{uparrow}{uparrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.BASIC_AS_CB}-option-9`);
          cy.get('@basicAsCbOptions').eq(8)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');
        });
      });
    });


    describe(`Autocomplete list Combobox`, () => {
      beforeEach(() => {
        cy.get(`#${IDS.AC_LIST_AS_CB}`)
          .as('acListAsCb')
          .find('input')
          .as('acListAsCbInput');
        cy.get('@acListAsCb')
          .find('ul')
          .as('acListAsCbList');
        cy.get('@acListAsCb')
          .find('label')
          .as('acListAsCbLabel');
        cy.get('@acListAsCb')
          .find('li')
          .as('acListAsCbOptions');

        // Reset input state before each test
        cy.get('@acListAsCbInput').focus().clear().type('{esc}').blur();
      });


      describe(`Keyboard interactions`, () => {
        it(`DOWN arrow should show list and change selected option correctly`, () => {
          cy.get('@acListAsCbInput')
            .focus()
            .type('{downarrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.AC_LIST_AS_CB}-option-1`);
          cy.get('@acListAsCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
          cy.get('@acListAsCbOptions').eq(0)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');

          cy.get('@acListAsCbInput')
            .type('{downarrow}{downarrow}{downarrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.AC_LIST_AS_CB}-option-4`);
          cy.get('@acListAsCbOptions').eq(3)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');
        });


        it(`UP arrow should show list and change selected option correctly`, () => {
          cy.get('@acListAsCbInput')
            .focus()
            .type('{uparrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.AC_LIST_AS_CB}-option-12`);
          cy.get('@acListAsCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
          cy.get('@acListAsCbOptions').eq(11)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');

          cy.get('@acListAsCbInput')
            .type('{uparrow}{uparrow}{uparrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.AC_LIST_AS_CB}-option-9`);
          cy.get('@acListAsCbOptions').eq(8)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');
        });


        it(`Typing string in input should show list with first option selected and remove options with text that doesn't start with string`, () => {
          cy.get('@acListAsCbInput')
            .focus()
            .type('sp');
          cy.get('@acListAsCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
          cy.get('@acListAsCbOptions')
            .should('have.length', 1)
            .eq(0)
            .should('have.attr', 'aria-selected', 'true');

          cy.get('@acListAsCbInput').type('a');
          cy.get('@acListAsCbOptions').should('have.length', 0);

          cy.get('@acListAsCbInput').type('{backspace}{backspace}');
          cy.get('@acListAsCbOptions')
            .should('have.length', 2)
            .eq(0)
            .should('have.attr', 'aria-selected', 'true');
        });
      });
    });


    describe(`Autocomplete both Combobox`, () => {
      beforeEach(() => {
        cy.get(`#${IDS.AC_BOTH_AS_CB}`)
          .as('acBothAsCb')
          .find('input')
          .as('acBothAsCbInput');
        cy.get('@acBothAsCb')
          .find('ul')
          .as('acBothAsCbList');
        cy.get('@acBothAsCb')
          .find('label')
          .as('acBothAsCbLabel');
        cy.get('@acBothAsCb')
          .find('li')
          .as('acBothAsCbOptions');

        // Reset input state before each test
        cy.get('@acBothAsCbInput').focus().clear().type('{esc}').blur();
      });


      describe(`Keyboard interactions`, () => {
        it(`DOWN arrow should show list, change selected option correctly and autocomplete input`, () => {
          cy.get('@acBothAsCbInput')
            .focus()
            .type('{uparrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.AC_BOTH_AS_CB}-option-12`)
            .should('have.value', 'Captain Marvel');
          cy.get('@acBothAsCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
          cy.get('@acBothAsCbOptions').eq(11)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');

          cy.get('@acBothAsCbInput')
            .type('{downarrow}{downarrow}{downarrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.AC_BOTH_AS_CB}-option-3`)
            .and('have.value', 'Hulk');
          cy.get('@acBothAsCbOptions').eq(2)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');
        });


        it(`UP arrow should show list, change selected option correctly and autocomplete input`, () => {
          cy.get('@acBothAsCbInput')
            .focus()
            .type('{uparrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.AC_BOTH_AS_CB}-option-12`)
            .should('have.value', 'Captain Marvel');
          cy.get('@acBothAsCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
          cy.get('@acBothAsCbOptions').eq(11)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');

          cy.get('@acBothAsCbInput')
            .type('{uparrow}{uparrow}{uparrow}')
            .should('have.attr', 'aria-activedescendant', `${IDS.AC_BOTH_AS_CB}-option-9`);

          cy.get('@acBothAsCbOptions').eq(8)
            .should('have.attr', 'aria-selected', 'true')
            .and('have.attr', ATTRS.OPTION_SELECTED, '');
        });


        it(`ESC after input autocomplete should revert input value to typed string`, () => {
          cy.get('@acBothAsCbInput')
            .focus()
            .type('c')
            .should('have.value', 'Captain America')
            .type('{downarrow}')
            .should('have.value', 'Captain America')
            .type('{downarrow}')
            .should('have.value', 'Captain Marvel')
            .type('{esc}')
            .should('have.value', 'c');
        });


        it(`Typing string in input should autocomplete input, show list and remove options with text that doesn't start with string`, () => {
          cy.get('@acBothAsCbInput')
            .focus()
            .type('sp')
            .should('have.value', 'Spider-man');
          cy.get('@acBothAsCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
          cy.get('@acBothAsCbOptions').should('have.length', 1);

          cy.get('@acBothAsCbInput')
            .type('a')
            .should('have.value', 'Spa');
          cy.get('@acBothAsCbOptions').should('have.length', 0);

          cy.get('@acBothAsCbInput')
            .type('{backspace}{backspace}')
            .should('have.value', 'S');
          cy.get('@acBothAsCbOptions').should('have.length', 2);
        });
      });
    });
  });


  context(`Custom events Combobox`, () => {
    beforeEach(() => {
      cy.get(`#${IDS.CUSTOM_EVENTS_CB}`)
        .as('customEventsCb')
        .find('ul')
        .as('customEventsCbList');
      cy.get('@customEventsCb')
        .find('input')
        .as('customEventsCbInput');

      cy.get(`#${IDS.ADD_OPTIONS_BTN}`).as('addOptionsBtn');
      cy.get(`#${IDS.SHOW_LIST_BTN}`).as('showListBtn');
      cy.get(`#${IDS.HIDE_LIST_BTN}`).as('hideListBtn');
    });


    it(`Combobox with missing elements and attributes should be initialised correctly`, () => {
      const LIST_ID = `${IDS.CUSTOM_EVENTS_CB}-list`;
      cy.get('@customEventsCb').should('have.attr', 'id', `${IDS.CUSTOM_EVENTS_CB}`);

      cy.get('@customEventsCbInput')
        .should('have.attr', 'aria-autocomplete', 'none')
        .and('have.attr', 'aria-expanded', 'false')
        .and('have.attr', 'aria-haspopup', 'true')
        .and('have.attr', 'aria-owns', LIST_ID)
        .and('have.attr', 'id', `${IDS.CUSTOM_EVENTS_CB}-input`)
        .and('have.attr', 'role', 'combobox')
        .and('have.attr', 'type', 'text');

      cy.get('@customEventsCbList')
        .should('have.attr', ATTRS.LIST, '')
        .and('have.attr', ATTRS.LIST_VISIBLE, 'false')
        .and('have.attr', 'id', LIST_ID)
        .and('have.attr', 'role', 'listbox');
    });


    it(`Dispatching update options event should add required attributes to newly added options`, () => {
      cy.get('@addOptionsBtn').click();
      cy.get('@customEventsCb')
        .find('li')
        .should('have.length', 3)
        .each(($option, index) => {
          cy.wrap($option)
            .should('have.attr', 'id', `${IDS.CUSTOM_EVENTS_CB}-option-${index + 1}`)
            .and('have.attr', ATTRS.OPTION, '')
            .and('have.attr', 'aria-selected', 'false')
            .and('have.attr', 'role', 'option')
            .and('not.have.attr', ATTRS.OPTION_SELECTED);
        });
    });


    it(`Dispatching show list and hide list events should show and hide list`, () => {
      cy.get('@customEventsCbInput').should('have.attr', 'aria-expanded', 'false');
      cy.get('@customEventsCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');
      cy.get('@showListBtn').click();
      cy.get('@customEventsCbInput').should('have.attr', 'aria-expanded', 'true');
      cy.get('@customEventsCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
      cy.get('@hideListBtn').click();
      cy.get('@customEventsCbInput').should('have.attr', 'aria-expanded', 'false');
      cy.get('@customEventsCbList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');
    });


    it(`Dispatching select option event should select option correctly`, () => {
      cy.get('@addOptionsBtn').click();
      cy.get('@customEventsCb')
        .find('li')
        .as('customEventsCbOptions');
      cy.get('@showListBtn').click();
      cy.get(`#${IDS.SELECT_OPTION_NUMBER_INPUT}`)
        .as('selectOptionNumberInput')
        .focus()
        .type(3);
      cy.get(`#${IDS.SELECT_OPTION_BTN}`)
        .as('selectOptionBtn')
        .click();
      cy.get('@customEventsCbInput').should('have.attr', 'aria-activedescendant', `${IDS.CUSTOM_EVENTS_CB}-option-3`);
      cy.get('@customEventsCbOptions').eq(2).should('have.attr', 'aria-selected', 'true');

      cy.get('@selectOptionNumberInput')
        .focus()
        .type('{backspace}1');
      cy.get('@selectOptionBtn').click();
      cy.get('@customEventsCbInput').should('have.attr', 'aria-activedescendant', `${IDS.CUSTOM_EVENTS_CB}-option-1`);
      cy.get('@customEventsCbOptions').eq(0).should('have.attr', 'aria-selected', 'true');
      cy.get('@hideListBtn').click();
    });
  });
});
