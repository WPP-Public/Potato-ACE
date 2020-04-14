# Disclosure

A disclosure component is one whose visibility can be changed using one or more trigger elements.

[W3C WAI-ARIA Spec](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure)


## Usage

Import the component module into your JS entry point:
```js
import Disclosure from '@potato/asce/components/disclosure/disclosure';
```

The names of the component HTML attributes are exported as properties of an object `ATTRS` so they may be imported. To avoid name clashes you can import using `as`, e.g. `import Disclosure as asceDisclosure from ...`. After `DOMContentLoaded` is fired, the component will automatically initialise an instance of itself within each `<asce-disclosure></asce-disclosure>` tag.

You must add an ID to each disclosure tag for the component to work. Add the attribute `asce-disclosure-trigger-for=<disclosure-id>` to each triggering element, replacing `<disclosure-id>` with the ID of the disclosure to be triggered. By default triggers will toggle the visibiility of the disclosure, but you can add the attributes `asce-disclosure-show-trigger` or `asce-disclosure-hide-trigger` to ensure the trigger only shows or hides a disclosure respectively.
Disclosures are hidden by default but can be initially shown by adding the attribute `asce-disclosure-visible="true"` to the disclosure.


## SASS

The following CSS is applied to discloure components:

```scss
/* STYLES */
[asce-disclosure-visible="false"] {
  display: none;
}
```

## Events

Disclosure uses the following custom events, the names of which are exported as properties of an `EVENTS` object so they can be used when dispatching or listen to these events.

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

Disclosures can be triggered with multiple triggers and there can be multiple disclosures on the same page. In this example Disclosure 1 is hidden (default behaviour) and Disclosure 2 is shown using `asce-disclosure-visible="true"`:

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
<button asce-disclosure-trigger-for="disclosure-2" asce-disclosure-show-trigger>
  Disclosure 2 Show
</button>
<button asce-disclosure-trigger-for="disclosure-2" asce-disclosure-hide-trigger>
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

Example of dynamically added trigger

```html
<button id="custom-event-hide-btn">
  Hide disclosure using custom event
</button>
<button id="custom-event-show-btn">
  Show disclosure using custom event
</button>
<button id="custom-event-toggle-btn">
  Toggle disclosure using custom event
</button>

<asce-disclosure id="custom-event-triggered-disclosure">
  <h1>Disclosure</h1>
  <p>Disclosure toggled using custom events.</p>
</asce-disclosure>
```
