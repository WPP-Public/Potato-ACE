# Carousel

Carousel is a set of slides, only one of which is displayed at a time, and buttons used to display the previous or next slide.

Carousel conforms to [W3C's WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#carousel).


## Setup

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/carousel/carousel'
```

Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/carousel/carousel';
```

For convenience the ES6 class is exported as `Carousel` and the attribute names used by the class are exported as properties of `ATTRS`.

After the event `DOMContentLoaded` is fired on `document`, an instance of Carousel is instantiated within each `<ace-carousel>` element, and an ID `ace-carousel-<n>` is addded for any instance without one, where `<n>` is a unique integer. Once instantiation is complete a custom event `ace-carousel-ready` is dispatched on `window`. See the **Custom events** section below for more details.

It is strongly recommended that Carousel be provided with an accessible label using `aria-label` or `aria-labelledby`. The word "carousel" should not be included in the label as Carousel has `aria-roledescription="carousel"` which will be read out by screen readers.

Carousel must have nested buttons to display the previous and next slide and will use `<button>` elements with attributes `ace-carousel-prev-btn` and `ace-carousel-next-btn` respectively. For better accesssbility these buttons should be the first and second focusable descendants. If no descendants have these attributes then the first and second decendant `<button>` element will be used and given this attribute.

All Carousel slides must be nested within an element with attribute `ace-carousel-slides`. If no descendant has this attribute, the first child `<div>` will be used if present, otherwise Carousel will append a child `<div>` to itself and use it. Slides do not have to be present upon instantiation and can be dynamically added, or removed, later as long as custom event `ace-carousel-update-slides` is dispatched on the Carousel instance afterwards.

## Usage

A Carousel displayed slide can be changed using the previous and next slide buttons, through custom events, or by changing the value of its attribute `ace-carousel-selected-slide` to the slide's number e.g. `2` will display the second slide and `3` the third. This attribute can be set before instantiation to display a specific slide on page load, but if omitted Carousel will add it and set its value to `1` thereby displaying the first slide. The attribute's value is also dynamically updated when the displayed slide is changed using the other methods.

By default the previous and next slide buttons are disabled when the first and last slide is displayed respectively. Giving the Carousel the attribute `ace-carousel-infinite` allows infinite scrolling through slides, where clicking the previous button with the first slide displayed displays the last slide and clicking the next button with the last slide displayed displays the first slide. This is also an observed attribute that can be added or removed to dynamically enable or disable this behaviour.


## Styles

The following SASS is applied to Carousel, each declaration of which can be overridden by a single class selector.

```scss
[ace-carousel-slide] {
  display: none;
}

[ace-carousel-slide-selected] {
  display: block;
}
```


## Custom events

Carousel uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.


### Dispatched events

The following events are dispatched on `window` by Carousel.

#### Ready

`ace-carousel-ready`

This event is dispatched when Carousel finishes initialising, after page load or in response to the `ace-carousel-update-slides` custom event being dispatched. The event name is available as `EVENTS.OUT.READY`, and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Carousel [string]
}
```

#### Changed

`ace-carousel-slide-changed`

This event is dispatched when the displayed slide is changed. The event name is available as `EVENTS.OUT.SELECTED_SLIDE_CHANGED`, and its `detail` property is composed as follows:


```js
'detail': {
  'currentlySelectedSlide': // The current selected slide number [number]
  'id': // ID of Carousel [string]
  'previouslySelectedSlide': // The previously selected slide number [number]
}
```

### Listened for events

Carousel listens for the following events, which should be dispatched by the user's code on the specific `ace-carousel` element.


#### Set previous slide

`ace-carousel-set-prev-slide`

This event should be dispatched to display the previous slide, or the last slide if the Carousel has the attribute `ace-carousel-infinite` and its first slide is displayed. The event name is available as `EVENTS.IN.SET_PREV_SLIDE`.


#### Set next slide

`ace-carousel-set-next-slide`

This event should be dispatched to display the next slide, or the first slide if the Carousel has the attribute `ace-carousel-infinite` and its the last slide is displayed. The event name is available as `EVENTS.IN.SET_NEXT_SLIDE`.


#### Update slides

`ace-carousel-update-slides`

This event should be dispatched if slides have been added or removed and causes the Carousel to initialise them. The event name is available as `EVENTS.IN.UPDATE_SLIDES`.


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.


### Simple Carousel

Simple Carousel with 3 slides.

```html
<ace-carousel aria-label="Basic carousel">
  <button>Previous slide</button>
  <button>Next slide</button>
  <br><br>
  <div>
    <div>
      <h2>Potato</h2>
      <p>We exist to design, develop and launch purposeful and effective digital products.</p>
      <p><a href="https://p.ota.to">Get to know us</a></p>
      <img src="/img/logo.svg" height="120px" alt="Classic Spuddy">
    </div>
    <div>
      <h2>Making new tech count</h2>
      <p>Though new technologies excite and drive us, we are not just seduced by the promise. Instead, we find useful applications that either make existing products better or provide new human-centred solutions.</p>
      <p><a href="https://p.ota.to/work/making-new-tech-count">Find out more</a></p>
      <img src="/img/carousel/spuddy-goggles.png" height="120px" alt="Spuddy with virtual reality goggles">
    </div>
    <div>
      <h2>Making digital for real life</h2>
      <p>We deliberately design for context, environment, and user outcomes, delivering products that allow people to interact with the world around them more effectively, making things better.</p>
      <p><a href="https://p.ota.to/work/making-digital-for-real-life">Find out more</a></p>
      <img src="/img/carousel/spuddy-phone.png" height="120px" alt="Spuddy with headphones and camera">
    </div>
  </div>
</ace-carousel>
```


### Infinite Carousel with initially displayed second slide

Carousel with infinite rotation that displays the second slide upon page load.

```html
<ace-carousel ace-carousel-infinite ace-carousel-selected-slide="2" aria-label="A carousel with infinite scroll and an initially selected slide" id="infinite-carousel">
  <button>Previous slide</button>
  <button>Next slide</button>
  <br><br>
  <div>
    <div>
      <h2>Potato</h2>
      <p>We exist to design, develop and launch purposeful and effective digital products.</p>
      <p><a href="https://p.ota.to">Get to know us</a></p>
      <img src="/img/logo.svg" height="120px" alt="Classic Spuddy">
    </div>
    <div>
      <h2>Making new tech count</h2>
      <p>Though new technologies excite and drive us, we are not just seduced by the promise. Instead, we find useful applications that either make existing products better or provide new human-centred solutions.</p>
      <p><a href="https://p.ota.to/work/making-new-tech-count">Find out more</a></p>
      <img src="/img/carousel/spuddy-goggles.png" height="120px" alt="Spuddy with virtual reality goggles">
    </div>
    <div>
      <h2>Making digital for real life</h2>
      <p>We deliberately design for context, environment, and user outcomes, delivering products that allow people to interact with the world around them more effectively, making things better.</p>
      <p><a href="https://p.ota.to/work/making-digital-for-real-life">Find out more</a></p>
      <img src="/img/carousel/spuddy-phone.png" height="120px" alt="Spuddy with headphones and camera">
    </div>
  </div>
</ace-carousel>
```

### Carousel controlled by custom events

The buttons in this example dispatch the `ace-carousel-set-prev-slide`, `ace-carousel-set-next-slide` and `ace-carousel-update-slides` custom events on the Carousel. The extra JavaScript used by this example is also shown below.

```html
<p>These buttons dispatch custom events</p>
<button id="prev-slide-btn">Prev slide</button>
<button id="next-slide-btn">Next slide</button>
<button id="add-slide-btn">Add slide to end</button>
<button id="remove-slide-btn">Remove last slide</button>
<hr>
<ace-carousel aria-label="Carousel controlled through custom events" id="custom-events-carousel">
  <button>Previous slide</button>
  <button>Next slide</button>
  <br><br>
  <div>
    <div>
      <h2>Potato</h2>
      <p>We exist to design, develop and launch purposeful and effective digital products.</p>
      <p><a href="https://p.ota.to">Get to know us</a></p>
      <img src="/img/logo.svg" height="120px" alt="Classic Spuddy">
    </div>
    <div>
      <h2>Making new tech count</h2>
      <p>Though new technologies excite and drive us, we are not just seduced by the promise. Instead, we find useful applications that either make existing products better or provide new human-centred solutions.</p>
      <p><a href="https://p.ota.to/work/making-new-tech-count">Find out more</a></p>
      <img src="/img/carousel/spuddy-goggles.png" height="120px" alt="Spuddy with virtual reality goggles">
    </div>
    <div>
      <h2>Making digital for real life</h2>
      <p>We deliberately design for context, environment, and user outcomes, delivering products that allow people to interact with the world around them more effectively, making things better.</p>
      <p><a href="https://p.ota.to/work/making-digital-for-real-life">Find out more</a></p>
      <img src="/img/carousel/spuddy-phone.png" height="120px" alt="Spuddy with headphones and camera">
    </div>
  </div>
</ace-carousel>
```

```js
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
    carouselEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_SLIDES));
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
        carouselEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_SLIDES));
        break;
    }
  });
});
```
