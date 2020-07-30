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

| Aria | Element | Usage | Editable |
| --- | --- | --- | --- |
| `role="region"` | `ace-carousel` | Defines the carousel and its controls as a land mark region. | No |
| `aria-roledescription="carousel"` | `ace-carousel` | Informs assistive technologies to identify the element as a "carousel" rather than a "region." Affects how the assistive technology renders the role but does not affect functionality, such as commands for navigating to landmark regions. | No |
| `aria-label="Page carousel"` | `ace-carousel` | Provides a label that describes the content in the carousel region. | Yes |
| `aria-label="Go to previous/next/first/last slide"` | `button` | Defines the accessible name for the next and previous slide buttons. In a carousel with infinite rotation, the labels specify the first and last slide. | No |
| `aria-controls="ace-carousel-slides"` | `button` | Identifies the content on the page that the button controls; Refers to the div that contains all the slides. | No |
| `aria-live="polite"` | `div[ace-carousel-slides]` | Identifies the container element as a live region in the "polite" state, meaning assistive technology users are informed about changes to the region at the next available opportunity. This causes screen readers to automatically announce the content of slides when the next and previous slide buttons are activated. | No |
| `role="group" `| `div[ace-carousel-slide]` | Applied to each of the elements that contains the content of a single slide; Enables assistive technology users to perceive the boundaries of a slide. | No |
| `aria-roledescription="slide"` | `div[ace-carousel-slide]` | Informs assistive technologies to identify the element as a "slide" rather than a "group." | No |
| `aria-label="Slide n of N"` | `div[ace-carousel-slide]` | Provides each slide with a distinct label that helps the user understand which of the N slides is displayed. | Yes |


## Styles

The following SASS is applied to the component, each declaration of which can be overridden by a single class selector.

```scss
[ace-carousel-slide] {
  display: none;
}

[ace-carousel-active-slide] {
  display: block;
}
```

The current slide is displayed by adding an `ace-carousel-active-slide` attribute on the appropriate `div[ace-carousel-slide]`. You can override this for custom animations. The captions, buttons, and other elements can be customised via CSS. 

*Note*: We will showcase a carousel with controls and captions displayed above and below the image, which is [considered more accessible](https://www.w3.org/TR/wai-aria-practices-1.1/examples/carousel/carousel-1.html?moreaccessible). If you choose to display controls and captions on the image, please take into consideration adding backgrounds via CSS to make them more perceivable.


## Custom events

Carousel uses the following custom events, the names of which are exported as properties of `EVENTS`, similar to `ATTRS`, so they may be imported into other modules and dispatched or listened for.


### Changed

`ace-carousel-changed`

This event is dispatched when a Carousel visibility is changed and its `detail` object is composed as follows:

```js
'detail': {
  'currentSlideNumber': // The number of the current slide being shown
  'id': // ID of Carousel
}
```

## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.


### Simple Carousel

This is a simple carousel, which changes slides by clicking "previous" or "next" buttons. When the carousel reaches the first or last slides, the "previous" and "next" buttons respectively get disabled.

```html
<ace-carousel id="carousel-1" aria-roledescription="carousel" aria-label="CATrousel">
  <div class="ace-carousel-inner">
    <div class="ace-carousel-controls">
      <button ace-carousel-button-previous aria-controls="ace-carousel-slides" aria-label="Previous slide">PREV</button>
      <button ace-carousel-button-next aria-controls="ace-carousel-slides" aria-label="Next slide">NEXT</button>
    </div>
    <div id="ace-carousel-slides" ace-carousel-slides="" aria-live="polite">
      <div ace-carousel-slide="" role="group" aria-roledescription="slide" aria-label="1 of 5">
        <div class="ace-carousel-image">
          <img src="/img/carousel/cat1.jpg" alt="Grumpy cat">
        </div>
        <div class="ace-carousel-caption">
          <p>Slide 1</p>
        </div>
      </div>
      <div ace-carousel-slide="" role="group" aria-roledescription="slide" aria-label="2 of 5">
        <div class="ace-carousel-image">
          <img src="/img/carousel/cat2.jpg" alt="Tabby cat">
        </div>
        <div class="ace-carousel-caption">
          <p>Slide 2</p>
        </div>
      </div>
      <div ace-carousel-slide="" role="group" aria-roledescription="slide" aria-label="3 of 5">
        <div class="ace-carousel-image">
          <img src="/img/carousel/cat3.jpg" alt="British shorthair cat">
        </div>
        <div class="ace-carousel-caption">
          <p>Slide 3</p>
        </div>
      </div>
      <div ace-carousel-slide="" role="group" aria-roledescription="slide" aria-label="4 of 5">
        <div class="ace-carousel-image">
          <img src="/img/carousel/cat4.jpg" alt="Ginger cat">
        </div>
        <div class="ace-carousel-caption">
          <p>Slide 4</p>
        </div>
      </div>
      <div ace-carousel-slide="" role="group" aria-roledescription="slide" aria-label="5 of 5">
        <div class="ace-carousel-image">
          <img src="/img/carousel/cat5.jpg" alt="White cat">
        </div>
        <div class="ace-carousel-caption">
          <p>Slide 5</p>
        </div>
      </div>
    </div>
  </div>
</ace-carousel>
```


### Carousel with inifinite rotation

With the attribute `ace-carousel-infinite="true"`, the "previous" and "next" buttons are not disabled anymore. Instead they reset from the last and first slide respectively. This is an observed attribute, which can be set dinamically and tested in dev tools.

```html
<ace-carousel id="carousel-2" aria-roledescription="carousel" aria-label="CATrousel" ace-carousel-infinite="true">
  <div class="ace-carousel-inner">
    <div class="ace-carousel-controls">
      <button ace-carousel-button-previous aria-controls="ace-carousel-slides" aria-label="Previous slide">PREV</button>
      <button ace-carousel-button-next aria-controls="ace-carousel-slides" aria-label="Next slide">NEXT</button>
    </div>
    <div id="ace-carousel-slides" ace-carousel-slides aria-live="polite">
      <div ace-carousel-slide="" role="group" aria-roledescription="slide" aria-label="1 of 5">
        <div class="ace-carousel-image">
          <img src="/img/carousel/cat1.jpg" alt="Grumpy cat">
        </div>
        <div class="ace-carousel-caption">
          <p>Slide 1</p>
        </div>
      </div>
      <div ace-carousel-slide="" role="group" aria-roledescription="slide" aria-label="2 of 5">
        <div class="ace-carousel-image">
          <img src="/img/carousel/cat2.jpg" alt="Tabby cat">
        </div>
        <div class="ace-carousel-caption">
          <p>Slide 2</p>
        </div>
      </div>
      <div ace-carousel-slide="" role="group" aria-roledescription="slide" aria-label="3 of 5">
        <div class="ace-carousel-image">
          <img src="/img/carousel/cat3.jpg" alt="British shorthair cat">
        </div>
        <div class="ace-carousel-caption">
          <p>Slide 3</p>
        </div>
      </div>
      <div ace-carousel-slide="" role="group" aria-roledescription="slide" aria-label="4 of 5">
        <div class="ace-carousel-image">
          <img src="/img/carousel/cat4.jpg" alt="Ginger cat">
        </div>
        <div class="ace-carousel-caption">
          <p>Slide 4</p>
        </div>
      </div>
      <div ace-carousel-slide="" role="group" aria-roledescription="slide" aria-label="5 of 5">
        <div class="ace-carousel-image">
          <img src="/img/carousel/cat5.jpg" alt="White cat">
        </div>
        <div class="ace-carousel-caption">
          <p>Slide 5</p>
        </div>
      </div>
    </div>
  </div>
</ace-carousel>
```

### Carousel with a set current slide

With the attribute `ace-carousel-current-slide`, you can specify which slide to show by number (i.e. 2 will show second slide). This is an observed attribute, which can be set dinamically and tested in dev tools. This attribute is optional.

```html
<ace-carousel id="carousel-3" aria-roledescription="carousel" aria-label="CATrousel" ace-carousel-current-slide="2">
  <div class="ace-carousel-inner">
    <div class="ace-carousel-controls">
      <button ace-carousel-button-previous aria-controls="ace-carousel-slides" aria-label="Previous slide">PREV</button>
      <button ace-carousel-button-next aria-controls="ace-carousel-slides" aria-label="Next slide">NEXT</button>
    </div>
    <div id="ace-carousel-slides" ace-carousel-slides="" aria-live="polite">
      <div ace-carousel-slide="" role="group" aria-roledescription="slide" aria-label="1 of 3">
        <div class="ace-carousel-image">
          <img src="/img/carousel/cat1.jpg" alt="Grumpy cat">
        </div>
        <div class="ace-carousel-caption">
          <p>Slide 1</p>
        </div>
      </div>
      <div ace-carousel-slide="" role="group" aria-roledescription="slide" aria-label="2 of 3">
        <div class="ace-carousel-image">
          <img src="/img/carousel/cat2.jpg" alt="Tabby cat">
        </div>
        <div class="ace-carousel-caption">
          <p>Slide 2</p>
        </div>
      </div>
      <div ace-carousel-slide="" role="group" aria-roledescription="slide" aria-label="3 of 3">
        <div class="ace-carousel-image">
          <img src="/img/carousel/cat3.jpg" alt="British shorthair cat">
        </div>
        <div class="ace-carousel-caption">
          <p>Slide 3</p>
        </div>
      </div>
    </div>
  </div>
</ace-carousel>
```
