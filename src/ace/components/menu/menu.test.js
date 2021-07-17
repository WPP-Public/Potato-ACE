import { ATTRS, EVENTS, MENU, SEARCH_TIMEOUT } from './menu';
import { getOptionId } from '../../../../cypress/functions';


const IDS = {
	ADD_OPTION_BTN: 'add-option',
	CUSTOM_EVENTS_MENU: 'custom-events-menu',
	REMOVE_OPTION_BTN: 'remove-option',
	SIMPLE_MENU: `${MENU}-1`,
};


const getEls = (id) => {
	return cy.get(`#${id}`)
		.as('menu')
		.find(`[${ATTRS.TRIGGER}]`)
		.as('menuTrigger')
		.get('@menu')
		.find(`[${ATTRS.LIST}]`)
		.as('menuList')
		.find(`[${ATTRS.OPTION}]`)
		.as('menuOptions');
};


const initChecks = () => {
	return cy.get('@menu')
		.then(($menu) => {
			cy.get('@menuTrigger')
				.should('have.id', `${$menu.attr('id')}-trigger`)
				.and('have.attr', ATTRS.TRIGGER, '')
				.and('not.have.attr', 'aria-expanded', 'true')
				.and('have.attr', 'aria-haspopup', 'true')
				.get('@menuList')
				.should('have.id', `${$menu.attr('id')}-list`)
				.and('have.attr', ATTRS.LIST, '')
				.and('have.attr', 'role', 'menu')
				.and('have.attr', 'tabindex', '-1')
				.and('not.have.attr', ATTRS.LIST_VISIBLE);
		});
};


const optionsInitChecks = () => {
	return cy.get('@menu')
		.then(($menu) => {
			cy.get('@menuOptions')
				.each(($option, index) => {
					cy.wrap($option)
						.should('have.id', getOptionId($menu.attr('id'), index))
						.and('have.attr', 'aria-selected', 'false')
						.and('have.attr', 'role', 'menuitem');
				});
		});
};


const checkOptionSelected = (optionIndex) => {
	return cy.get('@menu')
		.then(($menu) => {
			cy.get('@menuList')
				.should('have.focus')
				.and('have.attr', ATTRS.LIST_VISIBLE, '')
				.and('have.attr', 'aria-activedescendant', getOptionId($menu.attr('id'), optionIndex))
				.get('@menuOptions')
				.each(($option, index) => {
					cy.wrap($option).should('have.attr', 'aria-selected', index === optionIndex ? 'true' : 'false');
				});
		});
};


context(`Menu`, () => {
	before(() => {
		cy.visit(`/menu`);
		// The ACE header in some cases prevents cypress from focusing on buttons
		cy.get('header.header').invoke('attr', 'style', 'display: none');
	});


	it("should pass lighthouse and pa11y audits", function () {
		cy.lighthouse();
		cy.pa11y();
	});


	it(`Should initialise with an ID even if one not provided`, () => {
		cy.get(MENU)
			.first()
			.should('have.id', `${MENU}-1`);
	});


	context(`Simple Menu`, () => {
		const MENU_ID = IDS.SIMPLE_MENU;


		beforeEach(() => {
			getEls(MENU_ID);

			// Reset state
			cy.get('@menuTrigger').focus().type('{esc}');
		});


		it(`Should initialise correctly`, () => {
			initChecks();
			optionsInitChecks();
		});


		describe(`Mouse interactions`, () => {
			it(`Clicking trigger should show list with no options selected`, () => {
				cy.get('@menuTrigger')
					.click()
					.should('have.attr', 'aria-expanded', 'true')
					.get('@menuList')
					.should('have.attr', ATTRS.LIST_VISIBLE, '')
					.get('@menuOptions')
					.each((option) => cy.wrap(option).should('have.attr', 'aria-selected', 'false'));
			});


			it(`Clicking outside a shown list should hide it`, () => {
				cy.get('@menuTrigger')
					.click()
					.should('have.attr', 'aria-expanded', 'true')
					.get('body')
					.click()
					.should('not.have.attr', 'aria-expanded')
					.get('@menuList')
					.should('not.have.attr', ATTRS.LIST_VISIBLE);
			});


			it(`Clicking option should choose it and hide list`, () => {
				const optionIndex = 2;
				const expectedDetail = {
					'chosenOption': {
						'id': getOptionId(MENU_ID, optionIndex),
						'index': optionIndex
					},
					'id': MENU_ID,
				};
				cy.addCustomEventListener(EVENTS.OUT.OPTION_CHOSEN, expectedDetail)
					.get('@menuTrigger')
					.click()
					.get('@menuOptions')
					.eq(optionIndex)
					.click({ force: true })
					.get('@menuList')
					.should('not.have.attr', ATTRS.LIST_VISIBLE);
			});
		});


		describe(`Keyboard interactions`, () => {
			describe(`On trigger`, () => {
				it(`Pressing ESC on trigger should hide visible list`, () => {
					cy.get('@menuTrigger')
						.click()
						.type('{esc}')
						.should('not.have.attr', 'aria-expanded')
						.get('@menuList')
						.should('not.have.attr', ATTRS.LIST_VISIBLE);
				});

				// The rest of the tests in this group only pass if Cypress window is focused due to issues with how it fires the blur event

				it(`Pressing ENTER, SPACE, DOWN or UP on trigger should show list and select correct option`, () => {
					cy.wrap(['{enter}', ' ', '{downarrow}', '{uparrow}'])
						.each((key) => {
							cy.get('@menuTrigger')
								.focus()
								.type(key)
								.should('have.attr', 'aria-expanded', 'true');
							const optionSelected = key === '{uparrow}' ? 3 : 0;
							checkOptionSelected(optionSelected);

							cy.get('@menuTrigger').type('{esc}');
						});
				});
			});


			describe(`On list`, () => {
				// The tests in this group only pass if Cypress window is focused due to issues with how it fires the blur event
				it(`Pressing ESC on list should hide visible list`, () => {
					cy.get('@menuTrigger')
						.focus()
						.type('{enter}')
						.get('@menuList')
						.type('{esc}')
						.should('not.have.attr', ATTRS.LIST_VISIBLE)
						.get('@menuTrigger')
						.should('not.have.attr', 'aria-expanded');
				});


				it(`DOWN and UP on list should change selected option`, () => {
					// UP
					cy.get('@menuTrigger')
						.click()
						.get('@menuList')
						.focus()
						.type('{uparrow}{uparrow}');
					checkOptionSelected(2);
					// DOWN
					cy.get('@menuList').type('{downarrow}{downarrow}{downarrow}');
					checkOptionSelected(1);
				});


				it(`Pressing ENTER on list should choose selected option and hide list`, () => {
					const expectedDetail = {
						'chosenOption': {
							'id': getOptionId(MENU_ID, 0),
							'index': 0
						},
						'id': MENU_ID,
					};
					cy.addCustomEventListener(EVENTS.OUT.OPTION_CHOSEN, expectedDetail)
						.get('@menuTrigger')
						.focus()
						.type('{enter}')
						.get('@menuList')
						.type('{enter}')
						.should('not.have.attr', ATTRS.LIST_VISIBLE);
				});


				it(`Type-ahead on list should change selected option correctly`, () => {
					// Character that leads to no match does nothing
					cy.get('@menuTrigger')
						.focus()
						.type('{enter}')
						.get('@menuList')
						.type('z', { delay: SEARCH_TIMEOUT });
					checkOptionSelected(0);

					cy.get('@menuList').type('l', { delay: SEARCH_TIMEOUT });
					checkOptionSelected(3);

					cy.get('@menuList').type('se');
					checkOptionSelected(1);
				});
			});
		});
	});


	context(`Menu with dynamic options`, () => {
		const MENU_ID = IDS.CUSTOM_EVENTS_MENU;


		beforeEach(() => {
			cy.get(`#${MENU_ID}`)
				.as('menu')
				.find(`[${ATTRS.TRIGGER}]`)
				.as('menuTrigger')
				.get('@menu')
				.find(`[${ATTRS.LIST}]`)
				.as('menuList');

			// Reset state
			cy.get('@menuTrigger')
				.focus()
				.type('{esc}');
		});


		it(`Should initialise correctly`, () => initChecks());


		it(`Should respond to custom 'ace-menu-update-options' event correctly`, () => {
			cy.addCustomEventListener(EVENTS.OUT.READY, { 'id': MENU_ID })
				.get(`#${IDS.ADD_OPTION_BTN}`)
				.click()
				.click()
				.click()
				.click()
				.get('@menu')
				.find(`[${ATTRS.OPTION}]`)
				.as('menuOptions');
			optionsInitChecks(MENU_ID);

			cy.get(`#${IDS.REMOVE_OPTION_BTN}`)
				.click()
				.click();
			optionsInitChecks(MENU_ID);
		});
	});
});
