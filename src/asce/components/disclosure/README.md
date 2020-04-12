# Disclosure

A Disclosure is a component whose visibility can be toggled using one or more trigger elements.

[W3C WAI-ARIA Spec](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure)


## Usage

Import the component module into your JS entry point:
```js
import { Disclosure as asceDisclosure } from 'asce/components/disclosure/disclosure';
```

Use the `<asce-disclosure></asce-disclosure>` tag in your template, filled with your content, and give it an ID. 
On the trigger elements set the `asce-disclosure-trigger-for` attribute to the ID of the disclosure you wish to trigger. 


## SASS

The following CSS is applied to Discloure components:

```scss
/* STYLES */
[asce-disclosure-visible="false"] {
  display: none;
}
```

## Events

Disclosure uses the following custom events, the names of which are exported as properties of an `EVENTS` object so they can be used when dispatching or listen to these events.


### Toggle event

`asce-disclosure-toggle`

This event is dispatched when disclosure visibility is toggled.

The event `detail` property is composed as follows:
```js
{
  'id': // ID of disclosure
  'trigger': // The trigger clicked
}
```


<!-- | `asce-disclosure-toggle`        | `id` - Disclosure ID | Toggles the disclosure visibility                            |
| `asce-disclosure-opened`        | `id` - Disclosure ID | Dispatched when disclosure is opened                         |
| `asce-disclosure-closed`        | `id` - Disclosure ID | Dispatched when disclosure is closed                         |
| asce-disclosure-update-triggers | `id` - Disclosure ID | triggers an update to get all triggers which control this disclosure (for use when triggers are added dynamically) | -->



## Examples

### Static Disclosure

To trigger a disclosure use a button with the `asce-disclosure-trigger-for` attribute set to the ID of the disclosure:

```html
<button asce-disclosure-trigger-for="disclosure-1">
  Disclosure 1 Trigger 1
</button>
<button asce-disclosure-trigger-for="disclosure-1">
  Disclosure 1 Trigger 2
</button>
<button asce-disclosure-trigger-for="disclosure-2">
  Disclosure 2 Trigger
</button>


<asce-disclosure id="disclosure-1">
  <h1>Disclosure 1</h1>
  <p>Initially hidden diclosure.</p>
</asce-disclosure>

<asce-disclosure id="disclosure-2" asce-disclosure-visible>
  <h1>Disclosure 2</h1>
  <p>Initially visible diclosure.</p>
</asce-disclosure>
```


### Dynamically added trigger

Example of dynamically added trigger

```html
<button id="dynamic-disclosure-btn">
  Toggle disclosure using custom event
</button>

<asce-disclosure id="custom-event-triggered-disclosure">
  <h1>Disclosure</h1>
  <p>Disclosure toggled 'asce-disclosure-toggle' event.</p>
</asce-disclosure>
```
