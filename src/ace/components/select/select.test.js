import {ATTRS,  EVENTS, SELECT} from './select';
import {ATTRS as LB_ATTRS, searchTimeoutTime} from '../listbox/listbox';


const IDS = {
  ADD_OPTION_BTN: 'add-option',
  DYNAMIC_SELECT: 'dynamic-select',
  REMOVE_OPTION_BTN: 'remove-option',
  SELECT_1: 'ace-select-1',
};


context('Select', () => {
  before(() => {
    cy.visit(`/select`);
  });


  beforeEach(() => {
    // Get Selects and child elements
    cy.get(SELECT)
      .as('selects')
      .first()
      .as('select')
      .find('button')
      .as('selectTrigger');

    cy.get('@select')
      .find('ul')
      .as('selectList')
      .find('li')
      .as('selectOptions')
      .first()
      .as('selectOption1');
    cy.get('@selectOptions')
      .eq(1)
      .as('selectOption2');
    cy.get('@selectOptions')
      .eq(2)
      .as('selectOption3');
    cy.get('@selectOptions')
      .eq(3)
      .as('selectOption4');
    cy.get('@selectOptions')
      .eq(4)
      .as('selectOption5');
    cy.get('@selectOptions')
      .eq(5)
      .as('selectOption6');
    cy.get('@selectOptions')
      .eq(6)
      .as('selectOption7');
    cy.get('@selectOptions')
      .eq(7)
      .as('selectOption8');
    cy.get('@selectOptions')
      .eq(10)
      .as('selectOption11');
    cy.get('@selectOptions')
      .eq(11)
      .as('selectOption12');
    cy.get('@selectOptions')
      .eq(12)
      .as('selectOption13');
  });


  describe('Initialisation', () => {
    it('All selects should have IDs', () => {
      cy.get('@selects').each(select => {
        cy.get(select).should('have.attr', 'id');
      });
    });


    it('Select should initialise with correct attributes', () => {
      // Check select trigger attributes
      cy.get('@selectTrigger').should('have.attr', 'id', `${IDS.SELECT_1}-trigger`);
      cy.get('@selectTrigger').should('have.attr', ATTRS.TRIGGER);
      cy.get('@selectTrigger').should('have.attr', 'aria-expanded', 'false');
      cy.get('@selectTrigger').should('have.attr', 'aria-haspopup', 'listbox');
      cy.get('@selectOption1')
        .invoke('text')
        .then((text) => {
          cy.get('@selectTrigger').should('have.text', text);
        });

      // Check select list attributes
      cy.get('@selectList').should('have.attr', ATTRS.LIST);
      cy.get('@selectList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');
      cy.get('@selectList').should('have.attr', LB_ATTRS.LIST);
      cy.get('@selectList').should('have.attr', 'tabindex', '-1');
      cy.get('@selectList').should('have.attr', 'role', 'listbox');

      // Check select options attributes
      cy.get('@selectOptions').each((option, index) => {
        cy.get(option).should('have.attr', LB_ATTRS.OPTION_INDEX, index.toString());
        cy.get(option).should('have.attr', 'id', `${IDS.SELECT_1}-option-${(index + 1).toString()}`);
        cy.get(option).should('have.attr', 'role', 'option');
        cy.get(option).should('not.have.attr', LB_ATTRS.ACTIVE_OPTION);

        // All listbox options except the first of a single-select listbox should have aria-selected false
        const ariaSelected = (index === 0) ? 'true' : 'false';
        cy.get(option).should('have.attr', 'aria-selected', ariaSelected);
      });
    });
  });


  describe('Mouse interaction', () => {
    beforeEach(() => {
      cy.reload();
    });


    it('Initially clicking trigger should show list with first option selected', () => {
      cy.get('@selectTrigger').click();
      cy.get('@selectTrigger').should('have.attr', 'aria-expanded', 'true');
      cy.get('@selectList').should('have.focus');
      cy.get('@selectList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
      cy.get('@selectList').should('have.attr', 'aria-activedescendant', `${IDS.SELECT_1}-option-1`);
      cy.get('@selectOption1').should('have.attr', 'aria-selected', 'true');
    });


    it('Clicking outside a select with a shown list should hide the list and revert selected option to the one that matches the trigger', () => {
      cy.get('@selectTrigger').click();
      cy.get('@selectOption1').should('have.attr', 'aria-selected', 'true');
      cy.get('@selectList')
        .type('{downarrow}')
        .type('{downarrow}');
      cy.get('@selectOption3').should('have.attr', 'aria-selected', 'true');

      // click outside select
      cy.get('@select').parent().click();

      cy.get('@selectList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');
      cy.get('@selectOption1').should('have.attr', 'aria-selected', 'true');
      cy.get('@selectOption1')
        .invoke('text')
        .then((text) => {
          cy.get('@selectTrigger').should('have.text', text);
        });
    });


    it('Clicking an option should select it, hide the list and update the trigger text', () => {
      cy.get('@selectTrigger').click();
      cy.get('@selectOption6').click();

      // Check option is selected
      cy.get('@selectOption6').should('have.attr', 'aria-selected', 'true');

      // Check list is hidden
      cy.get('@selectList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');

      // Check trigger text updated
      cy.get('@selectOption6')
        .invoke('text')
        .then((text) => {
          cy.get('@selectTrigger').should('have.text', text);
        });
    });


    it('Clicking trigger after an option is selected should show list and keep the same option selected', () => {
      cy.get('@selectTrigger').click();
      cy.get('@selectOption8').click();
      cy.get('@selectTrigger').click();
      cy.get('@selectList').should('have.attr', 'aria-activedescendant', `${IDS.SELECT_1}-option-8`);
      cy.get('@selectOption8').should('have.attr', 'aria-selected', 'true');
    });
  });


  describe('Keyboard interaction', () => {
    beforeEach(() => {
      cy.reload();
    });


    it('DOWN and UP on trigger should show list but not change selected option', () => {
      // Test DOWN key
      cy.get('@selectList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');
      cy.get('@selectTrigger')
        .focus()
        .type('{downarrow}');
      cy.get('@selectList').should('have.focus');
      cy.get('@selectList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
      cy.get('@selectList').should('have.attr', 'aria-activedescendant', `${IDS.SELECT_1}-option-1`);
      cy.get('@selectOption1').should('have.attr', 'aria-selected', 'true');


      // Test UP key
      cy.get('@select').parent().click();
      cy.get('@selectList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');
      cy.get('@selectTrigger')
        .focus()
        .type('{uparrow}');
      cy.get('@selectList').should('have.focus');
      cy.get('@selectList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');
      cy.get('@selectList').should('have.attr', 'aria-activedescendant', `${IDS.SELECT_1}-option-1`);
      cy.get('@selectOption1').should('have.attr', 'aria-selected', 'true');
    });


    it('DOWN and UP on list should change selected option but not the trigger text', () => {
      // Test DOWN key
      cy.get('@selectTrigger').click();
      cy.get('@selectList').should('have.attr', 'aria-activedescendant', `${IDS.SELECT_1}-option-1`);
      cy.get('@selectOption1').should('have.attr', 'aria-selected', 'true');

      cy.get('@selectList').type('{downarrow}');
      cy.get('@selectList').should('have.attr', 'aria-activedescendant', `${IDS.SELECT_1}-option-2`);
      cy.get('@selectOption2').should('have.attr', 'aria-selected', 'true');
      cy.get('@selectList')
        .type('{uparrow}')
        .type('{uparrow}');
      cy.get('@selectList').should('have.attr', 'aria-activedescendant', `${IDS.SELECT_1}-option-13`);
      cy.get('@selectOption13').should('have.attr', 'aria-selected', 'true');

      // Check trigger text not updated
      cy.get('@selectOption1')
        .invoke('text')
        .then((text) => {
          cy.get('@selectTrigger').should('have.text', text);
        });
    });


    it('ENTER and SPACE on trigger should show list, and on list should close it and update trigger text', () => {
      cy.get('@selectList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');
      cy.get('@selectTrigger').trigger('click');
      cy.get('@selectList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');

      // Test ENTER on list
      cy.get('@selectList')
        .type('{downarrow}')
        .type('{downarrow}')
        .type('{downarrow}')
        .type('{enter}');
      cy.get('@selectOption4').should('have.attr', 'aria-selected', 'true');
      cy.get('@selectList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');

      // Test SPACE on list
      cy.get('@selectTrigger').trigger('click');
      cy.get('@selectList')
        .type('{uparrow}')
        .type(' ');
      cy.get('@selectOption3').should('have.attr', 'aria-selected', 'true');
      cy.get('@selectList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');

      // Check trigger text updated
      cy.get('@selectOption3')
        .invoke('text')
        .then((text) => {
          cy.get('@selectTrigger').should('have.text', text);
        });
    });


    it('ESC on list should close list and revert selected option to the one that matches the trigger', () => {
      // Select 5th option
      cy.get('@selectTrigger').click();
      cy.get('@selectOption5')
        .click()
        .should('have.attr', 'aria-selected', 'true');

      // Show list and move to 8th option
      cy.get('@selectTrigger').click();
      cy.get('@selectList')
        .type('{downarrow}')
        .type('{downarrow}')
        .type('{downarrow}');
      cy.get('@selectOption8').should('have.attr', 'aria-selected', 'true');

      // Test ESC key
      cy.get('@selectList').type('{esc}');
      cy.get('@selectOption8').should('not.have.attr', 'aria-selected', 'true');
      cy.get('@selectOption5').should('have.attr', 'aria-selected', 'true');
      cy.get('@selectList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');
    });
  });


  describe('Type-ahead interaction', () => {
    beforeEach(() => {
      cy.reload();
    });


    it('Typing a character that leads to no match should not change active option or trigger text', () => {
      cy.get('@selectTrigger')
        .focus()
        .type('z');
      cy.get('@selectOption1')
        .should('have.attr', 'aria-selected', 'true');

      // Check trigger text updated
      cy.get('@selectOption1')
        .invoke('text')
        .then((text) => {
          cy.get('@selectTrigger').should('have.text', text);
        });
    });


    it('Typing character on trigger should select first matching option and update trigger text', () => {
      cy.get('@selectTrigger')
        .focus()
        .type('h');
      cy.get('@selectOption4').should('have.attr', 'aria-selected', 'true');

      // Check trigger text updated
      cy.get('@selectOption4')
        .invoke('text')
        .then((text) => {
          cy.get('@selectTrigger').should('have.text', text);
        });
    });


    it('Typing character on trigger twice wihtout delay should select first matching option and update trigger text', () => {
      cy.get('@selectTrigger')
        .focus()
        .type('c')
        .type('c');
      cy.get('@selectOption7').should('have.attr', 'aria-selected', 'true');

      // Check trigger text updated
      cy.get('@selectOption7')
        .invoke('text')
        .then((text) => {
          cy.get('@selectTrigger').should('have.text', text);
        });
    });


    it('Typing character on trigger twice wiht short delay should select second matching option and update trigger text', () => {
      cy.get('@selectTrigger')
        .focus()
        .type('c', {delay: searchTimeoutTime})
        .type('c');
      cy.get('@selectOption13').should('have.attr', 'aria-selected', 'true');

      // Check trigger text updated
      cy.get('@selectOption13')
        .invoke('text')
        .then((text) => {
          cy.get('@selectTrigger').should('have.text', text);
        });
    });


    it('Typing character sequence on trigger should select first matching option and update trigger text', () => {
      cy.get('@selectTrigger')
        .focus()
        .type('d', {delay: searchTimeoutTime})
        .type('o');
      cy.get('@selectOption12').should('have.attr', 'aria-selected', 'true');

      // Check trigger text updated
      cy.get('@selectOption12')
        .invoke('text')
        .then((text) => {
          cy.get('@selectTrigger').should('have.text', text);
        });
    });


    it('Typing character in list should select first matching option without updating trigger text', () => {
      cy.get('@selectTrigger').click();
      cy.get('@selectList')
        .focus()
        .type('b');
      cy.get('@selectOption5').should('have.attr', 'aria-selected', 'true');

      // Check trigger text not updated
      cy.get('@selectOption1')
        .invoke('text')
        .then((text) => {
          cy.get('@selectTrigger').should('have.text', text);
        });
    });


    it('Typing character twice in list without delay should select first matching option without updating trigger text', () => {
      cy.get('@selectTrigger').click();
      cy.get('@selectList')
        .focus()
        .type('b')
        .type('b');
      cy.get('@selectOption5').should('have.attr', 'aria-selected', 'true');

      // Check trigger text not updated
      cy.get('@selectOption1')
        .invoke('text')
        .then((text) => {
          cy.get('@selectTrigger').should('have.text', text);
        });
    });


    it('Typing character twice in list with short delay should select second matching option without updating trigger text', () => {
      cy.get('@selectTrigger').click();
      cy.get('@selectList')
        .focus()
        .type('b', {delay: searchTimeoutTime})
        .type('b');
      cy.get('@selectOption11').should('have.attr', 'aria-selected', 'true');
      cy.get('@selectList').should('have.attr', ATTRS.LIST_VISIBLE, 'true');

      // Check trigger text updated
      cy.get('@selectOption1')
        .invoke('text')
        .then((text) => {
          cy.get('@selectTrigger').should('have.text', text);
        });
    });
  });


  describe('Option selected custom event', () => {
    beforeEach(() => {
      cy.reload();
    });


    it('Selecting an option with mouse should dispatch custom event with correct details', () => {
      cy.window().then((window) => {
        window.addEventListener(EVENTS.OPTION_SELECTED, (e) => {
          expect(e.detail.id).to.equal(IDS.SELECT_1);
          expect(e.detail.option.id).to.equal(`${IDS.SELECT_1}-option-5`);
          expect(e.detail.option.index).to.equal(4);
        });
      });

      cy.get('@selectTrigger').click();
      cy.get('@selectOption5').click();
    });


    it('Selecting an option with ENTER should dispatch custom event with correct details', () => {
      cy.window().then((window) => {
        window.addEventListener(EVENTS.OPTION_SELECTED, (e) => {
          expect(e.detail.id).to.equal(IDS.SELECT_1);
          expect(e.detail.option.id).to.equal(`${IDS.SELECT_1}-option-4`);
          expect(e.detail.option.index).to.equal(3);
        });
      });

      cy.get('@selectTrigger')
        .focus()
        .type('{downarrow}')
        .type('{downarrow}')
        .type('{downarrow}')
        .type('{downarrow}')
        .type('{enter}');
    });


    it('Selecting an option with SPACE should dispatch custom event with correct details', () => {
      cy.window().then((window) => {
        window.addEventListener(EVENTS.OPTION_SELECTED, (e) => {
          expect(e.detail.id).to.equal(IDS.SELECT_1);
          expect(e.detail.option.id).to.equal(`${IDS.SELECT_1}-option-2`);
          expect(e.detail.option.index).to.equal(1);
        });
      });

      cy.get('@selectTrigger')
        .focus()
        .type('{downarrow}')
        .type('{downarrow}')
        .type(' ');
    });


    it('Selecting an option with type-ahead on trigger should dispatch custom event with correct details', () => {
      cy.window().then((window) => {
        window.addEventListener(EVENTS.OPTION_SELECTED, (e) => {
          expect(e.detail.id).to.equal(IDS.SELECT_1);
          expect(e.detail.option.id).to.equal(`${IDS.SELECT_1}-option-8`);
          expect(e.detail.option.index).to.equal(7);
        });
      });

      cy.get('@selectTrigger')
        .focus()
        .type('s');
    });
  });


  describe('Select with dynamic options', () => {
    beforeEach(() => {
      cy.reload();

      cy.get(`#${IDS.DYNAMIC_SELECT}`).as('dynamicSelect');
      cy.get(`#${IDS.ADD_OPTION_BTN}`).as('addOptionBtn');
      cy.get(`#${IDS.REMOVE_OPTION_BTN}`).as('removeOptionBtn');

      cy.get('@dynamicSelect')
        .find('button')
        .as('dynamicSelectTrigger');

      cy.get('@dynamicSelect')
        .find('ul')
        .as('dynamicSelectList');
    });


    it('Select with dynamically added options should intiialise correctly', () => {
      cy.get('@addOptionBtn')
        .click()
        .click()
        .click();

      cy.get('@dynamicSelect')
        .find('li')
        .as('dynamicSelectOptions')
        .first()
        .as('dynamicSelectOption1');

      // Check select trigger attributes
      cy.get('@dynamicSelectTrigger').should('have.attr', 'id', `${IDS.DYNAMIC_SELECT}-trigger`);
      cy.get('@dynamicSelectTrigger').should('have.attr', ATTRS.TRIGGER);
      cy.get('@dynamicSelectTrigger').should('have.attr', 'aria-expanded', 'false');
      cy.get('@dynamicSelectTrigger').should('have.attr', 'aria-haspopup', 'listbox');
      cy.get('@dynamicSelectOption1')
        .invoke('text')
        .then((text) => {
          cy.get('@dynamicSelectTrigger').should('have.text', text);
        });

      // Check select list attributes
      cy.get('@selectList').should('have.attr', ATTRS.LIST);
      cy.get('@selectList').should('have.attr', ATTRS.LIST_VISIBLE, 'false');
      cy.get('@selectList').should('have.attr', LB_ATTRS.LIST);
      cy.get('@selectList').should('have.attr', 'tabindex', '-1');
      cy.get('@selectList').should('have.attr', 'role', 'listbox');

      // Check select options attributes
      cy.get('@selectOptions').each((option, index) => {
        cy.get(option).should('have.attr', LB_ATTRS.OPTION_INDEX, index.toString());
        cy.get(option).should('have.attr', 'id', `${IDS.SELECT_1}-option-${(index + 1).toString()}`);
        cy.get(option).should('have.attr', 'role', 'option');
        cy.get(option).should('not.have.attr', LB_ATTRS.ACTIVE_OPTION);

        // All listbox options except the first of a single-select listbox should have aria-selected false
        const ariaSelected = (index === 0) ? 'true' : 'false';
        cy.get(option).should('have.attr', 'aria-selected', ariaSelected);
      });
    });


    it('Select with dynamically removed option should intiialise correctly', () => {
      cy.get('@addOptionBtn')
        .click()
        .click();
      cy.get('@removeOptionBtn').click();

      cy.get('@dynamicSelect')
        .find('li')
        .as('dynamicSelectOptions')
        .first()
        .as('dynamicSelectOption1');

      // Check select trigger text
      cy.get('@dynamicSelectOption1')
        .invoke('text')
        .then((text) => {
          cy.get('@dynamicSelectTrigger').should('have.text', text);
        });

      // Check select options attributes
      cy.get('@selectOptions').each((option, index) => {
        cy.get(option).should('have.attr', LB_ATTRS.OPTION_INDEX, index.toString());
        const ariaSelected = (index === 0) ? 'true' : 'false';
        cy.get(option).should('have.attr', 'aria-selected', ariaSelected);
      });
    });
  });
});
