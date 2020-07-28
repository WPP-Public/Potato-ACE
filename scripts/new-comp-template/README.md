# Template

<!-- DESCRIBE COMPONENT AND ITS FUNCTIONALITY HERE -->

<!-- TODO: Replace '<w3c-component-name>' -->
Template conforms to W3C WAI-ARIA authoring practices specified [here](https://www.w3.org/TR/wai-aria-practices-1.1/#<w3c-component-name>).


## Instantiation

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/template/template'
```


Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/template/template';
```

For the sake of convenience the ES6 class is exported as `TemplatePascal`. To avoid name clashes the `as` keyword can be used when importing, e.g. `import TemplatePascal as aceTemplatePascal from ...`.
<!-- TODO: If no ATTRS are exported then remove following sentence -->
The attribute names used by the class are also exported as properties of `ATTRS`.

After `DOMContentLoaded` is fired, Template automatically instantiates an instance of itself within each `ace-template` element. Template then adds an ID `ace-template-<n>` for any instance without one, where `<n>` is the instance number. Once instantiation is complete a custom event `ace-template-ready` is dispatched on `window`. See the **Custom events** section below for more details.


## Usage

<!-- ADD USAGE AND INTERACTION INSTRUCTIONS HERE -->



## Styles

The following SASS is applied to the component, each declaration of which can be overridden by a single class selector. <!-- TODO: If no SASS variables used remove following sentence --> The SASS variables use `!default` so can also be easily overridden by users.

```scss
```


<!-- TODO: If one event used remove plural from following heading and sentence  -->
## Custom events
<!-- TODO: Remove 'listened for' in following sentence if component only dispatches and does not listen for events -->
Template uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.


### Ready

`ace-template-ready`

This event is dispatched on `window` when Template finishes initialising. The event name is available as the value of the `READY` property of the exported `EVENTS` object, and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Template [string]
}
```

<!-- TODO: Replace 'Listened for event' with a descriptive name -->
### Listened for event

<!-- TODO: Replace 'template-event-name' with actual value -->
`ace-template-event-name`

<!-- DESCRIBE EVENT HERE AND SPECIFY IF ITS DISPATCHED OR LISTENED FOR -->
This event should be dispatched on `window` when <!-- TODO: Describe when event should be dispatched -->, and causes Template to  <!-- TODO: Describe what the event causes template to do -->. The event name is available as the value of the <!-- TODO: Add property containing event name in EVENTS object --> property of the exported `EVENTS` object and its `detail` object should be composed as follows:
<!-- DESCRIBE EACH PROPERTY OF THE 'detail' OBJECT -->

```js
'detail': {
  'id': // ID of Template [string]
}
```


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.


<!-- TODO: Replace 'Example' with more descriptive name -->
### Example

<!-- DESCRIBE WHAT THE EXAMPLE SHOWS AND WHY IT SHOULD BE USED THAT WAY -->

<!-- IF EXAMPLE HAS CUSTOM SASS INCLUDE THIS LINE -->
<!-- Custom styles have been applied to this example using HTML classes and are shown below. -->
<!-- IF EXAMPLE HAS CUSTOM JS INCLUDE THIS LINE -->
<!-- The extra JavaScript required by this example is also shown below. -->

<!-- INCLUDE AN EMPTY HTML CODE BLOCK FOR EACH EXAMPLE -->
```html
```

<!-- IF EXAMPLE HAS CUSTOM STYLES INCLUDE AN EMPTY SCSS CODE BLOCK AS WELL -->
<!--
```scss
```
-->

<!-- IF EXAMPLE HAS CUSTOM JS CODE INCLUDE AN EMPTY JS CODE BLOCK AS WELL -->
<!--
```js
```
-->
