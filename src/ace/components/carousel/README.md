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

After the event `DOMContentLoaded` is fired on `document`, an instance of Carousel is instantiated within each `<ace-carousel>` element, and an ID `ace-carousel-<n>` is addded for any instance without one, where `<n>` is a unique integer. Once instantiation is complete a custom event `ace-carousel-ready` is dispatched on `window`.

It is strongly recommended that Carousel be provided with an accessible label using `aria-label` or `aria-labelledby`. The word "carousel" should not be included in the label as Carousel has `aria-roledescription="carousel"` which is read out by screen readers.

Carousels can automatically display the next slide periodically if given the attribute `ace-carousel-auto-slide-show`. Such automatic Carousels change the slide every 5 seconds by default, however developers can provide a custom interval time in milliseconds as the value of Carousel attribute `ace-carousel-auto-slide-show-time`. The automatic slide show can be stopped or started using a required, descendant toggle button, or by custom events. Automatic Carousels must have a nested button to stop and start the automatic slide show, which for better accessibility must be the first focusable descendant. Automatic Carousels will therefore use the first decendant `<button>` for this and give it the attribute `ace-carousel-auto-slide-show-btn`. This button will be given an `aria-label` "Stop automatic slide show" or "Start automatic slide show" when the automatic slide show is running or not respectively. Developers can provide custom or localised strings as values of Carousel attributes `ace-carousel-stop-auto-slide-show-label` and `ace-carousel-start-auto-slide-show-label`.

All Carousels must have nested buttons to display the previous and next slide and will use `<button>` elements with attributes `ace-carousel-prev-btn` and `ace-carousel-next-btn` respectively. For better accesssbility these buttons should be the first and second focusable descendants, or second and third focusable descendants for automatic Carousels. If no descendants have these attributes then the first and second, or second and third for automatic Carousels, decendant `<button>` elements will be used and given these attributes. The previous slide button will be given an aria-label of value `Go to previous slide`, or `Go to last slide` if the Carousel is infinite and the first slide is visible. Developers can however provide custom or localised strings as values of attributes `ace-carousel-go-to-prev-slide-label` and `ace-carousel-go-to-last-slide-label` respectively, set on the button. Similarly, the next slide button will be given an aria-label of value `Go to next slide`, or `Go to first slide` if the Carousel is infinite and the last slide is visible. Developers can however provide custom or localised strings as values of attributes `ace-carousel-go-to-next-slide-label` and `ace-carousel-go-to-first-slide-label` respectively, set on the button.

All Carousel slides must be nested within an element with attribute `ace-carousel-slides`. If no descendant has this attribute, the first child `<div>` will be used if present, otherwise Carousel will append a child `<div>` to itself and use it. Slides do not have to be present upon instantiation and can be dynamically added, or removed later, as long as custom event `ace-carousel-update-slides` is dispatched on the Carousel instance afterwards.

## Usage

A Carousel displayed slide can be changed using the previous and next slide buttons, using custom events, or by changing the value of its attribute `ace-carousel-selected-slide` to the slide's number e.g. `2` will display the second slide and `3` the third. This attribute can be set before instantiation to display a specific slide on page load, but if omitted Carousel will add it and set its value to `1` thereby displaying the first slide. The attribute's value is also dynamically updated when the displayed slide is changed using the other methods.

By default the previous and next slide buttons are disabled when the first and last slide is displayed respectively. Giving a Carousel the attribute `ace-carousel-infinite` allows infinite rotation through slides where clicking the previous button with the first slide displayed will display the last, and clicking the next button with the last slide displayed will display the first. This is an observed attribute that can be added or removed to dynamically enable or disable this behaviour.

For automatic Carousels the automatic slide show is paused while the mouse pointer hovers over the Carousel or while a Carousel instance descendant, other than the automatic slide show toggle button, has keyboard focus, and automatically resumes afterwards. The automatic slide show will not start on page load if the page is hidden, i.e. it's in a background tab or the window is minimised, and will start as soon as the page becomes visible. It will also pause if the page becomes hidden at any point and will resume once the page is visible again.

The automatic slide show can be stopped and started again using the automatic slide show toggle button or using custom events, with both methods setting Carousel attribute `ace-carousel-auto-slide-show-stopped` to `true` or `false`. This attribute can therefore be used to change the text string or icon of the toggle button simply using CSS. Note that this attribute will have value `false` while the Carousel is temporarily paused due to mouse hover or descendant keyboard focus.


## Styles

The following SASS is applied to Carousel, each declaration of which can be overridden by a single class selector.

```scss
@import '../../common/constants';


/* VARIABLES */
$ace-carousel-slide-picker-btn-focus-ring-width: 3px !default;
$ace-carousel-slide-picker-btn-focus-ring-color: $ace-color-focus !default;
$ace-carousel-slide-picker-btn-diameter: $ace-spacing-1 !default;
$ace-carousel-slide-picker-btn-border-width: 1px !default;
$ace-carousel-slide-picker-btn-border-color: #000 !default;
$ace-carousel-slide-picker-btn-selected-bg-color: $ace-carousel-slide-picker-btn-border-color !default;


/* STYLES */
ace-carousel {
  display: inline-block;
}

[ace-carousel-slide] {
  display: none;
}

[ace-carousel-slide-selected] {
  display: block;
}

[ace-carousel-slide-picker-btn] {
  background-color: transparent;
  border: $ace-carousel-slide-picker-btn-focus-ring-width solid transparent;
  border-radius: 50%;
  height: $ace-carousel-slide-picker-btn-diameter * 2.5;
  position: relative;
  width: $ace-carousel-slide-picker-btn-diameter * 2.5;

  &:active,
  &:focus {
    border-color: $ace-carousel-slide-picker-btn-focus-ring-color;
    outline: none;
  }

  &::after {
    border: $ace-carousel-slide-picker-btn-border-width solid $ace-carousel-slide-picker-btn-border-color;
    border-radius: 50%;
    content: '';
    height: $ace-carousel-slide-picker-btn-diameter;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: $ace-carousel-slide-picker-btn-diameter;
  }

  &[aria-selected="true"]::after {
    background-color: $ace-carousel-slide-picker-btn-selected-bg-color;
  }
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

#### Automatic slide show events

`ace-carousel-auto-slide-show-started`, `ace-carousel-auto-slide-show-stopped` & `ace-carousel-auto-slide-show-paused`

These events are dispatched when the automatic slide show is started, stopped or paused, the latter of which occurs when the mouse pointer hovers over the Carousel or when a descendant, other than the automatic slide show toggle button, has keyboard focus. The event names are available as `EVENTS.OUT.AUTO_SLIDE_SHOW_STARTED`, `EVENTS.OUT.AUTO_SLIDE_SHOW_STOPPED` and `EVENTS.OUT.AUTO_SLIDE_SHOW_PAUSED`, and their `detail` properties are composed as follows:

```js
'detail': {
  'id': // ID of Carousel [string]
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

#### Automatic slide show events

`ace-carousel-start-auto-slide-show` & `ace-carousel-stop-auto-slide-show`

These event should be dispatched to start or stop the automatic slide show respectively. The event names are available as `EVENTS.IN.START_AUTO_SLIDE_SHOW` and `EVENTS.IN.STOP_AUTO_SLIDE_SHOW` respectively.

## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.


### Simple Carousel

Simple Carousel with 3 slides.

```html
<ace-carousel aria-label="Simple">
  <button>Previous slide</button>
  <button>Next slide</button>
  <div>
    <div>
      <h3>Slide 1 heading</h3>
      <p>Slide 1 content.</p>
      <img src="/img/logo.svg" height="100px" alt="Potato logo"/>
    </div>
    <div>
      <h3>Slide 2 heading</h3>
      <p>Slide 2 content.</p>
      <img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone"/>
    </div>
    <div>
      <h3>Slide 3 heading</h3>
      <p>Slide 3 content.</p>
      <img src="/img/goggles-spuddy.png" height="100px" alt="Potato Spuddy with virtual reality goggles"/>
    </div>
  </div>
</ace-carousel>
```


### Carousel with infinite rotation and second slide initially displayed

Carousel with infinite rotation that displays the second slide upon page load.

```html
<ace-carousel ace-carousel-infinite ace-carousel-selected-slide="2" aria-label="Infinite rotation and second slide initially displayed" id="infinite-carousel">
  <button>Previous slide</button>
  <button>Next slide</button>
  <div>
    <div>
      <h3>Slide 1 heading</h3>
      <p>Slide 1 content.</p>
      <img src="/img/logo.svg" height="100px" alt="Potato logo"/>
    </div>
    <div>
      <h3>Slide 2 heading</h3>
      <p>Slide 2 content.</p>
      <img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone"/>
    </div>
    <div>
      <h3>Slide 3 heading</h3>
      <p>Slide 3 content.</p>
      <img src="/img/goggles-spuddy.png" height="100px" alt="Potato Spuddy with virtual reality goggles"/>
    </div>
  </div>
</ace-carousel>
```

### Carousel with automatic slide show

Carousel with automatic slide show. Two buttons have also been included, which dispatch the `ace-carousel-start-auto-slide-show` & `ace-carousel-stop-auto-slide-show` custom events. The extra JavaScript used by this example is also shown below.

```html
<button id="stop-auto-slide-show-custom-event-btn">Stop automatic slide show custom event</button>
<button id="start-auto-slide-show-custom-event-btn">Start automatic slide show custom event</button>
<hr>
<ace-carousel ace-carousel-auto-slide-show ace-carousel-auto-slide-show-time="2000" ace-carousel-infinite aria-label="Automatic slide show" id="auto-carousel">
  <button>Toggle automatic slide show</button>
  <button>Previous slide</button>
  <button>Next slide</button>
  <div>
    <div>
      <h3>Slide 1 heading</h3>
      <p>Slide 1 content.</p>
      <img src="/img/logo.svg" height="100px" alt="Potato logo"/>
    </div>
    <div>
      <h3>Slide 2 heading</h3>
      <p>Slide 2 content.</p>
      <img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone"/>
    </div>
    <div>
      <h3>Slide 3 heading</h3>
      <p>Slide 3 content.</p>
      <img src="/img/goggles-spuddy.png" height="100px" alt="Potato Spuddy with virtual reality goggles"/>
    </div>
  </div>
</ace-carousel>
```

```js
import {EVENTS} from '/ace/components/carousel/carousel.js';

document.addEventListener('DOMContentLoaded', () => {
  const carouselEl = document.getElementById('auto-carousel');

  window.addEventListener('click', (e) => {
    const targetId = e.target.id;
    switch(targetId) {
      case 'start-auto-slide-show-custom-event-btn':
      case 'stop-auto-slide-show-custom-event-btn': {
        const event = EVENTS.IN[`${targetId === 'start-auto-slide-show-custom-event-btn' ? 'START' : 'STOP'}_AUTO_SLIDE_SHOW`];
        carouselEl.dispatchEvent(new CustomEvent(event));
        break;
      }
    }
  });
});
```


### Carousel with slide picker

Carousel with slide picker buttons and automatic slide show.

```html
<ace-carousel ace-carousel-auto-slide-show
ace-carousel-infinite aria-label="Example of slide picker" id="slide-picker-carousel">
  <button>Toggle automatic slide show</button>
  <button>Previous slide</button>
  <button>Next slide</button>
  <div ace-carousel-slide-picker></div>
  <div>
    <div>
      <h3>Slide 1 heading</h3>
      <p>Slide 1 content.</p>
      <img src="/img/logo.svg" height="100px" alt="Potato logo"/>
    </div>
    <div>
      <h3>Slide 2 heading</h3>
      <p>Slide 2 content.</p>
      <img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone"/>
    </div>
    <div>
      <h3>Slide 3 heading</h3>
      <p>Slide 3 content.</p>
      <img src="/img/goggles-spuddy.png" height="100px" alt="Potato Spuddy with virtual reality goggles"/>
    </div>
  </div>
</ace-carousel>
```


### Carousel controlled using custom events

The buttons in this example dispatch the `ace-carousel-set-prev-slide`, `ace-carousel-set-next-slide` and `ace-carousel-update-slides` custom events on the Carousel. The extra JavaScript used by this example is also shown below.

```html
<p>These buttons dispatch custom events</p>
<button id="prev-slide-btn">Prev slide</button>
<button id="next-slide-btn">Next slide</button>
<button id="add-slide-btn">Add slide to end</button>
<button id="remove-slide-btn">Remove last slide</button>
<hr>
<ace-carousel aria-label="Custom events controlled" id="custom-events-carousel">
  <button>Previous slide</button>
  <button>Next slide</button>
  <div>
    <div>
      <h3>Slide 1 heading</h3>
      <p>Slide 1 content.</p>
      <img src="/img/logo.svg" height="100px" alt="Potato logo"/>
    </div>
    <div>
      <h3>Slide 2 heading</h3>
      <p>Slide 2 content.</p>
      <img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone"/>
    </div>
    <div>
      <h3>Slide 3 heading</h3>
      <p>Slide 3 content.</p>
      <img src="/img/goggles-spuddy.png" height="100px" alt="Potato Spuddy with virtual reality goggles"/>
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
    p.textContent = `This slide was added dynamically, after this Carousel was initialised.`;
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
