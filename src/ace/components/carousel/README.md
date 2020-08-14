# Carousel

A carousel presents a set of items, referred to as slides, by sequentially displaying a subset of one or more slides. Typically, one slide is displayed at a time, and users can activate a next or previous slide control that hides the current slide and "rotates" the next or previous slide into view. In some implementations, rotation automatically starts when the page loads, and it may also automatically stop once all the slides have been displayed. While a slide may contain any type of content, image carousels where each slide contains nothing more than a single image are common. Carousel conforms to the [W3C WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#carousel).

## Instantiation

First import the styles into your main SASS file, replacing `../path/to` with the path to *node_modules* relative to the file:

```scss
@import '../path/to/node_modules/@potato/ace/components/carousel/carousel'
```

Then import the class into your JavaScript entry point:

```js
import '@potato/ace/components/carousel/carousel';
```

For the sake of convenience the ES6 class is exported as `Carousel`. To avoid name clashes the `as` keyword can be used when importing, e.g. `import Carousel as aceCarousel from ...`. The attribute names used by the class are also exported as properties of `ATTRS`.

After `DOMContentLoaded` is fired, Carousel automatically instantiates an instance of itself within each `<ace-carousel></ace-carousel>` and adds IDs in the format `ace-carousel-(n)` to any instances without one, where `(n)` is the instance count.

### ARIA atributes and roles

For some aria attributes and roles, the value can be changed (i.e., `aria-label`), whereas for others, the value will be replaced with the correct one (i.e., `role="slide"`).

*Note*: If these aria attributes and roles are not provided, they will be automatically added with the appropriate value. Aria labels are added with a default value **only** if they haven't been provided. If you addd aria labels, please ensure the text is descriptive enough. You can find out more about aria attributes and roles in the [ARIA carousel specification](https://www.w3.org/TR/wai-aria-practices-1.1/#carousel). `alt` text is not added by default, but is recommended for images.

Here's a breakdown of added aria attributes and roles, and which ones can be edited:

| Attribute | Element | Usage | Editable |
| --- | --- | --- | --- |
| `role="region"` | `ace-carousel` | Defines the carousel and its controls as a land mark region. | No |
| `aria-roledescription="carousel"` | `ace-carousel` | Informs assistive technologies to identify the element as a "carousel" rather than a "region." Affects how the assistive technology renders the role but does not affect functionality, such as commands for navigating to landmark regions. | No |
| `aria-label="Page carousel"` | `ace-carousel` | Provides a label that describes the content in the carousel region. | Yes |
| `aria-label="Go to previous/next/first/last slide"` | `button` | Defines the accessible name for the next and previous slide buttons. In a carousel with infinite rotation, the labels specify the first and last slide. | No |
| `aria-controls="ace-carousel-slides"` | `button` | Identifies the content on the page that the button controls; Refers to the div that contains all the slides. | No |
| `aria-live="polite"` | `div[ace-carousel-slides]` | Identifies the container element as a live region in the "polite" state, meaning assistive technology users are informed about changes to the region at the next available opportunity. This causes screen readers to automatically announce the content of slides when the next and previous slide buttons are activated. | No |
| `role="group" `| `div[ace-carousel-slide]` | Applied to each of the elements that contains the content of a single slide; Enables assistive technology users to perceive the boundaries of a slide. | No |
| `aria-roledescription="slide"` | `div[ace-carousel-slide]` | Informs assistive technologies to identify the element as a "slide" rather than a "group." | No |
| `aria-label="n of N"` | `div[ace-carousel-slide]` | Provides each slide with a distinct label that helps the user understand which of the N slides is displayed. | Yes |


## Styles

The following SASS is applied to the component, each declaration of which can be overridden by a single class selector.

```scss
[ace-carousel-slide] {
  display: none;
}

[ace-carousel-slide-selected] {
  display: block;
}
```

The current slide is displayed by adding an `ace-carousel-slide-active` attribute on the appropriate `div[ace-carousel-slide]`. You can override this for custom animations. The captions, buttons, and other elements can be customised via CSS. 

*Note*: We will showcase a carousel with controls and captions displayed above and below the image, which is [considered more accessible](https://www.w3.org/TR/wai-aria-practices-1.1/examples/carousel/carousel-1.html?moreaccessible). If you choose to display controls and captions on the image, please take into consideration adding backgrounds via CSS to make them more perceivable.


## Custom events

Carousel uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.


### Dispatched events

The following events are dispatched on `window` by Carousel.

#### Ready

`ace-carousel-ready`

This event is dispatched when Carousel finishes initialising, after page load or response to the `ace-carousel-update` event being dispatched. The event name is available as `EVENTS.OUT.READY`, and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Carousel [string]
}
```

#### Changed

`ace-carousel-changed`

This event is dispatched when the Carousel selected slide is changed. The event name is available as `EVENTS.OUT.CHANGED`, and its `detail` property is composed as follows:


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

This event should be dispatched to select the previous slide, or the last slide if the Carousel has the attribute `ace-carousel-infinite` and the first slide is selected. The event name is available as `EVENTS.IN.SET_PREV_SLIDE`.


#### Set next slide

`ace-carousel-set-next-slide`

This event should be dispatched to select the next slide, or the first slide if the Carousel has the attribute `ace-carousel-infinite` and the last slide is selected. The event name is available as `EVENTS.IN.SET_NEXT_SLIDE`.


#### Update

`ace-carousel-set-next-slide`

This event should be dispatched if the Carousel mark-up has been changed, for example after adding or removing slides, and causes the Carousel to re-initialise. The event name is available as `EVENTS.IN.UPDATE`.


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.


### Simple Carousel

This is a simple carousel, which changes slides by clicking "previous" or "next" buttons. When the carousel reaches the first or last slides, the "previous" and "next" buttons respectively get disabled.

```html
<ace-carousel aria-label="Basic carousel">
  <button>Previous slide</button>
  <button>Next slide</button>
  <div>
    <div>
      <h2>Potato</h2>
      <h3>made better</h3>
      <p>We exist to design, develop and launch purposeful and effective digital products.</p>
      <a href="https://p.ota.to">get to know us</a>
      <br><br>
      <img src="/img/logo.svg" height="120px" alt="default plain Spuddy">
    </div>
    <div>
      <h2>Making new tech count</h2>
      <h3>Uncovering the potential of emerging technology.</h3>
      <p>Though new technologies excite and drive us, we are not just seduced by the promise. Instead, we find useful applications that either make existing products better or provide new human-centred solutions.</p>
      <a href="https://p.ota.to/work/making-new-tech-count">learn more</a>
      <br><br>
      <img src="/img/carousel/spuddy-goggles.png" height="120px" alt="Spuddy with virtual reality goggles">
    </div>
    <div>
      <h2>Making digital for real life</h2>
      <h3>Shaping the physical world through interactions with digital experiences.</h3>
      <p>We deliberately design for context, environment, and user outcomes, delivering products that allow people to interact with the world around them more effectively, making things better.</p>
      <a href="https://p.ota.to/work/making-digital-for-real-life">learn more</a>
      <br><br>
      <img src="/img/carousel/spuddy-phone.png" height="120px" alt="Spuddy with headphones and camera">
    </div>
  </div>
</ace-carousel>
```


### Carousel with inifinite rotation and initially set slide

With the attribute `ace-carousel-infinite`, the "previous" and "next" buttons are not disabled anymore. Instead they reset from the last and first slide respectively. This is an observed attribute, which can be set dynamically and tested in dev tools. Also note that this Carousel has attribute `ace-carousel-active-slide="2"` which causes it to set the second slide as active upon initialising.

```html
<ace-carousel id="infinite-carousel" aria-label="A carousel with infinite scroll and an initially selected slide" ace-carousel-infinite ace-carousel-selected-slide="2">
  <button ace-carousel-previous-slide>Previous slide</button>
  <button ace-carousel-next-slide>Next slide</button>
  <div>
    <div>
      <h2>Potato</h2>
      <h3>made better</h3>
      <p>We exist to design, develop and launch purposeful and effective digital products.</p>
      <a href="https://p.ota.to">get to know us</a>
      <br><br>
      <img src="/img/logo.svg" height="120px" alt="default plain Spuddy">
    </div>
    <div>
      <h2>Making new tech count</h2>
      <h3>Uncovering the potential of emerging technology.</h3>
      <p>Though new technologies excite and drive us, we are not just seduced by the promise. Instead, we find useful applications that either make existing products better or provide new human-centred solutions.</p>
      <a href="https://p.ota.to/work/making-new-tech-count">learn more</a>
      <br><br>
      <img src="/img/carousel/spuddy-goggles.png" height="120px" alt="Spuddy with virtual reality goggles">
    </div>
    <div>
      <h2>Making digital for real life</h2>
      <h3>Shaping the physical world through interactions with digital experiences.</h3>
      <p>We deliberately design for context, environment, and user outcomes, delivering products that allow people to interact with the world around them more effectively, making things better.</p>
      <a href="https://p.ota.to/work/making-digital-for-real-life">learn more</a>
      <br><br>
      <img src="/img/carousel/spuddy-phone.png" height="120px" alt="Spuddy with headphones and camera">
    </div>
  </div>
</ace-carousel>
```

### Custom event triggered Carousel

This Carousel is controlled through custom events.

```html
<p>These buttons dispatch custom events</p>
<button id="prev-slide-btn">Prev slide</button>
<button id="next-slide-btn">Next slide</button>
<button id="add-slide-btn">Add slide to end</button>
<button id="remove-slide-btn">Remove last slide</button>

<hr>

<ace-carousel id="custom-events-carousel" aria-label="Carousel controlled through custom events">
  <button ace-carousel-previous-slide>Previous slide</button>
  <button ace-carousel-next-slide>Next slide</button>
  <div>
    <div>
      <h2>Potato</h2>
      <h3>made better</h3>
      <p>We exist to design, develop and launch purposeful and effective digital products.</p>
      <a href="https://p.ota.to">get to know us</a>
      <br><br>
      <img src="/img/logo.svg" height="120px" alt="default plain Spuddy">
    </div>
    <div>
      <h2>Making new tech count</h2>
      <h3>Uncovering the potential of emerging technology.</h3>
      <p>Though new technologies excite and drive us, we are not just seduced by the promise. Instead, we find useful applications that either make existing products better or provide new human-centred solutions.</p>
      <a href="https://p.ota.to/work/making-new-tech-count">learn more</a>
      <br><br>
      <img src="/img/carousel/spuddy-goggles.png" height="120px" alt="Spuddy with virtual reality goggles">
    </div>
    <div>
      <h2>Making digital for real life</h2>
      <h3>Shaping the physical world through interactions with digital experiences.</h3>
      <p>We deliberately design for context, environment, and user outcomes, delivering products that allow people to interact with the world around them more effectively, making things better.</p>
      <a href="https://p.ota.to/work/making-digital-for-real-life">learn more</a>
      <br><br>
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
```
