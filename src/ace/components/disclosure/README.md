# Disclosure

Disclosure is a component whose visibility can be changed using trigger buttons and custom events. Disclosure conforms to W3C WAI-ARIA authoring practices specified [here](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure).


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


### Ready

`ace-disclosure-ready`

This event is dispatched on `window` when Disclosure finishes initialising. The event name is available as the value of the `READY` property of the exported `EVENTS` object, and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Disclosure [string]
}
```

### Changed

`ace-disclosure-changed`

This event is dispatched when a Disclosure visibility is changed. The event name is available as the value of the `CHANGED` property of the exported `EVENTS` object, and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Disclosure [string],
  'visible': // Whether the Disclosure is visible or not [boolean]
}
```

### Hide, Show and Toggle

`ace-disclosure-hide`, `ace-disclosure-show` & `ace-disclosure-toggle`

These events should be dispatched on `window` to hide, show and toggle Disclosure respectively. The event names are available as the values of the `HIDE`, `SHOW` & `TOGGLE` properties of the exported `EVENTS` object and their `detail` objects should be composed as follows:

```js
'detail': {
  'id': // ID of Disclosure [string]
}
```


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.


### Simple Disclosure

This is a simple button triggered Disclosure.

```html
<button ace-disclosure-trigger-for="disclosure">
  Disclosure Toggle
</button>
<br><br>
<ace-disclosure id="disclosure">
  <h2>Disclosure heading</h2>
  <p>Disclosure content</p>
  <img src="/img/logo.svg" width="50px" alt="potato logo"/>
</ace-disclosure>
```


### Initially visible Disclosure

In this example Disclosure 1 is initially hidden, whereas Disclosure 2 is initially visible as it has the attribute `ace-disclosure-visible="true"`.

```html
<button ace-disclosure-trigger-for="disclosure-1">
  Disclosure 1 Toggle 1
</button>
<button ace-disclosure-trigger-for="disclosure-1">
  Disclosure 1 Toggle 2
</button>
<button ace-disclosure-trigger-for="disclosure-2">
  Disclosure 2 Toggle
</button>
<button ace-disclosure-trigger-for="disclosure-2" ace-disclosure-trigger-show>
  Disclosure 2 Show
</button>
<button ace-disclosure-trigger-for="disclosure-2" ace-disclosure-trigger-hide>
  Disclosure 2 Hide
</button>
<br><br>
<ace-disclosure id="disclosure-1">
  <div>
    Disclosure 1 - Initially hidden diclosure.
  </div>
</ace-disclosure>

<ace-disclosure id="disclosure-2" ace-disclosure-visible="true">
  <div>
    Disclosure 2 - Initially visible diclosure.
  </div>
</ace-disclosure>
```


### Custom event triggered Disclosure

Example of Disclosure controlled through custom events. The buttons in this example are **not** trigger buttons and instead dispatch the Disclosure's custom events. This implementation is only for demonstration purposes and trigger buttons should have the `ace-disclosure-trigger-for` attribute instead. The extra JavaScript code required by this example is also included below.

```html
<button id="custom-event-show-btn">
  Show disclosure using custom event
</button>
<button id="custom-event-hide-btn">
  Hide disclosure using custom event
</button>
<button id="custom-event-toggle-btn">
  Toggle disclosure using custom event
</button>
<br><br>
<ace-disclosure id="custom-event-triggered-disclosure">
  <p>Disclosure toggled using custom events.</p>
</ace-disclosure>
```

```js
import {EVENTS} from '/ace/components/disclosure/disclosure.js';

document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('click', (e) => {
    const customEventHideBtnClicked = e.target.closest('#custom-event-hide-btn');
    const customEventShowBtnClicked = e.target.closest('#custom-event-show-btn');
    const customEventToggleBtnClicked = e.target.closest('#custom-event-toggle-btn');

    if (!customEventToggleBtnClicked && !customEventShowBtnClicked && !customEventHideBtnClicked) {
      return;
    }

    let eventType = EVENTS.TOGGLE;

    if (customEventShowBtnClicked) {
      eventType = EVENTS.SHOW;
    }

    if (customEventHideBtnClicked) {
      eventType = EVENTS.HIDE;
    }

    window.dispatchEvent(new CustomEvent(
      eventType,
      {
        'detail': {
          'id': 'custom-event-triggered-disclosure',
        }
      },
    ));
  });
});
```
