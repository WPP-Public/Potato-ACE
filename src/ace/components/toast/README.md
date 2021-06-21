# Toast

A Toast is a component that is used to convey an important message to the user for a short period of time. Toasts do not require user input and disappear after a set period of time. For messages that require user input use the ACE [Modal component](/modal) instead.  

Toast conforms to the [W3C WAI-ARIA authoring practices](http://w3.org/WAI/WCAG21/Techniques/aria/ARIA22.html).


## Setup

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/toast/toast';
```

Alternatively *ace.scss* includes all ACE component SASS files, so if using multiple ACE components it can be imported instead:

```scss
@import '<path-to-node_modules>/@potato/ace/ace';
```

A CSS file is also provided for convenience and is located at `<path-to-node_modules>/@potato/ace/components/toast/ace-toast.css`.

Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/toast/toast';
```

For convenience the ES6 class is exported as `Toast` and the attribute names used by the class are exported as properties of `ATTRS`.

After the event `DOMContentLoaded` is fired on `document` an instance of Toast is instantiated within each `<ace-toast>` element and an ID `ace-toast-<n>` is added for any instance without one, where `<n>` is a unique integer. Once instantiation is complete a custom event `ace-toast-ready` is dispatched on `window`. See the **Custom events** section below for more details.

## Usage

Toasts have an attribute `ace-toast-visible` which is initially set to `false`. This is an observed attribute and therefore dynamically be set to `true` which will cause the Toast to appear for a default show time of 4 seconds before disappearing. Developers can specify a custom show time by setting attribute `ace-toast-show-time` to the value of the show time in milliseconds as demonstrated in the example below.


## Styles

The following SASS is applied to Toast. The SASS variables use `!default` so can also be easily overridden by developers. SASS variables used that are not defined here are defined in *<path-to-node_modules>/@potato/ace/common/constants.scss*.


```scss
@import '../../common/constants';


// VARIABLES
$ace-toast-bg-color: #000 !default;
$ace-toast-border-radius: 8px !default;
$ace-toast-breakpoint: 600px !default;
$ace-toast-distance-from-bottom: 32px !default;
$ace-toast-font-size: 16px !default;
$ace-toast-max-width: 500px !default;
$ace-toast-mobile-max-width: 300px !default;
$ace-toast-padding: 16px !default;
$ace-toast-text-color: #fff !default;


// STYLES
ace-toast {
	background: $ace-toast-bg-color;
	border-radius: $ace-toast-border-radius;
	bottom: $ace-toast-distance-from-bottom;
	color: $ace-toast-text-color;
	font-size: $ace-toast-font-size;
	left: 50%;
	max-width: $ace-toast-mobile-max-width;
	padding: $ace-toast-padding;
	position: fixed;
	transform: translateX(-50%);
	z-index: $ace-toast-z-index;

	&:not([ace-toast-visible]) {
		display: none;
	}

	@media (min-width: $ace-toast-breakpoint) {
		max-width: $ace-toast-max-width;
	}
}
```


## Custom events

Toast uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.


### Dispatched events

The following events are dispatched on `window` by Toast.

#### Ready

`ace-toast-ready`

This event is dispatched when Toast finishes initialising. The event name is available as `EVENTS.OUT.READY` and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Toast [string]
}
```

#### Changed

`ace-toast-changed`

This event is dispatched when Toast visibility changes. The event name is available as `EVENTS.OUT.CHANGED` and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Toast [string]
  'visible': // Whether Toast is visible or not [boolean]
}
```


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.

### Simple Toast and long show time Toast
A Toast with a default 4 second show time and one with a custom 7 second show time. The JavaScript used by this example is shown below.

```html
<button id="simple-toast-btn">Show Toast</button>
<button id="long-show-time-toast-btn">Show Toast with 7 second show time</button>

<ace-toast>
	Toast with standard 4 second show time
</ace-toast>

<ace-toast ace-toast-show-time="7000">
	Toast with developer-defined 7 second show time
</ace-toast>
```

```js
import { ATTRS } from '/ace/components/toast/toast.js';

document.addEventListener('DOMContentLoaded', () => {
	const toastEl = document.getElementById('ace-toast-1');
	const secondToastEl = document.getElementById('ace-toast-2');
	const showToastBtn = document.getElementById('simple-toast-btn');
	const showSecondToastBtn = document.getElementById('long-show-time-toast-btn');

	showToastBtn.addEventListener('click', () => toastEl.setAttribute(ATTRS.VISIBLE, ''));
	showSecondToastBtn.addEventListener('click', () => secondToastEl.setAttribute(ATTRS.VISIBLE, ''));
});
```

### Multiple Toasts at the same time

All Toasts occupy the same fixed position at the bottom of the viewport window. Developers should therefore add a way of dealing with multiple Toasts appearing at the same time if this is a possibility. An example of how this can be achieved using JavaScript is shown below.

```html
<button id="show-1st-toast-btn">Show first Toast</button>
<button id="show-2nd-toast-btn">Show second Toast</button>
<button id="show-3rd-toast-btn">Show third Toast</button>
<ace-toast>
	First Toast
</ace-toast>
<ace-toast>
	Second Toast
</ace-toast>
<ace-toast>
	Third Toast
</ace-toast>
```

```js
import { ATTRS } from '/ace/components/toast/toast.js';

document.addEventListener('DOMContentLoaded', () => {
	const firstToastId = 'ace-toast-3';
	const secondToastId = 'ace-toast-4';
	const thirdToastId = 'ace-toast-5';
	const firstToastEl = document.getElementById(firstToastId);
	const secondToastEl = document.getElementById(secondToastId);
	const thirdToastEl = document.getElementById(thirdToastId);

	const positionToast = (toastEl) => {
		const TOAST_GAP = 10;
		let offsetTopOfHighestToast;
		const visibleToasts = document.querySelectorAll(`[${ATTRS.VISIBLE}]`);

		visibleToasts.forEach((visibleToast, index) => {
			const visibleToastOffsetTop = visibleToast.offsetTop;

			if (index === 0) {
				offsetTopOfHighestToast = visibleToastOffsetTop;
				return;
			}

			if (visibleToastOffsetTop < offsetTopOfHighestToast) {
				offsetTopOfHighestToast = visibleToastOffsetTop;
			}
		});
		toastEl.style.bottom = visibleToasts.length ? `${window.innerHeight - offsetTopOfHighestToast + TOAST_GAP}px` : '';
	};

	window.addEventListener('click', (e) => {
		const targetId = e.target.id;
		let toastEl;
		toastEl = targetId === 'show-1st-toast-btn' ? firstToastEl : toastEl;
		toastEl = targetId === 'show-2nd-toast-btn' ? secondToastEl : toastEl;
		toastEl = targetId === 'show-3rd-toast-btn' ? thirdToastEl : toastEl;

		if (!toastEl) {
			return;
		}

		positionToast(toastEl);
		toastEl.setAttribute(ATTRS.VISIBLE, '');
	});
});
```
