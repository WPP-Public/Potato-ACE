import {ACCORDION, ATTRS, EVENTS} from './accordion';


const IDS = {
	APPEND_PANEL_BTN: 'append-panel-btn',
	CUSTOM_EVENTS_ACCORDION: 'custom-events-accordion',
	HIDE_ALL_PANELS_BTN: 'hide-panels-btn',
	HIDE_PANEL_BTN: 'hide-panel-btn',
	ONE_VISIBLE_PANEL_ACCORDION: 'one-visible-panel-accordion',
	PANEL_NUMBER_INPUT: 'panel-number',
	REMOVE_PANEL_BTN: 'remove-panel-btn',
	SHOW_ALL_PANELS_BTN: 'show-panels-btn',
	SHOW_PANEL_BTN: 'show-panel-btn',
	SIMPLE_ACCORDION: `${ACCORDION}-1`,
	TOGGLE_PANEL_BTN: 'toggle-panel-btn',
};


const getEls = (id) => {
	return cy.get(`#${id}`)
		.as('accordion')
		.find(`[${ATTRS.TRIGGER}]`)
		.as('accordionTriggers')
		.get('@accordion')
		.find(`[${ATTRS.PANEL}]`)
		.as('accordionPanels');
};


const accordionInitChecks = () => {
	return cy.get('@accordion')
		.invoke('attr', 'id')
		.then((accordionId) => {
			cy.get('@accordionTriggers')
				.each(($trigger, index) => {
					const triggerId = `${accordionId}-trigger-${index + 1}`;
					const panelId = `${accordionId}-panel-${index + 1}`;

					cy.wrap($trigger)
						.should('have.id', triggerId)
						.and('have.attr', ATTRS.TRIGGER, '')
						.and('have.attr', 'aria-controls', panelId)
						.and('have.attr', 'aria-expanded')
						.wrap($trigger)
						.invoke('attr', 'aria-expanded')
						.then((ariaExpanded) => {
							const panelShouldBeVisible = ariaExpanded === 'true';
							cy.get('@accordionPanels')
								.eq(index)
								.should('have.id', panelId)
								.and('have.attr', ATTRS.PANEL, '')
								.and('have.attr', 'aria-labelledby', triggerId)
								.and('have.attr', 'role', 'region')
								.and(`${panelShouldBeVisible ? '' : 'not.'}have.attr`, ATTRS.PANEL_VISIBLE);
						});
				});
		});
};



const checkPanelNotVisible = (panelIndex) => {
	return cy.get('@accordionTriggers')
		.eq(panelIndex)
		.should('have.attr', 'aria-expanded', 'false')
		.get('@accordionPanels')
		.eq(panelIndex)
		.should('not.have.attr', ATTRS.PANEL_VISIBLE);
};


const checkPanelVisible = (panelIndex) => {
	return cy.get('@accordion')
		.invoke('attr', ATTRS.ONE_VISIBLE_PANEL)
		.then((oneVisiblePanelAttrVal) => {
			// If one visible panel accordion then check that other panels are not visible
			const isOneVisiblePanelAccordion = oneVisiblePanelAttrVal === '';
			if (isOneVisiblePanelAccordion) {
				cy.get('@accordionTriggers')
					.each(($trigger, index) => {
						const panelVisible = (index === panelIndex);
						cy.wrap($trigger)
							.should('have.attr', 'aria-expanded', panelVisible.toString())
							.get('@accordionPanels')
							.eq(index)
							.should(`${panelVisible ? '' : 'not.'}have.attr`, ATTRS.PANEL_VISIBLE);
					});
			} else {
				cy.get('@accordionTriggers')
					.eq(panelIndex)
					.should('have.attr', 'aria-expanded', 'true')
					.get('@accordionPanels')
					.eq(panelIndex)
					.should('have.attr', ATTRS.PANEL_VISIBLE, '');
			}
		});
};


context(`Accordion`, () => {
	before(() => cy.visit(`/accordion`));


	it(`Accordion without ID should initialise with an ID`, () => {
		cy.get(ACCORDION)
			.first()
			.should('have.id', `${ACCORDION}-1`);
	});


	context(`Simple Accordion`, () => {
		const ACCORDION_ID = IDS.SIMPLE_ACCORDION;


		beforeEach(() => getEls(ACCORDION_ID));


		it(`Should initialise correctly`, () => accordionInitChecks());


		it(`Should toggle panel visibility when trigger clicked`, () => {
			const panelIndex = 0;
			let expectedDetail = {
				'id': ACCORDION_ID,
				'panelNumber': panelIndex + 1,
				'panelVisible': true,
			};

			cy.addCustomEventListener(EVENTS.OUT.PANEL_VISIBILITY_CHANGED, expectedDetail)
				.get('@accordionTriggers')
				.eq(panelIndex)
				.should('have.attr', 'aria-expanded', 'false')
				.click();

			checkPanelVisible(panelIndex);

			expectedDetail = {
				'id': ACCORDION_ID,
				'panelNumber': panelIndex + 1,
				'panelVisible': false,
			};

			cy.addCustomEventListener(EVENTS.OUT.PANEL_VISIBILITY_CHANGED, expectedDetail)
				.get('@accordionTriggers')
				.eq(panelIndex)
				.click()
				.blur();
			checkPanelNotVisible(panelIndex);
		});
	});


	context(`One panel visible Accordion`, () => {
		const ACCORDION_ID = IDS.ONE_VISIBLE_PANEL_ACCORDION;


		beforeEach(() => {
			getEls(ACCORDION_ID);
			cy.get('@accordion').should('have.attr', ATTRS.ONE_VISIBLE_PANEL, '');
		});


		it(`Should initialise correctly`, () => accordionInitChecks());


		it(`Should initialise with second panel visible`, () => checkPanelVisible(1));


		it(`Should toggle panels visibilities when trigger clicked`, () => {
			const panelIndex = 2;
			let expectedDetail = {
				'id': ACCORDION_ID,
				'panelNumber': panelIndex + 1,
				'panelVisible': true,
			};

			cy.addCustomEventListener(EVENTS.OUT.PANEL_VISIBILITY_CHANGED, expectedDetail)
				.get('@accordionTriggers')
				.eq(panelIndex)
				.should('have.attr', 'aria-expanded', 'false')
				.click();

			checkPanelVisible(panelIndex);

			expectedDetail = {
				'id': ACCORDION_ID,
				'panelNumber': panelIndex + 1,
				'panelVisible': false,
			};

			cy.addCustomEventListener(EVENTS.OUT.PANEL_VISIBILITY_CHANGED, expectedDetail)
				.get('@accordionTriggers')
				.eq(panelIndex)
				.click()
				.blur();
			checkPanelNotVisible(panelIndex);
		});
	});


	context(`Accordion controlled using custom events`, () => {
		const ACCORDION_ID = IDS.CUSTOM_EVENTS_ACCORDION;


		beforeEach(() => {
			getEls(ACCORDION_ID);

			cy.get(`#${IDS.HIDE_PANEL_BTN}`)
				.as('hidePanelBtn')
				.get(`#${IDS.SHOW_PANEL_BTN}`)
				.as('showPanelBtn')
				.get(`#${IDS.TOGGLE_PANEL_BTN}`)
				.as('togglePanelBtn');
		});


		it(`Should initialise correctly`, () => accordionInitChecks());


		it(`Should show and hide all panels when ${EVENTS.IN.SHOW_ALL_PANELS} & ${EVENTS.IN.HIDE_ALL_PANELS} custom events dispatched`, () => {
			cy.get(`#${IDS.SHOW_ALL_PANELS_BTN}`)
				.click()
				.get('@accordionTriggers')
				.each(($trigger, index) => checkPanelVisible(index))
				.get(`#${IDS.HIDE_ALL_PANELS_BTN}`)
				.click()
				.get('@accordionTriggers')
				.each(($trigger, index) => checkPanelNotVisible(index));
		});


		it(`Should show, hide and toggle panel when ${EVENTS.IN.SHOW_PANEL}, ${EVENTS.IN.HIDE_PANEL} & ${EVENTS.IN.TOGGLE_PANEL}custom events dispatched`, () => {
			const panelIndex = 2;
			let expectedDetail = {
				'id': ACCORDION_ID,
				'panelNumber': panelIndex + 1,
				'panelVisible': true,
			};

			cy.addCustomEventListener(EVENTS.OUT.PANEL_VISIBILITY_CHANGED, expectedDetail)
				.get(`#${IDS.PANEL_NUMBER_INPUT}`)
				.type(panelIndex + 1)
				.get('@showPanelBtn')
				.click();
			checkPanelVisible(panelIndex);
			cy.get('@showPanelBtn').click();
			checkPanelVisible(panelIndex);

			expectedDetail = {
				'id': ACCORDION_ID,
				'panelNumber': panelIndex + 1,
				'panelVisible': false,
			};
			cy.addCustomEventListener(EVENTS.OUT.PANEL_VISIBILITY_CHANGED, expectedDetail)
				.get('@hidePanelBtn')
				.click();
			checkPanelNotVisible(panelIndex);
			cy.get('@hidePanelBtn').click();
			checkPanelNotVisible(panelIndex);

			expectedDetail = {
				'id': ACCORDION_ID,
				'panelNumber': panelIndex + 1,
				'panelVisible': true,
			};
			cy.addCustomEventListener(EVENTS.OUT.PANEL_VISIBILITY_CHANGED, expectedDetail)
				.get('@togglePanelBtn')
				.click();
			checkPanelVisible(panelIndex);
			cy.get('@togglePanelBtn').click();
			checkPanelNotVisible(panelIndex);
		});


		it(`Should reinitialise panels when ${EVENTS.IN.UPDATE} custom event dispatched`, () => {
			cy.get(`#${IDS.APPEND_PANEL_BTN}`).click();
			accordionInitChecks();

			cy.get(`#${IDS.REMOVE_PANEL_BTN}`)
				.click()
				.click();
			accordionInitChecks();
		});
	});
});
