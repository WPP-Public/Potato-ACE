import { ATTRS, DISCLOSURE, EVENTS } from './disclosure';


const IDS = {
	CUSTOM_EVENTS_DISCLOSURE: 'custom-events-disclosure',
	INIT_VISIBLE_DISCLOSURE: 'initially-visible-disclosure',
	SIMPLE_DISCLOSURE: `${DISCLOSURE}-1`,
	TOGGLE_CUSTOM_EVENT_BTN: 'toggle-custom-event-btn',
};


const getEls = (id) => {
	return cy.get(`#${id}`)
		.as('disclosure')
		.get(`[${ATTRS.TRIGGER}="${id}"]`)
		.as('disclosureTriggers');
};


const initChecks = () => {
	return cy.get('@disclosure')
		.then(($disclosure) => {
			cy.wrap($disclosure)
				.invoke('attr', ATTRS.VISIBLE)
				.then((visibleAttrVal) => {
					cy.get('@disclosureTriggers')
						.each($trigger => {
							cy.wrap($trigger)
								.should('have.attr', 'aria-controls', $disclosure.attr('id'))
								.and('have.attr', 'aria-expanded', visibleAttrVal === '' ? 'true' : 'false');
						});
				});
		});
};


const checkDislosureState = (visible) => {
	return cy.get('@disclosure')
		.should(`${visible ? '' : 'not.'}have.attr`, ATTRS.VISIBLE)
		.get('@disclosureTriggers')
		.each($trigger => {
			cy.wrap($trigger).should('have.attr', 'aria-expanded', visible.toString());
		});
};


context(`Disclosure`, () => {
	before(() => cy.visit(`/disclosure`));


	context(`Simple Disclosure`, () => {
		const ID = IDS.SIMPLE_DISCLOSURE;


		beforeEach(() => getEls(ID));


		it(`Should initialise correctly`, () => initChecks());


		it(`Should only toggle its own visibility and update only it's own trigger when toggle trigger clicked`, () => {
			let expectedDetail = {
				'id': ID,
				'visible': true,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail);


			// Check that disclosure's first toggle trigger toggles it
			cy.get('@disclosureTriggers')
				.first()
				.click();
			checkDislosureState(true);

			// Check that other disclosure is not affected
			cy.get(`#${IDS.INIT_VISIBLE_DISCLOSURE}`)
				.as('otherDisclosure')
				.should('have.attr', ATTRS.VISIBLE, '')
				.get(`[${ATTRS.TRIGGER}="${IDS.INIT_VISIBLE_DISCLOSURE}"]`)
				.as('otherDisclosureTriggers')
				.each($trigger => cy.wrap($trigger).should('have.attr', 'aria-expanded', 'true'));

			expectedDetail = {
				'id': ID,
				'visible': false,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail);

			// Check that disclosure's second toggle trigger toggles it
			cy.get('@disclosureTriggers')
				.eq(0)
				.click();
			checkDislosureState(false);

			// Check that other disclosure is not affected
			cy.get('@otherDisclosure')
				.should('have.attr', ATTRS.VISIBLE, '')
				.get('@otherDisclosureTriggers')
				.each($trigger => cy.wrap($trigger).should('have.attr', 'aria-expanded', 'true'));
		});


		it(`Should change visibility when observed attribute changed`, () => {
			let expectedDetail = {
				'id': ID,
				'visible': true,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail);

			cy.get('@disclosure')
				.invoke('attr', ATTRS.VISIBLE, '')
				.get('@disclosureTriggers')
				.each(($trigger) => {
					cy.wrap($trigger).should('have.attr', 'aria-expanded', 'true');
				});

			expectedDetail = {
				'id': ID,
				'visible': false,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail);
			cy.get('@disclosure')
				.invoke('removeAttr', ATTRS.VISIBLE)
				.get('@disclosureTriggers')
				.each(($trigger) => {
					cy.wrap($trigger).should('have.attr', 'aria-expanded', 'false');
				});
		});
	});


	context(`Initially visible Disclosure`, () => {
		const ID = IDS.INIT_VISIBLE_DISCLOSURE;


		beforeEach(() => getEls(ID));


		it(`Should initialise correctly`, () => initChecks());


		it(`Should only toggle its own visibility and update all it's own triggers only when a toggle trigger of it is clicked`, () => {
			let expectedDetail = {
				'id': ID,
				'visible': false,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail);

			// Check that disclosure's first toggle trigger toggles it
			cy.get('@disclosureTriggers')
				.first()
				.click();
			checkDislosureState(false);

			// Check that other disclosure not affected
			cy.get(`#${IDS.SIMPLE_DISCLOSURE}`)
				.as('otherDisclosure')
				.should('not.have.attr', ATTRS.VISIBLE)
				.get(`[${ATTRS.TRIGGER}="${IDS.SIMPLE_DISCLOSURE}"]`)
				.as('otherDisclosureTriggers')
				.each($trigger => cy.wrap($trigger).should('have.attr', 'aria-expanded', 'false'));


			expectedDetail = {
				'id': ID,
				'visible': true,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)

				// Check that disclosure's second toggle trigger toggles it
				.get('@disclosureTriggers')
				.eq(1)
				.click();
			checkDislosureState(true);

			// Check that other disclosure not affected
			cy.get('@otherDisclosure')
				.should('not.have.attr', ATTRS.VISIBLE)
				.get('@otherDisclosureTriggers')
				.each($trigger => cy.wrap($trigger).should('have.attr', 'aria-expanded', 'false'));
		});


		it(`Should only show or only hide only itself and update all of it's own triggers only when it's show or hide triggers clicked`, () => {
			let expectedDetail = {
				'id': ID,
				'visible': false,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
				.get(`[${ATTRS.TRIGGER}="${ID}"][${ATTRS.TRIGGER_SHOW}]`)
				.as('disclosureShowTrigger')
				.get(`[${ATTRS.TRIGGER}="${ID}"][${ATTRS.TRIGGER_HIDE}]`)
				.as('disclosureHideTrigger')
				.click()
				.get('@disclosure')
				.should('not.have.attr', ATTRS.VISIBLE);

			expectedDetail = {
				'id': ID,
				'visible': true,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
				.get('@disclosureHideTrigger')
				.click()
				.get('@disclosure')
				.should('not.have.attr', ATTRS.VISIBLE)
				.get('@disclosureShowTrigger')
				.click()
				.get('@disclosure')
				.should('have.attr', ATTRS.VISIBLE, '')
				.get('@disclosureShowTrigger')
				.click()
				.get('@disclosure')
				.should('have.attr', ATTRS.VISIBLE, '');
		});


		it(`Should change visibility when observed attribute changed`, () => {
			let expectedDetail = {
				'id': ID,
				'visible': false,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail);

			cy.get('@disclosure')
				.invoke('removeAttr', ATTRS.VISIBLE)
				.get('@disclosureTriggers')
				.each(($trigger) => {
					cy.wrap($trigger).should('have.attr', 'aria-expanded', 'false');
				});

			expectedDetail = {
				'id': ID,
				'visible': true,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail);
			cy.get('@disclosure')
				.invoke('attr', ATTRS.VISIBLE, '')
				.get('@disclosureTriggers')
				.each(($trigger) => {
					cy.wrap($trigger).should('have.attr', 'aria-expanded', 'true');
				});
		});
	});


	it(`Should toggle visibility when toggle custom event dispatched to it`, () => {
		const ID = IDS.CUSTOM_EVENTS_DISCLOSURE;

		let expectedDetail = {
			'id': ID,
			'visible': true,
		};
		cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
			.get(`#${IDS.CUSTOM_EVENTS_DISCLOSURE}`)
			.as('disclosure')
			.get(`#${IDS.TOGGLE_CUSTOM_EVENT_BTN}`)
			.as('toggleBtn')
			.click()
			.get('@disclosure')
			.should('have.attr', ATTRS.VISIBLE, '');

		expectedDetail = {
			'id': ID,
			'visible': false,
		};
		cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
			.get('@toggleBtn')
			.click()
			.get('@disclosure')
			.should('not.have.attr', ATTRS.VISIBLE);
	});
});
