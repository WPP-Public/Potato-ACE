<!-- USE WORD 'developer' TO REFER TO PEOPLE THAT WILL USE THE COMPONENTS TO BUILD SOMETHING, USE WORD 'user' TO REFER TO THE END USER THAT WILL INTERACT WITH WHAT THE DEVELOPER HAS BUILT -->

# Template

<!-- ADD AN OVERVIEW OF COMPONENT AND ITS FUNCTIONALITY HERE -->

<!-- TODO: Replace '<w3c-component-name>' -->Template conforms to the [W3C WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#<w3c-component-name>).


## Setup

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/template/template';
```

Alternatively *ace.scss* includes all ACE component SASS files, so if using multiple ACE components it can be imported instead:

```scss
@import '<path-to-node_modules>/@potato/ace/ace';
```

A CSS file is also provided for convenience and is located at `<path-to-node_modules>/@potato/ace/components/template/ace-template.css`.

Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/template/template';
```

For convenience the ES6 class is exported as `Template` <!-- TODO: If no ATTRS are exported, remove following sentence --> and the attribute names used by the class are exported as properties of `ATTRS`.

After the event `DOMContentLoaded` is fired on `document` an instance of Template is instantiated within each `<ace-template>` element and an ID `ace-template-<n>` is added for any instance without one, where `<n>` is a unique integer. Once instantiation is complete a custom event `ace-template-ready` is dispatched to `window`. See the **Custom events** section below for more details.

<!-- EXPLAIN THE REQUIRED AND RECOMMENDED ATTRIBUTES AND ELEMENTS TO BE PROVIDED BY DEVELOPERS BEFORE INSTANTIATION. STARTING FROM THE COMPONENT ITSELF AND FOLLOWING THE HIERARCHY DESCRIBE: -->

<!-- 1. Required elements that developers must provide before page load. For each, mention the custom attribute it can be given for explicit assignment, and whether this attribute can be omitted and the component can implicitly determine which element to use based on its position in the DOM hierarchy. Example: -->

> Template must have a descendant button to \_\_\_\_\_, and will use a descendant `<button>` with attribute `ace-template-btn`. If no descendant has this attribute then the first descendant `<button>` will be used and given this attribute.

<!-- 2. Elements and/or attributes that developers are strongly advised to provide such as `<label>`, `aria-label` or `aria-labelledby`. -->

> It is strongly recommended that Template be provided with an accessible label using either `aria-label` or `aria-labelledby`.

<!-- 3. Optional elements that can be added dynamically after page load, explaining which custom event is needed to prompt the component to initialise them. -->

## Usage

<!-- EXPLAINING COMPONENT FEATURES AND HOW IT CAN BE INTERACTED WITH. COMPONENT VARIANTS MAY BE BRIEFLY LISTED HERE BUT NOT IN DETAIL AS EACH VARIANT SHOULD HAVE AN EXAMPLE BELOW CONTAINING ALL THE DETAILS -->


## Styles

The following SASS is applied to Template. <!-- TODO: If no SASS variables used remove following sentence --> The SASS variables use `!default` so can also be easily overridden by developers. <!-- TODO: If SASS variable from common/constants.scss file used add the following sentence --> SASS variables used that are not defined here are defined in *<path-to-node_modules>/@potato/ace/common/constants.scss*.


```scss

```


## Custom events

Template uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.


### Dispatched events

The following events are dispatched to `window` by Template.


#### Ready

`ace-template-ready`

This event is dispatched when Template finishes initialising. The event name is available as `EVENTS.OUT.READY` and its `detail` property is composed as follows:

```js
'detail': {
	'id': // ID of Template [string]
}
```


### Listened for events

Template listens for the following events that should be dispatched to `window`.


<!-- TODO: Replace 'Event name' with a descriptive name -->
#### Event name

<!-- TODO: Replace 'event-name' with actual value -->
`ace-template-event-name`

<!-- DESCRIBE EVENT HERE AND SPECIFY IF ITS DISPATCHED OR LISTENED FOR -->
This event should be dispatched to <!-- TODO: Describe what the event causes the instance to do -->. The event name is available as <!-- TODO: Replace <EVENT-NAME> with correct value -->`EVENTS.IN.<EVENT-NAME>`

<!-- TODO: If detail property used add the following and describe each of its properties --> 
and its `detail` property should be composed as follows:

```js
'detail': {
	'id': // ID of target Template [string]
	'prop': // Description of prop [prop type (string/boolean etc.)]
}
```


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.

<!-- TODO: Replace 'Example' with more descriptive name -->

### Example
<!-- DESCRIBE WHAT THE EXAMPLE SHOWS AND WHY IT SHOULD BE USED THAT WAY -->
<!-- IF EXAMPLE HAS CUSTOM SASS INCLUDE THIS LINE -->
<!-- Custom styles have been applied to this example and are shown below. -->
<!-- IF EXAMPLE HAS CUSTOM JS INCLUDE THIS LINE -->
<!-- The JavaScript used by this example is shown below. -->

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
