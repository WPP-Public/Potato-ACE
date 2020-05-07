<!-- TODO: Replace 'Template', 'TEMPLATE' and 'template' with actual values -->
# Template

<!-- DESCRIBE COMPONENT AND ITS FUNCTIONALITY HERE -->

<!-- TODO: Replace '<w3c-component-name>' -->
Template conforms to W3C WAI-ARIA authoring practices specified [here](https://www.w3.org/TR/wai-aria-practices-1.1/#<w3c-component-name>).


## Instantiation

Import the Template class:

```js
import Template from '@potato/asce/components/template/template';
```

To avoid name clashes the `as` keyword can be used when importing, e.g. `import Listbox as aceListbox from ...`.
<!-- TODO: If no ATTRS are exported then remove following sentence -->
The attribute names used by the class are also exported as properties of `ATTRS`.

After `DOMContentLoaded` is fired, Template automatically instantiates an instance of itself within each `<asce-template></asce-template>` and adds IDs in the format `asce-template-(n)` to any instances without one, where `(n)` is the instance count.


## Usage

<!-- ADD USAGE AND INTERACTION INSTRUCTIONS HERE -->



## SASS

The following SASS is applied to the component, each declaration of which can be overridden by a single class selector. <!-- TODO: If no SASS variables used remove following sentence --> The SASS variables use `!default` so can also be easily overridden by users. 

```scss
```


## Custom events
<!-- TODO: If only one event used remove plural -->
<!-- TODO: Remove or keep 'dispatched' and 'listened for' as appropriate -->
Template uses the following custom events, the names of which are exported as properties of `EVENTS`, similar to `ATTRS`, so they may be imported into other modules and dispatched or listened for.


<!-- TODO: Replace 'Event name' with a descriptive name -->
### Event name

<!-- TODO: Replace 'template-event-name' with actual value -->
`asce-template-event-name`

<!-- DESCRIBE EVENT HERE AND SPECIFY IF ITS DISPATCHED OR LISTENED FOR -->

<!-- DESCRIBE EACH PROPERTY OF THE 'detail' OBJECT -->
<!-- 
```js
'detail': {
  'id': // ID of Template
}
```
-->


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as ASCE components may alter their HTML when they initialise.


<!-- TODO: Replace 'Example' with more descriptive name -->
### Example

<!-- DESCRIBE WHAT THE EXAMPLE SHOWS AND WHY IT SHOULD BE USED THAT WAY HERE -->

<!-- INCLUDE AN EMPTY HTML CODE BLOCK FOR EACH EXAMPLE -->
<!--
```html
```
-->
