import { ATTRS, DEFAULT_SHOW_TIME, EVENTS, TOAST } from './toast';


const IDS = {
	LONG_SHOW_TIME_TOAST: 'ace-toast-2',
	LONG_SHOW_TIME_TOAST_BTN: 'long-show-time-toast-btn',
	SIMPLE_TOAST: 'ace-toast-1',
	SIMPLE_TOAST_BTN: 'simple-toast-btn',
};


const toastInitChecks = () => {
	return cy.get('@toast')
		.should('have.attr', 'aria-live', 'polite')
		.and('have.attr', 'role', 'status');
};


context(`Toast`, () => {
	before(() => cy.visit(`/toast`));


	it("should pass lighthouse and pa11y audits", function () {
		cy.lighthouse();
		cy.pa11y();
	});


	it(`Toast without ID should initialise with an ID`, () => {
		cy.get(TOAST)
			.first()
			.should('have.id', `${TOAST}-1`);
	});


	context(`Simple Toast`, () => {
		const TOAST_ID = IDS.SIMPLE_TOAST;


		beforeEach(() => cy.get(`#${TOAST_ID}`).as('toast'));


		it(`Should initialise correctly`, () => toastInitChecks());


		it(`Should show when attribute ace-toast-visible is set to 'true' and hide after default show time`, () => {
			let expectedDetail = {
				'id': TOAST_ID,
				'visible': true,
			};
			cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail)
				.get('@toast')
				.invoke('attr', ATTRS.VISIBLE, '')
				.then(() => {
					expectedDetail = {
						'id': TOAST_ID,
						'visible': false,
					};
					cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail)
						.wait(DEFAULT_SHOW_TIME)
						.get('@toast')
						.should('not.have.attr', ATTRS.VISIBLE);
				});
		});


		it(`Should change the show time when ace-toast-show-time attribute is changed`, () => {
			const NEW_SHOW_TIME = 200;

			cy.get('@toast')
				.invoke('attr', ATTRS.SHOW_TIME, NEW_SHOW_TIME)
				.then(() => {
					cy.get('@toast')
						.invoke('attr', ATTRS.VISIBLE, '')
						.then(() => {
							cy.wait(NEW_SHOW_TIME)
								.get('@toast')
								.should('not.have.attr', ATTRS.VISIBLE);
						});
				});
		});
	});


	context(`Long delay time Toast`, () => {
		const TOAST_ID = IDS.LONG_SHOW_TIME_TOAST;


		beforeEach(() => cy.get(`#${TOAST_ID}`).as('toast'));


		it(`Should initialise correctly`, () => toastInitChecks());


		it(`Should show when attribute ace-toast-visible is set to 'true' and hide after specified show time`, () => {
			let expectedDetail = {
				'id': TOAST_ID,
				'visible': true,
			};
			cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail)
				.get('@toast')
				.invoke('attr', ATTRS.SHOW_TIME)
				.then((showTime) => {
					cy.get('@toast')
						.invoke('attr', ATTRS.VISIBLE, '')
						.then(() => {
							expectedDetail = {
								'id': TOAST_ID,
								'visible': false,
							};
							cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail)
								.wait(+showTime)
								.get('@toast')
								.should('not.have.attr', ATTRS.VISIBLE);
						});
				});
		});
	});
});
