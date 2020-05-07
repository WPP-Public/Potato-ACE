# Disclosure

Disclosure is a compoent whose visibility can be changed using trigger buttons. Disclosure conforms to W3C WAI-ARIA authoring practices specified [here](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure).


## Instantiation

Import the Disclosure class:

```js
import Disclosure from '@potato/asce/components/disclosure/disclosure';
```

The attribute names used by the class are also exported as properties of `ATTRS`. To avoid name clashes the `as` keyword can be used when importing, e.g. `import Disclosure as aceDisclosure from ...`.

After `DOMContentLoaded` is fired, Disclosure automatically instantiates an instance of itself within each `<asce-disclosure></asce-disclosure>` and adds IDs in the format `asce-disclosure-(n)` to any instances without one, where `(n)` is the instance count.

Disclosures are hidden by default but can be initially shown by adding the `asce-disclosure-visible="true"` attribute to it. The attribute `asce-disclosure-trigger-for=<disclosure-id>` should be added to triggering elements, where `<disclosure-id>` is that of the Disclosure to be triggered. For accessibility reasons it is recommended that only `<button>`s are used for triggers. Disclosures can also be triggered using custom events, as described in the **Custom events** section below.

Triggers will by default toggle the visibiility of the Disclosure, but the `asce-disclosure-show-trigger` or `asce-disclosure-hide-trigger` attribute can be added to the trigger to ensure that it only shows or hides its Disclosure respectively.


## SASS

The following SASS is applied to the component, each declaration of which can be overridden by a single class selector.

```scss
[asce-disclosure-visible="false"] {
  display: none;
}
```


## Custom events

Disclosure uses the following custom events, the names of which are exported as properties of `EVENTS`, similar to `ATTRS`, so they may be imported into other modules and dispatched or listened for.


### Changed

`asce-disclosure-changed`

This event is dispatched when a Disclosure visibility is changed and its `detail` object is composed as follows:

```js
'detail': {
  'id': // ID of Disclosure
  'visible': // The new value of the Disclosure's `asce-disclosure-visible` attribute, as a boolean
}
```


### Hide, Show and Toggle

`asce-disclosure-hide`, `asce-disclosure-show` & `asce-disclosure-toggle`

A Disclosure listens for these events then hides, shows or toggles itself respectively. These events should be dispatched on `window` and the `detail` object should be composed as follows:

```js
'detail': {
  'id': // ID of Disclosure
}
```


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as ASCE components may alter their HTML when they initialise.


### Button triggered Disclosures

In this example Disclosure 1 is initially hidden, whereas Disclosure 2 is initially visible as it has the attribute `asce-disclosure-visible="true"`.

```html
<button asce-disclosure-trigger-for="disclosure-1">
  Disclosure 1 Toggle 1
</button>
<button asce-disclosure-trigger-for="disclosure-1">
  Disclosure 1 Toggle 2
</button>
<button asce-disclosure-trigger-for="disclosure-2">
  Disclosure 2 Toggle
</button>
<button asce-disclosure-trigger-for="disclosure-2" asce-disclosure-trigger-show>
  Disclosure 2 Show
</button>
<button asce-disclosure-trigger-for="disclosure-2" asce-disclosure-trigger-hide>
  Disclosure 2 Hide
</button>
<br><br>
<asce-disclosure id="disclosure-1">
  <div>
    Disclosure 1 - Initially hidden diclosure.
  </div>
</asce-disclosure>

<asce-disclosure id="disclosure-2" asce-disclosure-visible="true">
  <div>
    Disclosure 2 - Initially visible diclosure.
  </div>
</asce-disclosure>
```


### Custom event triggered Disclosure

Example of Disclosure controlled through custom events. The buttons in this example are **not** trigger buttons and instead dispatch the Disclosure's custom events. The extra JavaScript code to achieve this is also included below. This implementation is only for demonstration purposes and trigger buttons should have the `asce-disclosure-trigger-for` attribute instead.

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
<asce-disclosure id="custom-event-triggered-disclosure">
  <h1>Disclosure</h1>
  <p>Disclosure toggled using custom events.</p>
</asce-disclosure>
```

```js
import Disclosure, {EVENTS} from '../../asce/components/disclosure/disclosure.js';


document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('click', (e) => {
    const customEventHideBtnClicked = e.target.closest('#custom-event-hide-btn');
    const customEventShowBtnClicked = e.target.closest('#custom-event-show-btn');
    const customEventToggleBtnClicked = e.target.closest('#custom-event-toggle-btn');
    let showDisclosure = null;

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
