import { ATTRS, EVENTS } from './modal';


const IDS = {
	HIDDEN_MODAL: 'ace-hidden-modal',
	VISIBLE_MODAL: 'ace-visible-modal',
};


const getEls = (id) => {
	cy.get(`#${id}`)
		.as('modal')
		.find(`[${ATTRS.HIDE_BTN}]`)
		.as('modalHideBtn')
		.get(`[${ATTRS.TRIGGER}="${id}"]`)
		.as('modalTriggers')
		.get(`[${ATTRS.BACKDROP}]`)
		.as('modalBackdrop');
};


const initChecks = () => {
	return cy.get('@modal')
		.should('have.attr', 'aria-modal', 'true')
		.and('have.attr', 'role', 'dialog');
};


const checkModalState = (visible) => {
	cy.get('@modal')
		.should(`${visible ? '' : 'not.'}have.attr`, ATTRS.VISIBLE)
		.get('body')
		.should(`${visible ? '' : 'not.'}have.attr`, ATTRS.IS_VISIBLE)
		.get('@modalBackdrop')
		.should(`${visible ? '' : 'not.'}have.attr`, ATTRS.IS_VISIBLE);
	if (visible) {
		cy.get('@modal').should(`have.focus`);
	}
};


context(`Modal`, () => {
	before(() => {
		cy.visit(`/modal`);
		// The ACE header in some cases prevents cypress from focusing on buttons
		// cy.get('header.header').invoke('attr', 'style', 'display: none');
	});


	context(`Initially visible Modal`, () => {
		const ID = IDS.VISIBLE_MODAL;


		beforeEach(() => getEls(ID));


		it(`Should initialise correctly`, () => {
			cy.get('@modal').should('have.attr', ATTRS.VISIBLE, '');
			initChecks();
		});


		it(`Should be hidden or shown in response to observed attribute changes`, () => {
			// Check that Modal hidden when observed attribute removed
			let expectedDetail = {
				'id': ID,
				'visible': false,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
				.get('@modal')
				.invoke('removeAttr', ATTRS.VISIBLE)
				.then(() => {
					checkModalState(false);
				});

			// Check that Modal shown when observed attribute re-added
			expectedDetail = {
				'id': ID,
				'visible': true,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
				.get('@modal')
				.invoke('attr', ATTRS.VISIBLE, '')
				.then(() => {
					checkModalState(true);
				});
		});


		it(`Should be hidden when it's hide button clicked and become visible when any of it's triggers clicked`, () => {
			// Check that Modal hidden by hide button
			let visible = false;
			let expectedDetail = {
				'id': ID,
				'visible': visible,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
				.get('@modalHideBtn')
				.click();
			checkModalState(visible);


			// Check that Modal shown by trigger button
			visible = true;
			expectedDetail = {
				'id': ID,
				'visible': visible,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail);
			cy.get('@modalTriggers')
				.eq(0)
				.click()
				.get(`#${IDS.HIDDEN_MODAL}`)
				.should('not.have.attr', ATTRS.VISIBLE);
			checkModalState(visible);

			// Check that focus is returned to trigger after Modal hidden
			cy.get('@modal')
				.invoke('removeAttr', ATTRS.VISIBLE)
				.get('@modalTriggers')
				.eq(0)
				.should('have.focus')

				// Check second trigger shows Modal
				.get('@modalTriggers')
				.eq(1)
				.click()
				.get(`#${IDS.HIDDEN_MODAL}`)
				.should('not.have.attr', ATTRS.VISIBLE);
			checkModalState(visible);

			// Check that focus is returned to trigger after Modal hidden
			cy.get('@modal')
				.invoke('removeAttr', ATTRS.VISIBLE)
				.get('@modalTriggers')
				.eq(1)
				.should('have.focus')
				.click();
		});


		it(`Should be hidden when backdrop clicked`, () => {
			// Check that Modal hidden by clicking on backdrop
			const visible = false;
			const expectedDetail = {
				'id': ID,
				'visible': visible,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
				.get('@modalBackdrop')
				.click({ force: true });
			checkModalState(visible);

			// Reset state
			cy.get('@modalTriggers')
				.eq(0)
				.click();
		});


		it(`Should be hidden when ESC key pressed`, () => {
			// Check that Modal hidden by clicking on backdrop
			const visible = false;
			const expectedDetail = {
				'id': ID,
				'visible': visible,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
				.get('@modalHideBtn')
				.type('{esc}');
			checkModalState(visible);

			// Reset state
			cy.get('@modalTriggers')
				.eq(0)
				.click();
		});
	});



	context(`Initially hidden Modal`, () => {
		before(() => {
			cy.get(`#${IDS.VISIBLE_MODAL}`).invoke('removeAttr', ATTRS.VISIBLE);
		});

		const ID = IDS.HIDDEN_MODAL;


		beforeEach(() => getEls(ID));


		it(`Should initialise correctly`, () => {
			cy.get('@modal').should('not.have.attr', ATTRS.VISIBLE, '');
			initChecks();
		});


		it(`Should be shown and hidden in response to observed attribute changes`, () => {
			// Check that Modal hidden when observed attribute removed
			let expectedDetail = {
				'id': ID,
				'visible': true,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
				.get('@modal')
				.invoke('attr', ATTRS.VISIBLE, '')
				.then(() => {
					checkModalState(true);
				});

			// Check that Modal shown when observed attribute re-added
			expectedDetail = {
				'id': ID,
				'visible': false,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
				.get('@modal')
				.invoke('removeAttr', ATTRS.VISIBLE)
				.then(() => {
					checkModalState(false);
				});
		});


		it(`Should become visible when it's trigger is clicked and become hidden when it's hide button clicked`, () => {
			// Check that Modal shown by trigger button
			let visible = true;
			let expectedDetail = {
				'id': ID,
				'visible': visible,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail);
			cy.get('@modalTriggers')
				.eq(0)
				.click()
				.get(`#${IDS.HIDDEN_MODAL}`)
				.should('have.attr', ATTRS.VISIBLE);
			checkModalState(visible);


			// Check that Modal hidden by hide button
			visible = false;
			expectedDetail = {
				'id': ID,
				'visible': visible,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
				.get('@modalHideBtn')
				.click();
			checkModalState(visible);

			// Check that focus is returned to trigger after Modal hidden
			cy.get('@modalTriggers')
				.eq(0)
				.should('have.focus');
		});


		it(`Should be hidden when backdrop clicked`, () => {
			cy.get('@modalTriggers')
				.eq(0)
				.click();

			// Check that Modal hidden by clicking on backdrop
			const visible = false;
			const expectedDetail = {
				'id': ID,
				'visible': visible,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
				.get('@modalBackdrop')
				.click({ force: true });
			checkModalState(visible);
		});


		it(`Should be hidden when ESC key pressed`, () => {
			cy.get('@modalTriggers')
				.eq(0)
				.click();

			// Check that Modal hidden by clicking on backdrop
			const visible = false;
			const expectedDetail = {
				'id': ID,
				'visible': visible,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail)
				.get('@modalHideBtn')
				.type('{esc}');
			checkModalState(visible);
		});
	});


	context(`Modal with trigger for another Modal`, () => {
		it(`Should be hidden when other Modal is triggered from it`, () => {
			cy.get(`#${IDS.VISIBLE_MODAL}`)
				.as('visibleModal')
				.invoke('removeAttr', ATTRS.VISIBLE);

			cy.get(`#${IDS.HIDDEN_MODAL}`)
				.as('hiddenModal')
				.invoke('attr', ATTRS.VISIBLE, '');
			getEls(IDS.HIDDEN_MODAL);

			// Check that Modal is shown when trigger in another modal is clicked
			const visible = true;
			const expectedDetail = {
				'id': IDS.VISIBLE_MODAL,
				'visible': visible,
			};
			cy.addCustomEventListener(EVENTS.OUT.VISIBILITY_CHANGED, expectedDetail);

			cy.get('@hiddenModal')
				.find(`[${ATTRS.TRIGGER}="${IDS.VISIBLE_MODAL}"]`)
				.click()
				.get('@hiddenModal')
				.should('not.have.attr', ATTRS.VISIBLE)
				.get('@visibleModal')
				.should('have.attr', ATTRS.VISIBLE, '')
				.get('body')
				.should('have.attr', ATTRS.IS_VISIBLE, '')
				.get('@modalBackdrop')
				.should('have.attr', ATTRS.IS_VISIBLE, '');
		});
	});
});
