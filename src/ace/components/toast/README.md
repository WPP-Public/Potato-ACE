<!-- USE WORD 'developer' TO REFER TO PEOPLE THAT WILL USE THE COMPONENTS TO BUILD SOMETHING, USE WORD 'user' TO REFER TO THE END USER THAT WILL INTERACT WITH WHAT THE DEVELOPER HAS BUILT -->

# Toast

<!-- ADD AN OVERVIEW OF COMPONENT AND ITS FUNCTIONALITY HERE -->

<!-- TODO: Replace '<w3c-component-name>' -->Toast conforms to the [W3C WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#<w3c-component-name>).


## Setup

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/toast/toast'
```

Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/toast/toast';
```

For convenience the ES6 class is exported as `Toast` <!-- TODO: If no ATTRS are exported, remove following sentence --> and the attribute names used by the class are exported as properties of `ATTRS`.

After the event `DOMContentLoaded` is fired on `document` an instance of Toast is instantiated within each `<ace-toast>` element and an ID `ace-toast-<n>` is added for any instance without one, where `<n>` is a unique integer. Once instantiation is complete a custom event `ace-toast-ready` is dispatched on `window`. See the **Custom events** section below for more details.

<!-- EXPLAIN THE REQUIRED AND RECOMMENDED ATTRIBUTES AND ELEMENTS TO BE PROVIDED BY DEVELOPERS BEFORE INSTANTIATION. STARTING FROM THE COMPONENT ITSELF AND FOLLOWING THE HIERARCHY DESCRIBE: -->

<!-- 1. Required elements that developers must provide before page load. For each, mention the custom attribute it can be given for explicit assignment, and whether this attribute can be omitted and the component can implicitly determine which element to use based on its position in the DOM hierarchy. Example: -->

> Toast must have a descendant button to \_\_\_\_\_, and will use a descendant `<button>` with attribute `ace-toast-btn`. If no descendant has this attribute then the first decendant `<button>` will be used and given this attribute.

<!-- 2. Elements and/or attributes that developers are strongly advised to provide such as `<label>`, `aria-label` or  or `aria-labelledby`. -->

> It is strongly recommended that Toast be provided with an accessible label using either `aria-label` or `aria-labelledby`.

<!-- 3. Optional elements that can be added dynamically after page load, explaining which custom event is needed to prompt the component to initialise them. -->

## Usage

<!-- EXPLAINING COMPONENT FEATURES AND HOW IT CAN BE INTERACTED WITH. COMPONENT VARIANTS MAY BE BRIEFLY LISTED HERE BUT NOT IN DETAIL AS EACH VARIANT SHOULD HAVE AN EXAMPLE BELOW CONTAINING ALL THE DETAILS -->


## Styles

The following SASS is applied to Toast. <!-- TODO: If no SASS variables used remove following sentence --> The SASS variables use `!default` so can also be easily overridden by developers. <!-- TODO: If SASS variable from common/constants.scss file used add the following sentence --> SASS variables used that are not defined here are defined in *<path-to-node_modules>/@potato/ace/common/constants.scss*.


```scss
@import '../../common/constants';


/* VARIABLES */
$ace-toast-bg-color: #000 !default;
$ace-toast-border-radius: 8px !default;
$ace-toast-breakpoint: 600px !default;
$ace-toast-distance-from-bottom: 32px !default;
$ace-toast-font-size: 16px !default;
$ace-toast-max-width: 500px !default;
$ace-toast-mobile-max-width: 300px !default;
$ace-toast-padding: 16px !default;
$ace-toast-text-color: #fff !default;


/* STYLES */
ace-toast {
  background: $ace-toast-bg-color;
  border-radius: $ace-toast-border-radius;
  bottom: $ace-toast-distance-from-bottom;
  color: $ace-toast-text-color;
  font-size: $ace-toast-font-size;
  left: 50%;
  max-width: $ace-toast-mobile-max-width;
  padding: $ace-toast-padding;
  position: fixed;
  transform: translateX(-50%);
  z-index: $ace-toast-z-index;

  @media (min-width: $ace-toast-breakpoint) {
    max-width: $ace-toast-max-width;
  }

  &:not([ace-toast-visible="true"]) {
    display: none;
  }
}
```


## Custom events

Toast uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.


### Dispatched events

The following events are dispatched on `window` by Toast.


#### Ready

`ace-toast-ready`

This event is dispatched when Toast finishes initialising. The event name is available as `EVENTS.OUT.READY` and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Toast [string]
}
```


### Listened for events

Toast listens for the following events, which should be dispatched on the specific `ace-toast` element.


<!-- TODO: Replace 'Event name' with a descriptive name -->
#### Event name

<!-- TODO: Replace 'event-name' with actual value -->
`ace-toast-event-name`

<!-- DESCRIBE EVENT HERE AND SPECIFY IF ITS DISPATCHED OR LISTENED FOR -->
This event should be dispatched to <!-- TODO: Describe what the event causes the instance to do -->. The event name is available as  <!-- TODO: Replace <EVENT-NAME> with correct value -->`EVENTS.IN.<EVENT-NAME>`

<!-- TODO: If detail property used add the following and describe each of its properties --> 
and its `detail` property should be composed as follows:

```js
'detail': {
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
<!-- OR -->
<!-- Custom styles that mimic Google Material Design have been applied to this example and are shown below. -->
<!-- IF EXAMPLE HAS CUSTOM JS INCLUDE THIS LINE -->
<!-- The JavaScript used by this example is also shown below. -->

<!-- INCLUDE AN EMPTY HTML CODE BLOCK FOR EACH EXAMPLE -->
```html
<button id="simple-toast-btn">Show Toast</button>
<button id="long-show-time-toast-btn">Show Toast with 7 second show time</button>

<ace-toast>
  Toast with standard 4 second show time
</ace-toast>

<ace-toast ace-toast-show-time="7000">
  Toast with developer-defined 7 second show time
</ace-toast>
```

```js
import {ATTRS} from '/ace/components/toast/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const toastEl = document.getElementById('ace-toast-1');
  const secondToastEl = document.getElementById('ace-toast-2');
  const showToastBtn = document.getElementById('simple-toast-btn');
  const showSecondToastBtn = document.getElementById('long-show-time-toast-btn');

  showToastBtn.addEventListener('click', () => toastEl.setAttribute(ATTRS.VISIBLE, 'true'));
  showSecondToastBtn.addEventListener('click', () => secondToastEl.setAttribute(ATTRS.VISIBLE, 'true'));
});
```

### Example
<!-- DESCRIBE WHAT THE EXAMPLE SHOWS AND WHY IT SHOULD BE USED THAT WAY -->
<!-- IF EXAMPLE HAS CUSTOM SASS INCLUDE THIS LINE -->
<!-- Custom styles have been applied to this example and are shown below. -->
<!-- OR -->
<!-- Custom styles that mimic Google Material Design have been applied to this example and are shown below. -->
<!-- IF EXAMPLE HAS CUSTOM JS INCLUDE THIS LINE -->
<!-- The JavaScript used by this example is also shown below. -->

<!-- INCLUDE AN EMPTY HTML CODE BLOCK FOR EACH EXAMPLE -->
```html
<button id="show-1st-toast-btn">Show first Toast</button>
<button id="show-2nd-toast-btn">Show second Toast</button>
<button id="show-3rd-toast-btn">Show thirds Toast</button>

<ace-toast>
  First Toast
</ace-toast>

<ace-toast>
  Second Toast
</ace-toast>

<ace-toast>
  Third Toast
</ace-toast>
```

```js
import {ATTRS} from '/ace/components/toast/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const firstToastEl = document.getElementById('ace-toast-3');
  const secondToastEl = document.getElementById('ace-toast-4');
  const thirdToastEl = document.getElementById('ace-toast-5');

  const positionToast = (toastEl) => {
    const visibleToasts = document.querySelectorAll(`[${ATTRS.VISIBLE}="true"]`);
    visibleToasts.forEach((visibleToast) => {
      const TOAST_GAP = 10;
      toastEl.style.bottom = `${window.innerHeight - visibleToast.offsetTop + TOAST_GAP}px`;
    });
  };

  window.addEventListener('click', (e) => {
    const targetId = e.target.id;
    let toastEl;
    switch (targetId) {
      case 'show-1st-toast-btn':
        toastEl = firstToastEl;
        break;
      case 'show-2nd-toast-btn':
        toastEl = secondToastEl;
        break;
      case 'show-3rd-toast-btn':
        toastEl = thirdToastEl;
        break;
    }

    if (!toastEl) {
      return;
    }

    positionToast(toastEl);
    toastEl.setAttribute(ATTRS.VISIBLE, 'true');
  });
});
```
