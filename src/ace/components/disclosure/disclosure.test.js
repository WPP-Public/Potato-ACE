import {ATTRS, DISCLOSURE, EVENTS} from './disclosure.js';


const IDS = {
  CUSTOM_EVENT_DISCLOSURE: 'custom-event-triggered-disclosure',
  CUSTOM_EVENT_HIDE_BTN: 'custom-event-hide-btn',
  CUSTOM_EVENT_SHOW_BTN: 'custom-event-show-btn',
  CUSTOM_EVENT_TOGGLE_BTN: 'custom-event-toggle-btn',
  DISCLOSURE_1: 'disclosure-1',
  DISCLOSURE_2: 'disclosure-2',
};


context('Disclosure', () => {
  before(() => {
    cy.visit('/disclosure');
  });

  beforeEach(() => {
    // Get disclosures
    cy.get(`#${IDS.DISCLOSURE_1}`).as('disclosure1');
    cy.get(`#${IDS.DISCLOSURE_2}`).as('disclosure2');

    // Get triggers
    cy.get(`[${ATTRS.TRIGGER}="${IDS.DISCLOSURE_1}"]`).as('disclosure1Triggers');
    cy.get(`[${ATTRS.TRIGGER}="${IDS.DISCLOSURE_2}"]`).as('disclosure2Triggers');

    cy.get('@disclosure1Triggers')
      .first()
      .as('disclosure1ToggleTrigger1');
    cy.get('@disclosure1Triggers')
      .eq(1)
      .as('disclosure1ToggleTrigger2');

    cy.get('@disclosure2Triggers')
      .first()
      .as('disclosure2ToggleTrigger');

    cy.get('@disclosure2Triggers')
      .eq(1)
      .as('disclosure2ShowTrigger');

    cy.get('@disclosure2Triggers')
      .eq(2)
      .as('disclosure2HideTrigger');
  });


  describe('Initialisation', () => {
    it('Disclosures should initialise with correct attributes', () => {
      cy.get(DISCLOSURE).each(disclosure => {
        cy.get(disclosure).should('have.attr', ATTRS.VISIBLE).then((visible) => {
          if (visible === 'true') {
            cy.get(disclosure)
              .should('have.attr', ATTRS.VISIBLE, 'true')
              .and('not.have.css', 'display', 'none');
          } else {
            cy.get(disclosure)
              .should('have.attr', ATTRS.VISIBLE, 'false')
              .and('have.css', 'display', 'none');
          }
        });
      });
    });


    it('Disclosure triggers should initialise with correct attributes', () => {
      cy.get(`[${ATTRS.TRIGGER}]`).each(trigger => {
        const triggerDisclosureId = trigger.attr(`${ATTRS.TRIGGER}`);
        cy.get(trigger).should('have.attr', 'aria-controls', triggerDisclosureId);
        const disclosureVisible = trigger.attr('aria-expanded');
        cy.get(`#${triggerDisclosureId}`).should('have.attr', ATTRS.VISIBLE, disclosureVisible);
      });
    });
  });


  describe('Trigger buttons', () => {
    beforeEach(() => {
      cy.reload();
    });


    it('Toggle triggers should toggle Disclosure and update all it\'s triggers', () => {
      // Check Discloure attributes before trigger click
      cy.get('@disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');

      // Check triggers attributes before trigger click
      cy.get('@disclosure1Triggers').each((trigger) => {
        cy.get(trigger).should('have.attr', 'aria-expanded', 'false');
      });

      // Click a trigger
      cy.get('@disclosure1ToggleTrigger1').click();

      // Check Discloure attributes after trigger clicked
      cy.get('@disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'true')
        .and('not.have.css', 'display', 'none');

      // Check triggers attributes after trigger clicked
      cy.get('@disclosure1Triggers').each((trigger) => {
        cy.get(trigger).should('have.attr', 'aria-expanded', 'true');
      });

      // Click the other trigger
      cy.get('@disclosure1ToggleTrigger2').click();

      // Check Discloure attributes after second trigger clicked
      cy.get('@disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');

      // Check triggers attributes after second trigger clicked
      cy.get('@disclosure1Triggers').each((trigger) => {
        cy.get(trigger).should('have.attr', 'aria-expanded', 'false');
      });
    });


    it('Toggle trigger should only toggle it\'s Disclosure', () => {
      // Check attributes before trigger click
      cy.get('@disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');
      cy.get('@disclosure2')
        .should('have.attr', ATTRS.VISIBLE, 'true')
        .and('not.have.css', 'display', 'none');

      // Click Disclosure 1 trigger
      cy.get('@disclosure1ToggleTrigger1').click();

      // Check attributes after trigger click
      cy.get('@disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'true')
        .and('not.have.css', 'display', 'none');
      cy.get('@disclosure2')
        .should('have.attr', ATTRS.VISIBLE, 'true')
        .and('not.have.css', 'display', 'none');

      // Click Disclosure 2 trigger
      cy.get('@disclosure2ToggleTrigger').click();
      // Check attributes after trigger click
      cy.get('@disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'true')
        .and('not.have.css', 'display', 'none');
      cy.get('@disclosure2')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');
    });


    it('"Show" and "hide" triggers should not toggle but should show and hide Disclosure respectively', () => {
      // Check Disclosure attributes before trigger click
      cy.get('@disclosure2')
        .should('have.attr', ATTRS.VISIBLE, 'true')
        .and('not.have.css', 'display', 'none');

      // Click hide trigger
      cy.get('@disclosure2HideTrigger').click();

      // Check Disclosure attributes after hide trigger clicked
      cy.get('@disclosure2')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');

      // Click hide trigger again
      cy.get('@disclosure2HideTrigger').click();

      // Check Disclosure attributes after hide trigger clicked again
      cy.get('@disclosure2').should('have.attr', ATTRS.VISIBLE, 'false');

      // Click show trigger
      cy.get('@disclosure2ShowTrigger').click();

      // Check Disclosure attributes after show trigger clicked
      cy.get('@disclosure2')
        .should('have.attr', ATTRS.VISIBLE, 'true')
        .and('not.have.css', 'display', 'none');

      // Click show trigger again
      cy.get('@disclosure2ShowTrigger').click();

      // Check Disclosure attributes after show trigger clicked again
      cy.get('@disclosure2').should('have.attr', ATTRS.VISIBLE, 'true');
    });
  });


  describe('"Toggle", "show" and "hide" custom events', () => {
    beforeEach(() => {
      cy.reload();

      cy.get(`#${IDS.CUSTOM_EVENT_DISCLOSURE}`).as('customEventDisclosure');
      cy.get(`#${IDS.CUSTOM_EVENT_HIDE_BTN}`).as('customEventHideBtn');
      cy.get(`#${IDS.CUSTOM_EVENT_SHOW_BTN}`).as('customEventShowBtn');
      cy.get(`#${IDS.CUSTOM_EVENT_TOGGLE_BTN}`).as('customEventToggleBtn');
    });


    it('Dispatching "toggle" custom event should toggle it\'s Disclosure', () => {
      cy.get('@disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');

      cy.get('@customEventDisclosure')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');

      // Dispatch Disclosure toggle event
      cy.get('@customEventToggleBtn').click();

      // Check this Disclosure toggled
      cy.get('@customEventDisclosure')
        .should('have.attr', ATTRS.VISIBLE, 'true')
        .and('not.have.css', 'display', 'none');

      // Check different Disclosure not toggled
      cy.get('@disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');

      // Dispatch Disclosure toggle event
      cy.get('@customEventToggleBtn').click();

      // Check this Disclosure toggled
      cy.get('@customEventDisclosure')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');
    });


    it('Dispatching "show" and "hide" custom events should not toggle but show and hide it\'s Disclosure respectively', () => {
      cy.get('@disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');

      cy.get('@customEventDisclosure')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');

      // Dispatch Disclosure show event
      cy.get('@customEventShowBtn').click();

      // Check this Disclosure visible
      cy.get('@customEventDisclosure')
        .should('have.attr', ATTRS.VISIBLE, 'true')
        .and('not.have.css', 'display', 'none');

      // Check different Disclosure not changed
      cy.get('@disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');

      // Dispatch Disclosure show event
      cy.get('@customEventShowBtn').click();

      // Check this Disclosure still visible
      cy.get('@customEventDisclosure')
        .should('have.attr', ATTRS.VISIBLE, 'true')
        .and('not.have.css', 'display', 'none');

      // Dispatch Disclosure hide event
      cy.get('@customEventHideBtn').click();

      // Check this Disclosure not visible
      cy.get('@customEventDisclosure')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');

      // Check different Disclosure not changed
      cy.get('@disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');

      // Dispatch Disclosure hide event
      cy.get('@customEventHideBtn').click();

      // Check this Disclosure still not visible
      cy.get('@customEventDisclosure')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');
    });
  });


  describe('"Changed" custom event', () => {
    beforeEach(() => {
      cy.reload();

      cy.get(`#${IDS.CUSTOM_EVENT_DISCLOSURE}`).as('customEventDisclosure');
      cy.get(`#${IDS.CUSTOM_EVENT_HIDE_BTN}`).as('customEventHideBtn');
      cy.get(`#${IDS.CUSTOM_EVENT_SHOW_BTN}`).as('customEventShowBtn');
      cy.get(`#${IDS.CUSTOM_EVENT_TOGGLE_BTN}`).as('customEventToggleBtn');
    });


    it('Clicking "toggle" trigger should dispatch "change" custom event with correct details', () => {
      let visible = false;
      cy.window().then((window) => {
        window.addEventListener(EVENTS.CHANGED, (e) => {
          visible = !visible;
          expect(e.detail.id).to.equal(IDS.DISCLOSURE_1);
          expect(e.detail.visible).to.equal(visible);
        });
      });

      cy.get('@disclosure1ToggleTrigger1').click();
      cy.get('@disclosure1ToggleTrigger1').click();

    });


    it('Dispatching "toggle" custom event should dispatch "change" custom event with correct details', () => {
      let visible = false;
      cy.window().then((window) => {
        window.addEventListener(EVENTS.CHANGED, (e) => {
          visible = !visible;
          expect(e.detail.id).to.equal(IDS.CUSTOM_EVENT_DISCLOSURE);
          expect(e.detail.visible).to.equal(visible);
        });
      });

      cy.get('@customEventToggleBtn').click();
      cy.get('@customEventToggleBtn').click();
    });


    it('Clicking "show" and "hide" triggers should dispatch "change" custom event with correct details', () => {
      let visible = true;
      cy.window().then((window) => {
        window.addEventListener(EVENTS.CHANGED, (e) => {
          visible = !visible;
          expect(e.detail.id).to.equal(IDS.DISCLOSURE_2);
          expect(e.detail.visible).to.equal(visible);
        });
      });

      cy.get('@disclosure2ShowTrigger').click();
      cy.get('@disclosure2HideTrigger').click();
    });


    it('Dispatching "show" and "hide" custom events should dispatch "change" custom event with correct details', () => {
      let visible = false;
      cy.window().then((window) => {
        window.addEventListener(EVENTS.CHANGED, (e) => {
          visible = !visible;
          expect(e.detail.id).to.equal(IDS.CUSTOM_EVENT_DISCLOSURE);
          expect(e.detail.visible).to.equal(visible);
        });
      });

      cy.get('@customEventShowBtn').click();
      cy.get('@customEventHideBtn').click();
    });
  });
});
