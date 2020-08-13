import {ATTRS, EVENTS} from './carousel';

const IDS = {
  CAROUSEL_1: 'carousel-1',
  CAROUSEL_2: 'carousel-2',
  CAROUSEL_3: 'carousel-3'
};

const CAROUSEL_ITEMS_LEN = 5;

context('Carousel', () => {
  before(() => cy.visit('/carousel'));

  beforeEach(() => {
    cy.get(`#${IDS.CAROUSEL_1}`).as('carousel1');
    cy.get(`#${IDS.CAROUSEL_2}`).as('carousel2');
    cy.get(`#${IDS.CAROUSEL_3}`).as('carousel3');

    cy.get('@carousel1')
      .find('.ace-carousel-controls')
      .find(`[${ATTRS.PREVIOUS_BUTTON}]`)
      .as('carousel1ControlsPrev');

    cy.get('@carousel1')
      .find('.ace-carousel-controls')
      .find(`[${ATTRS.NEXT_BUTTON}]`)
      .as('carousel1ControlsNext');

    cy.get('@carousel1')
      .find(`[${ATTRS.CAROUSEL_SLIDES}]`)
      .as('carousel1SlideWrapper');

    cy.get('@carousel1')
      .find(`[${ATTRS.CAROUSEL_SLIDE}]`)
      .as('carousel1Items');

    cy.get('@carousel2')
      .find('.ace-carousel-controls')
      .find(`[${ATTRS.PREVIOUS_BUTTON}]`)
      .as('carousel2ControlsPrev');

    cy.get('@carousel2')
      .find('.ace-carousel-controls')
      .find(`[${ATTRS.NEXT_BUTTON}]`)
      .as('carousel2ControlsNext');

    cy.get('@carousel2')
      .find(`[${ATTRS.CAROUSEL_SLIDES}]`)
      .as('carousel2SlideWrapper');

    cy.get('@carousel2')
      .find(`[${ATTRS.CAROUSEL_SLIDE}]`)
      .as('carousel2Items');

    cy.get('@carousel3')
      .find('.ace-carousel-controls')
      .find(`[${ATTRS.PREVIOUS_BUTTON}]`)
      .as('carousel3ControlsPrev');

    cy.get('@carousel3')
      .find('.ace-carousel-controls')
      .find(`[${ATTRS.NEXT_BUTTON}]`)
      .as('carousel3ControlsNext');

    cy.get('@carousel3')
      .find(`[${ATTRS.CAROUSEL_SLIDES}]`)
      .as('carousel3SlideWrapper');

    cy.get('@carousel3')
      .find(`[${ATTRS.CAROUSEL_SLIDE}]`)
      .as('carousel3Items');
  });

  describe('Initialisation', () => {
    it('Carousels should initialise with correct attributes', () => {
      cy.get('@carousel1').should('have.attr', 'role', 'region');
      cy.get('@carousel1').should('have.attr', 'aria-label', 'CATrousel');
      cy.get('@carousel1').should('have.attr', 'aria-roledescription', 'carousel');
      cy.get('@carousel1SlideWrapper').should('have.attr', 'aria-live', 'polite');
      cy.get('@carousel1SlideWrapper').should('have.id', 'ace-carousel-slides');

      cy.get('@carousel2').should('have.attr', 'role', 'region');
      cy.get('@carousel2').should('have.attr', 'aria-label', 'CATrousel');
      cy.get('@carousel2').should('have.attr', 'aria-roledescription', 'carousel');
      cy.get('@carousel2').should('have.attr', ATTRS.INFINITE_ROTATION, 'true');
      cy.get('@carousel2SlideWrapper').should('have.attr', 'aria-live', 'polite');
      cy.get('@carousel1SlideWrapper').should('have.id', 'ace-carousel-slides');
    });

    it('Carousel controls should initialise with correct attributes', () => {
      cy.get('@carousel1ControlsPrev').should('have.attr', 'aria-controls', 'ace-carousel-slides');
      cy.get('@carousel1ControlsPrev').should('have.attr', 'aria-label', 'Go to previous slide');
      cy.get('@carousel1ControlsNext').should('have.attr', 'aria-controls', 'ace-carousel-slides');
      cy.get('@carousel1ControlsNext').should('have.attr', 'aria-label', 'Go to next slide');

      cy.get('@carousel2ControlsPrev').should('have.attr', 'aria-controls', 'ace-carousel-slides');
      cy.get('@carousel2ControlsPrev').should('have.attr', 'aria-label', 'Go to last slide');
      cy.get('@carousel2ControlsNext').should('have.attr', 'aria-controls', 'ace-carousel-slides');
      cy.get('@carousel2ControlsNext').should('have.attr', 'aria-label', 'Go to next slide');
    });

    it('Carousel items should initialise with correct attributes', () => {
      cy.get('@carousel1Items').each((item, index, items) => {
        // Should only display first item and hide the rest.
        if (index == 0) {
          cy.get(item).should('have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
          cy.get(item).should('have.css', 'display', 'block');
        } else {
          cy.get(item).should('not.have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
          cy.get(item).should('have.css', 'display', 'none');
        }

        cy.get(item).should('have.attr', 'role', 'group');
        cy.get(item).should('have.attr', 'aria-roledescription', 'slide');
        cy.get(item).should('have.attr', 'aria-label', `${index + 1} of ${items.length}`);

      }).then(items => {
        expect(items).to.have.length(5);
      });

      cy.get('@carousel2Items').each((item, index, items) => {
        // Should only display first item and hide the rest.
        if (index == 0) {
          cy.get(item).should('have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
          cy.get(item).should('have.css', 'display', 'block');
        } else {
          cy.get(item).should('not.have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
          cy.get(item).should('have.css', 'display', 'none');
        }

        cy.get(item).should('have.attr', 'role', 'group');
        cy.get(item).should('have.attr', 'aria-roledescription', 'slide');
        cy.get(item).should('have.attr', 'aria-label', `${index + 1} of ${items.length}`);

      }).then(items => {
        expect(items).to.have.length(5);
      });
    });
  });

  describe('Interaction', () => {
    it('Next carousel item should be displayed when clicking "next"', () => {
      // Check that first item is active.
      cy.get('@carousel1Items').first().should('have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
      cy.get('@carousel1ControlsNext').click();
      cy.get('@carousel1Items').first().should('not.have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
      cy.get('@carousel1Items').eq(1).should('have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
      cy.get('@carousel1Items').eq(2).should('not.have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
    });

    it('Previous carousel item should be displayed when clicking "previous"', () => {
      cy.get('@carousel1ControlsPrev').click();
      cy.get('@carousel1Items').first().should('have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
      cy.get('@carousel1Items').eq(1).should('not.have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
    });

    it('Previous button should be disabled on Carousel 1, first item', () => {
      // Ensure first item is active.
      cy.get('@carousel1Items').first().should('have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
      cy.get('@carousel1ControlsPrev').should('have.attr', 'disabled');
      cy.get('@carousel1ControlsPrev').should('have.attr', 'aria-label', 'Go to previous slide');
    });

    it('Next button should be disabled on Carousel 1, last item', () => {
      // Go to last item.
      cy.get('@carousel1').invoke('attr', ATTRS.CURRENT_SLIDE, CAROUSEL_ITEMS_LEN);
      // Ensure last item is active.
      cy.get('@carousel1Items').last().should('have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
      cy.get('@carousel1ControlsNext').should('have.attr', 'disabled');
      cy.get('@carousel1ControlsNext').should('have.attr', 'aria-label', 'Go to next slide');
    });

    it('Previous button should display last item on Carousel 2, first item', () => {
      // Ensure first item is active.
      cy.get('@carousel2Items').first().should('have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
      cy.get('@carousel2ControlsPrev').should('not.have.attr', 'disabled');
      cy.get('@carousel2ControlsPrev').should('have.attr', 'aria-label', 'Go to last slide');
      cy.get('@carousel2ControlsPrev').click();
      cy.get('@carousel2Items').last().should('have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
    });

    it('Next button should display first item on Carousel 2, last item', () => {
      // Go to last item.
      cy.get('@carousel2').invoke('attr', ATTRS.CURRENT_SLIDE, CAROUSEL_ITEMS_LEN);
      // Ensure last item is active.
      cy.get('@carousel2Items').last().should('have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
      cy.get('@carousel2ControlsNext').should('not.have.attr', 'disabled');
      cy.get('@carousel2ControlsNext').should('have.attr', 'aria-label', 'Go to first slide');
      cy.get('@carousel2ControlsNext').click();
      cy.get('@carousel2Items').first().should('have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
    });
  });

  describe('Observed attributes', () => {
    it ('Should activate the correct slide', () => {
      cy.get('@carousel3').should('have.attr', ATTRS.CURRENT_SLIDE, '2');
      cy.get('@carousel3Items').first().should('not.have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
      cy.get('@carousel3Items').eq(1).should('have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
      cy.get('@carousel3Items').last().should('not.have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
      cy.get('@carousel3').invoke('attr', ATTRS.CURRENT_SLIDE, '1');
      cy.get('@carousel3Items').first().should('have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
      cy.get('@carousel3Items').eq(1).should('not.have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
    });

    it ('Should activate infinite rotation', () => {
      cy.get('@carousel3ControlsPrev').should('have.attr', 'disabled');
      cy.get('@carousel3ControlsPrev').should('have.attr', 'aria-label', 'Go to previous slide');
      cy.get('@carousel3ControlsNext').should('have.attr', 'aria-label', 'Go to next slide');
      cy.get('@carousel3ControlsNext').click();
      cy.get('@carousel3ControlsPrev').should('not.have.attr', 'disabled');
      cy.get('@carousel3').invoke('attr', ATTRS.CURRENT_SLIDE, '3');
      cy.get('@carousel3ControlsNext').should('have.attr', 'disabled');
      cy.get('@carousel3ControlsPrev').should('have.attr', 'aria-label', 'Go to previous slide');
      cy.get('@carousel3ControlsNext').should('have.attr', 'aria-label', 'Go to next slide');

      cy.get('@carousel3').invoke('attr', ATTRS.CURRENT_SLIDE, '1')
                          .invoke('attr', ATTRS.INFINITE_ROTATION, 'true');
      cy.get('@carousel3').should('have.attr', ATTRS.INFINITE_ROTATION, 'true');
      cy.get('@carousel3Items').first().should('have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
      cy.get('@carousel3ControlsPrev').should('have.attr', 'aria-label', 'Go to last slide');
      cy.get('@carousel3ControlsNext').should('have.attr', 'aria-label', 'Go to next slide');
      cy.get('@carousel3ControlsPrev').click();
      cy.get('@carousel3Items').last().should('have.attr', ATTRS.ACTIVE_CAROUSEL_SLIDE);
      cy.get('@carousel3ControlsPrev').should('have.attr', 'aria-label', 'Go to previous slide');
      cy.get('@carousel3ControlsNext').should('have.attr', 'aria-label', 'Go to first slide');
      cy.get('@carousel3').invoke('attr', ATTRS.INFINITE_ROTATION, 'false');
    });
  });

  describe('Event change', () => {
    it('Changing the current slide attr should dispatch "change" custom event with correct details', () => {
      const listener = (e) => {
        expect(e.detail.id).to.equal(IDS.CAROUSEL_3);
        expect(e.detail.currentSlideNumber).to.equal(2);
      };

      cy.window().then((window) => {
        window.addEventListener(EVENTS.OUT.CHANGED, listener);
      });

      cy.get('@carousel3').invoke('attr', ATTRS.CURRENT_SLIDE, '2');

      cy.window().then((window) => {
        window.removeEventListener(EVENTS.OUT.CHANGED, listener);
      });

      cy.get('@carousel3').invoke('attr', ATTRS.CURRENT_SLIDE, '1');
    });

    it('Clicking "next"/"previous" buttons should dispatch "change" custom event with correct details', () => {
      const listener1 = (e) => {
        expect(e.detail.id).to.equal(IDS.CAROUSEL_3);
        expect(e.detail.currentSlideNumber).to.equal(2);
      };

      const listener2 = (e) => {
        expect(e.detail.id).to.equal(IDS.CAROUSEL_3);
        expect(e.detail.currentSlideNumber).to.equal(1);
      };

      cy.window().then((window) => {
        window.addEventListener(EVENTS.OUT.CHANGED, listener1);
      });

      cy.get('@carousel3ControlsNext').click();

      cy.window().then((window) => {
        window.removeEventListener(EVENTS.OUT.CHANGED, listener1);
      });

      cy.window().then((window) => {
        window.addEventListener(EVENTS.OUT.CHANGED, listener2);
      });

      cy.get('@carousel3ControlsPrev').click();

      cy.window().then((window) => {
        window.removeEventListener(EVENTS.OUT.CHANGED, listener2);
      });
    });
  });
});
