import {ATTRS, CAROUSEL, EVENTS} from './carousel';


const IDS = {
  ADD_SLIDE_BTN: 'add-slide-btn',
  AUTO_CAROUSEL: 'auto-carousel',
  CUSTOM_EVENTS_CAROUSEL: 'custom-events-carousel',
  INFINITE_CAROUSEL: 'infinite-carousel',
  NEXT_SLIDE_BTN: 'next-slide-btn',
  PREV_SLIDE_BTN: 'prev-slide-btn',
  REMOVE_SLIDE_BTN: 'remove-slide-btn',
  SIMPLE_CAROUSEL: `${CAROUSEL}-1`,
  SLIDE_PICKER_CAROUSEL: `slide-picker-carousel`,
  START_AUTO_SLIDE_SHOW_CUSTOM_EVENT_BTN: 'start-auto-slide-show-custom-event-btn',
  STOP_AUTO_SLIDE_SHOW_CUSTOM_EVENT_BTN: 'stop-auto-slide-show-custom-event-btn',
};


const getEls = (id) => {
  return cy.get(`#${id}`)
    .as('carousel')
    .find(`[${ATTRS.PREV_SLIDE_BTN}]`)
    .as('carouselPrevSlideBtn')
    .get('@carousel')
    .find(`[${ATTRS.NEXT_SLIDE_BTN}]`)
    .as('carouselNextSlideBtn')
    .get('@carousel')
    .find(`[${ATTRS.SLIDES}]`)
    .as('carouselSlidesWrapper')
    .find(`[${ATTRS.SLIDE}]`)
    .as('carouselSlides');
};


const checkSlideSelected = (slideNumber) => {
  return cy.get('@carouselSlides')
    .eq(slideNumber - 1)
    .should('have.attr', ATTRS.SLIDE_SELECTED, '');
};


const carouselInitChecks = (id, autoSlideShow=false, hasSlidePicker=false) => {
  const SLIDES_ID = `${id}-slides`;

  return cy.get('@carousel')
    .should('have.attr', 'aria-roledescription', 'carousel')
    .and('have.attr', 'role', 'region')
    .get('@carouselPrevSlideBtn')
    .should('have.attr', ATTRS.PREV_SLIDE_BTN, '')
    .and('have.attr', 'aria-controls', SLIDES_ID)
    .get('@carouselNextSlideBtn')
    .should('have.attr', ATTRS.NEXT_SLIDE_BTN, '')
    .and('have.attr', 'aria-controls', SLIDES_ID)
    .get('@carouselSlidesWrapper')
    .should('have.id', SLIDES_ID)
    .and(`${autoSlideShow ? 'not.' : ''}have.attr`, 'aria-live', 'polite')
    .get('@carouselSlides')
    .then(($slides) => {
      cy.get('@carouselSlides')
        .each(($slide, index) => {
          cy.wrap($slide)
            .should('have.attr', ATTRS.SLIDE, '')
            .and('have.attr', 'aria-label', `${index + 1} of ${$slides.length}`)
            .and('have.attr', 'aria-roledescription', 'slide')
            .and('have.attr', 'role', `${hasSlidePicker ? 'tabpanel' : 'group'}`);
        });
    });
};


const getExpectedDetailObj = (id, prevSlideNumber, newSlideNumber) => {
  const expectedDetail = {
    currentlySelectedSlide: newSlideNumber,
    id,
    previouslySelectedSlide: prevSlideNumber,
  };
  return expectedDetail;
};


context(`Carousel`, () => {
  before(() => cy.visit(`/carousel`));


  it(`Carousel without ID should initialise with an ID`, () => {
    cy.get(CAROUSEL)
      .first()
      .should('have.id', `${CAROUSEL}-1`);
  });


  context(`Simple Carousel`, () => {
    const CAROUSEL_ID = IDS.SIMPLE_CAROUSEL;


    beforeEach(() => getEls(CAROUSEL_ID));


    it(`Should initialise correctly`, () => {
      carouselInitChecks(CAROUSEL_ID);
      checkSlideSelected(1);
      cy.get('@carouselPrevSlideBtn').should('be.disabled');
    });


    it(`Should respond to next and previous slide buttons correctly`, () => {
      // Test next slide button
      cy.addCustomEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, getExpectedDetailObj(CAROUSEL_ID, 1, 2))
        .get('@carouselNextSlideBtn')
        .click()
        .get('@carouselPrevSlideBtn')
        .should('not.be.disabled');
      checkSlideSelected(2);
      cy.get('@carouselNextSlideBtn')
        .click()
        .should('be.disabled');
      checkSlideSelected(3);

      // Test prev slide button
      cy.addCustomEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, getExpectedDetailObj(CAROUSEL_ID, 3, 2))
        .get('@carouselPrevSlideBtn')
        .click()
        .get('@carouselNextSlideBtn')
        .should('not.be.disabled');
      checkSlideSelected(2);
      cy.get('@carouselPrevSlideBtn')
        .click()
        .should('be.disabled');
      checkSlideSelected(1);
    });


    describe(`Observed attributes`, () => {
      it(`Should select correct slide when observed attribute changed`, () => {
        const slideToSelect = 3;
        cy.addCustomEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, getExpectedDetailObj(CAROUSEL_ID, 1, slideToSelect))
          .get('@carousel')
          .invoke('attr', ATTRS.SELECTED_SLIDE, slideToSelect)
          .invoke('attr', ATTRS.SELECTED_SLIDE, 1);
      });


      it(`Should select infinite rotation when observed attribute added`, () => {
        cy.get('@carousel')
          .invoke('attr', ATTRS.INFINITE, '')
          .get('@carouselPrevSlideBtn')
          .should('not.be.disabled')
          .get('@carousel')
          .invoke('removeAttr', ATTRS.INFINITE)
          .get('@carouselPrevSlideBtn')
          .should('be.disabled');
      });
    });
  });


  context(`Carousel with infinite rotation and initially set slide`, () => {
    const CAROUSEL_ID = IDS.INFINITE_CAROUSEL;


    beforeEach(() => getEls(CAROUSEL_ID));


    it(`Should initialise correctly`, () => {
      carouselInitChecks(CAROUSEL_ID);
      checkSlideSelected(2);
    });


    it(`Should respond to next and previous slide buttons correctly`, () => {
      // Test Prev button
      cy.get('@carouselPrevSlideBtn').click();
      checkSlideSelected(1);

      // Test Prev button wrapping
      cy.get('@carouselPrevSlideBtn')
        .should('not.be.disabled')
        .click();
      checkSlideSelected(3);

      // Test Next button wrapping
      cy.get('@carouselNextSlideBtn')
        .should('not.be.disabled')
        .click();
      checkSlideSelected(1);

      // Test Next button
      cy.get('@carouselNextSlideBtn').click();
      checkSlideSelected(2);
    });


    describe(`Observed attributes`, () => {
      it(`Should select correct slide when observed attribute changed`, () => {
        const slideToSelect = 3;
        cy.addCustomEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, getExpectedDetailObj(CAROUSEL_ID, 2, slideToSelect))
          .get('@carousel')
          .invoke('attr', ATTRS.SELECTED_SLIDE, slideToSelect)
          .invoke('attr', ATTRS.SELECTED_SLIDE, 2);
      });


      it(`Should de-select infinite rotation when observed attribute removed`, () => {
        cy.get('@carousel')
          .then($carousel => $carousel.removeAttr(ATTRS.INFINITE))
          .get('@carouselPrevSlideBtn')
          .click()
          .should('be.disabled')
          .get('@carousel')
          .invoke('attr', ATTRS.INFINITE, '')
          .get('@carouselPrevSlideBtn')
          .should('not.be.disabled');
      });
    });
  });


  context(`Carousel with automatic slide show`, () => {
    const CAROUSEL_ID = IDS.AUTO_CAROUSEL;


    beforeEach(() => {
      getEls(CAROUSEL_ID);

      cy.get('@carousel')
        .find(`[${ATTRS.AUTO_SLIDE_SHOW_BTN}]`)
        .as('carouselAutoSlideShowBtn');
    });


    it(`Should initialise correctly`, () => {
      carouselInitChecks(CAROUSEL_ID, true);

      cy.get('@carousel')
        .should('have.attr', ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'true')
        .and('have.attr', ATTRS.AUTO_SLIDE_SHOW_STOPPED, 'false');
    });


    it(`Should automatically select next slide after interval time`, () => {
      const startingSelectedSlideNumber = 2;
      const selectedSlideNumberAfterInterval = startingSelectedSlideNumber + 1;
      cy.get('@carousel')
        .invoke('attr', ATTRS.SELECTED_SLIDE, startingSelectedSlideNumber)
        .invoke('attr', ATTRS.AUTO_SLIDE_SHOW_TIME)
        .then((intervalTime) => {
          cy.addCustomEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, getExpectedDetailObj(CAROUSEL_ID, startingSelectedSlideNumber, selectedSlideNumberAfterInterval))
            .wait(+intervalTime)
            .get('@carousel')
            .invoke('attr', ATTRS.SELECTED_SLIDE)
            .then((selectedSlideNumber) => {
              cy.wrap(+selectedSlideNumber).should('equal', selectedSlideNumberAfterInterval);
            });
        });
    });


    it(`Should pause automatic slide show when mouse hovers over Carousel`, () => {
      cy.addCustomEventListener(EVENTS.OUT.AUTO_SLIDE_SHOW_PAUSED, {id: CAROUSEL_ID})
        .get('@carousel')
        .trigger('mouseenter')
        .should('have.attr', ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'false')
        .and('have.attr', ATTRS.AUTO_SLIDE_SHOW_STOPPED, 'false')
        .get('@carouselSlidesWrapper')
        .should('have.attr', 'aria-live', 'polite')
        .get('@carouselAutoSlideShowBtn')
        .focus()
        .blur()
        .get('@carousel')
        .trigger('mouseleave')
        .should('have.attr', ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'true')
        .and('have.attr', ATTRS.AUTO_SLIDE_SHOW_STOPPED, 'false')
        .get('@carouselSlidesWrapper')
        .should('have.attr', 'aria-live', 'off');
    });


    it(`Should pause automatic slide show when a descendant of Carousel, other than toggle button, receives keyboard focus`, () => {
      cy.addCustomEventListener(EVENTS.OUT.AUTO_SLIDE_SHOW_PAUSED, {id: CAROUSEL_ID})
        .get('@carousel')
        .should('have.attr', ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'true')
        .get('@carouselPrevSlideBtn')
        .focus()
        .get('@carousel')
        .should('have.attr', ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'false')
        .and('have.attr', ATTRS.AUTO_SLIDE_SHOW_STOPPED, 'false')
        .get('@carouselSlidesWrapper')
        .should('have.attr', 'aria-live', 'polite')
        .addCustomEventListener(EVENTS.OUT.AUTO_SLIDE_SHOW_STARTED, {id: CAROUSEL_ID})
        .get('@carouselAutoSlideShowBtn')
        .focus()
        .get('@carousel')
        .should('have.attr', ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'true')
        .get('@carouselSlidesWrapper')
        .should('have.attr', 'aria-live', 'off')
        .addCustomEventListener(EVENTS.OUT.AUTO_SLIDE_SHOW_PAUSED, {id: CAROUSEL_ID})
        .get('@carouselNextSlideBtn')
        .focus()
        .get('@carousel')
        .should('have.attr', ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'false')
        .and('have.attr', ATTRS.AUTO_SLIDE_SHOW_STOPPED, 'false')
        .get('@carouselSlidesWrapper')
        .should('have.attr', 'aria-live', 'polite')
        .get('@carouselAutoSlideShowBtn')
        .focus()
        .blur();
    });


    it(`Should toggle automatic slide show and dispatch custom events when toggle button clicked`, () => {
      cy.addCustomEventListener(EVENTS.OUT.AUTO_SLIDE_SHOW_STOPPED, {id: CAROUSEL_ID})
        .get('@carousel')
        .should('have.attr', ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'true')
        .get('@carouselAutoSlideShowBtn')
        .click()
        .get('@carousel')
        .should('have.attr', ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'false')
        .and('have.attr', ATTRS.AUTO_SLIDE_SHOW_STOPPED, 'true')
        .get('@carouselSlidesWrapper')
        .should('have.attr', 'aria-live', 'polite')
        .addCustomEventListener(EVENTS.OUT.AUTO_SLIDE_SHOW_STARTED, {id: CAROUSEL_ID})
        .get('@carouselAutoSlideShowBtn')
        .click()
        .get('@carousel')
        .should('have.attr', ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'true')
        .and('have.attr', ATTRS.AUTO_SLIDE_SHOW_STOPPED, 'false')
        .get('@carouselSlidesWrapper')
        .should('have.attr', 'aria-live', 'off');
    });


    it(`Should toggle automatic slide show when custom events dispatched`, () => {
      cy.addCustomEventListener(EVENTS.OUT.AUTO_SLIDE_SHOW_STOPPED, {id: CAROUSEL_ID})
        .get(`#${IDS.STOP_AUTO_SLIDE_SHOW_CUSTOM_EVENT_BTN}`)
        .click()
        .get('@carousel')
        .should('have.attr', ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'false')
        .and('have.attr', ATTRS.AUTO_SLIDE_SHOW_STOPPED, 'true')
        .addCustomEventListener(EVENTS.OUT.AUTO_SLIDE_SHOW_STARTED, {id: CAROUSEL_ID})
        .get(`#${IDS.START_AUTO_SLIDE_SHOW_CUSTOM_EVENT_BTN}`)
        .click()
        .get('@carousel')
        .should('have.attr', ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'true')
        .and('have.attr', ATTRS.AUTO_SLIDE_SHOW_STOPPED, 'false');
    });


    describe(`Observed attributes`, () => {
      beforeEach(() => {
        // Stop automatic slide show if running and select the first slide
        cy.get('@carousel')
          .invoke('attr', ATTRS.AUTO_SLIDE_SHOW_ACTIVE)
          .then(($slideShowActive) => {
            if ($slideShowActive === 'true') {
              cy.get('@carouselAutoSlideShowBtn').click();
            }
            cy.get('@carousel').invoke('attr', ATTRS.SELECTED_SLIDE, 1);
          });
      });


      it(`Should set correct slide when observed attribute changed`, () => {
        const slideToSelect = 3;
        cy.addCustomEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, getExpectedDetailObj(CAROUSEL_ID, 1, slideToSelect))
          .get('@carousel')
          .invoke('attr', ATTRS.SELECTED_SLIDE, slideToSelect);
      });


      it(`Should de-select infinite rotation when observed attribute removed`, () => {
        cy.get('@carousel')
          .then($carousel => $carousel.removeAttr(ATTRS.INFINITE))
          .get('@carouselPrevSlideBtn')
          .should('be.disabled')
          .get('@carousel')
          .invoke('attr', ATTRS.INFINITE, '')
          .get('@carouselPrevSlideBtn')
          .should('not.be.disabled');
      });
    });
  });


  context(`Carousel with slide picker`, () => {
    const CAROUSEL_ID = IDS.SLIDE_PICKER_CAROUSEL;


    beforeEach(() => {
      getEls(CAROUSEL_ID);

      cy.get('@carousel')
        .find(`[${ATTRS.AUTO_SLIDE_SHOW_BTN}]`)
        .as('carouselAutoSlideShowBtn')
        .get('@carousel')
        .find(`[${ATTRS.SLIDE_PICKER}]`)
        .as('carouselSlidePicker')
        .find('button')
        .as('carouselSlidePickerBtns');
    });


    it(`Should initialise correctly`, () => {
      carouselInitChecks(CAROUSEL_ID, true, true);

      cy.get('@carousel')
        .should('have.attr', ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'true')
        .and('have.attr', ATTRS.AUTO_SLIDE_SHOW_STOPPED, 'false')
        .get('@carouselSlidePicker')
        .should('have.attr', ATTRS.SLIDE_PICKER, '')
        .and('have.attr', 'aria-label', 'Choose slide to display')
        .and('have.attr', 'role', 'tablist')

        // Pause automatic slide show
        .get('@carouselNextSlideBtn').focus()

        // Check initial attributes of slide picker buttons
        .get('@carousel')
        .invoke('attr', ATTRS.SELECTED_SLIDE)
        .then((selectedSlideNumber) => {
          cy.get('@carouselSlidePickerBtns')
            .each(($slidePickerBtn, index) => {
              const slideNumber = index + 1;
              cy.wrap($slidePickerBtn)
                .should('have.attr', ATTRS.SLIDE_PICKER_BTN, slideNumber)
                .and('have.attr', 'aria-controls', `${IDS.SLIDE_PICKER_CAROUSEL}-slide-${slideNumber}`)
                .and('have.attr', 'aria-label', `Slide ${slideNumber}`)
                .and('have.attr', 'aria-selected', +selectedSlideNumber === slideNumber ? 'true' : 'false')
                .and('have.attr', 'role', 'tab')
                .and('have.attr', 'tabindex', +selectedSlideNumber === slideNumber ? '0' : '-1');
            });
        })

        // Resume automatic slide show
        .get('@carouselAutoSlideShowBtn').focus();
    });
  });


  context(`Custom events Carousel`, () => {
    const CAROUSEL_ID = IDS.CUSTOM_EVENTS_CAROUSEL;


    beforeEach(() => getEls(CAROUSEL_ID));


    it(`Should initialise correctly`, () => {
      carouselInitChecks(CAROUSEL_ID);
      checkSlideSelected(1);
    });


    it(`Should respond correctly when SET_PREV_TAB and SET_NEXT_TAB custom events dispatched`, () => {
      cy.addCustomEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, getExpectedDetailObj(CAROUSEL_ID, 1, 2))
        .get(`#${IDS.NEXT_SLIDE_BTN}`)
        .click();
      checkSlideSelected(2);

      cy.addCustomEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, getExpectedDetailObj(CAROUSEL_ID, 2, 1))
        .get(`#${IDS.PREV_SLIDE_BTN}`)
        .click();
      checkSlideSelected(1);
    });


    it(`Should update Carousel when a slide is added or removed and the UPDATE custom event is dispatched`, () => {
      cy.addCustomEventListener(EVENTS.OUT.READY, {id: CAROUSEL_ID})
        .get('@carousel')
        .invoke('attr', ATTRS.SELECTED_SLIDE, 3)
        .get('@carouselNextSlideBtn')
        .should('be.disabled')
        .get(`#${IDS.ADD_SLIDE_BTN}`)
        .click()
        .get('@carousel')
        .find(`[${ATTRS.SLIDE}]`)
        .as('carouselSlides')
        .should('have.length', 4)
        .get('@carouselNextSlideBtn')
        .should('not.be.disabled')
        .click();
      checkSlideSelected(4);
      cy.get(`#${IDS.REMOVE_SLIDE_BTN}`).click();
      checkSlideSelected(3);

      cy.get('@carousel').invoke('attr', ATTRS.SELECTED_SLIDE, 1);
    });


    describe(`Observed attributes`, () => {
      it(`Should set correct slide when observed attribute changed`, () => {
        const slideToSelect = 3;
        cy.addCustomEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, getExpectedDetailObj(CAROUSEL_ID, 1, slideToSelect))
          .get('@carousel')
          .invoke('attr', ATTRS.SELECTED_SLIDE, slideToSelect)
          .invoke('attr', ATTRS.SELECTED_SLIDE, 1);
      });


      it(`Should select infinite rotation when observed attribute added`, () => {
        cy.get('@carousel')
          .invoke('attr', ATTRS.INFINITE, '')
          .get('@carouselPrevSlideBtn')
          .should('not.be.disabled')
          .get('@carousel')
          .then($carousel => $carousel.removeAttr(ATTRS.INFINITE))
          .get('@carouselPrevSlideBtn')
          .should('be.disabled');
      });
    });
  });
});
