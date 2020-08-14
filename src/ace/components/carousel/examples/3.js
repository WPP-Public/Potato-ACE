import {ATTRS, EVENTS} from '/ace/components/carousel/carousel.js';

document.addEventListener('DOMContentLoaded', () => {
  const carouselEl = document.getElementById('custom-events-carousel');
  const slidesWrapper = carouselEl.querySelector(`[${ATTRS.SLIDES}]`);

  const addSlide = () => {
    const headingEl = document.createElement('h2');
    headingEl.textContent = `Dynamically added Slide`;
    const p = document.createElement('p');
    p.textContent = `This slide was added dynamically, after the carousel was initialised.`;
    const newSlideEl = document.createElement('div');
    newSlideEl.appendChild(headingEl);
    newSlideEl.appendChild(p);
    slidesWrapper.appendChild(newSlideEl);
    carouselEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE));
  };

  window.addEventListener('click', (e) => {
    const targetId = e.target.id;
    switch(targetId) {
      case 'prev-slide-btn':
      case 'next-slide-btn': {
        const event = EVENTS.IN[`SET_${targetId === 'prev-slide-btn' ? 'PREV' : 'NEXT'}_SLIDE`];
        carouselEl.dispatchEvent(new CustomEvent(event));
        break;
      }
      case 'add-slide-btn':
      case 'remove-slide-btn':
        if (targetId === 'add-slide-btn') {
          addSlide();
        } else {
          slidesWrapper.removeChild(slidesWrapper.lastElementChild);
        }
        carouselEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE));
        break;
    }
  });
});
