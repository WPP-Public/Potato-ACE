# Tooltip

A Tooltip is a hidden component that contains information related to a target element, which becomes visible when the target receives keyboard focus, the mouse hovers over the target, or a user touches the target on a touch screen device for a short period of time.

Tooltip conforms to the [W3C WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#tooltip).


## Set up

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/tooltip/tooltip';
```

Alternatively *ace.scss* includes all ACE component SASS files, so if using multiple ACE components it can be imported instead:

```scss
@import '<path-to-node_modules>/@potato/ace/ace';
```

A CSS file is also provided for convenience and is located at `<path-to-node_modules>/@potato/ace/components/tooltip/ace-tooltip.css`.

Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/tooltip/tooltip';
```

For convenience the ES6 class is exported as `Tooltip` and the attribute names used by the class are exported as properties of `ATTRS`.

After the event `DOMContentLoaded` is fired on `document` an instance of Tooltip is instantiated within each `<ace-tooltip>` element and an ID `ace-tooltip-<n>` is added for any instance without one, where `<n>` is a unique integer. Once instantiation is complete a custom event `ace-tooltip-ready` is dispatched on `window`. See the **Custom events** section below for more details.

Tooltip must be a child of its target element and will add attribute `ace-tooltip-target` to it as well as set the value of its `aria-labelledby` or `aria-describedby` to the Tooltip's ID based on whether the Tooltip contains primary or supplimentary information. Tooltip content is considered primary information if its target does not have attributes `aria-label` nor `aria-labelledby`, nor text content, thus the value of the target element's `aria-labelledby` attribute is set to the Tooltip ID. Otherwise the Tooltip content is considered suplimentary information and its ID is set as the value of the target element's `aria-describedby` attribute instead.

A Tooltip can only be added to a target element that can receive keyboard focus, otherwise it would be inaccessible to keyboard users. Furthermore, Tooltips can not be used with elements that have the HTML `disabled` attribute as they are not focusable nor do they fire the mouse events needed to show and hide them upon hover. If the Tooltip's purpose is to explain why an element is disabled then developers are strongly advised to use a different technique to convey this information to the user. If however this is an unavoidable requirement it is advised that the `disabled` attribute not be used and instead the target should be styled using CSS to look disabled, while explaining in the Tooltip text that the target is disabled and why. See the **Disabled Tooltip target** example below for a demo of this.

Tooltips appear after a short delay, the default value of which is 1 second, however developers can provide a custom delay time in milliseconds as the value of attribute `ace-tooltip-delay`. To prevent the text content of a Tooltip from wrapping onto multiple lines the attribute `ace-tooltip-nowrap` can be added to it. Wide Tooltips with long text strings prevent themselved from overflowing outside the viewport by aligning themselves to the left or right edge of their target as appropriate. See the **Non-wrapping Toooltips** example below for a demo of this. If there is no space in the viewport below a Tooltip's target it will appear above it.


## Usage

Tooltips are initially hidden and become visible when the target receives keyboard focus, the mouse hovers over the target, a user touches the target on a touch screen device for a short period of time, or due to a dispatched custom event. They are hidden again once the target loses keyboard focus, the mouse pointer leaves the target, <kbd>Escape</kbd> is pressed while the target is focused or due to a dispatched custom event. Tooltips can be disabled entrely by adding the `disabled` attribute to them, preventing them from becoming visible. 

Note that the keydown event for <kbd>Escape</kbd> is prevented from bubbling using [Event.stopPropagation](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) to prevent undesired side effects such as closing a Modal the Tooltip target is in.


## Styles

The following SASS is applied to Tooltip. The SASS variables use `!default` so can also be easily overridden by developers. SASS variables used that are not defined here are defined in *<path-to-node_modules>/@potato/ace/common/constants.scss*.


```scss
@import '../../common/constants';


// VARIABLES
$ace-tooltip-base-transform: translateX(-50%) !default;
$ace-tooltip-bg-color: #000 !default;
$ace-tooltip-gap: 10px !default;
$ace-tooltip-padding: 4px 8px !default;
$ace-tooltip-text-color: #fff !default;


// STYLES
[ace-tooltip-target] {
	position: relative;
}

ace-tooltip {
	background-color: $ace-tooltip-bg-color;
	color: $ace-tooltip-text-color;
	left: 50%;
	margin-bottom: $ace-tooltip-gap;
	margin-top: $ace-tooltip-gap;
	padding: $ace-tooltip-padding;
	pointer-events: none;
	position: absolute;
	top: 100%;
	transform: $ace-tooltip-base-transform;
	z-index: $ace-tooltip-list-z-index;

	&:not([ace-tooltip-visible]) {
		visibility: hidden;
	}

	&[ace-u-float-right],
	&[ace-u-float-left] {
		transform: translateX(0);
	}

	&[ace-u-float-above] {
		bottom: 100%;
		top: initial;
	}

	&[ace-u-float-left] {
		left: initial;
		right: 0;
	}

	&[ace-u-float-right] {
		left: 0;
		right: initial;
	}
}

[ace-tooltip-nowrap] {
	white-space: nowrap;
}
```


## Custom events

Tooltip uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.


### Dispatched events

The following events are dispatched on `window` by Tooltip.


#### Ready

`ace-tooltip-ready`

This event is dispatched when Tooltip finishes initialising. The event name is available as `EVENTS.OUT.READY` and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Tooltip [string]
}
```

#### Changed

`ace-tooltip-changed`

This event is dispatched when Tooltip visibility changes. The event name is available as `EVENTS.OUT.CHANGED` and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Tooltip [string]
  'visible': // Whether the Tooltip is visible or not [boolean]
}
```


### Listened for events

Tooltip listens for the following events, which should be dispatched on the specific `ace-tooltip` element.

#### Show and hide

`ace-tooltip-show` & `ace-tooltip-hide` 

These events should be dispatched to show and hide the Tooltip. The event names are available as `EVENTS.IN.SHOW` and `EVENTS.IN.HIDE`:


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.


### Simple Tooltips

Examples of simple Tooltips for:

1. A target link with text content with the Tooltip providing suplimentary information.
1. A target button with attribute `aria-label` with the Tooltip providing suplimentary information.
1. A target button with attribute `aria-labelledby` with the Tooltip providing suplimentary information.
1. A target button without attributes `aria-label` nor `aria-labelledby`, and without text content, with the Tooltip acting as a label.

```html
<a href="#">
	Tooltip target
	<ace-tooltip>Tooltip with supplimentary text</ace-tooltip>
</a>

<hr>

<button aria-label="Tooltip target label">
	<img src="/img/clipboard.svg" aria-hidden="true" width="24px">
	<ace-tooltip>Tooltip with supplimentary text</ace-tooltip>
</button>

<hr>

<label id="tooltip-target-label">Tooltip target label</label><br>
<button aria-labelledby="tooltip-target-label">
	<img src="/img/clipboard.svg" aria-hidden="true" width="24px">
	<ace-tooltip>Tooltip with supplimentary text</ace-tooltip>
</button>

<hr>

<button>
	<img src="/img/clipboard.svg" aria-hidden="true" width="24px">
	<ace-tooltip>Tooltip acting as target label</ace-tooltip>
</button>
```


### Non-wrapping Tooltips

These Tooltips have attribute `ace-tooltip-nowrap` that keeps their text on a single line. They are also wide enough to overflow outside the viewport if centered, to demonstrate how Tooltips automatically avoid this by aligning themselves to the left or right edge of their target as appropriate. To view this example properly use a viewport width between 720px and 1023px.

```html
<div style="display: flex; justify-content: space-between;">
	<button>
		Tooltip target
		<ace-tooltip ace-tooltip-nowrap>A wide Tooltip with non-wrapping text that demonstrates how automatic overflow
			handling works</ace-tooltip>
	</button>
	<button>
		Tooltip target
		<ace-tooltip ace-tooltip-nowrap>A wide Tooltip with non-wrapping text that demonstrates how automatic overflow
			handling works</ace-tooltip>
	</button>
	<button>
		Tooltip target
		<ace-tooltip ace-tooltip-nowrap>A wide Tooltip with non-wrapping text that demonstrates how automatic overflow
			handling works</ace-tooltip>
	</button>
</div>
```


### Tooltips with custom delay times

In this example the first Tooltip has a custom delay of 2 seconds while the second has no delay.

```html
<button>
	Tooltip target
	<ace-tooltip ace-tooltip-delay="2000">Tooltip text</ace-tooltip>
</button>

<button>
	Tooltip target
	<ace-tooltip ace-tooltip-delay="0">Tooltip text</ace-tooltip>
</button>
```


### Disabled Tooltip target

Tooltips are not compatible with disabled targets as they are not focusable nor do they dispatch the mouse events required by Tooltip. This example shows a possible way of showing a Tooltip with a button that does not have the `disabled` attribute but is instead styled to look disabled as a workaround. Developers are advised against using this anti-pattern and to instead convey this information in another way. The example is provided only for situations where such functionality is unavoidable. Custom styles have been applied to this example and are shown below.

```html
<button class="disabled">
	Tooltip target
	<ace-tooltip ace-tooltip-nowrap>This button is disabled until all required form fields are completed</ace-tooltip>
</button>
```

```scss
.disabled {
	background: rgba(#eee, .4);
	border: none;
	color: rgba(0, 0, 0, .4);
	cursor: not-allowed;
	padding: 4px 8px;
}
```

### Tooltip controlled using custom events

The first two buttons in this example dispatch the `ace-tooltip-show` and `ace-tooltip-hide` events that show and hide the Tooltip. The JavaScript used by this example is shown below.

```html
<button id="show-tooltip-btn">Show Tooltip</button>
<button id="hide-tooltip-btn">Hide Tooltip</button>

<hr>

<button>
	Tooltip target
	<ace-tooltip id="custom-events-tooltip">Tooltip text</ace-tooltip>
</button>
```

```js
import { EVENTS } from '/ace/components/tooltip/tooltip.js';

document.addEventListener('DOMContentLoaded', () => {
	const tooltipEl = document.getElementById('custom-events-tooltip');

	window.addEventListener('click', (e) => {
		const targetId = e.target.id;
		if (targetId === 'show-tooltip-btn' || targetId === 'hide-tooltip-btn') {
			tooltipEl.dispatchEvent(new CustomEvent(EVENTS.IN[`${targetId === 'show-tooltip-btn' ? 'SHOW' : 'HIDE'}`]));
		}
	});
});
```


### Styled Tooltip

An example of how Tooltip can be styled to resemble a commonly used design. Custom styles have been applied to this example and are shown below. To view this example properly use a viewport width between 720px and 1023px.

```html
<div style="display: flex; justify-content: space-between;">
	<button>
		Tooltip target
		<ace-tooltip ace-tooltip-nowrap class="styled-tooltip">
			Tooltip with dummy text to demonstrate how they can be styled
		</ace-tooltip>
	</button>
	<button>
		Tooltip target
		<ace-tooltip ace-tooltip-nowrap class="styled-tooltip">
			Tooltip with dummy text to demonstrate how they can be styled
		</ace-tooltip>
	</button>
	<button>
		Tooltip target
		<ace-tooltip ace-tooltip-nowrap class="styled-tooltip">
			Tooltip with dummy text to demonstrate how they can be styled
		</ace-tooltip>
	</button>
</div>
```

```scss
.styled-tooltip {
	$arrow-size: 12px;

	border-radius: 4px;
	font-family: 'Roboto', sans-serif;
	font-size: 14px;
	font-weight: 500;
	margin: 16px 0;
	opacity: 0;
	padding: 8px 10px;
	transition: opacity .25s;

	&,
	&::before {
		background-color: #232f34;
	}

	&[ace-tooltip-visible] {
		opacity: 1;
	}

	&::before {
		bottom: calc(100% - (#{$arrow-size} / 2));
		content: '';
		height: $arrow-size;
		left: 50%;
		position: absolute;
		transform: translateX(-50%) rotate(45deg);
		width: $arrow-size;
		z-index: 9;
	}

	&[ace-u-float-above]::before {
		bottom: calc(-#{$arrow-size} / 2);
	}

	&[ace-u-float-right]::before {
		left: calc(#{$arrow-size} + 8px);
	}

	&[ace-u-float-left]::before {
		left: unset;
		right: $arrow-size;
	}
}
```
