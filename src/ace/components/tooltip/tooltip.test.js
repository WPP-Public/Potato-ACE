import { ATTRS, DEFAULT_DELAY, EVENTS, TOOLTIP } from './tooltip';


const IDS = {
	CUSTOM_EVENTS_TOOLTIP: 'custom-events-tooltip',
	HIDE_TOOLTIP_BTN: 'hide-tooltip-btn',
	SHOW_TOOLTIP_BTN: 'show-tooltip-btn',
};


const getEls = (id) => {
	return cy.get(`#${id}`)
		.as('tooltip')
		.parent()
		.as('tooltipTarget');
};


const tooltipInitChecks = () => {
	return cy.get('@tooltip')
		.and('have.attr', 'role', 'tooltip')
		.get('@tooltipTarget')
		.should('have.attr', ATTRS.TARGET);
};


context(`Tooltip`, () => {
	before(() => cy.visit(`/tooltip`));


	it(`Tooltip without ID should initialise with an ID`, () => {
		cy.get(TOOLTIP)
			.first()
			.should('have.id', `${TOOLTIP}-1`);
	});


	context(`Simple Tooltips`, () => {
		const TOOLTIP_ID = `${TOOLTIP}-1`;


		beforeEach(() => getEls(TOOLTIP_ID));


		it(`Tooltip should initialise correctly`, () => tooltipInitChecks());


		it(`Content of Tooltip for target with text content should be treated as supplementary information`, () => {
			cy.get('@tooltipTarget').should('have.attr', 'aria-describedby', TOOLTIP_ID);
		});


		it(`Content of Tooltip for target with aria-label should be treated as supplementary information`, () => {
			const TOOLTIP_ID = `${TOOLTIP}-2`;

			cy.get(`#${TOOLTIP_ID}`)
				.parent()
				.should('have.attr', 'aria-describedby', TOOLTIP_ID);
		});


		it(`Content of Tooltip for target with aria-labelledby should be treated as supplementary information`, () => {
			const TOOLTIP_ID = `${TOOLTIP}-3`;

			cy.get(`#${TOOLTIP_ID}`)
				.parent()
				.should('have.attr', 'aria-describedby', TOOLTIP_ID);
		});


		it(`Content of Tooltip for target with no text nor label should be treated as primary label`, () => {
			const TOOLTIP_ID = `${TOOLTIP}-4`;

			cy.get(`#${TOOLTIP_ID}`)
				.parent()
				.should('have.attr', 'aria-labelledby', TOOLTIP_ID);
		});


		it(`Should show when target receives keyboard focus and hide when it loses focus`, () => {
			let expectedDetail = {
				'id': TOOLTIP_ID,
				'visible': true,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
				.get('@tooltipTarget')
				.focus()
				.wait(DEFAULT_DELAY)
				.get('@tooltip')
				.should('have.attr', ATTRS.VISIBLE, '');

			expectedDetail = {
				'id': TOOLTIP_ID,
				'visible': false,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
				.get('@tooltipTarget')
				.blur()
				.get('@tooltip')
				.should('not.have.attr', ATTRS.VISIBLE);
		});


		it(`Tooltip should show when mouse pointer enters target and hide when it leaves`, () => {
			let expectedDetail = {
				'id': TOOLTIP_ID,
				'visible': true,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
				.get('@tooltipTarget')
				.trigger('mouseenter')
				.wait(DEFAULT_DELAY)
				.get('@tooltip')
				.should('have.attr', ATTRS.VISIBLE, '');

			expectedDetail = {
				'id': TOOLTIP_ID,
				'visible': false,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
				.get('@tooltipTarget')
				.trigger('mouseleave')
				.get('@tooltip')
				.should('not.have.attr', ATTRS.VISIBLE);
		});


		it(`Tooltip should hide when ESCAPE pressed`, () => {
			let expectedDetail = {
				'id': TOOLTIP_ID,
				'visible': true,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
				.get('@tooltipTarget')
				.focus()
				.wait(DEFAULT_DELAY);

			expectedDetail = {
				'id': TOOLTIP_ID,
				'visible': false,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
				.get('@tooltipTarget')
				.type('{esc}')
				.get('@tooltip')
				.should('not.have.attr', ATTRS.VISIBLE)
				.get('@tooltipTarget')
				.blur();
		});


		it(`Tooltip should not show if 'disabled' attribute added, and should show if disbaled attribute removed`, () => {
			cy
				.get('@tooltip')
				.invoke('attr', 'disabled', '')
				.then(() => {
					cy.get('@tooltipTarget')
						.focus()
						.wait(DEFAULT_DELAY)
						.get('@tooltip')
						.should('not.have.attr', ATTRS.VISIBLE, '')
						.invoke('removeAttr', 'disabled')
						.then(() => {
							cy.get('@tooltipTarget')
								.blur()
								.focus()
								.wait(DEFAULT_DELAY)
								.get('@tooltip')
								.should('have.attr', ATTRS.VISIBLE, '')
								.get('@tooltipTarget')
								.blur();
						});
				});
		});
	});


	it(`Tooltip should show and hide when customs events are dispatched`, () => {
		const TOOLTIP_ID = IDS.CUSTOM_EVENTS_TOOLTIP;
		getEls(TOOLTIP_ID);

		let expectedDetail = {
			'id': TOOLTIP_ID,
			'visible': true,
		};
		cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
			.get(`#${IDS.SHOW_TOOLTIP_BTN}`)
			.click()
			.wait(DEFAULT_DELAY);

		expectedDetail = {
			'id': TOOLTIP_ID,
			'visible': false,
		};
		cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
			.get('@tooltip')
			.should('have.attr', ATTRS.VISIBLE, '')
			.get(`#${IDS.HIDE_TOOLTIP_BTN}`)
			.click()
			.get('@tooltip')
			.should('not.have.attr', ATTRS.VISIBLE);
	});
});
