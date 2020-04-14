# Disclosure

A disclosure component is one whose visibility can be changed using one or more trigger elements.

[W3C WAI-ARIA Spec](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure)


## Usage

Import the component module into your JS entry point:
```js
import Disclosure from '@potato/asce/components/disclosure/disclosure';
```

The names of the component HTML attributes are exported as properties of an object `ATTRS` so they may be imported. To avoid name clashes you can import using `as`, e.g. `import Disclosure as asceDisclosure from ...`. After `DOMContentLoaded` is fired, the component will automatically initialise an instance of itself within each `<asce-disclosure></asce-disclosure>` tag.

You must add an ID to each disclosure tag for the component to work. Disclosures are hidden by default but can be initially shown by adding the attribute `asce-disclosure-visible="true"` to it.

Add the attribute `asce-disclosure-trigger-for=<disclosure-id>` to each triggering element, replacing `<disclosure-id>` with the ID of the disclosure to be triggered. Only use "clickable" elements like buttons or anchor tags for triggers. Triggers will by default toggle the visibiility of the disclosure, but the `asce-disclosure-show-trigger` or `asce-disclosure-hide-trigger` attributes can be added to the trigger to ensure it only shows or hides its disclosure respectively.


## SASS

The following CSS is applied to discloure components:

```scss
/* STYLES */
[asce-disclosure-visible="false"] {
  display: none;
}
```

## Events

Disclosure uses the following custom events, the names of which are exported as properties of an `EVENTS` object so they can be used when dispatching or listen to the following events.

```js
export const EVENTS = {
  CHANGED: `asce-disclosure-changed`,
  HIDE: `asce-disclosure-hide`,
  SHOW: `asce-disclosure-show`,
  TOGGLE: `asce-disclosure-toggle`,
};
```


### Changed

`asce-disclosure-changed`

This event is dispatched when disclosure visibility is changed.

The event `detail` property is composed as follows:
```js
{
  'id': // ID of disclosure
  'visible': // Whether the disclosure is currently visible or not (boolean)
}
```

### Hide, Show and Toggle

`asce-disclosure-hide`, `asce-disclosure-show` & `asce-disclosure-toggle`

The disclosure component listens for these event and then hides, shows or toggles itself respectively. These events should be dispatched on *window* and contain a `detail` property composed as follows:
```js
{
  'id': // ID of disclosure
}
```



## Examples

### Button triggered disclosures

Disclosures can be triggered with multiple triggers and there can be multiple disclosures on the same page. Disclosure 1 is initially hidden, which is the default behaviour, whereas Disclosure 2 is initially visible as it has the attribute `asce-disclosure-visible="true"`:

```html
<button asce-disclosure-trigger-for="disclosure-1">
  Disclosure 1 Toggle 1
</button>
<button asce-disclosure-trigger-for="disclosure-1">
  Disclosure 1 Toggle 2
</button>
<br>
<button asce-disclosure-trigger-for="disclosure-2">
  Disclosure 2 Toggle
</button>
<button asce-disclosure-trigger-for="disclosure-2" asce-disclosure-trigger-show>
  Disclosure 2 Show
</button>
<button asce-disclosure-trigger-for="disclosure-2" asce-disclosure-trigger-hide>
  Disclosure 2 Hide
</button>


<asce-disclosure id="disclosure-1">
  <h1>Disclosure 1</h1>
  <p>Initially hidden diclosure.</p>
</asce-disclosure>

<asce-disclosure id="disclosure-2" asce-disclosure-visible="true">
  <h1>Disclosure 2</h1>
  <p>Initially visible diclosure.</p>
</asce-disclosure>
```


### Custom event triggered disclosure

Example of disclosure controlled through custom events. The buttons in the example are not trigger buttons and instead dispatch the disclosure component's custom events.

```html
<button id="custom-event-hide-btn">
  Disclosure hide custom event
</button>
<button id="custom-event-show-btn">
  Disclosure show custom event
</button>
<button id="custom-event-toggle-btn">
  Disclosure toggle custom event
</button>

<asce-disclosure id="custom-event-triggered-disclosure">
  <h1>Disclosure</h1>
  <p>Disclosure controlled using custom events.</p>
</asce-disclosure>
```
