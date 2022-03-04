import { ATTRS, DEFAULT_SHOW_TIME, EVENTS, TOAST } from './toast';


const IDS = {
	LONG_SHOW_TIME_TOAST: 'ace-toast-2',
	LONG_SHOW_TIME_TOAST_BTN: 'long-show-time-toast-btn',
	SIMPLE_TOAST: 'ace-toast-1',
	SIMPLE_TOAST_BTN: 'simple-toast-btn',
};

const getEls = (id) => {
	return cy.get(`#${id}`)
		.as('toast')
		.find(`[${ATTRS.INNER}]`)
		.as('toastInner');
};



const toastInitChecks = () => {
	return cy.get('@toastInner')
		.should('have.attr', 'aria-live', 'polite')
		.and('have.attr', 'role', 'status');
};


context(`Toast`, () => {
	before(() => cy.visit(`/toast`));


	it(`Toast without ID should initialise with an ID`, () => {
		cy.get(TOAST)
			.first()
			.should('have.id', `${TOAST}-1`);
	});


	context(`Simple Toast`, () => {
		const TOAST_ID = IDS.SIMPLE_TOAST;


		beforeEach(() => getEls(TOAST_ID));


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


	context(`Long show time Toast`, () => {
		const TOAST_ID = IDS.LONG_SHOW_TIME_TOAST;

		beforeEach(() => getEls(TOAST_ID));


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
