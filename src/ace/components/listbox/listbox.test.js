import { ATTRS, EVENTS, LISTBOX, SEARCH_TIMEOUT } from './listbox';
import { getOptionId } from '../../../../cypress/functions';


const IDS = {
	ADD_OPTION_BTN: 'add-option',
	CUSTOM_EVENTS_LB: 'ace-custom-events-listbox',
	FOR_FORM_LB: 'ace-listbox-for-form',
	MULTI_SELECT_LB: 'ace-multiselect-listbox',
	SINGLE_SELECT_LB: `${LISTBOX}-1`,
};


const getEls = (id) => {
	return cy.get(`#${id}`)
		.as('listbox')
		.find('ul')
		.as('listboxList')
		.find('li')
		.as('listboxOptions');
};


const initChecks = () => {
	return cy.get('@listbox')
		.then(($listbox) => {
			cy.wrap($listbox)
				.invoke('attr', ATTRS.MULTISELECT)
				.then((multiselect) => {
					const isMultiselect = multiselect === '';
					cy.get('@listboxList')
						.should('have.attr', ATTRS.LIST, '')
						.and('have.attr', 'role', 'listbox')
						.and('have.attr', 'tabindex', '0')
						.get('@listboxOptions')
						.each(($option, index) => {
							cy.wrap($option)
								.should('have.attr', 'aria-selected', (!isMultiselect && index === 0) ? 'true' : 'false')
								.and('have.id', getOptionId($listbox.attr('id'), index))
								.and('have.attr', 'role', 'option');
						});
				});
		});
};


context(`Listbox`, () => {
	before(() => cy.visit(`/listbox`));


	it(`Listbox without ID should initialise with an ID`, () => {
		cy.get(LISTBOX)
			.eq(0)
			.should('have.id', IDS.SINGLE_SELECT_LB);
	});


	context(`Single-select Listbox`, () => {
		const LISTBOX_ID = IDS.SINGLE_SELECT_LB;


		beforeEach(() => {
			getEls(LISTBOX_ID);

			// Reset state
			cy.get('@listboxOptions')
				.eq(0)
				.click()
				.get('@listboxList')
				.blur();
		});


		it(`Should initialise correctly`, () => initChecks());


		it(`Should set first option as active on initial focus and remove it on blur`, () => {
			cy.get('@listboxList')
				.focus()
				.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, 0))
				.get('@listboxOptions')
				.first()
				.as('listboxOption1')
				.should('have.attr', ATTRS.ACTIVE_OPTION, '')
				.and('have.attr', 'aria-selected', 'true')
				.get('@listboxList')
				.blur()
				.should('not.have.attr', 'aria-activedescendant')
				.get('@listboxOption1')
				.should('not.have.attr', ATTRS.ACTIVE_OPTION);
		});


		it(`Should select clicked option, deactivate it on blur and reactivate it on focus`, () => {
			const firstClickedOptionIndex = 3;
			const firstClickedOptionId = getOptionId(LISTBOX_ID, firstClickedOptionIndex);
			const secondClickedOptionIndex = 7;
			const secondClickedOptionId = getOptionId(LISTBOX_ID, secondClickedOptionIndex);

			cy.get('@listboxList')
				.focus()
				.get('@listboxOptions')
				.eq(firstClickedOptionIndex)
				.click()
				.get('@listboxList')
				.should('have.attr', 'aria-activedescendant', firstClickedOptionId)
				.get('@listboxList')
				.blur()
				.should('not.have.attr', 'aria-activedescendant')
				.get('@listboxList')
				.focus()
				.should('have.attr', 'aria-activedescendant', firstClickedOptionId)
				.get('@listboxOptions')
				.eq(secondClickedOptionIndex)
				.click()
				.should('have.attr', 'aria-selected', 'true')
				.get('@listboxList')
				.should('have.attr', 'aria-activedescendant', secondClickedOptionId)
				.get('@listboxOptions')
				.each(($option, index) => {
					cy.wrap($option)
						.should('have.attr', 'aria-selected', index === secondClickedOptionIndex ? 'true' : 'false')
						.and(`${index === secondClickedOptionIndex ? '' : 'not.'}have.attr`, ATTRS.ACTIVE_OPTION);
				});
		});


		it(`Should respond to combination of clicks and arrow keys correctly`, () => {
			const firstClickedOptionIndex = 4;
			const secondClickedOptionIndex = 11;

			cy.get('@listboxList')
				.focus()
				.get('@listboxOptions')
				.eq(firstClickedOptionIndex)
				.click()
				.get('@listboxList')
				.focus()
				.type('{downarrow}{downarrow}')
				.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, firstClickedOptionIndex + 2))
				.get('@listboxOptions')
				.eq(secondClickedOptionIndex)
				.click()
				.get('@listboxList')
				.focus()
				.type('{uparrow}{uparrow}{uparrow}')
				.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, secondClickedOptionIndex - 3));
		});


		describe(`Keyboard interactions`, () => {
			it(`Should respond to UP & DOWN correctly`, () => {
				// Test Up key
				let optionIndex = 11;
				cy.get('@listboxList')
					.focus()
					.type('{uparrow}')
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, optionIndex))
					.get('@listboxOptions')
					.first()
					.should('not.have.attr', ATTRS.ACTIVE_OPTION, '')
					.and('have.attr', 'aria-selected', 'false')
					.get('@listboxOptions')
					.eq(optionIndex)
					.should('have.attr', ATTRS.ACTIVE_OPTION, '')
					.and('have.attr', 'aria-selected', 'true');

				optionIndex = 9;
				cy.get('@listboxList')
					.type('{uparrow}{uparrow}')
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, optionIndex))
					.get('@listboxOptions')
					.eq(optionIndex)
					.should('have.attr', ATTRS.ACTIVE_OPTION, '');

				// Test Down key
				optionIndex = 0;
				cy.get('@listboxList')
					.type('{downarrow}{downarrow}{downarrow}')
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, optionIndex))
					.get('@listboxOptions')
					.eq(optionIndex)
					.should('have.attr', ATTRS.ACTIVE_OPTION, '')
					.and('have.attr', 'aria-selected', 'true');

				optionIndex = 1;
				cy.get('@listboxList')
					.type('{downarrow}')
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, optionIndex))
					.get('@listboxOptions')
					.eq(optionIndex)
					.should('have.attr', ATTRS.ACTIVE_OPTION, '')
					.and('have.attr', 'aria-selected', 'true');
			});


			it(`Should respond to HOME & END correctly`, () => {
				// Test END key
				cy.get('@listboxList')
					.focus()
					.type('{end}')
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, 11))
					.get('@listboxOptions')
					.last()
					.should('have.attr', ATTRS.ACTIVE_OPTION, '')
					.and('have.attr', 'aria-selected', 'true')
					// Test HOME key
					.get('@listboxList')
					.type('{home}')
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, 0))
					.get('@listboxOptions')
					.first()
					.should('have.attr', ATTRS.ACTIVE_OPTION, '')
					.and('have.attr', 'aria-selected', 'true');
			});


			it(`Type-ahead should change selected option correctly`, () => {
				// Character that leads to no match does nothing
				cy.get('@listboxList')
					.focus()
					.type('z', { delay: SEARCH_TIMEOUT })
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, 0));

				// Typing single character
				let optionIndex = 2;
				cy.get('@listboxList')
					.type('h', { delay: SEARCH_TIMEOUT })
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, 2))
					.get('@listboxOptions')
					.eq(optionIndex)
					.should('have.attr', 'aria-selected', 'true');

				// Typing character twice without delay then again after delay
				optionIndex = 5;
				cy.get('@listboxList')
					.type('b')
					.type('b', { delay: SEARCH_TIMEOUT })
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, optionIndex))
					.get('@listboxOptions')
					.eq(optionIndex)
					.should('have.attr', 'aria-selected', 'true');
				optionIndex = 8;
				cy.get('@listboxList')
					.type('b', { delay: SEARCH_TIMEOUT })
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, optionIndex))
					.get('@listboxOptions')
					.eq(optionIndex)
					.should('have.attr', 'aria-selected', 'true');

				// Character sequence that leads to match
				optionIndex = 9;
				cy.get('@listboxList')
					.type('s')
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, optionIndex))
					.get('@listboxOptions')
					.eq(optionIndex)
					.should('have.attr', 'aria-selected', 'true');
				optionIndex = 6;
				cy.get('@listboxList')
					.focus()
					.type('c')
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, optionIndex))
					.get('@listboxOptions')
					.eq(optionIndex)
					.should('have.attr', 'aria-selected', 'true');
			});
		});
	});


	context(`Multi-select Listbox`, () => {
		const LISTBOX_ID = IDS.MULTI_SELECT_LB;


		beforeEach(() => {
			getEls(LISTBOX_ID);

			// Reset state
			cy.get('@listboxOptions')
				.eq(0)
				.click()
				.get('@listboxList')
				.type('{ctrl}a{ctrl}a')
				.blur();
		});


		it(`Should initialise correctly`, () => initChecks());


		it(`Should set first option as active but not selected on initial focus and deactivate it on blur`, () => {
			cy.get('@listboxList')
				.focus()
				.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, 0))
				.get('@listboxOptions')
				.first()
				.as('listboxOption1')
				.should('have.attr', ATTRS.ACTIVE_OPTION, '')
				.and('have.attr', 'aria-selected', 'false')
				.get('@listboxList')
				.blur()
				.should('not.have.attr', 'aria-activedescendant')
				.get('@listboxOption1')
				.should('not.have.attr', ATTRS.ACTIVE_OPTION);
		});


		describe(`Mouse interactions`, () => {
			it(`Should select and deslect options when clicked`, () => {
				const firstClickedOptionIndex = 9;
				const firstClickedOptionId = getOptionId(LISTBOX_ID, firstClickedOptionIndex);
				const secondClickedOptionIndex = 6;

				cy.get('@listboxList')
					.focus()
					.get('@listboxOptions')
					.eq(firstClickedOptionIndex)
					.as('firstClickedOption')
					.click()
					.get('@listboxList')
					.should('have.attr', 'aria-activedescendant', firstClickedOptionId)
					.get('@listboxList')
					.blur()
					.should('not.have.attr', 'aria-activedescendant')
					.get('@listboxList')
					.focus()
					.should('have.attr', 'aria-activedescendant', firstClickedOptionId)
					.get('@listboxOptions')
					.eq(secondClickedOptionIndex)
					.as('secondClickedOption')
					.click()
					.should('have.attr', 'aria-selected', 'true')
					.get('@listboxList')
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, secondClickedOptionIndex))
					.get('@firstClickedOption')
					.should('have.attr', 'aria-selected', 'true')
					.get('@secondClickedOption')
					.should('have.attr', 'aria-selected', 'true')
					.and('have.attr', ATTRS.ACTIVE_OPTION, '')
					.get('@listboxOptions')
					.eq(secondClickedOptionIndex)
					.as('secondClickedOption')
					.click()
					.should('have.attr', 'aria-selected', 'false')
					.get('@listboxList')
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, secondClickedOptionIndex));
			});


			it(`Should select multiple options using SHIFT + click`, () => {
				const firstClickedOptionIndex = 9;
				const secondClickedOptionIndex = 6;

				cy.get('@listboxList')
					.focus()
					.get('@listboxOptions')
					.eq(firstClickedOptionIndex)
					.click()
					.get('@listboxList')
					.type('{shift}', { release: false })
					.get('@listboxOptions')
					.eq(secondClickedOptionIndex)
					.click()
					.get('@listboxList')
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, secondClickedOptionIndex))
					.get('@listboxOptions')
					.each(($option, index) => {
						cy.wrap($option).should(
							'have.attr',
							'aria-selected',
							(index <= firstClickedOptionIndex && index >= secondClickedOptionIndex) ? 'true' : 'false'
						);
					});
			});


			it(`Should respond to combination of clicks and keyboard keys correctly`, () => {
				cy.get('@listboxList')
					.focus()
					.get('@listboxOptions')
					.eq(8)
					.as('firstClickedOption')
					.click()
					.get('@listboxList')
					.focus()
					.type('{uparrow}{uparrow} {downarrow}')
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, 7))
					.get('@firstClickedOption')
					.should('have.attr', 'aria-selected', 'true')
					.get('@listboxOptions')
					.eq(6)
					.should('have.attr', 'aria-selected', 'true')
					.get('@listboxList')
					.type('{home}')
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, 0))
					.get('@listboxOptions')
					.first()
					.should('have.attr', ATTRS.ACTIVE_OPTION, '');
			});
		});


		describe(`Keyboard interactions`, () => {
			it(`Should respond to UP & DOWN correctly`, () => {
				// Test UP key
				let optionIndex = 11;
				cy.get('@listboxList')
					.focus()
					.type('{uparrow}')
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, optionIndex))
					.get('@listboxOptions')
					.eq(optionIndex)
					.should('have.attr', ATTRS.ACTIVE_OPTION, '')
					.and('have.attr', 'aria-selected', 'false');

				// Test SHIFT + UP key
				optionIndex = 5;
				cy.get('@listboxList')
					.type('{uparrow}{uparrow}{shift}', { release: false })
					.get('@listboxList')
					.type('{uparrow}{uparrow}{uparrow}{uparrow}')
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, optionIndex))
					.get('@listboxOptions')
					.eq(optionIndex)
					.should('have.attr', ATTRS.ACTIVE_OPTION, '')
					.get('@listboxOptions')
					.each(($option, index) => {
						cy.wrap($option).should(
							'have.attr',
							'aria-selected',
							(index <= (optionIndex + 3) && index >= optionIndex) ? 'true' : 'false');
					});

				// Test DOWN key
				cy.get('@listboxList')
					.type('{downarrow}')
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, 6))
					.get('@listboxOptions')
					.eq(6)
					.should('have.attr', ATTRS.ACTIVE_OPTION, '')
					.and('have.attr', 'aria-selected', 'true')
					// Test SHIFT + DOWN key
					.get('@listboxList')
					.type('{shift}', { release: false })
					.type('{downarrow}{downarrow}{downarrow}{downarrow}')
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, 10))
					.get('@listboxOptions')
					.each(($option, index) => {
						const selected = index === 5 || index === 6 || index === 9 || index === 10;
						cy.wrap($option).should('have.attr', 'aria-selected', selected ? 'true' : 'false');
					});
			});


			it(`Should repond to SPACE key correctly`, () => {
				// Test SPACE selection and deselection
				cy.get('@listboxList')
					.focus()
					.type(' ')
					.get('@listboxOptions')
					.eq(0)
					.as('listboxOption1')
					.should('have.attr', 'aria-selected', 'true')
					.get('@listboxList')
					.type(' ')
					.get('@listboxOption1')
					.should('have.attr', 'aria-selected', 'false')
					// Test SHIFT + SPACE selection with no options in range selected
					.get('@listboxList')
					.type('{downarrow}{downarrow} {downarrow}{downarrow}{shift}', { release: false })
					.type(' ')
					.get('@listboxOptions')
					.each(($option, index) => {
						cy.wrap($option).should('have.attr', 'aria-selected', (index >= 2 && index <= 4) ? 'true' : 'false');
					})
					// Test SHIFT + SPACE selection when some options in range selected
					.get('@listboxList')
					.type('{downarrow}{downarrow} {uparrow}{uparrow}{uparrow}{uparrow}{uparrow}{uparrow}{shift}', { release: false })
					.type(' ')
					.get('@listboxOptions')
					.each(($option, index) => {
						cy.wrap($option).should('have.attr', 'aria-selected', (index >= 0 && index <= 6) ? 'true' : 'false');
					})
					// Test SHIFT + SPACE selection with wrap around
					.get('@listboxList')
					.type('{uparrow}{uparrow}{shift}', { release: false })
					.type(' ')
					.get('@listboxOptions')
					.each(($option, index) => {
						cy.wrap($option).should('have.attr', 'aria-selected', (index !== 11) ? 'true' : 'false');
					});
			});


			it(`Should repond to CTRL key correctly`, () => {
				// Test CTRL + A selection & deselection
				cy.get('@listboxList')
					.focus()
					.type('{meta+a}')
					.get('@listboxOptions')
					.each(($option) => {
						cy.wrap($option).should('have.attr', 'aria-selected', 'true');
					})
					.get('@listboxList')
					.type('{meta+a}')
					.get('@listboxOptions')
					.each(($option) => {
						cy.wrap($option).should('have.attr', 'aria-selected', 'false');
					})
					// Test CTRL + SHIFT + HOME
					.get('@listboxList')
					.type('{downarrow}{downarrow}{downarrow}{ctrl}{shift}{home}')
					.get('@listboxOptions')
					.each(($option, index) => {
						cy.wrap($option).should('have.attr', 'aria-selected', index <= 3 ? 'true' : 'false');
					})
					// Test CTRL + SHIFT + END
					.get('@listboxList')
					.type('{uparrow}{uparrow}{uparrow}{ctrl}{shift}{end}')
					.get('@listboxOptions')
					.each(($option, index) => {
						cy.wrap($option).should('have.attr', 'aria-selected', index <= 3 || index >= 9 ? 'true' : 'false');
					});
			});


			it(`Type-ahead should make option active but not selected`, () => {
				const optionIndex = 10;
				cy.get('@listboxList')
					.type('d')
					.should('have.attr', 'aria-activedescendant', getOptionId(LISTBOX_ID, optionIndex))
					.get('@listboxOptions')
					.eq(optionIndex)
					.as('listboxOption10')
					.should('have.attr', 'aria-selected', 'false');
			});
		});
	});


	context(`Listbox for form`, () => {
		const LISTBOX_ID = IDS.FOR_FORM_LB;


		beforeEach(() => {
			cy.get(`#${LISTBOX_ID}`)
				.as('listbox')
				.find('ol')
				.as('listboxList')
				.find('li')
				.as('listboxOptions')
				.get('@listbox')
				.find(`input[${ATTRS.INPUT}]`)
				.as('listboxInput');

			// Reset state
			cy.get('@listboxOptions')
				.eq(0)
				.click()
				.get('@listboxList')
				.type('{ctrl}a{ctrl}a')
				.blur();
		});


		it(`Should initialise correctly`, () => {
			initChecks();

			const inputId = `${LISTBOX_ID}-input`;
			cy.get('@listboxInput')
				.should('have.id', inputId)
				.and('have.attr', 'name', inputId)
				.and('have.attr', 'type', 'hidden');
		});


		it(`Should dynamically set the value and data attribute of hidden input to selected options`, () => {
			const firstSelectedOptionIndex = 2;
			const secondSelectedOptionIndex = 8;

			cy.get('@listboxOptions')
				.eq(firstSelectedOptionIndex)
				.click()
				.invoke('text')
				.then((firstSelectedOptionText) => {
					cy.get('@listboxOptions')
						.eq(secondSelectedOptionIndex)
						.click()
						.invoke('text')
						.then((secondSelectedOptionText) => {
							const vals = [firstSelectedOptionText, secondSelectedOptionText];
							const ids = [
								`${LISTBOX_ID}-list-option-${firstSelectedOptionIndex + 1}`,
								`${LISTBOX_ID}-list-option-${secondSelectedOptionIndex + 1}`,
							];

							cy.get('@listboxInput')
								.should('have.attr', ATTRS.SELECTED_OPTION_IDS, JSON.stringify(ids))
								.and('have.value', encodeURIComponent(JSON.stringify(vals)));
						});
				});
		});
	});


	context(`Listbox controlled using custom events`, () => {
		const LISTBOX_ID = IDS.CUSTOM_EVENTS_LB;


		beforeEach(() => {
			cy.get(`#${LISTBOX_ID}`)
				.as('listbox')
				.find('ul')
				.as('listboxList')
				.get(`#${IDS.ADD_OPTION_BTN}`)
				.as('addOptionBtn');
		});


		it(`Listbox should add a <ul> if neither a <ul> nor a <ol> is not present`, () => {
			cy.get('@listbox')
				.find('ul')
				.should('have.length', 1);
		});


		it(`Should respond to custom events correctly`, () => {
			const selectedOptionIndex = 2;
			cy.addCustomEventListener(EVENTS.OUT.READY, { 'id': LISTBOX_ID })
				.get('@addOptionBtn')
				.click()
				.click()
				.click()
				.get('@listbox')
				.find('li')
				.as('listboxOptions')
				.eq(selectedOptionIndex)
				.click()
				.get('@listboxOptions')
				.each(($option, index) => {
					cy.wrap($option)
						.should('have.id', `${LISTBOX_ID}-list-option-${(index + 1)}`)
						.and('have.attr', 'aria-selected', (index === selectedOptionIndex) ? 'true' : 'false')
						.and('have.attr', 'role', 'option')
						.and(`${index === selectedOptionIndex ? '' : 'not.'}have.attr`, ATTRS.ACTIVE_OPTION);
				});
		});
	});
});
