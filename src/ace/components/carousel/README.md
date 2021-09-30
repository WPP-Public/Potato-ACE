# Carousel

Carousel is a set of slides, only one of which is displayed at a time, and buttons used to display the previous or next slide.

Carousel conforms to [W3C's WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#carousel).


## Set up

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/carousel/carousel';
```

Alternatively *ace.scss* includes all ACE component SASS files, so if using multiple ACE components it can be imported instead:

```scss
@import '<path-to-node_modules>/@potato/ace/ace';
```

A CSS file with the component styles is also provided for convenience and is located at `<path-to-node_modules>/@potato/ace/components/carousel/ace-carousel.css`.

Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/carousel/carousel';
```

For convenience the ES6 class is exported as `Carousel` and the attribute names used by the class are exported as properties of `ATTRS`.

After the event `DOMContentLoaded` is fired on `document` an instance of Carousel is instantiated within each `<ace-carousel>` element and an ID `ace-carousel-<n>` is given to any instance without one, where `<n>` is a unique integer. Once instantiation is complete the **Ready** custom event is dispatched.

It is strongly recommended that Carousel be provided with an accessible label using `aria-label` or `aria-labelledby`. The word "carousel" should not be included in the label as Carousel has `aria-roledescription="carousel"` which is read out by screen readers.

Carousels can periodically display the next slide if given the attribute `ace-carousel-auto-slide-show`. This makes the Carousel to change the slide every 5 seconds, however developers can provide a custom interval time in milliseconds as the value of attribute `ace-carousel-auto-slide-show-time`. The automatic slide show can be stopped or started using a required, descendant toggle button, or by custom events. Automatic Carousels must have a descendant button to stop and start the automatic slide show, which for better accessibility must be the first focusable descendant. Automatic Carousels will therefore use the first decendant `<button>` for this and give it the attribute `ace-carousel-auto-slide-show-btn`. This button will be given an `aria-label` "Stop automatic slide show" or "Start automatic slide show" when the automatic slide show is running or not respectively. Developers can provide custom or localised strings as values of Carousel attributes `ace-carousel-stop-auto-slide-show-label` and `ace-carousel-start-auto-slide-show-label`.

All Carousels must have descendant buttons to display the previous and next slide and will use `<button>` elements with attributes `ace-carousel-prev-btn` and `ace-carousel-next-btn` respectively. For better accessibility these buttons should be the first and second focusable descendants, or second and third focusable descendants for automatic Carousels, even if they are to be displayed on the left and right of the carousel, as is common practice, with their positioning set using CSS. If no descendants have these attributes then the first and second, or second and third for automatic Carousels, decendant `<button>` elements will be used and given these attributes. The previous slide button will be given an aria-label of value `Go to previous slide`, or `Go to last slide` if the Carousel is infinite and the first slide is visible. Developers can however provide custom or localised strings as values of attributes `ace-carousel-go-to-prev-slide-label` and `ace-carousel-go-to-last-slide-label` respectively, set on the button. Similarly, the next slide button will be given an aria-label of value `Go to next slide`, or `Go to first slide` if the Carousel is infinite and the last slide is visible. Developers can however provide custom or localised strings as values of attributes `ace-carousel-go-to-next-slide-label` and `ace-carousel-go-to-first-slide-label` respectively, set on the button.

A set of slide picker buttons, used to select each slide, can be added to Carousel by including an element with attribute `ace-carousel-slide-picker` and a descendant `<button>` for each slide. Alternatively, this element can be added with no descendant `button` elements and Carousel will populate it with a button for each slide. Carousel adds `aria-label` attributes to each slide picker button in the format `Slide n`, where `n` is the slide number. To allow for more approprite or localised strings, the string `Slide` can be replaced in the `aria-label` of all slide picker buttons with the value of the attribute `ace-carousel-slide-picker-btn-aria-label-prefix` of the element with attribute `ace-carousel-slide-picker`. It is strongly recommended that the slide picker follow the previous and next slide buttons in DOM hierarchy and therefore in tab sequence. This order should be used even if the slide picker buttons are to be displayed below or overlayed on top of the slides in which case their positioning should be set using CSS. For accessibility purposes Carousel buttons that are styled by developers and overlayed on top of the slides must use colors that provides sufficient contrast so they are clearly visible.

All Carousel slides must be descendant within an element with attribute `ace-carousel-slides`. If no descendant has this attribute, the first child `<div>` will be used if present, otherwise Carousel will append a child `<div>` to itself and use it. Slides do not have to be present upon instantiation and can be dynamically added, or removed later, as long as the **Update slides** custom event is dispatched afterwards. Carousel adds `aria-label` attributes to each slide in the format `n of N`, where `n` is the slide number and `N` is the total number of slides. To allow for localised strings, the string `of` can be replaced with the value of the attribute `ace-carousel-slide-aria-label-infix` of the element with attribute `ace-carousel-slides`.

## Usage

A Carousel displayed slide can be changed using the previous and next slide buttons, using custom events, or by changing the value of its attribute `ace-carousel-selected-slide` to the slide's number e.g. `2` will display the second slide and `3` the third. This attribute can be set before instantiation to display a specific slide on page load, but if omitted Carousel will add it and set its value to `1` thereby displaying the first slide. The attribute's value is also dynamically updated when the displayed slide is changed using the other methods.

By default the previous and next slide buttons are disabled when the first and last slide is displayed respectively. Giving a Carousel the attribute `ace-carousel-infinite` allows infinite rotation through slides where clicking the previous button with the first slide displayed will display the last, and clicking the next button with the last slide displayed will display the first. This is an observed attribute that can be added or removed to dynamically enable or disable this behaviour.

For automatic Carousels the automatic slide show is paused while the mouse pointer hovers over the Carousel or while a Carousel instance descendant, other than the automatic slide show toggle button, has keyboard focus, and automatically resumes afterwards. The automatic slide show will not start on page load if the page is hidden, i.e. it's in a background tab or the window is minimised, and will start as soon as the page becomes visible. It will also pause if the page becomes hidden at any point and will resume once the page is visible again.

The automatic slide show can be stopped and started again using the automatic slide show toggle button or using custom events, with both methods setting Carousel attribute `ace-carousel-auto-slide-show-stopped` to `true` or `false`. This attribute can therefore be used to change the text string or icon of the toggle button simply using CSS. Note that this attribute will have value `false` while the Carousel is temporarily paused due to mouse hover or descendant keyboard focus.


## Animating slide changes

Since animations can be achieved using many different methods Carousel does not animate slide changes. Developers interested in doing so can listen for the **Slide Changed** custom event and then apply their own animations, as demonstrated in one of the examples below.

In order to implement animations without hindering accessibility developers must hide non-selected slides from screen readers and remove their focusable decendants from the tab sequence after the animation ends, both of which can be achieved by applying CSS declaration `display: none` or `visibility: hidden` to them. Furthermore, animations should not be shown to users that have requested the operating system minimise the amount of non-essential motion it uses. To acheive this developers can make use of the [`prefers-reduced-motion` media query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) as demonstrated in the example.


## Styles

The following SASS is applied to Carousel. SASS variables used that are not defined here are defined in *<path-to-node_modules>/@potato/ace/common/constants.scss*.

```scss
@import '../../common/constants';


// VARIABLES
$ace-carousel-slide-picker-btn-size: 12px !default;
$ace-carousel-slide-picker-btn-spacing: $ace-spacing-1 !default;


// STYLES
ace-carousel {
	display: block;
}

[ace-carousel-slide]:not([ace-carousel-slide-selected]) {
	display: none;
}

[ace-carousel-slide-picker-btn] {
	height: $ace-carousel-slide-picker-btn-size;
	margin: 0 calc(#{$ace-carousel-slide-picker-btn-spacing} / 2);

	&[aria-selected="true"] {
		background-color: $ace-color-selected;
		border-style: inset;
	}
}
```


## Custom events

Carousel uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.


### Dispatched events

The following events are dispatched to `window` by Carousel.

#### Ready

`ace-carousel-ready`

This event is dispatched when Carousel finishes initialising just after page load, and after dynamically added descendants are initialised in response to the **Update slides** custom event being dispatched. The event name is available as `EVENTS.OUT.READY` and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Carousel [string]
}
```

#### Slide changed

`ace-carousel-slide-changed`

This event is dispatched when the displayed slide is changed. The event name is available as `EVENTS.OUT.SELECTED_SLIDE_CHANGED` and its `detail` property is composed as follows:


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

Carousel listens for the following events, which should be dispatched to `window`.


#### Set previous slide

`ace-carousel-set-prev-slide`

This event should be dispatched to display the previous slide, or the last slide if the Carousel has the attribute `ace-carousel-infinite` and its first slide is displayed. The event name is available as `EVENTS.IN.SET_PREV_SLIDE` and its `detail` property should be composed as follows:

```js
'detail': {
  'id': // ID of target Carousel [string]
}
```


#### Set next slide

`ace-carousel-set-next-slide`

This event should be dispatched to display the next slide, or the first slide if the Carousel has the attribute `ace-carousel-infinite` and its the last slide is displayed. The event name is available as `EVENTS.IN.SET_NEXT_SLIDE` and its `detail` property should be composed as follows:

```js
'detail': {
  'id': // ID of target Carousel [string]
}
```


#### Update slides

`ace-carousel-update-slides`

This event should be dispatched when slides are added or removed and causes Carousel to initialise them and then dispatch the **Ready** event. The event name is available as `EVENTS.IN.UPDATE_SLIDES` and its `detail` property should be composed as follows:

```js
'detail': {
  'id': // ID of target Carousel [string]
}
```

#### Automatic slide show events

`ace-carousel-start-auto-slide-show` & `ace-carousel-stop-auto-slide-show`

These event should be dispatched to start or stop the automatic slide show respectively. The event names are available as `EVENTS.IN.START_AUTO_SLIDE_SHOW` and `EVENTS.IN.STOP_AUTO_SLIDE_SHOW` and their `detail` properties should be composed as follows:

```js
'detail': {
  'id': // ID of target Carousel [string]
}
```

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


### Carousel controlled using custom events

The buttons in this example dispatch the **Set previous slide**, **Set next slide** and **Update slides** custom events to `window`. The JavaScript used by this example is shown below.

```html
<p>These buttons dispatch custom events</p>
<button id="prev-slide-btn">Prev slide</button>
<button id="next-slide-btn">Next slide</button>
<button id="add-slide-btn">Add slide to end</button>
<button id="remove-slide-btn">Remove last slide</button>
<hr>
<ace-carousel aria-label="Custom events" id="custom-events-carousel">
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
	const CAROUSEL_ID = 'custom-events-carousel';
	const carouselEl = document.getElementById(CAROUSEL_ID);
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
		window.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_SLIDES, {
			'detail': {
				'id': CAROUSEL_ID,
			}
		}));
	};

	window.addEventListener('click', (e) => {
		const targetId = e.target.id;
		switch(targetId) {
			case 'next-slide-btn': {
				window.dispatchEvent(new CustomEvent(EVENTS.IN.SET_NEXT_SLIDE, {
					'detail': {
						'id': CAROUSEL_ID,
					}
				}));
				break;
			}
			case 'prev-slide-btn': {
				window.dispatchEvent(new CustomEvent(EVENTS.IN.SET_PREV_SLIDE, {
					'detail': {
						'id': CAROUSEL_ID,
					}
				}));
				break;
			}
			case 'add-slide-btn':
			case 'remove-slide-btn':
				if (targetId === 'add-slide-btn') {
					addSlide();
				} else {
					slidesWrapper.removeChild(slidesWrapper.lastElementChild);
				}
				window.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_SLIDES, {
					'detail': {
						'id': CAROUSEL_ID,
					}
				}));
				break;
		}
	});
});
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

### Carousel with slide picker

Carousel with slide picker buttons and automatic slide show. 

```html
<ace-carousel aria-label="Slide picker" id="slide-picker-carousel">
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


### Carousel with automatic slide show

Carousel with automatic slide show. Two buttons have also been included, which dispatch the **Start auto slide show** and **Stop auto slide show** custom events. The JavaScript used by this example is shown below.

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

window.addEventListener('click', (e) => {
	const targetId = e.target.id;
	switch(targetId) {
		case 'start-auto-slide-show-custom-event-btn':
		case 'stop-auto-slide-show-custom-event-btn': {
			const event = targetId === 'start-auto-slide-show-custom-event-btn' ?
				EVENTS.IN.START_AUTO_SLIDE_SHOW :
				EVENTS.IN.STOP_AUTO_SLIDE_SHOW;
			window.dispatchEvent(new CustomEvent(event, {
				'detail': {
					'id': 'auto-carousel',
				}
			}));
			break;
		}
	}
});
```


### Animated Carousel

Example of Carousel with animated slide changes. Custom styles have been applied to this example and are shown below. The JavaScript used by this example is shown below.

```html
<ace-carousel ace-carousel-infinite aria-label="Animated" id="animated-carousel" class="animated-carousel">
	<button>Previous slide</button>
	<button>Next slide</button>
	<div class="animated-carousel__slides">
		<div class="animated-carousel__slide">
			<h3>Slide 1 heading</h3>
			<button>Button</button>
			<a href="#">Link</a>
			<p>Slide 1 content.</p>
			<img src="/img/logo.svg" height="100px" alt="Potato logo" />
		</div>
		<div class="animated-carousel__slide">
			<h3>Slide 2 heading</h3>
			<button>Button</button>
			<a href="#">Link</a>
			<p>Slide 2 content.</p>
			<img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone" />
		</div>
		<div class="animated-carousel__slide">
			<h3>Slide 3 heading</h3>
			<button>Button</button>
			<a href="#">Link</a>
			<p>Slide 3 content.</p>
			<img src="/img/goggles-spuddy.png" height="100px" alt="Potato Spuddy with virtual reality goggles" />
		</div>
	</div>
</ace-carousel>
```

```scss
@media (prefers-reduced-motion: no-preference) {
	.animated-carousel {
		&__slides {
			display: flex;
			overflow-x: hidden;
		}

		&__slide {
			flex-shrink: 0;
			width: 100%;

			&--hidden {
				visibility: hidden;
			}

			&:not([ace-carousel-slide-selected]) {
				display: block;
			}
		}
	}
}
```

```js
import { ATTRS, EVENTS } from '/ace/components/carousel/carousel.js';

document.addEventListener('DOMContentLoaded', () => {
	// If user prefers reduced motion then do not animate
	if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
		return;
	}

	const CAROUSEL_ID = 'animated-carousel';
	const carouselEl = document.getElementById(CAROUSEL_ID);
	const carouselSlidesEl = carouselEl.querySelector(`[${ATTRS.SLIDES}]`);
	const carouselSlideEls = carouselEl.querySelectorAll(`[${ATTRS.SLIDE}]`);
	const slidesEdges = [];
	let selectedSlideIndex = +carouselEl.getAttribute(ATTRS.SELECTED_SLIDE) - 1;
	let scrollTimeout;

	// Hide non-selected slides on page load
	carouselSlideEls.forEach((slide, i) => {
		if (i === selectedSlideIndex) {
			return;
		}
		slide.setAttribute('aria-hidden', 'true');
		slide.classList.add(`${CAROUSEL_ID}__slide--hidden`);
	});

	// Store left edge x-coordinates of slides on page load and resize
	const getSlidesEdges = () => {
		carouselSlideEls.forEach((slide, i) => slidesEdges[i] = slide.offsetLeft - carouselSlidesEl.offsetLeft);
	};
	window.addEventListener('load', getSlidesEdges);
	window.addEventListener('resize', getSlidesEdges, { passive: true });

	// Start animation when slide changes
	window.addEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, (e) => {
		if (!e.detail || e.detail.id !== CAROUSEL_ID) {
			return;
		}
		clearTimeout(scrollTimeout);
		selectedSlideIndex = e.detail.currentlySelectedSlide - 1;
		carouselSlideEls.forEach((slide) => {
			// Prevent non-selected slides from being announced by screen reader due to aria-live="polite" on carouselSlidesEl
			slide.setAttribute('aria-hidden', 'true');
			slide.classList.remove(`${CAROUSEL_ID}__slide--hidden`);
		});
		carouselSlidesEl.scrollTo({ behavior: 'smooth', left: slidesEdges[selectedSlideIndex] });
	});

	// Hide non-selected slides when scrolling finishes
	carouselSlidesEl.addEventListener('scroll', () => {
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			carouselSlideEls.forEach((slide, i) => {
				if (i === selectedSlideIndex) {
					slide.removeAttribute('aria-hidden');
					return;
				}
				slide.classList.add(`${CAROUSEL_ID}__slide--hidden`);
			});
		}, 100);
	}, { passive: true });
});
```


### Styled Carousel

An example of how Carousel can be styled to resemble a commonly used design. Custom styles have been applied to this example and are shown below. The JavaScript used by this example is shown below.

```html
<ace-carousel ace-carousel-auto-slide-show ace-carousel-infinite aria-label="Styled example" id="styled-carousel"
	class="styled-carousel">
	<button class="styled-carousel__auto-slide-show-btn"><span class="play-icon">&#9658;</span><span
			class="pause-icon">&#10074; &#10074;</span></button>
	<button class="styled-carousel__slide-btn styled-carousel__slide-btn--prev">&#10094;</button>
	<button class="styled-carousel__slide-btn styled-carousel__slide-btn--next">&#10095;</button>
	<div ace-carousel-slide-picker class="styled-carousel__slide-picker"></div>
	<div class="styled-carousel__slides">
		<div class="styled-carousel__slide">
			<h3>Slide 1 heading</h3>
			<button>Button</button>
			<p>Slide 1 content.</p>
			<img src="/img/logo.svg" height="100px" alt="Potato logo" />
		</div>
		<div class="styled-carousel__slide">
			<h3>Slide 2 heading</h3>
			<button>Button</button>
			<p>Slide 2 content.</p>
			<img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone" />
		</div>
		<div class="styled-carousel__slide">
			<h3>Slide 3 heading</h3>
			<button>Button</button>
			<p>Slide 3 content.</p>
			<img src="/img/goggles-spuddy.png" height="100px" alt="Potato Spuddy with virtual reality goggles" />
		</div>
	</div>
</ace-carousel>
```

```scss
.styled-carousel {
	color: #fff;
	max-width: 600px;
	position: relative;

	&__auto-slide-show-btn,
	&__slide-btn {
		background: transparent;
		border: 2px solid #fff;
		border-radius: 50%;
		color: inherit;
		cursor: pointer;
		height: 45px;
		margin: 8px;
		position: absolute;
		width: 45px;

		&:focus,
		&:hover {
			background: #00bed0;
		}

		&:focus {
			outline: none;
		}
	}

	&[ace-carousel-auto-slide-show-stopped="true"] .pause-icon,
	&[ace-carousel-auto-slide-show-stopped="false"] .play-icon {
		display: none;
	}

	&__slide-btn {
		border-radius: 50%;
		font-size: 24px;
		top: 50%;
		transform: translateY(-50%);

		&--next {
			right: 0;
		}
	}

	&__slide-picker {
		bottom: 0;
		left: 50%;
		position: absolute;
		transform: translateX(-50%);
	}

	[ace-carousel-slide-picker-btn] {
		$slide-picker-btn-diameter: 10px;

		background-color: transparent;
		border: 2px solid transparent;
		border-radius: 50%;
		cursor: pointer;
		height: $slide-picker-btn-diameter * 2.5;
		margin: 0;
		position: relative;
		width: $slide-picker-btn-diameter * 2.5;

		&:active,
		&:focus {
			border-color: #fff;
			outline: none;
		}

		&::after {
			border: 1px solid #fff;
			border-radius: 50%;
			content: '';
			height: $slide-picker-btn-diameter;
			left: 50%;
			position: absolute;
			top: 50%;
			transform: translate(-50%, -50%);
			width: $slide-picker-btn-diameter;
		}

		&:hover::after {
			background: #00bed0;
		}

		&[aria-selected="true"]::after {
			background-color: #fff;
		}
	}

	&__slide {
		padding: 50px 80px 30px;

		$bg-colors: #173d57, #66204a, #20122e;
		@for $i from 1 through length($bg-colors) {
			&:nth-of-type(#{$i}) {
				background: nth($bg-colors, $i);
			}
		}
	}

	// Animation styles
	@media (prefers-reduced-motion: no-preference) {
		&__slides {
			display: flex;
			overflow-x: hidden;
		}

		&__slide {
			flex-shrink: 0;
			width: 100%;

			&--hidden {
				visibility: hidden;
			}

			&:not([ace-carousel-slide-selected]) {
				display: block;
			}
		}
	}
}
```

```js
import { ATTRS, EVENTS } from '/ace/components/carousel/carousel.js';

document.addEventListener('DOMContentLoaded', () => {
	// If user prefers reduced motion then do not animate
	if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
		return;
	}

	const CAROUSEL_ID = 'styled-carousel';
	const carouselEl = document.getElementById(CAROUSEL_ID);
	const carouselSlidesEl = carouselEl.querySelector(`[${ATTRS.SLIDES}]`);
	const carouselSlideEls = carouselEl.querySelectorAll(`[${ATTRS.SLIDE}]`);
	const slidesEdges = [];
	let selectedSlideIndex = +carouselEl.getAttribute(ATTRS.SELECTED_SLIDE) - 1;
	let scrollTimeout;

	// Hide non-selected slides on page load
	carouselSlideEls.forEach((slide, i) => {
		if (i === selectedSlideIndex) {
			return;
		}
		slide.setAttribute('aria-hidden', 'true');
		slide.classList.add(`${CAROUSEL_ID}__slide--hidden`);
	});

	// Store left edge x-coordinates of slides on page load and resize
	const getSlidesEdges = () => {
		carouselSlideEls.forEach((slide, i) => slidesEdges[i] = slide.offsetLeft - carouselSlidesEl.offsetLeft);
	};
	window.addEventListener('load', getSlidesEdges);
	window.addEventListener('resize', getSlidesEdges, { passive: true });

	// Start animation when slide changes
	window.addEventListener(EVENTS.OUT.SELECTED_SLIDE_CHANGED, (e) => {
		if (!e.detail || e.detail.id !== CAROUSEL_ID) {
			return;
		}
		clearTimeout(scrollTimeout);
		selectedSlideIndex = e.detail.currentlySelectedSlide - 1;
		carouselSlideEls.forEach((slide) => {
			// Prevent non-selected slides from being announced by screen reader due to aria-live="polite" on carouselSlidesEl
			slide.setAttribute('aria-hidden', 'true');
			slide.classList.remove(`${CAROUSEL_ID}__slide--hidden`);
		});
		carouselSlidesEl.scrollTo({ behavior: 'smooth', left: slidesEdges[selectedSlideIndex] });
	});

	// Hide non-selected slides when scrolling finishes
	carouselSlidesEl.addEventListener('scroll', () => {
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			carouselSlideEls.forEach((slide, i) => {
				if (i === selectedSlideIndex) {
					slide.removeAttribute('aria-hidden');
					return;
				}
				slide.classList.add(`${CAROUSEL_ID}__slide--hidden`);
			});
		}, 100);
	}, { passive: true });
});
```
