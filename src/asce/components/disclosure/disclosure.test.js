import {DISCLOSURE, ATTRS, EVENTS} from './disclosure';

const IDS = {
  DISCLOSURE_1: 'disclosure-1',
  DISCLOSURE_2: 'disclosure-2',
  CUSTOM_EVENT_TRIGGERED_DISCLOSURE: 'custom-event-triggered-disclosure',
};

describe('Disclosure tests', () => {
  before(() => {
    cy.visit('/disclosure');
  });


  describe('Initialisation', () => {
    it('should initialise disclosures with correct attributes', () => {
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


    it('should initialise triggers with correct attributes', () => {
      cy.get(`[${ATTRS.TRIGGER}]`).each(trigger => {
        const triggerDisclosureId = trigger.attr(`${ATTRS.TRIGGER}`);
        cy.get(trigger).should('have.attr', 'aria-controls', triggerDisclosureId);
        const disclosureVisible = trigger.attr('aria-expanded');
        cy.get(`#${triggerDisclosureId}`).should('have.attr', ATTRS.VISIBLE, disclosureVisible);
      });
    });
  });


  describe('Trigger button tests', () => {
    it('should toggle disclosure and update all it\'s triggers when any of it\'s triggers are clicked', () => {
      cy.get(`#${IDS.DISCLOSURE_1}`).as('disclosure');
      cy.get(`[${ATTRS.TRIGGER}="${IDS.DISCLOSURE_1}"]`).as('triggers');
      cy.get('@triggers').first().as('trigger');
      // Check attributes before trigger click
      cy.get('@disclosure')
        .should('have.attr', `${ATTRS.VISIBLE}`, 'false')
        .and('have.css', 'display', 'none');
      cy.get('@triggers').each(trigger => cy.get(trigger).should('have.attr', 'aria-expanded', 'false'));
      // Click the trigger
      cy.get('@trigger').click();
      // Check attributes after trigger click
      cy.get('@disclosure')
        .should('have.attr', `${ATTRS.VISIBLE}`, 'true')
        .and('not.have.css', 'display', 'none');
      cy.get('@triggers').each(trigger => cy.get(trigger).should('have.attr', 'aria-expanded', 'true'));
      // Click the trigger again
      cy.get('@trigger').click();
      // Check attributes after trigger click
      cy.get('@disclosure')
        .should('have.attr', `${ATTRS.VISIBLE}`, 'false')
        .and('have.css', 'display', 'none');
      cy.get('@triggers').each(trigger => cy.get(trigger).should('have.attr', 'aria-expanded', 'false'));
    });


    it('should toggle when it\'s, and not another disclosure\'s, toggle trigger is clicked', () => {
      cy.get(`#${IDS.DISCLOSURE_1}`).as('disclosure1');
      cy.get(`#${IDS.DISCLOSURE_2}`).as('disclosure2');
      cy.get(`[${ATTRS.TRIGGER}="${IDS.DISCLOSURE_1}"]`).first().as('disclosure1Trigger');
      cy.get(`[${ATTRS.TRIGGER}="${IDS.DISCLOSURE_2}"]`).first().as('disclosure2Trigger');

      // Check attributes before trigger click
      cy.get('@disclosure1')
        .should('have.attr', `${ATTRS.VISIBLE}`, 'false')
        .and('have.css', 'display', 'none');
      cy.get('@disclosure2')
        .should('have.attr', `${ATTRS.VISIBLE}`, 'true')
        .and('not.have.css', 'display', 'none');

      // Click disclosure 1 trigger
      cy.get('@disclosure1Trigger').click();
      // Check attributes after trigger click
      cy.get('@disclosure1')
        .should('have.attr', `${ATTRS.VISIBLE}`, 'true')
        .and('not.have.css', 'display', 'none');
      cy.get('@disclosure2')
        .should('have.attr', `${ATTRS.VISIBLE}`, 'true')
        .and('not.have.css', 'display', 'none');

      // Click disclosure 2 trigger
      cy.get('@disclosure2Trigger').click();
      // Check attributes after trigger click
      cy.get('@disclosure1')
        .should('have.attr', `${ATTRS.VISIBLE}`, 'true')
        .and('not.have.css', 'display', 'none');
      cy.get('@disclosure2')
        .should('have.attr', `${ATTRS.VISIBLE}`, 'false')
        .and('have.css', 'display', 'none');
    });


    it('should show, and not hide, when it\'s show trigger is clicked', () => {
      cy.get(`#${IDS.DISCLOSURE_2}`).as('disclosure');
      cy.get(`[${ATTRS.TRIGGER}="${IDS.DISCLOSURE_2}"][${ATTRS.TRIGGER_SHOW}]`).first().as('showTrigger');

      // Check attributes before trigger click
      cy.get('@disclosure')
        .should('have.attr', `${ATTRS.VISIBLE}`, 'false')
        .and('have.css', 'display', 'none');

      // Click the hide trigger
      cy.get('@showTrigger').click();
      // Check attributes after trigger click
      cy.get('@disclosure')
        .should('have.attr', `${ATTRS.VISIBLE}`, 'true')
        .and('not.have.css', 'display', 'none');

      // Click the trigger again
      cy.get('@showTrigger').click();
      // Check attributes after trigger click
      cy.get('@disclosure')
        .should('have.attr', `${ATTRS.VISIBLE}`, 'true')
        .and('not.have.css', 'display', 'none');
    });

    it('should hide, and not show, when it\'s hide trigger is clicked', () => {
      cy.get(`#${IDS.DISCLOSURE_2}`).as('disclosure');
      cy.get(`[${ATTRS.TRIGGER}="${IDS.DISCLOSURE_2}"][${ATTRS.TRIGGER_HIDE}]`).first().as('hideTrigger');

      // Check attributes before trigger click
      cy.get('@disclosure')
        .should('have.attr', `${ATTRS.VISIBLE}`, 'true')
        .and('not.have.css', 'display', 'none');

      // Click the hide trigger
      cy.get('@hideTrigger').click();
      // Check attributes after trigger click
      cy.get('@disclosure')
        .should('have.attr', `${ATTRS.VISIBLE}`, 'false')
        .and('have.css', 'display', 'none');

      // Click the trigger again
      cy.get('@hideTrigger').click();
      // Check attributes after trigger click
      cy.get('@disclosure')
        .should('have.attr', `${ATTRS.VISIBLE}`, 'false')
        .and('have.css', 'display', 'none');
    });
  });


  describe('Custom Events tests', () => {
    beforeEach(() => {
      cy.visit('/disclosure');
    });

    it('should toggle when it\'s and not another disclosure\'s toggle event is dispatched', () => {
      cy.get(`#${IDS.DISCLOSURE_1}`)
        .as('disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');
      // Dispatch a different disclosure's toggle event
      cy.window().then(window => {
        window.dispatchEvent(
          new CustomEvent(
            EVENTS.TOGGLE,
            { detail: { id: IDS.DISCLOSURE_2 }}
          )
        );
      });

      // Check disclosure is not visible
      cy.get('@disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');

      // Dispatch this disclosure's toggle event
      cy.window().then(window => {
        window.dispatchEvent(
          new CustomEvent(
            EVENTS.TOGGLE,
            { detail: { id: IDS.DISCLOSURE_1 }}
          )
        );
      });
      // Check disclosure is visible
      cy.get('@disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'true')
        .and('not.have.css', 'display', 'none');

      // Dispatch this disclosure's toggle event again
      cy.window().then(window => {
        window.dispatchEvent(
          new CustomEvent(
            EVENTS.TOGGLE,
            { detail: { id: IDS.DISCLOSURE_1 }}
          )
        );
      });
      // Check disclosure is visible
      cy.get('@disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');
    });


    it('should show, and not hide, when it\'s and not another disclosure\'s toggle event is emitted', () => {
      cy.get(`#${IDS.DISCLOSURE_1}`)
        .as('disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');
      // Dispatch a different disclosure's toggle event
      cy.window().then(window => {
        window.dispatchEvent(
          new CustomEvent(
            EVENTS.SHOW,
            { detail: { id: IDS.DISCLOSURE_2 }}
          )
        );
      });
      // Check disclosure is not visible
      cy.get('@disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');

      // Dispatch this disclosure's toggle event
      cy.window().then(window => {
        window.dispatchEvent(
          new CustomEvent(
            EVENTS.SHOW,
            { detail: { id: IDS.DISCLOSURE_1 }}
          )
        );
      });
      // Check disclosure is visible
      cy.get('@disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'true')
        .and('not.have.css', 'display', 'none');

      // Dispatch this disclosure's toggle event again
      cy.window().then(window => {
        window.dispatchEvent(
          new CustomEvent(
            EVENTS.SHOW,
            { detail: { id: IDS.DISCLOSURE_1 }}
          )
        );
      });
      // Check disclosure is visible
      cy.get('@disclosure1')
        .should('have.attr', ATTRS.VISIBLE, 'true')
        .and('not.have.css', 'display', 'none');
    });


    it('should hide, and not show, when it\'s and not another disclosure\'s toggle event is emitted', () => {
      cy.get(`#${IDS.DISCLOSURE_2}`)
        .as('disclosure2')
        .should('have.attr', ATTRS.VISIBLE, 'true')
        .and('not.have.css', 'display', 'none');
      // Dispatch a different disclosure's toggle event
      cy.window().then(window => {
        window.dispatchEvent(
          new CustomEvent(
            EVENTS.HIDE,
            { detail: { id: IDS.DISCLOSURE_1 }}
          )
        );
      });
      // Check disclosure is not visible
      cy.get('@disclosure2')
        .should('have.attr', ATTRS.VISIBLE, 'true')
        .and('not.have.css', 'display', 'none');

      // Dispatch this disclosure's toggle event
      cy.window().then(window => {
        window.dispatchEvent(
          new CustomEvent(
            EVENTS.HIDE,
            { detail: { id: IDS.DISCLOSURE_2 }}
          )
        );
      });
      // Check disclosure is visible
      cy.get('@disclosure2')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');

      // Dispatch this disclosure's toggle event again
      cy.window().then(window => {
        window.dispatchEvent(
          new CustomEvent(
            EVENTS.HIDE,
            { detail: { id: IDS.DISCLOSURE_2 }}
          )
        );
      });
      // Check disclosure is visible
      cy.get('@disclosure2')
        .should('have.attr', ATTRS.VISIBLE, 'false')
        .and('have.css', 'display', 'none');
    });
  });
});
