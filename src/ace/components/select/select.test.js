import { ATTRS, EVENTS, SEARCH_TIMEOUT, SELECT } from './select';
import { getOptionId } from '../../../../cypress/functions';


const IDS = {
	ADD_OPTION_BTN: 'add-option',
	CUSTOM_EVENTS_SELECT: 'ace-custom-events-select',
	FOR_FORM_SELECT: `ace-select-for-form`,
	REMOVE_OPTION_BTN: 'remove-option',
	SIMPLE_SELECT: `${SELECT}-1`,
};


const getEls = (id) => {
	return cy.get(`#${id}`)
		.as('select')
		.find('button')
		.as('selectTrigger')
		.get('@select')
		.find('ul')
		.as('selectList');
};


const initChecks = () => {
	return cy.get('@select')
		.then(($select) => {
			cy.get('@selectTrigger')
				.should('have.id', `${$select.attr('id')}-trigger`)
				.and('have.attr', ATTRS.TRIGGER, '')
				.and('have.attr', 'aria-expanded', 'false')
				.and('have.attr', 'aria-haspopup', 'listbox')
				.get('@selectList')
				.should('have.attr', ATTRS.LIST, '')
				.and('have.attr', 'role', 'listbox')
				.and('have.attr', 'tabindex', '-1');
		});
};


const optionsInitChecks = () => {
	return cy.get('@select')
		.then(($select) => {
			cy.get('@selectOptions')
				.eq(0)
				.then(($firstOption) => cy.get('@selectTrigger').should('have.text', $firstOption.text()))
				.get('@selectOptions')
				.each(($option, index) => {
					cy.wrap($option)
						.should('have.id', getOptionId($select.attr('id'), index))
						.and('have.attr', 'aria-selected', index === 0 ? 'true' : 'false')
						.and('have.attr', 'role', 'option');
				});
		});
};


const checkOptionSelected = (optionIndex) => {
	return cy.get('@select')
		.then(($select) => {
			cy.get('@selectOptions')
				.eq(0)
				.then(($firstOption) => cy.get('@selectTrigger').should('have.text', $firstOption.text()))
				.get('@selectList')
				.should('have.attr', ATTRS.LIST_VISIBLE, '')
				.and('have.attr', 'aria-activedescendant', getOptionId($select.attr('id'), optionIndex))
				.get('@selectOptions')
				.each(($option, index) => {
					cy.wrap($option).should('have.attr', 'aria-selected', index === optionIndex ? 'true' : 'false');
				});
		});
};


const checkOptionChosen = (optionIndex) => {
	return cy.get('@selectOptions')
		.eq(optionIndex)
		.then(($chosenOption) => {
			cy.get('@selectTrigger')
				.should('have.text', $chosenOption.text())
				.and('have.attr', 'aria-expanded', 'false');
		});
};


context(`Select`, () => {
	before(() => cy.visit(`/select`));


	it(`Should initialise with an ID even if one not provided`, () => {
		cy.get(SELECT)
			.first()
			.should('have.id', `${SELECT}-1`);
	});


	context(`Simple Select`, () => {
		const SELECT_ID = IDS.SIMPLE_SELECT;
		const option1Id = getOptionId(SELECT_ID, 0);


		beforeEach(() => {
			getEls(SELECT_ID);
			cy.get('@selectList')
				.find('li')
				.as('selectOptions')
				.first()
				.as('selectOption1')
				// Reset state
				.get('@selectTrigger')
				.click()
				.get('@selectOption1')
				.click()
				.get('@select')
				.parent()
				.click();
		});


		it(`Should initialise correctly`, () => {
			initChecks();
			optionsInitChecks();
		});


		describe(`Mouse interactions`, () => {
			it(`Clicking trigger should show list with first option selected and give it focus`, () => {
				cy.get('@selectTrigger')
					.click()
					.should('have.attr', 'aria-expanded', 'true')
					.get('@selectList')
					.and('have.focus');
				checkOptionSelected(0);
			});


			it(`Clicking outside a shown list without choosing active option should only hide list`, () => {
				cy.get('@selectTrigger')
					.click()
					.get('@selectList')
					.type('{downarrow}')
					.get('@select')
					.parent()
					.click();
				checkOptionChosen(0);
			});


			it(`Clicking option should choose it, hide list and update trigger text`, () => {
				const optionIndex = 6;
				const expectedDetail = {
					'chosenOption': {
						'id': getOptionId(SELECT_ID, optionIndex),
						'index': optionIndex
					},
					'id': SELECT_ID,
				};
				cy.addCustomEventListener(EVENTS.OUT.OPTION_CHOSEN, expectedDetail)
					.get('@selectTrigger')
					.click()
					.get('@selectOptions')
					.eq(optionIndex)
					.click();
				checkOptionChosen(optionIndex);
			});


			it(`Clicking an option then clicking the trigger again should show list with same option selected`, () => {
				const optionIndex = 8;
				cy.get('@selectTrigger')
					.click()
					.get('@selectOptions')
					.eq(optionIndex)
					.as('selectOption7')
					.click()
					.get('@selectTrigger')
					.click()
					.get('@selectList')
					.should('have.attr', 'aria-activedescendant', getOptionId(SELECT_ID, optionIndex))
					.get('@selectOption7')
					.should('have.attr', 'aria-selected', 'true');
			});
		});


		describe(`Keyboard interactions`, () => {
			describe(`On trigger`, () => {
				it(`Pressing DOWN key on trigger should show list without changing selected option`, () => {
					cy.get('@selectTrigger')
						.focus()
						.type('{downarrow}')
						.should('have.attr', 'aria-expanded', 'true')
						.get('@selectList')
						.and('have.attr', 'aria-activedescendant', option1Id)
						.get('@selectOption1')
						.should('have.attr', 'aria-selected', 'true');
				});


				it(`Pressing UP key on trigger should show list without changing selected option`, () => {
					cy.get('@selectTrigger')
						.focus()
						.type('{uparrow}')
						.should('have.attr', 'aria-expanded', 'true')
						.get('@selectList')
						.and('have.attr', 'aria-activedescendant', option1Id)
						.get('@selectOption1')
						.should('have.attr', 'aria-selected', 'true');
				});


				it(`Type-ahead should change selected option correctly`, () => {
					// Character that leads to no match does nothing
					cy.get('@selectTrigger')
						.focus()
						.type('z', { delay: SEARCH_TIMEOUT });
					checkOptionChosen(0);

					// Typing single character
					cy.get('@selectTrigger').type('t', { delay: SEARCH_TIMEOUT });
					checkOptionChosen(5);

					// Typing character twice without delay then again after delay
					cy.get('@selectTrigger')
						.type('b')
						.type('b', { delay: SEARCH_TIMEOUT });
					checkOptionChosen(10);
					cy.get('@selectTrigger').type('b', { delay: SEARCH_TIMEOUT });
					checkOptionChosen(4);

					// Character sequence that leads to match
					cy.get('@selectTrigger').type('s');
					checkOptionChosen(7);
					cy.get('@selectTrigger').type('p');
					checkOptionChosen(9);
				});
			});


			describe(`On list`, () => {
				it(`Pressing ESC key on list should close list without choosing selected option`, () => {
					cy.get('@selectTrigger')
						.click()
						.get('@selectList')
						.type('{uparrow}{esc}');
					checkOptionChosen(0);
				});


				it(`DOWN and UP on list should change selected option but not the trigger text`, () => {
					cy.get('@selectTrigger')
						.click()
						.get('@selectList')
						.type('{downarrow}{downarrow}{downarrow}');
					checkOptionSelected(3);

					cy.get('@selectList').type('{uparrow}{uparrow}{uparrow}{uparrow}{uparrow}');
					checkOptionSelected(11);
				});


				it(`Pressing SPACE key on list should choose selected option`, () => {
					const optionIndex = 1;
					const expectedDetail = {
						'chosenOption': {
							'id': getOptionId(SELECT_ID, optionIndex),
							'index': optionIndex
						},
						'id': SELECT_ID,
					};

					cy.addCustomEventListener(EVENTS.OUT.OPTION_CHOSEN, expectedDetail)
						.get('@selectTrigger')
						.focus()
						.click()
						.type('{downarrow} {esc}');
					checkOptionChosen(optionIndex);
				});


				it(`Type-ahead should change selected option correctly`, () => {
					// Character that leads to no match does nothing
					cy.get('@selectTrigger')
						.click()
						.get('@selectList')
						.focus()
						.type('z', { delay: SEARCH_TIMEOUT });
					checkOptionSelected(0);

					// Typing single character
					cy.get('@selectList').type('t', { delay: SEARCH_TIMEOUT });
					checkOptionSelected(5);

					// Typing character twice without delay then again after delay
					cy.get('@selectList')
						.type('b')
						.type('b', { delay: SEARCH_TIMEOUT });
					checkOptionSelected(10);
					cy.get('@selectList').type('b', { delay: SEARCH_TIMEOUT });
					checkOptionSelected(4);

					// Character sequence that leads to match
					cy.get('@selectList').type('s');
					checkOptionSelected(7);
					cy.get('@selectList').type('p');
					checkOptionSelected(9);
				});
			});
		});
	});


	context(`Select for form`, () => {
		const SELECT_ID = IDS.FOR_FORM_SELECT;


		beforeEach(() => {
			getEls(SELECT_ID);
			cy.get('@select')
				.find(`input[${ATTRS.INPUT}]`)
				.as('selectInput')
				.get('@selectList')
				.find('li')
				.as('selectOptions')
				.first()
				.as('selectOption1')
				// Reset state
				.get('@selectTrigger')
				.click()
				.get('@selectOption1')
				.click()
				.get('@select')
				.parent()
				.click();
		});


		it(`Should initialise correctly`, () => {
			initChecks();

			const inputId = `${SELECT_ID}-input`;
			cy.get('@selectInput')
				.should('have.id', inputId)
				.and('have.attr', 'name', inputId)
				.and('have.attr', 'type', 'hidden');
		});


		it(`Should dynamically set the value and data attribute of hidden input to selected options`, () => {
			const selectedOptionIndex = 2;
			cy.get('@selectTrigger')
				.click()
				.get('@selectOptions')
				.eq(selectedOptionIndex)
				.click()
				.invoke('text')
				.then((selectedOptionText) => {
					const id = `${SELECT_ID}-list-option-${selectedOptionIndex + 1}`;
					const val = selectedOptionText;

					cy.get('@selectInput')
						.should('have.attr', ATTRS.SELECTED_OPTION_ID, id)
						.and('have.value', encodeURIComponent(val));
				});

			const secondSelectedOptionIndex = 8;
			cy.get('@selectTrigger')
				.click()
				.get('@selectOptions')
				.eq(secondSelectedOptionIndex)
				.click()
				.invoke('text')
				.then((selectedOptionText) => {
					const id = `${SELECT_ID}-list-option-${secondSelectedOptionIndex + 1}`;
					const val = selectedOptionText;

					cy.get('@selectInput')
						.should('have.attr', ATTRS.SELECTED_OPTION_ID, id)
						.and('have.value', encodeURIComponent(val));
				});

		});
	});


	context(`Select with dynamic options`, () => {
		const SELECT_ID = IDS.CUSTOM_EVENTS_SELECT;


		beforeEach(() => getEls(SELECT_ID));


		it(`Should initialise correctly`, () => initChecks());


		it(`Should respond to custom 'ace-select-update-options' event correctly`, () => {
			cy.addCustomEventListener(EVENTS.OUT.READY, { 'id': SELECT_ID })
				.get(`#${IDS.ADD_OPTION_BTN}`)
				.click()
				.click()
				.click()
				.click()
				.get('@select')
				.find('li')
				.as('selectOptions');
			optionsInitChecks(SELECT_ID);

			cy.get(`#${IDS.REMOVE_OPTION_BTN}`)
				.click()
				.click();
			initChecks();
			cy.get('@selectOptions')
				.eq(0)
				.then($firstOption => cy.get('@selectTrigger').should('have.text', $firstOption.text()))
				.get('@selectOptions')
				.each(($option, index) => {
					cy.wrap($option)
						.should('have.attr', 'aria-selected', index === 0 ? 'true' : 'false')
						.and('have.attr', 'role', 'option');
				});
		});
	});
});
