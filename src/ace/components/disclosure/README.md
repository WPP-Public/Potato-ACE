# Disclosure

Disclosure is a component whose visibility can be changed using trigger buttons and custom events. Disclosure conforms to the [W3C WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure).


## Instantiation

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/disclosure/disclosure'
```


Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/disclosure/disclosure';
```

For the sake of convenience the ES6 class is exported as `Disclosure`. To avoid name clashes the `as` keyword can be used when importing, e.g. `import Disclosure as aceDisclosure from ...`. The attribute names used by the class are also exported as properties of `ATTRS`.

After `DOMContentLoaded` is fired, Disclosure automatically instantiates an instance of itself within each `ace-disclosure` element. Disclosure then adds an ID `ace-disclosure-<n>` for any instance without one, where `<n>` is the instance number. Once instantiation is complete a custom event `ace-disclosure-ready` is dispatched on `window`. See the **Custom events** section below for more details.

Disclosures are hidden by default but can be initially shown by adding the `ace-disclosure-visible="true"` attribute to it. The attribute `ace-disclosure-trigger-for=<disclosure-id>` should be added to triggering elements, where `<disclosure-id>` is that of the Disclosure to be triggered. For accessibility reasons it is recommended that only `<button>`s are used for triggers. Disclosures can also be triggered using custom events, as described in the **Custom events** section below.

Triggers will by default toggle the visibiility of the Disclosure, but the `ace-disclosure-show-trigger` or `ace-disclosure-hide-trigger` attribute can be added to the trigger to ensure that it only shows or hides its Disclosure respectively.


## Styles

The following SASS is applied to the component, each declaration of which can be overridden by a single class selector.

```scss
[ace-disclosure-visible="false"] {
  display: none;
}
```


## Custom events

Disclosure uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.

### Dispatched events

The following events are dispatched on `window` by Disclosure.

#### Ready

`ace-disclosure-ready`

This event is dispatched when Disclosure finishes initialising. The event name is available as `EVENTS.OUT.READY`, and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Disclosure [string]
}
```


#### Changed

`ace-disclosure-changed`

This event is dispatched when Disclosure's visibility changes. The event name is available as `EVENTS.OUT.CHANGED`, and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Disclosure [string]
  'visible': // Whether the Disclosure is visible or not [boolean]
}
```

### Listened for events

Disclosure listens for the following events, which should be dispatched by the user's code on the specific `ace-disclosure` element.


#### Hide, Show and Toggle

`ace-disclosure-hide`, `ace-disclosure-show` & `ace-disclosure-toggle`

These events should be dispatched to hide, show and toggle Disclosure respectively. The event names are available as `EVENTS.IN.HIDE`, `EVENTS.IN.SHOW` & `EVENTS.IN.TOGGLE`.


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.


### Simple Disclosure

This is a simple button triggered Disclosure.

```html
<button ace-disclosure-trigger-for="ace-disclosure-1">
  Disclosure toggle
</button>
<hr>
<ace-disclosure id="ace-disclosure-1">
  <h2>Disclosure heading</h2>
  <p>Disclosure content</p>
  <img src="/img/logo.svg" width="50px" alt="Potato logo"/>
</ace-disclosure>
```


### Initially visible Disclosure

In this example Disclosure 1 is initially hidden, whereas Disclosure 2 is initially visible as it has the attribute `ace-disclosure-visible="true"`.

```html
<button ace-disclosure-trigger-for="basic-disclosure">
  Disclosure 1 toggle trigger 1
</button>
<button ace-disclosure-trigger-for="basic-disclosure">
  Disclosure 1 toggle trigger 2
</button>
<button ace-disclosure-trigger-for="initially-visible-disclosure">
  Disclosure 2 toggle trigger
</button>
<button ace-disclosure-trigger-for="initially-visible-disclosure" ace-disclosure-trigger-show>
  Disclosure 2 show trigger
</button>
<button ace-disclosure-trigger-for="initially-visible-disclosure" ace-disclosure-trigger-hide>
  Disclosure 2 hide trigger
</button>
<hr>
<ace-disclosure id="basic-disclosure">
  <h2>Disclosure 1</h2>
  <p>This Disclosure is initially hidden.</p>
</ace-disclosure>

<ace-disclosure ace-disclosure-visible="true" id="initially-visible-disclosure">
  <h2>Disclosure 2</h2>
  <p>This Disclosure is initially visible becasue it has the attribute <code>ace-disclosure-visible="true"</code>.</p>
</ace-disclosure>
```


### Custom event triggered Disclosure

Example of Disclosure controlled through custom events. The buttons in this example are **not** trigger buttons and instead dispatch the Disclosure's custom events. This implementation is only for demonstration purposes and trigger buttons should have the `ace-disclosure-trigger-for` attribute instead. The extra JavaScript code required by this example is also included below.

```html
<button id="custom-events-show-btn">
  Show disclosure using custom event
</button>
<button id="custom-events-hide-btn">
  Hide disclosure using custom event
</button>
<button id="custom-events-toggle-btn">
  Toggle disclosure using custom event
</button>
<hr>
<ace-disclosure id="custom-events-disclosure">
  <h2>Custom event Disclosure</h2>
  <p>This Disclosure's visibility is controlled using custom events.</p>
</ace-disclosure>
```

```js
import {EVENTS} from '/ace/components/disclosure/disclosure.js';

document.addEventListener('DOMContentLoaded', () => {
  const disclosureEl = document.getElementById('custom-events-disclosure');
  window.addEventListener('click', (e) => {
    const customEventHideBtnClicked = e.target.closest('#custom-events-hide-btn');
    const customEventShowBtnClicked = e.target.closest('#custom-events-show-btn');
    const customEventToggleBtnClicked = e.target.closest('#custom-events-toggle-btn');

    if (!customEventToggleBtnClicked && !customEventShowBtnClicked && !customEventHideBtnClicked) {
      return;
    }

    let eventType = EVENTS.IN.TOGGLE;
    if (customEventShowBtnClicked) {
      eventType = EVENTS.IN.SHOW;
    }
    if (customEventHideBtnClicked) {
      eventType = EVENTS.IN.HIDE;
    }

    disclosureEl.dispatchEvent(new CustomEvent(eventType));
  });
});
```
