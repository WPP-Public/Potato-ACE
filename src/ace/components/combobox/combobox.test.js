import {ATTRS, COMBOBOX, EVENTS} from './combobox';
import {getOptionId} from '../../../../cypress/functions';


const IDS = {
  AC_BOTH_AS_CB: `ac-both-autoselect-combobox`,
  AC_BOTH_CB: `ac-both-combobox`,
  AC_LIST_AS_CB: `ac-list-autoselect-combobox`,
  AC_LIST_CB: `ac-list-combobox`,
  ADD_OPTIONS_BTN: 'add-options-btn',
  BASIC_AS_CB: `basic-autoselect-combobox`,
  BASIC_CB: `${COMBOBOX}-1`,
  CUSTOM_EVENTS_CB: `custom-events-combobox`,
  HIDE_LIST_BTN: 'hide-list-btn',
  SELECT_OPTION_FORM: 'select-option-form',
  SHOW_LIST_BTN: 'show-list-btn',
};


// Reset input state before each test
const resetState = () => {
  return cy.get('@comboboxInput')
    .focus()
    .clear()
    .type('{esc}')
    .blur();
};


const comboboxBeforeEach = (id) => {
  cy.get(`#${id}`)
    .as('combobox')
    .find('input')
    .as('comboboxInput')
    .get('@combobox')
    .find('ul')
    .as('comboboxList')
    .get('@combobox')
    .find('li')
    .as('comboboxOptions');
  resetState();
};


const comboboxInitChecks = () => {
  return cy.get('@combobox')
    .then(($combobox) => {
      const id = $combobox.attr('id');
      const INPUT_ID = `${id}-input`;
      const LIST_ID = `${id}-list`;

      cy.get('@comboboxInput')
        .should('have.id', INPUT_ID)
        .and('have.attr', 'aria-expanded', 'false')
        .and('have.attr', 'aria-haspopup', 'true')
        .and('have.attr', 'aria-owns', LIST_ID)
        .and('have.attr', 'role', 'combobox')
        .and('have.attr', 'type', 'text')
        .get('@comboboxList')
        .should('have.id', LIST_ID)
        .and('have.attr', ATTRS.LIST, '')
        .and('have.attr', ATTRS.LIST_VISIBLE, 'false')
        .and('have.attr', 'role', 'listbox')
        .and('not.have.attr', 'tabindex')
        .get('@comboboxOptions')
        .each(($option, index) => {
          cy.wrap($option)
            .should('have.id', `${id}-option-${index + 1}`)
            .and('have.attr', ATTRS.OPTION, '')
            .and('have.attr', 'aria-selected', 'false')
            .and('have.attr', 'role', 'option')
            .and('not.have.attr', ATTRS.OPTION_SELECTED);
        });
    });
};


const checkOptionSelected = (optionIndex) => {
  return cy.get('@combobox')
    .then(($combobox) => {
      cy.get('@comboboxInput')
        .should('have.attr', 'aria-activedescendant', getOptionId($combobox.attr('id'), optionIndex))
        .get('@comboboxList')
        .should('have.attr', ATTRS.LIST_VISIBLE, 'true')
        .get('@comboboxOptions')
        .eq(optionIndex)
        .should('have.attr', ATTRS.OPTION_SELECTED, '')
        .and('have.attr', 'aria-selected', 'true');
    });
};


const checkOptionChosen = (optionIndex) => {
  return cy.get('@comboboxList')
    .should('have.attr', ATTRS.LIST_VISIBLE, 'false')
    .and('not.have.attr', 'aria-activedescendant')
    .get('@comboboxOptions')
    .eq(optionIndex)
    .then(($chosenOption) => {
      cy.get('@comboboxInput')
        .should('have.value', $chosenOption.text())
        .and('have.attr', 'aria-expanded', 'false');
    });
};


context(`Combobox`, () => {
  before(() => cy.visit(`/combobox`));


  it(`Combobox without ID should initialise with an ID`, () => {
    cy.get(COMBOBOX)
      .first()
      .should('have.id', IDS.BASIC_CB);
  });


  context(`Manual selection Comboboxes`, () => {
    context(`Basic Combobox`, () => {
      const COMBOBOX_ID = IDS.BASIC_CB;


      beforeEach(() => comboboxBeforeEach(COMBOBOX_ID));


      it(`Should initialise with correct attributes`, () => {
        comboboxInitChecks();
        cy.get('@comboboxInput').should('have.attr', 'aria-autocomplete', 'none');
      });


      describe(`Focus interactions`, () => {
        it(`Focusing on input should show list and losing focus should hide list`, () => {
          // Focus
          const expectedDetail = {
            id: COMBOBOX_ID,
            listVisible: true,
          };
          cy.addCustomEventListener(EVENTS.OUT.LIST_TOGGLED, expectedDetail)
            .get('@comboboxInput')
            .focus()
            .get('@comboboxList')
            .should('have.attr', ATTRS.LIST_VISIBLE, 'true');

          // Blur
          const expectedDetail2 = {
            id: COMBOBOX_ID,
            listVisible: false,
          };
          cy.addCustomEventListener(EVENTS.OUT.LIST_TOGGLED, expectedDetail2)
            .get('@comboboxInput')
            .blur()
            .get('@comboboxList')
            .should('have.attr', ATTRS.LIST_VISIBLE, 'false');
        });


        it(`Input losing focus with option selected should choose option`, () => {

          cy.get('@comboboxInput')
            .focus()
            .type('{downarrow}');

          const optionIndex = 1;
          const expectedDetail = {
            id: COMBOBOX_ID,
            selectedOptionId: getOptionId(COMBOBOX_ID, optionIndex),
          };
          cy.addCustomEventListener(EVENTS.OUT.OPTION_SELECTED, expectedDetail)
            .get('@comboboxInput')
            .type('{downarrow}')
            .blur();
          checkOptionChosen(optionIndex);
        });
      });


      it(`Clicking an option should hide list and change input's text to match the option's`, () => {
        const optionIndex = 3;
        const expectedDetail = {
          chosenOptionId: getOptionId(COMBOBOX_ID, optionIndex),
          id: COMBOBOX_ID,
        };
        cy.addCustomEventListener(EVENTS.OUT.OPTION_CHOSEN, expectedDetail)
          .get('@comboboxInput')
          .focus()
          .get('@comboboxOptions')
          .eq(optionIndex)
          .click();
        checkOptionChosen(optionIndex);

        // Check that all options are deselected
        cy.get('@comboboxOptions')
          .each(($option) => {
            cy.wrap($option).should('have.attr', 'aria-selected', 'false');
          });
      });


      it(`Selected option position in list should not reset when list hidden after choosing option`, () => {
        cy.get('@comboboxInput')
          .focus()
          .type('{uparrow}{uparrow}{enter}{downarrow}');
        checkOptionSelected(11);

        const optionIndex = 7;
        cy.get('@comboboxInput')
          .focus()
          .get('@comboboxOptions')
          .eq(optionIndex)
          .click()
          .get('@comboboxInput')
          .focus()
          .type('{uparrow}');
        checkOptionSelected(optionIndex - 1);
      });


      describe(`Keyboard interactions`, () => {
        it(`ESC on input should hide the list without choosing selected option`, () => {
          cy.get('@comboboxInput')
            .focus()
            .type('{uparrow}{esc}')
            .should('have.value', '')
            .get('@comboboxList')
            .should('have.attr', ATTRS.LIST_VISIBLE, 'false');
        });


        it(`ENTER when no option selected should have no effect`, () => {
          cy.get('@comboboxInput')
            .focus()
            .type('{enter}')
            .should('have.value', '');
        });


        it(`ENTER when option selected should update input value to match option's value and hide the list`, () => {
          const optionIndex = 10;
          const expectedDetail = {
            chosenOptionId: getOptionId(COMBOBOX_ID, optionIndex),
            id: COMBOBOX_ID,
          };
          cy.addCustomEventListener(EVENTS.OUT.OPTION_CHOSEN, expectedDetail)
            .get('@comboboxInput')
            .focus()
            .type('{uparrow}{uparrow}{enter}');
          checkOptionChosen(optionIndex);
        });


        it(`DOWN arrow should show list and change selected option correctly`, () => {
          const optionIndex = 0;
          cy.get('@comboboxInput')
            .focus()
            .type('{downarrow}');
          checkOptionSelected(optionIndex);

          cy.get('@comboboxInput').type('{downarrow}{downarrow}{downarrow}');
          checkOptionSelected(optionIndex + 3);
        });


        it(`UP arrow should show list and change selected option correctly`, () => {
          const optionIndex = 11;
          cy.get('@comboboxInput')
            .focus()
            .type('{uparrow}');
          checkOptionSelected(optionIndex);

          cy.get('@comboboxInput').type('{uparrow}{uparrow}');
          checkOptionSelected(optionIndex - 2);
        });


        it(`Typing string should not filter options`, () => {
          cy.get('@comboboxInput')
            .focus()
            .type('c')
            .get('@comboboxOptions')
            .should('have.length', 12);
        });
      });
    });


    context(`Autocomplete list Combobox`, () => {
      const COMBOBOX_ID = IDS.AC_LIST_CB;


      beforeEach(() => comboboxBeforeEach(COMBOBOX_ID));


      it(`Should initialise with correct attributes`, () => {
        comboboxInitChecks();
        cy.get('@comboboxInput').should('have.attr', 'aria-autocomplete', 'list');
      });


      it(`Clicking an option should remove all other options from list and hide it, and change input's text to match the option's`, () => {
        const optionIndex = 7;
        const expectedDetail = {
          chosenOptionId: getOptionId(COMBOBOX_ID, optionIndex),
          id: COMBOBOX_ID,
        };
        cy.addCustomEventListener(EVENTS.OUT.OPTION_CHOSEN, expectedDetail)
          .get('@comboboxInput')
          .focus()
          .type('{uparrow}')
          .get('@comboboxOptions')
          .eq(optionIndex)
          .click()
          .get('@comboboxOptions')
          .should('have.length', 1);
        checkOptionChosen(0);
      });


      describe(`Focus interactions`, () => {
        it(`Focusing on input should not show list and losing focus should hide list`, () => {
          cy.get('@comboboxInput')
            .focus()
            .get('@comboboxList')
            .should('have.attr', ATTRS.LIST_VISIBLE, 'false')
            .get('@comboboxInput')
            .type('{downarrow}')
            .get('@comboboxList')
            .should('have.attr', ATTRS.LIST_VISIBLE, 'true')
            .get('@comboboxInput')
            .blur()
            .get('@comboboxList')
            .should('have.attr', ATTRS.LIST_VISIBLE, 'false');
        });


        it(`Input losing focus with option selected should choose option`, () => {
          cy.get('@comboboxInput')
            .focus()
            .type('{uparrow}')
            .blur()
            .get('@comboboxList')
            .should('have.length', 1);
          checkOptionChosen(0);
        });
      });


      describe(`Keyboard interactions`, () => {
        it(`ENTER should choose selected option, updating input value to match it's value, reduce list to selected value and hide the list`, () => {
          cy.get('@comboboxInput')
            .focus()
            .type('{uparrow}{uparrow}{uparrow}{enter}')
            .get('@comboboxOptions')
            .should('have.length', 1);
          checkOptionChosen(0);
        });


        it(`Typing string in input should remove options with text that doesn't start with string and show list`, () => {
          cy.get('@comboboxInput')
            .focus()
            .type('s')
            .get('@comboboxList')
            .should('have.attr', ATTRS.LIST_VISIBLE, 'true')
            .get('@comboboxOptions')
            .should('have.length', 2)
            .get('@comboboxInput')
            .type('p')
            .get('@comboboxOptions')
            .should('have.length', 1)
            .get('@comboboxInput')
            .type('a')
            .get('@comboboxOptions')
            .should('have.length', 0)
            .get('@comboboxInput')
            .type('{backspace}{backspace}')
            .get('@comboboxOptions')
            .should('have.length', 2);
        });
      });
    });


    context(`Autocomplete both Combobox`, () => {
      const COMBOBOX_ID = IDS.AC_BOTH_CB;


      beforeEach(() => comboboxBeforeEach(COMBOBOX_ID));


      it(`Should initialise with correct attributes`, () => {
        comboboxInitChecks();
        cy.get('@comboboxInput').should('have.attr', 'aria-autocomplete', 'both');
      });


      it(`Clicking an option should remove all other options from list and hide it, and change input's text to match the option's`, () => {
        const optionIndex = 4;
        const expectedDetail = {
          chosenOptionId: getOptionId(COMBOBOX_ID, optionIndex),
          id: COMBOBOX_ID,
        };
        cy.addCustomEventListener(EVENTS.OUT.OPTION_CHOSEN, expectedDetail)
          .get('@comboboxInput')
          .focus()
          .type('{uparrow}')
          .get('@comboboxOptions')
          .eq(optionIndex)
          .click()
          .get('@comboboxOptions')
          .should('have.length', 1);
        checkOptionChosen(0);
      });


      describe(`Focus interactions`, () => {
        it(`Focusing on input should not show list and losing focus should hide list`, () => {
          cy.get('@comboboxInput')
            .focus()
            .get('@comboboxList')
            .should('have.attr', ATTRS.LIST_VISIBLE, 'false')
            .get('@comboboxInput')
            .type('{downarrow}')
            .get('@comboboxList')
            .should('have.attr', ATTRS.LIST_VISIBLE, 'true')
            .get('@comboboxInput')
            .blur()
            .get('@comboboxList')
            .should('have.attr', ATTRS.LIST_VISIBLE, 'false');
        });


        it(`Input losing focus with option selected should choose option`, () => {
          cy.get('@comboboxInput')
            .focus()
            .type('{uparrow}')
            .blur()
            .get('@comboboxList')
            .should('have.length', 1);
          checkOptionChosen(0);
        });
      });


      describe(`Keyboard interactions`, () => {
        it(`ENTER should choose selected option, updating input value to match it's value, reduce list to selected value and hide the list`, () => {
          cy.get('@comboboxInput')
            .focus()
            .type('{uparrow}{uparrow}{uparrow}{enter}')
            .get('@comboboxOptions')
            .should('have.length', 1);
          checkOptionChosen(0);
        });


        it(`UP arrow should show list, change selected option correctly and autocomplete input`, () => {
          let optionIndex = 11;
          cy.get('@comboboxInput')
            .focus()
            .type('{uparrow}');
          checkOptionSelected(optionIndex);

          optionIndex = 10;
          cy.get('@comboboxInput')
            .type('{downarrow}{uparrow}{uparrow}')
            .get('@comboboxOptions')
            .eq(optionIndex)
            .then(($option) => {
              cy.get('@comboboxInput').should('have.value', $option.text());
            });
          checkOptionSelected(optionIndex);
        });


        it(`DOWN arrow should show list, change selected option correctly and autocomplete input`, () => {
          let optionIndex = 0;
          cy.get('@comboboxInput')
            .focus()
            .type('{downarrow}');
          checkOptionSelected(optionIndex);

          optionIndex = 1;
          cy.get('@comboboxInput')
            .type('{uparrow}{downarrow}{downarrow}')
            .get('@comboboxOptions')
            .eq(optionIndex)
            .then(($option) => {
              cy.get('@comboboxInput').should('have.value', $option.text());
            });
          checkOptionSelected(optionIndex);
        });


        it(`Typing string in input then selecting an option should autocomplete input`, () => {
          cy.get('@comboboxInput')
            .focus()
            .type('s')
            .type('{uparrow}')
            .get('@comboboxOptions')
            .eq(1)
            .then(($option) => {
              cy.get('@comboboxInput').should('have.value', $option.text());
            });
        });
      });
    });
  });


  context(`Automatic selection Comboboxes`, () => {
    context(`Basic Combobox`, () => {
      const COMBOBOX_ID = IDS.BASIC_AS_CB;


      beforeEach(() => {
        comboboxBeforeEach(COMBOBOX_ID);
        cy.get('@comboboxOptions')
          .first()
          .as('comboboxOption1');
      });


      it(`Should initialise with correct attributes`, () => {
        cy.get('@combobox')
          .should('have.attr', ATTRS.AUTOSELECT, 'true')
          .get('@comboboxInput')
          .should('have.attr', 'aria-autocomplete', 'none');
      });


      it(`Focusing on input should show list with first option selected`, () => {
        // Focus
        const expectedDetail = {
          id: COMBOBOX_ID,
          listVisible: true,
        };
        cy.addCustomEventListener(EVENTS.OUT.LIST_TOGGLED, expectedDetail)
          .get('@comboboxInput')
          .focus()
          .get('@comboboxList')
          .should('have.attr', ATTRS.LIST_VISIBLE, 'true')
          .get('@comboboxOption1')
          .should('have.attr', 'aria-selected', 'true');
      });


      describe(`Keyboard interactions`, () => {
        it(`DOWN arrow should show list and change selected option and input text correctly`, () => {
          const optionIndex = 2;
          cy.get('@comboboxInput')
            .focus()
            .type('{downarrow}{downarrow}');
          checkOptionSelected(optionIndex);

          cy.get('@comboboxInput').type('{downarrow}{downarrow}');
          checkOptionSelected(optionIndex + 2);
        });


        it(`UP arrow should show list and change selected option correctly`, () => {
          const optionIndex = 10;
          cy.get('@comboboxInput')
            .focus()
            .type('{uparrow}{uparrow}');
          checkOptionSelected(optionIndex);

          cy.get('@comboboxInput').type('{uparrow}{uparrow}{uparrow}');
          checkOptionSelected(optionIndex - 3);
        });


        it(`Typing string should show list with first item selected`, () => {
          cy.get('@comboboxInput')
            .focus()
            .type('ca')
            .get('@comboboxOptions')
            .should('have.length', 12)
            .eq(0)
            .should('have.attr', 'aria-selected', 'true');
        });


        it(`Typing string after pressing ESC should show list with no items selected`, () => {
          cy.get('@comboboxInput')
            .focus()
            .type('{esc}c')
            .get('@comboboxOptions')
            .should('have.length', 12)
            .eq(0)
            .should('have.attr', 'aria-selected', 'false');
        });
      });
    });


    context(`Autocomplete list Combobox`, () => {
      const COMBOBOX_ID = IDS.AC_LIST_AS_CB;


      beforeEach(() => comboboxBeforeEach(COMBOBOX_ID));


      it(`Should initialise with correct attributes`, () => {
        cy.get('@combobox')
          .should('have.attr', ATTRS.AUTOSELECT, 'true')
          .get('@comboboxInput')
          .should('have.attr', 'aria-autocomplete', 'list');
      });


      it(`Typing string in input should remove options with text that doesn't start with string and show list with first option selected`, () => {
        cy.get('@comboboxInput')
          .focus()
          .type('s')
          .get('@comboboxList')
          .should('have.attr', ATTRS.LIST_VISIBLE, 'true')
          .get('@comboboxOptions')
          .should('have.length', 2)
          .eq(0)
          .should('have.attr', 'aria-selected', 'true')
          .get('@comboboxInput')
          .type('p')
          .get('@comboboxOptions')
          .should('have.length', 1);
      });
    });


    context(`Autocomplete both Combobox`, () => {
      const COMBOBOX_ID = IDS.AC_BOTH_AS_CB;


      beforeEach(() => comboboxBeforeEach(COMBOBOX_ID));


      it(`Should initialise with correct attributes`, () => {
        cy.get('@combobox')
          .should('have.attr', ATTRS.AUTOSELECT, 'true')
          .get('@comboboxInput')
          .should('have.attr', 'aria-autocomplete', 'both');
      });


      it(`Typing string in input should remove options with text that doesn't start with string and show list with first option selected and the input text autocompleted`, () => {
        cy.get('@comboboxInput')
          .focus()
          .type('sp')
          .get('@comboboxList')
          .should('have.attr', ATTRS.LIST_VISIBLE, 'true')
          .get('@comboboxOptions')
          .should('have.length', 1)
          .get('@comboboxOptions')
          .eq(0)
          .then(($option) => {
            cy.get('@comboboxInput').should('have.value', $option.text());
          })
          .get('@comboboxInput')
          .type('{backspace}')
          .should('have.value', 'Sp');
      });
    });
  });


  context(`Custom events Combobox`, () => {
    const COMBOBOX_ID = IDS.CUSTOM_EVENTS_CB;

    it(`Should respond to custom events correctly`, () => {
      const comboboxList = Cypress.$(`#${COMBOBOX_ID} [${ATTRS.LIST}]`);

      cy.get(`#${COMBOBOX_ID}`)
        .as('combobox')
        .find('input')
        .as('comboboxInput')
        .get('@combobox')
        .find('ul')
        .as('comboboxList')
        .get(`#${IDS.ADD_OPTIONS_BTN}`)
        .click()
        .get('@comboboxList')
        .find(`[${ATTRS.OPTION}]`)
        .as('comboboxOptions')
        .should('not.have.length', 0);

      // Test SHOW_LIST event
      cy.window().then((window) => {
        window.addEventListener(EVENTS.OUT.LIST_TOGGLED, (e) => {
          console.log(e.detail);
          const listVisible = true;
          const expectedDetail = {
            id: COMBOBOX_ID,
            listVisible,
          };
          console.log(expectedDetail);
          expect(e.detail).to.deep.equal(expectedDetail);
          expect(comboboxList.attr(ATTRS.LIST_VISIBLE)).to.equal(listVisible.toString());
        }, {once: true});
      });
      cy.get(`#${IDS.SHOW_LIST_BTN}`).click();

      // Test SELECT_OPTION event
      const optionIndex = 2;
      cy.get(`#${IDS.SELECT_OPTION_FORM}`)
        .as('setOptionForm')
        .find('input')
        .focus()
        .type(optionIndex + 1)
        .get('@setOptionForm')
        .submit();
      checkOptionSelected(optionIndex);

      // Test HIDE_LIST event
      cy.window().then((window) => {
        window.addEventListener(EVENTS.OUT.LIST_TOGGLED, (e) => {
          const listVisible = false;
          const expectedDetail2 = {
            id: COMBOBOX_ID,
            listVisible,
          };
          expect(e.detail).to.deep.equal(expectedDetail2);
          expect(comboboxList.attr(ATTRS.LIST_VISIBLE)).to.equal(listVisible.toString());
        }, {once: true});
      });
      cy.get(`#${IDS.HIDE_LIST_BTN}`).click();
    });
  });
});
