# Disclosure

Disclosure is a component whose visibility is changed using trigger buttons.

Disclosure conforms to the [W3C WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure).


## Set up

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/disclosure/disclosure';
```

Alternatively *ace.scss* includes all ACE component SASS files, so if using multiple ACE components it can be imported instead:

```scss
@import '<path-to-node_modules>/@potato/ace/ace';
```

A CSS file with the component styles is also provided for convenience and is located at `<path-to-node_modules>/@potato/ace/components/disclosure/ace-disclosure.css`.

Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/disclosure/disclosure';
```

For convenience the ES6 class is exported as `Disclosure` and the attribute names used by the class are exported as properties of `ATTRS`.

After the event `DOMContentLoaded` is fired on `document` an instance of Disclosure is instantiated within each `<ace-disclosure>` element and an ID `ace-disclosure-<n>` is given to any instance without one, where `<n>` is a unique integer. Once instantiation is complete the **Ready** custom event is dispatched. See the **Custom events** section below for more details.

## Usage

Disclosures are hidden by default but can be initially shown on page load by adding the `ace-disclosure-visible="true"` attribute to it. The attribute `ace-disclosure-trigger-for` should be added to triggering element and its value set to the ID of the Disclosure to be triggered. For accessibility reasons it is recommended that only `<button>` elements are used for triggers. Disclosures can also be triggered using the **Toggle visibility** custom event. See the **Custom events** section below for more details.

Triggers will by default toggle the visibiility of the Disclosure, but the `ace-disclosure-show-trigger` or `ace-disclosure-hide-trigger` attribute can be added to the trigger to ensure that it only shows or hides its Disclosure respectively.


## Styles

The following SASS is applied to Disclosure.

```scss
ace-disclosure:not([ace-disclosure-visible]) {
	display: none;
}
```


## Custom events

Disclosure uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.

### Dispatched events

The following events are dispatched to `window` by Disclosure.

#### Ready

`ace-disclosure-ready`

This event is dispatched when Disclosure finishes initialising. The event name is available as `EVENTS.OUT.READY` and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Disclosure [string]
}
```


#### Visibility changed

`ace-disclosure-visibility-changed`

This event is dispatched when Disclosure's visibility changes. The event name is available as `EVENTS.OUT.VISIBILITY_CHANGED` and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Disclosure [string]
  'visible': // Whether the Disclosure is visible or not [boolean]
}
```

### Listened for event

Disclosure listens for the following event, which should be dispatched to `window`.


#### Toggle visibility

`ace-disclosure-toggle-visibility`

This event should be dispatched to toggle the visibility of the Disclosure. The event name is available as `EVENTS.IN.TOGGLE_VISIBILITY`and its `detail` property should be composed as follows:
```js
'detail': {
  'id': // ID of target Disclosure [string]
}
```


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.


### Simple Disclosure

This is a simple, button-triggered Disclosure.

```html
<button ace-disclosure-trigger-for="ace-disclosure-1">
	Disclosure toggle
</button>
<hr>
<ace-disclosure id="ace-disclosure-1">
	<h2>Disclosure heading</h2>
	<p>Disclosure content.</p>
	<img src="/img/logo.svg" height="100px" alt="Potato logo" />
</ace-disclosure>
```


### Initially visible Disclosure

In this example Disclosure 1 is initially hidden, whereas Disclosure 2 is initially visible as it has the attribute `ace-disclosure-visible="true"`.

```html
<button ace-disclosure-trigger-for="initially-visible-disclosure">
	Disclosure toggle trigger 1
</button>
<button ace-disclosure-trigger-for="initially-visible-disclosure">
	Disclosure toggle trigger 2
</button>
<button ace-disclosure-trigger-for="initially-visible-disclosure" ace-disclosure-trigger-show>
	Disclosure show trigger
</button>
<button ace-disclosure-trigger-for="initially-visible-disclosure" ace-disclosure-trigger-hide>
	Disclosure hide trigger
</button>
<hr>
<ace-disclosure ace-disclosure-visible id="initially-visible-disclosure">
	<h2>Initially visible disclosure</h2>
	<p>This Disclosure is initially visible because it has the attribute <code>ace-disclosure-visible="true"</code>.</p>
	<img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone" />
</ace-disclosure>
```


### Disclosure controlled using custom event

The button in this example is **not** a trigger button but instead is a button that dispatches the **Toggle visibility** custom event. This implementation is only for demonstration purposes and trigger buttons should have the `ace-disclosure-trigger-for` attribute instead. The JavaScript used by this example is shown below.

```html
<button id="toggle-custom-event-btn">
	Toggle disclosure visibility using custom event
</button>
<hr>
<ace-disclosure id="custom-events-disclosure">
	<h2>Custom event Disclosure</h2>
	<p>This Disclosure's visibility is controlled using custom events.</p>
	<img src="/img/logo.svg" height="100px" alt="Potato logo" />
</ace-disclosure>
```

```js
import { EVENTS } from '/ace/components/disclosure/disclosure.js';

document.addEventListener('DOMContentLoaded', () => {
	const DISCLOSURE_ID = 'custom-events-disclosure';
	const customEventBtn = document.getElementById('toggle-custom-event-btn');

	customEventBtn.addEventListener('click', () => {
		window.dispatchEvent(new CustomEvent(EVENTS.IN.TOGGLE_VISIBILITY, {'detail': {'id': DISCLOSURE_ID}}));
	});
});
```
