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


let isAutoSlideShowCarousel, isInfiniteCarousel, carouselHasSlidePicker;


// Determine whether Carousel is infinite, has automatic slideshow and has slide picker
const beforeAll = (id) => {
  return cy.get(`#${id}`)
    .then(($carousel) => {
      const carouselEl = $carousel[0];
      isAutoSlideShowCarousel = carouselEl.hasAttribute(ATTRS.AUTO_SLIDE_SHOW);
      isInfiniteCarousel = carouselEl.hasAttribute(ATTRS.INFINITE);
      carouselHasSlidePicker = carouselEl.hasAttribute(ATTRS.WITH_SLIDE_PICKER);
    });
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
    .as('carouselSlides')
    .then(() => {
      if (isAutoSlideShowCarousel) {
        cy.get(`#${id} [${ATTRS.AUTO_SLIDE_SHOW_BTN}]`)
          .as('carouselAutoSlideShowBtn');
      }

      if (carouselHasSlidePicker) {
        cy.get(`#${id} [${ATTRS.SLIDE_PICKER}]`)
          .as('carouselSlidePicker')
          .find('button')
          .as('carouselSlidePickerBtns');
      }
    });
};


const checkSlideSelected = (slideNumber) => {
  return cy.get('@carouselSlides')
    .each(($slide, index) => {
      cy.wrap($slide).should(`${index === slideNumber - 1 ? '' : 'not.'}have.attr`, ATTRS.SLIDE_SELECTED, '');
    })
    .then(() => {
      if (carouselHasSlidePicker) {
        cy.get('@carouselSlidePickerBtns')
          .each(($slidePickerBtn, index) => {
            cy.wrap($slidePickerBtn)
              .should('have.attr', 'aria-selected', `${index === slideNumber - 1 ? 'true' : 'false'}`)
              .and('have.attr', 'tabindex', `${index === slideNumber - 1 ? '0' : '-1'}`);
          });
      }
    });
};


const initChecks = (id) => {
  const SLIDES_ID = `${id}-slides`;

  return cy.get('@carousel')
    .should('have.attr', 'aria-roledescription', 'carousel')
    .and('have.attr', 'role', 'region')
    .and(`${isAutoSlideShowCarousel ? '' : 'not.'}have.attr`, ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'true')
    .and(`${isAutoSlideShowCarousel ? '' : 'not.'}have.attr`, ATTRS.AUTO_SLIDE_SHOW_STOPPED, 'false')

    // Check initial attributes of previous slide button
    .get('@carouselPrevSlideBtn')
    .should('have.attr', ATTRS.PREV_SLIDE_BTN, '')
    .and('have.attr', 'aria-controls', SLIDES_ID)

    // Check initial attributes of next slide button
    .get('@carouselNextSlideBtn')
    .should('have.attr', ATTRS.NEXT_SLIDE_BTN, '')
    .and('have.attr', 'aria-controls', SLIDES_ID)

    // Check initial attributes of slides wrapper
    .get('@carouselSlidesWrapper')
    .should('have.id', SLIDES_ID)
    .and('have.attr', 'aria-live', `${isAutoSlideShowCarousel ? 'off' : 'polite'}`)

    // Check initial attributes of slides
    .get('@carouselSlides')
    .then(($slides) => {
      cy.wrap($slides)
        .each(($slide, index) => {
          cy.wrap($slide)
            .should('have.attr', ATTRS.SLIDE, '')
            .and('have.attr', 'aria-label', `${index + 1} of ${$slides.length}`)
            .and('have.attr', 'aria-roledescription', 'slide')
            .and('have.attr', 'role', `${carouselHasSlidePicker ? 'tabpanel' : 'group'}`);
        });
    })

    // Check initial attributes of slide picker and slide picker buttons
    .then(() => {
      if (carouselHasSlidePicker) {
        cy.get('@carouselSlidePicker')
          .should('have.attr', ATTRS.SLIDE_PICKER, '')
          .and('have.attr', 'aria-label', 'Choose slide to display')
          .and('have.attr', 'role', 'tablist')
          .get('@carouselSlidePickerBtns')
          .each(($slidePickerBtn, index) => {
            const slideNumber = index + 1;
            cy.wrap($slidePickerBtn)
              .should('have.attr', ATTRS.SLIDE_PICKER_BTN, slideNumber)
              .and('have.attr', 'aria-controls', `${IDS.SLIDE_PICKER_CAROUSEL}-slide-${slideNumber}`)
              .and('have.attr', 'aria-label', `Slide ${slideNumber}`)
              .and('have.attr', 'role', 'tab');
          });
      }
    })

    // Pause automatic slide show to prevent values changing in between checks
    .then(() => {
      if (isAutoSlideShowCarousel) {
        cy.get('@carouselNextSlideBtn').focus();
      }
    })

    // Check that correct initial slide selected
    .get('@carousel')
    .invoke('attr', ATTRS.SELECTED_SLIDE)
    .then((selectedSlideNumberString) => {
      const selectedSlideNumber = +selectedSlideNumberString;
      checkSlideSelected(selectedSlideNumber);

      if (!isInfiniteCarousel) {
        cy.get('@carouselPrevSlideBtn').should(`${selectedSlideNumber === 1 ? '' : 'not.'}be.disabled`);
      }
    })

    // Resume automatic slide show
    .then(() => {
      if (isAutoSlideShowCarousel) {
        cy.get('@carouselAutoSlideShowBtn').focus();
      }
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


const testSelectedSlideObsAttr = (slideToSelect) => {
  return cy.get('@carousel')
    .then(($carousel) => {
      const id = $carousel.attr('id');
      const currentSelectedSlide = +$carousel.attr(ATTRS.SELECTED_SLIDE);

      cy.addCustomEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, getExpectedDetailObj(id, currentSelectedSlide, slideToSelect))
        .get('@carousel')
        .invoke('attr', ATTRS.SELECTED_SLIDE, slideToSelect);
      checkSlideSelected(slideToSelect);

      // Reset state
      cy.get('@carousel').invoke('attr', ATTRS.SELECTED_SLIDE, currentSelectedSlide);
    });
};


const testInfiniteObsAttr = () => {
  return cy.get('@carousel')
    .invoke('attr', ATTRS.SELECTED_SLIDE, 1)
    .then(($carousel) => {
      if (isInfiniteCarousel) {
        cy.wrap($carousel)
          .invoke('removeAttr', ATTRS.INFINITE)
          .get('@carouselPrevSlideBtn')
          .should('be.disabled')
          .get('@carousel')
          .invoke('attr', ATTRS.INFINITE, '')
          .get('@carouselPrevSlideBtn')
          .should('not.be.disabled');
      } else {
        cy.wrap($carousel)
          .invoke('attr', ATTRS.INFINITE, '')
          .get('@carouselPrevSlideBtn')
          .should('not.be.disabled')
          .get('@carousel')
          .invoke('removeAttr', ATTRS.INFINITE)
          .get('@carouselPrevSlideBtn')
          .should('be.disabled');
      }
    });
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


    before(() => beforeAll(CAROUSEL_ID));


    beforeEach(() => getEls(CAROUSEL_ID));


    it(`Should initialise correctly`, () => initChecks(CAROUSEL_ID));


    it(`Should respond to next and previous slide buttons correctly`, () => {
      // Test prev slide button
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

      // Test next slide button
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
      it(`Should select correct slide when observed attribute changed`, () => testSelectedSlideObsAttr(3));


      it(`Should select infinite rotation when observed attribute added`, () => testInfiniteObsAttr());
    });
  });


  context(`Carousel with infinite rotation and initially set slide`, () => {
    const CAROUSEL_ID = IDS.INFINITE_CAROUSEL;


    before(() => beforeAll(CAROUSEL_ID));


    beforeEach(() => getEls(CAROUSEL_ID));


    it(`Should initialise correctly`, () => initChecks(CAROUSEL_ID));


    it(`Should respond to next and previous slide buttons correctly`, () => {
      // Test prev slide button
      cy.addCustomEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, getExpectedDetailObj(CAROUSEL_ID, 2, 1))
        .get('@carouselPrevSlideBtn')
        .click();
      checkSlideSelected(1);
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
      it(`Should select correct slide when observed attribute changed`, () => testSelectedSlideObsAttr(1));


      it(`Should de-select infinite rotation when observed attribute removed`, () => testInfiniteObsAttr());
    });
  });


  context(`Carousel with automatic slide show`, () => {
    const CAROUSEL_ID = IDS.AUTO_CAROUSEL;


    before(() => beforeAll(CAROUSEL_ID));


    beforeEach(() => getEls(CAROUSEL_ID));


    it(`Should initialise correctly`, () => initChecks(CAROUSEL_ID));


    it(`Should automatically select next slide after interval time`, () => {
      cy.get('@carousel')
        .invoke('attr', ATTRS.AUTO_SLIDE_SHOW_TIME)
        .then((intervalTime) => {
          cy.get('@carousel')
            .invoke('attr', ATTRS.SELECTED_SLIDE)
            .then((currentSelectedSlideString) => {
              const currentSelectedSlide = +currentSelectedSlideString;
              cy.addCustomEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, getExpectedDetailObj(CAROUSEL_ID, currentSelectedSlide, currentSelectedSlide + 1))
                .wait(+intervalTime)
                .get('@carousel')
                .invoke('attr', ATTRS.SELECTED_SLIDE)
                .should('equal', (currentSelectedSlide + 1).toString());
            });
        });
    });


    it(`Should pause automatic slide show when mouse hovers over Carousel`, () => {
      cy.addCustomEventListener(EVENTS.OUT.AUTO_SLIDE_SHOW_PAUSED, {id: CAROUSEL_ID})
        .get('@carousel')
        .trigger('mouseenter', 'bottomRight', {eventConstructor: 'MouseEvent'})
        .get('@carousel')
        .should('have.attr', ATTRS.AUTO_SLIDE_SHOW_ACTIVE, 'false')
        .and('have.attr', ATTRS.AUTO_SLIDE_SHOW_STOPPED, 'false')
        .get('@carouselSlidesWrapper')
        .should('have.attr', 'aria-live', 'polite')
        .get('@carouselAutoSlideShowBtn')
        .focus()
        .blur();
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


    it(`Should toggle automatic slide show when toggle button clicked`, () => {
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
        // Stop automatic slideshow before the following tests
        cy.get('@carouselAutoSlideShowBtn').click();
      });


      it(`Should select correct slide when observed attribute changed`, () => {
        cy.get('@carousel').invoke('attr', ATTRS.SELECTED_SLIDE, 1);
        testSelectedSlideObsAttr(2);

        // Resume slide show
        cy.get('@carouselAutoSlideShowBtn').click();
      });


      it(`Should select infinite rotation when observed attribute added`, () => {
        testInfiniteObsAttr();

        // Resume slide show
        cy.get('@carouselAutoSlideShowBtn').click();
      });
    });
  });


  context(`Carousel with slide picker`, () => {
    const CAROUSEL_ID = IDS.SLIDE_PICKER_CAROUSEL;


    before(() => beforeAll(CAROUSEL_ID));


    beforeEach(() => getEls(CAROUSEL_ID));


    it(`Should initialise correctly`, () => initChecks(CAROUSEL_ID));


    it(`Should respond to next and previous slide buttons correctly`, () => {
      // Stop automatic slideshow
      cy.get('@carouselAutoSlideShowBtn').click();

      // Test next slide button
      cy.addCustomEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, getExpectedDetailObj(CAROUSEL_ID, 1, 2))
        .get('@carouselNextSlideBtn')
        .click();
      checkSlideSelected(2);

      cy.get('@carouselNextSlideBtn').click();
      checkSlideSelected(3);

      // Test prev slide button
      cy.addCustomEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, getExpectedDetailObj(CAROUSEL_ID, 3, 2))
        .get('@carouselPrevSlideBtn')
        .click();
      checkSlideSelected(2);

      cy.get('@carouselPrevSlideBtn').click();
      checkSlideSelected(1);

      // Start automatic slideshow
      cy.get('@carouselAutoSlideShowBtn').click();
    });


    it(`Should change selected slide when slide picker buttons clicked`, () => {
      // Stop automatic slideshow
      cy.get('@carouselAutoSlideShowBtn').click();

      cy.addCustomEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, getExpectedDetailObj(CAROUSEL_ID, 1, 3))
        .get('@carouselSlidePickerBtns')
        .eq(2)
        .click();
      checkSlideSelected(3);

      cy.addCustomEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, getExpectedDetailObj(CAROUSEL_ID, 3, 2))
        .get('@carouselSlidePickerBtns')
        .eq(1)
        .click();
      checkSlideSelected(2);

      cy.get('@carouselSlidePickerBtns')
        .eq(0)
        .click();

      // Start automatic slideshow
      cy.get('@carouselAutoSlideShowBtn').click();
    });


    it(`Should change selected slide when arrows keys used while any slide picker button is focused`, () => {
      // Stop automatic slideshow
      cy.get('@carouselAutoSlideShowBtn').click();

      cy.addCustomEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, getExpectedDetailObj(CAROUSEL_ID, 1, 2))
        .get('@carouselSlidePickerBtns')
        .eq(0)
        .focus()
        .type('{rightarrow}');
      checkSlideSelected(2);

      // Start automatic slideshow
      cy.get('@carouselAutoSlideShowBtn').click();
    });


    describe(`Observed attributes`, () => {
      beforeEach(() => {
        // Stop automatic slideshow before the following tests
        cy.get('@carouselAutoSlideShowBtn').click();
      });


      it(`Should select correct slide when observed attribute changed`, () => {
        cy.get('@carousel').invoke('attr', ATTRS.SELECTED_SLIDE, 1);
        testSelectedSlideObsAttr(3);

        // Resume slide show
        cy.get('@carouselAutoSlideShowBtn').click();
      });


      it(`Should select infinite rotation when observed attribute added`, () => {
        testInfiniteObsAttr();

        // Resume slide show
        cy.get('@carouselAutoSlideShowBtn').click();
      });
    });
  });


  context(`Custom events Carousel`, () => {
    const CAROUSEL_ID = IDS.CUSTOM_EVENTS_CAROUSEL;


    before(() => beforeAll(CAROUSEL_ID));


    beforeEach(() => getEls(CAROUSEL_ID));


    it(`Should initialise correctly`, () => initChecks(CAROUSEL_ID));


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
      it(`Should select correct slide when observed attribute changed`, () => testSelectedSlideObsAttr(3));


      it(`Should select infinite rotation when observed attribute added`, () => testInfiniteObsAttr());
    });
  });
});
