import {ATTRS, CAROUSEL, EVENTS} from './carousel';


const IDS = {
  BASIC_CAROUSEL: `${CAROUSEL}-1`,
  INITIALLY_SET_SLIDE_CAROUSEL: 'initially-set-slide-carousel',
  WRAPPING_CAROUSEL: 'wrapping-carousel',
};


const getEls = (id) => {
  return cy.get(`#${id}`)
    .as('carousel')
    .find(`[${ATTRS.PREV}]`)
    .as('carouselPrevBtn')
    .get('@carousel')
    .find(`[${ATTRS.NEXT_BUTTON}]`)
    .as('carouselNextBtn')
    .get('@carousel')
    .find(`[${ATTRS.SLIDES}]`)
    .as('carouselSlidesWrapper')
    .find(`[${ATTRS.SLIDE}]`)
    .as('carouselSlides');
};


const checkSlideActive = (slideNumber) => {
  return cy.get('@carouselSlides')
    .then(($slides) => {
      cy.get('@carouselSlides')
        .each(($slide, index) => {
          cy.wrap($slide)
            .should('have.attr', ATTRS.SLIDE, '')
            .and('have.attr', 'aria-label', `${index + 1} of ${$slides.length}`)
            .and('have.attr', 'aria-roledescription', 'slide')
            .and(`${index === slideNumber - 1 ? '' : 'not.' }have.attr`, ATTRS.SLIDE_ACTIVE, '');
        });
    });
};


const carouselInitChecks = (id, activeSlideNumber=1, automatic=false) => {
  const SLIDES_ID = `${id}-slides`;

  return cy.get('@carousel')
    .should('have.attr', 'aria-roledescription', 'carousel')
    .and('have.attr', 'role', 'region')
    .get('@carouselPrevBtn')
    .should('have.attr', ATTRS.PREV, '')
    .and('have.attr', 'aria-controls', SLIDES_ID)
    .get('@carouselNextBtn')
    .should('have.attr', ATTRS.NEXT_BUTTON, '')
    .and('have.attr', 'aria-controls', SLIDES_ID)
    .get('@carouselSlidesWrapper')
    .should('have.id', SLIDES_ID)
    .and(`${automatic ? 'not.' : ''}have.attr`, 'aria-live', 'polite')
    .get('@carouselSlides')
    .then(() => checkSlideActive(activeSlideNumber));
};


context(`Carousel`, () => {
  before(() => {
    cy.visit(`/carousel`);
  });


  it(`Carousel without ID should initialise with an ID`, () => {
    cy.get(CAROUSEL)
      .first()
      .should('have.id', `${CAROUSEL}-1`);
  });


  context(`Basic Carousel`, () => {
    const CAROUSEL_ID = IDS.BASIC_CAROUSEL;


    beforeEach(() => getEls(CAROUSEL_ID));


    it(`Should initialise correctly`, () => {
      carouselInitChecks(CAROUSEL_ID);
      cy.get('@carouselPrevBtn').should('be.disabled');
    });


    it(`Should respond to next and previous slide buttons correctly`, () => {
      // Test Next button
      const expectedDetail = {
        currentSlideNumber: 2,
        id: CAROUSEL_ID,
      };
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail)
        .get('@carouselNextBtn')
        .click()
        .get('@carouselPrevBtn')
        .should('not.be.disabled');
      checkSlideActive(2);
      cy.get('@carouselNextBtn')
        .click()
        .should('be.disabled');
      checkSlideActive(3);

      // Test Prev button
      cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail)
        .get('@carouselPrevBtn')
        .click()
        .get('@carouselNextBtn')
        .should('not.be.disabled');
      checkSlideActive(2);
      cy.get('@carouselPrevBtn')
        .click()
        .should('be.disabled');
      checkSlideActive(1);
    });


    describe(`Observed attributes`, () => {
      it(`Should activate correct slide when observed attribute changed`, () => {
        const slideToActivate = 3;
        const expectedDetail = {
          currentSlideNumber: slideToActivate,
          id: CAROUSEL_ID,
        };
        cy.addCustomEventListener(EVENTS.OUT.CHANGED, expectedDetail)
          .get('@carousel')
          .invoke('attr', ATTRS.ACTIVE_SLIDE_NUMBER, slideToActivate)
          .invoke('attr', ATTRS.ACTIVE_SLIDE_NUMBER, 1);
      });


      it(`Should activate infinite rotation when observed attribute changed`, () => {
        cy.get('@carousel')
          .invoke('attr', ATTRS.WRAPPING, '')
          .get('@carouselPrevBtn')
          .should('not.be.disabled')
          .get('@carousel')
          .then($carousel => $carousel.removeAttr(ATTRS.WRAPPING))
          .get('@carouselPrevBtn')
          .should('be.disabled');
      });
    });
  });


  context(`Wrapping Carousel`, () => {
    const CAROUSEL_ID = IDS.WRAPPING_CAROUSEL;


    beforeEach(() => getEls(CAROUSEL_ID));


    it(`Should initialise correctly`, () => {
      carouselInitChecks(CAROUSEL_ID);
      cy.get('@carouselPrevBtn').should('not.be.disabled');
    });


    it(`Should respond to next and previous slide buttons correctly`, () => {
      // Test Next button
      cy.get('@carouselNextBtn')
        .click()
        .click();
      checkSlideActive(3);
      cy.get('@carouselNextBtn')
        .should('not.be.disabled')
        .click();
      checkSlideActive(1);

      // Test Prev button
      cy.get('@carouselPrevBtn')
        .click();
      checkSlideActive(3);
    });
  });


  context(`Carousel with initially set slide`, () => {
    const CAROUSEL_ID = IDS.INITIALLY_SET_SLIDE_CAROUSEL;


    beforeEach(() => getEls(CAROUSEL_ID));


    it(`Should initialise correctly`, () => {
      carouselInitChecks(CAROUSEL_ID, 2);
    });
  });
});
