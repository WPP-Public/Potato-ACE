# Accordion

Accordion is a component consisting of vertically stacked sections of content that can be shown or hidden or using trigger buttons, commonly used to reduce the need to scroll when presenting multiple sections of content on a single page.

Accordion conforms to the [W3C WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion).


## Set up

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/accordion/accordion';
```

Alternatively *ace.scss* includes all ACE component SASS files, so if using multiple ACE components it can be imported instead:

```scss
@import '<path-to-node_modules>/@potato/ace/ace';
```

A CSS file is also provided for convenience and is located at `<path-to-node_modules>/@potato/ace/components/accordion/ace-accordion.css`.

Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/accordion/accordion';
```

For convenience the ES6 class is exported as `Accordion` and the attribute names used by the class are exported as properties of `ATTRS`.

After the event `DOMContentLoaded` is fired on `document` an instance of Accordion is instantiated within each `<ace-accordion>` element and an ID `ace-accordion-<n>` is added for any instance without one, where `<n>` is a unique integer. Once instantiation is complete a custom event `ace-accordion-ready` is dispatched on `window`. See the **Custom events** section below for more details.

For each section of content Accordion requires a descendant **panel** and a corresponding descendant **header** that in turn contains a child **trigger**. The number of headers, triggers and panels must be the same. Having said this, Accordions can be initalised with none of these, which can instead be added later and initialised by dispatching a custom event. See the **Custom events** section below for more details.

Accordion headers must be HTML heading elements, i.e. `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>` or`<h6>` and of the same type, e.g. all `<h3>`. Accordion will use all heading elements with attribute `ace-accordion-header` as long as they are of the same type. If no descendant heading elements have this attribute then all descendant heading elements will be used as headers, as long as they are of the same type, and given this attribute.

Each header must have only a single child element that must also be a `<button>`, which will be used as the trigger and given the attribute `ace-accordion-trigger`. Accordion must have a corresponding panel for each trigger element and will use any descendants with attribute `ace-accordion-panel`. If no descendants have this attribute then all non-heading child elements will be used as panels and given this attribute.

## Usage

The visibility of a panel can be toggled by clicking on it's corresponding trigger button and by default multiple panels can be visible at the same time. Adding attribute `ace-accordion-one-visible-panel` to the Accordion ensures that only one panel is visible at a time and showing one panel will hide the currently visible panel. By default Accordion initialises with all panels hidden but setting attribute `ace-accordion-panel-visible` to `true` on a panel will make that panel visible upon page load.

## Animating panels

Since animations can be achieved using many different methods Accordion does not animate the showing and hiding of panels. Developers interested in doing so can listen for the `ace-carousel-panel-visibility-changed` custom event and then apply their own animations, as demonstrated in one of the examples below.

In order to implement animations without hindering accessibility developers must hide non-visible panels from screen readers and remove their focusable decendants from the tab sequence after the animation ends, both of which can be achieved by applying CSS declaration `display: none` or `visibility: hidden` to them. Furthermore, animations should not be shown to users that have requested the operating system minimise the amount of non-essential motion it uses. To acheive this developers can make use of the [`prefers-reduced-motion` media query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) as demonstrated in the example.


## Styles

The following SASS is applied to Accordion.


```scss
[ace-accordion-trigger] {
	width: 100%;
}

[ace-accordion-panel]:not([ace-accordion-panel-visible]) {
	display: none;
}
```


## Custom events

Accordion uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.


### Dispatched events

The following events are dispatched on `window` by Accordion.


#### Ready

`ace-accordion-ready`

This event is dispatched when Accordion finishes initialising just after page load, and after dynamically added descendants are initialised in response to the `ace-accordion-update` custom event being dispatched. The event name is available as `EVENTS.OUT.READY` and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Accordion [string]
}
```

#### Panel visibility changed

`ace-accordion-changed`

This event is dispatched when a panel's visiblity changes. The event name is available as `EVENTS.OUT.CHANGED` and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Accordion [string]
  'panelNumber': // The number of the panel that changed [number]
  'panelVisible': // Whether the panel is now visible or not [boolean]  
}
```

### Listened for events

Accordion listens for the following events, which should be dispatched on the specific `ace-accordion` element.

#### Show, hide and toggle panel

`ace-accordion-show-panel`, `ace-accordion-hide-panel` & `ace-accordion-toggle-panel`

These events should be dispatched to show, hide and toggle the visibility of a panel. The event names are available as `EVENTS.IN.SHOW_PANEL`, `EVENTS.IN.HIDE_PANEL` and `EVENTS.IN.TOGGLE_PANEL`,  and their `detail` properties should be composed as follows:

```js
'detail': {
  'panelNumber': // The number of the panel to change the visibility of [number]
}
```

#### Show and hide all panels

`ace-accordion-show-panels` &  `ace-accordion-hide-panels`

These events should be dispatched to show and hide all panels. The event names are available as `EVENTS.IN.SHOW_PANELS` and  `EVENTS.IN.HIDE_PANELS`.

#### Update

`ace-accordion-update`

This event should be dispatched when headers, triggers and panels are added or removed and causes Accordion to initialise them and then dispatch the `ace-accordion-ready` event. The event name is available as `EVENTS.IN.UPDATE`.


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.

### Simple Accordion

Example of a simple Accordion with 3 panels.

```html
<ace-accordion>
	<h3>
		<button>Trigger 1</button>
	</h3>
	<div>
		<p>Panel 1 content</p>
	</div>
	<h3>
		<button>Trigger 2</button>
	</h3>
	<div>
		<p>Panel 2 content</p>
	</div>
	<h3>
		<button>Trigger 3</button>
	</h3>
	<div>
		<p>Panel 3 content</p>
	</div>
</ace-accordion>
```

### One visible panel Accordion with initially visible second panel

This Accordion will show the second panel upon page load as it has the attribute `ace-accordion-panel-visible` with value `true`. The Accordion also has the attribute `ace-accordion-one-visible-panel` so only one panel is visible at a time and showing a panel will hide the currently visible panel.

```html
<ace-accordion ace-accordion-one-visible-panel id="one-visible-panel-accordion">
	<h3>
		<button>Trigger 1</button>
	</h3>
	<div>
		<p>Panel 1 content</p>
	</div>
	<h3>
		<button>Trigger 2</button>
	</h3>
	<div ace-accordion-panel-visible="true">
		<p>Panel 2 content</p>
	</div>
	<h3>
		<button>Trigger 3</button>
	</h3>
	<div>
		<p>Panel 3 content</p>
	</div>
</ace-accordion>
```

### Animated Accordion

Example of how an Accordion can be animated. Custom styles have been applied to this example and are shown below.

Note that this method should only be used if the panels are of the same or similar heights. The reason for this is that the height transitions from 0px to `max-height` over the transition duration time, therefore `max-height` must be set to a value that allows the tallest panel to be visible. If one panel is significantly taller than the others the shorter panels have less to reveal during the transition which will therefore seem to take less time than expected as when the panel is fully visible the transition is still ongoing until `max-height` reaches the value given.

```html
<ace-accordion ace-accordion-one-visible-panel class="animated-accordion" id="animated-accordion" >
	<h3>
		<button>Trigger 1</button>
	</h3>
	<div>
		<p>Panel 1 content</p>
		<img src="/img/logo.svg" height="100px" alt="Potato logo"/>
	</div>
	<h3>
		<button>Trigger 2</button>
	</h3>
	<div>
		<p>Panel 2 content</p>
		<img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone"/>
	</div>
	<h3>
		<button>Trigger 3</button>
	</h3>
	<div>
		<p>Panel 3 content</p>
		<img src="/img/goggles-spuddy.png" height="100px" alt="Potato Spuddy with virtual reality goggles"/>
	</div>
</ace-accordion>
```

```scss
.animated-accordion {
	@media (prefers-reduced-motion: no-preference) {
		$trans-duration: .2s;

		[ace-accordion-panel] {
			display: block;
			max-height: 0;
			overflow: hidden;
			transition: max-height $trans-duration ease-out, visibility 0s linear $trans-duration;
			visibility: hidden;
		}

		[ace-accordion-panel-visible] {
			max-height: 180px;
			transition: max-height $trans-duration ease-in;
			visibility: visible;
		}
	}
}
```

### Accordion controlled through custom events

The JavaScript used by this example is shown below.

```html
<label>
	Panel number:
	<input id="panel-number" type="number" min="1" max="3" />
</label>
<button id="toggle-panel-btn">Toggle panel</button>
<button id="show-panel-btn">Show panel</button>
<button id="hide-panel-btn">Hide panel</button>
<hr>
<button id="show-panels-btn">Show all panels</button>
<button id="hide-panels-btn">Hide all panels</button>
<hr>
<button id="append-panel-btn">Append panel</button>
<button id="remove-panel-btn">Remove first panel</button>
<hr>

<ace-accordion id="custom-events-accordion">
	<h3>
		<button>Trigger 1</button>
	</h3>
	<div>
		<p>Panel 1 content</p>
	</div>
	<h3>
		<button>Trigger 2</button>
	</h3>
	<div>
		<p>Panel 2 content</p>
	</div>
	<h3>
		<button>Trigger 3</button>
	</h3>
	<div>
		<p>Panel 3 content</p>
	</div>
</ace-accordion>

```

```js
import {ATTRS, EVENTS} from '/ace/components/accordion/accordion.js';

document.addEventListener('DOMContentLoaded', () => {
	const accordionEl = document.getElementById('custom-events-accordion');

	window.addEventListener('click', (e) => {
		let customEvent;
		const targetId = e.target.id;
		switch(targetId) {
			case 'hide-panel-btn':
			case 'show-panel-btn':
			case 'toggle-panel-btn': {
				const panelNumber = document.getElementById('panel-number').value;
				if (targetId === 'toggle-panel-btn') {
					customEvent = EVENTS.IN.TOGGLE_PANEL;
				} else {
					customEvent = EVENTS.IN[`${targetId === 'hide-panel-btn' ? 'HIDE' : 'SHOW'}_PANEL`];
				}
				accordionEl.dispatchEvent(new CustomEvent(customEvent, {
					'detail': {
						'panelNumber': panelNumber,
					}
				}));
				break;
			}
			case 'show-panels-btn':
			case 'hide-panels-btn': {
				customEvent = EVENTS.IN[`${targetId === 'hide-panels-btn' ? 'HIDE' : 'SHOW'}_PANELS`];
				accordionEl.dispatchEvent(new CustomEvent(customEvent));
				break;
			}
			case 'append-panel-btn': {
				const newTriggerEl = document.createElement('button');
				newTriggerEl.textContent = 'Dynamically added trigger';
				const newHeaderEl = document.createElement('h3');
				newHeaderEl.setAttribute(ATTRS.HEADER, '');
				newHeaderEl.append(newTriggerEl);

				const newPanelP = document.createElement('p');
				newPanelP.textContent = `Dynamically added panel`;
				const newPanelEl = document.createElement('div');
				newPanelEl.setAttribute(ATTRS.PANEL, '');
				newPanelEl.append(newPanelP);

				accordionEl.append(newHeaderEl);
				accordionEl.append(newPanelEl);
				accordionEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE));
				break;
			}
			case 'remove-panel-btn': {
				const headerEl = accordionEl.querySelector(`[${ATTRS.HEADER}]`);
				const panelEl = accordionEl.querySelector(`[${ATTRS.PANEL}]`);
				accordionEl.removeChild(headerEl);
				accordionEl.removeChild(panelEl);
				accordionEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE));
				break;
			}
		}
	});
});
```


### Styled Accordion

An example of how Accordion can be styled to resemble a commonly used design. Custom styles have been applied to this example and are shown below.

```html
<h2>Potato</h2>
<p>Things we do at Potato:</p>

<ace-accordion class="styled-accordion">
	<h3 class="styled-accordion__header">
		<button class="styled-accordion__trigger">
			Making new tech count
		</button>
	</h3>
	<div class="styled-accordion__panel">
		<div class="styled-accordion__panel-inner">
			<p>
				It’s the positive and transformative effects of technology that matter, not the technology itself.
			</p>
			<p>
				<a href="https://p.ota.to/work/making-new-tech-count" target="_blank">
					Find out more
				</a>
			</p>
			<img src="/img/logo.svg" height="100px" alt="Potato logo"/>
		</div>
	</div>
	<h3 class="styled-accordion__header">
		<button class="styled-accordion__trigger">
			Making digital for real life
		</button>
	</h3>
	<div class="styled-accordion__panel">
		<div class="styled-accordion__panel-inner">
			<p>
				People value digital products that enhance their lives and positively complement their interactions with the world.
			</p>
			<p>
				<a href="https://p.ota.to/work/making-digital-for-real-life" target="_blank">
					Find out more
				</a>
			</p>
			<img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone"/>
		</div>
	</div>
	<h3 class="styled-accordion__header">
		<button class="styled-accordion__trigger">
			Building for people first
		</button>
	</h3>
	<div class="styled-accordion__panel">
		<div class="styled-accordion__panel-inner">
			<p>
				Gaining direct insight through testing products with people is the fundamental requirement to make things better.
			</p>
			<p>
				<a href="https://p.ota.to/work/building-for-people-first" target="_blank">
					Find out more
				</a>
			</p>
			<img src="/img/goggles-spuddy.png" height="100px" alt="Potato Spuddy with virtual reality goggles"/>
		</div>
	</div>
</ace-accordion>
```

```scss
.styled-accordion {
	$trans-duration: .2s;

	border: 1px solid black;
	border-radius: 10px;
	display: block;
	max-width: 500px;
	overflow: hidden;

	&__header {
		margin: 0;

		&:not(:first-child) {
			border-top: 1px solid black;
		}
	}

	&__trigger {
		background: #41354d;
		border: 0;
		color: #fff;
		display: flex;
		font-weight: 600;
		justify-content: space-between;
		padding: 20px;
		width: 100%;

		&::after {
			content: '\25BC';

			@media (prefers-reduced-motion: no-preference) {
				transition: transform $trans-duration linear;
			}
		}

		&[aria-expanded="true"] {
			&::after {
				transform: rotate(180deg);
			}
		}
	}

	&__panel {
		@media (prefers-reduced-motion: no-preference) {
			max-height: 0;
			overflow: hidden;
			transition: max-height $trans-duration ease-out, visibility 0s linear $trans-duration;
			visibility: hidden;

			&:not([ace-accordion-panel-visible]) {
				display: block;
			}
		}
	}

	[ace-accordion-panel-visible] {
		@media (prefers-reduced-motion: no-preference) {
			max-height: 300px;
			transition: max-height $trans-duration ease-in;
			visibility: visible;
		}
	}

	&__panel-inner {
		padding: 10px 20px;
	}
}
```
