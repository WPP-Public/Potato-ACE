# Modal

> A dialog is a window overlaid on either the primary window or another dialog window. Windows under a modal dialog are inert. That is, users cannot interact with content outside an active dialog window. Inert content outside an active dialog is typically visually obscured or dimmed so it is difficult to discern, and in some implementations, attempts to interact with the inert content cause the dialog to close.

Modal conforms to the [W3C WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal).


## Setup

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/modal/modal'
```

Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/modal/modal';
```

For convenience the ES6 class is exported as `Modal` <!-- TODO: If no ATTRS are exported, remove following sentence --> and the attribute names used by the class are exported as properties of `ATTRS`.

After the event `DOMContentLoaded` is fired on `document`, an instance of Modal is instantiated within each `<ace-modal>` element, and an ID `ace-modal-<n>` is addded for any instance without one, where `<n>` is a unique integer. Once instantiation is complete a custom event `ace-modal-ready` is dispatched on `window`. See the **Custom events** section below for more details.

<!-- EXPLAIN THE REQUIRED AND RECOMMENDED ATTRIBUTES AND ELEMENTS TO BE PROVIDED BY DEVELOPERS BEFORE INSTANTIATION. STARTING FROM THE COMPONENT ITSELF AND FOLLOWING THE HIERARCHY DESCRIBE: -->

<!-- 1. Required elements that developers must provide before page load. For each, mention the custom attribute it can be given for explicit assignment, and whether this attribute can be omitted and the component can implicitly determine which element to use based on its position in the DOM hierarchy. Example: -->

> Modal must have a nested button to \_\_\_\_\_, and will use a descendant `<button>` with attribute `ace-modal-btn`. If no descendant has this attribute then the first decendant `<button>` will be used and given this attribute.

<!-- 2. Elements and/or attributes that developers are strongly advised to provide such as `<label>`, `aria-label` or  or `aria-labelledby`. -->

> It is strongly recommended that Modal be provided with an accessible label using either `aria-label` or `aria-labelledby`.

<!-- 3. Optional elements that can be added dynamically after page load, explaining which custom event is needed to prompt the component to initialise them. -->

## Usage

<!-- EXPLAINING COMPONENT FEATURES AND HOW IT CAN BE INTERACTED WITH. COMPONENT VARIANTS MAY BE BRIEFLY LISTED HERE BUT NOT IN DETAIL AS EACH VARIANT SHOULD HAVE AN EXAMPLE BELOW CONTAINING ALL THE DETAILS -->


## Styles

The following SASS is applied to Modal. <!-- TODO: If no SASS variables used remove following sentence --> The SASS variables use `!default` so can also be easily overridden by developers.

```scss
@import '../../common/constants';


/* VARIABLES */
$ace-modal-backdrop-bg-colour: rgba(0, 0, 0, .5) !default;
$ace-modal-bg-colour: #fff !default;
$ace-modal-padding: $ace-spacing-3 !default;
$ace-modal-switch-breakpoint: 768px;


/* STYLES */
ace-modal {
  background: $ace-modal-bg-colour;
  padding: $ace-modal-padding;
  position: fixed;
  z-index: $ace-modal-z-index;

  @media (max-width: #{$ace-modal-switch-breakpoint - 1px}) {
    height: 100vh;
    left: 0;
    top: 0;
    width: 100vw;
  }

  @media (min-width: #{$ace-modal-switch-breakpoint}) {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  &:not([ace-modal-visible]) {
    display: none;
  }
}

// Placed on body and backdrop when a Modal is visible
[ace-modal-is-visible] {
  overflow: hidden;
  // prevent reflow due to scroll bar disappearing;
  padding-right: $ace-scrollbar-width;
}

[ace-modal-backdrop] {
  background: $ace-modal-backdrop-bg-colour;
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: $ace-modal-backdrop-z-index;

  &:not([ace-modal-is-visible]) {
    display: none;
  }
}
```


## Custom events

Modal uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.


### Dispatched events

The following events are dispatched on `window` by Modal.


#### Ready

`ace-modal-ready`

This event is dispatched when Modal finishes initialising. The event name is available as `EVENTS.OUT.READY`, and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Modal [string]
}
```


### Listened for events

Modal listens for the following events, which should be dispatched on the specific `ace-modal` element.


<!-- TODO: Replace 'Listened for event name' with a descriptive name -->
#### Event name

<!-- TODO: Replace 'event-name' with actual value -->
`ace-modal-event-name`

<!-- DESCRIBE EVENT HERE AND SPECIFY IF ITS DISPATCHED OR LISTENED FOR -->
This event should be dispatched to <!-- TODO: Describe what the event causes the instance to do -->. The event name is available as  <!-- TODO: Replace <EVENT-NAME> with correct value -->`EVENTS.IN.<EVENT-NAME>`

<!-- TODO: If detail property used add the following and describe each of its properties --> 
, and its `detail` object should be composed as follows:

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
The extra JavaScript used by this example is also shown below.

```html
<button ace-modal-trigger-for="simple-modal">Modal trigger 1</button>
<button ace-modal-trigger-for="simple-modal">Modal trigger 2</button>

<ace-modal aria-label="Example Modal" id="simple-modal" ace-modal-visible>
  <h3>Modal heading</h3>
  <p>This modal was shown on page load as it had attribute <code>ace-modal-visible</code> when the page was loaded.</p>
  <img src="/img/logo.svg" height="100px" alt="Potato logo"/>

  <button id="add-link-btn">Add link to Modal</button>
  <button id="remove-link-btn">Remove link from Modal</button>

  <button id="toggle-disabled-btn-btn">Toggle disabled button</button>
  <button id="disabled-btn" disabled>Disabled Button</button>
</ace-modal>
```

```js
import {EVENTS} from '/ace/components/modal/modal.js';

document.addEventListener('DOMContentLoaded', () => {
  const modalEl = document.getElementById('simple-modal');
  const disabledBtn = document.getElementById('disabled-btn');

  modalEl.addEventListener('click', (e) => {
    const targetId = e.target.id;
    const toggleDisabledBtnBtnClicked = targetId === 'toggle-disabled-btn-btn';
    if (toggleDisabledBtnBtnClicked) {
      disabledBtn.disabled = !disabledBtn.disabled;
      return;
    }

    const addLinkBtnClicked = targetId === 'add-link-btn';
    if (addLinkBtnClicked) {
      const linkEl = document.createElement('a');
      linkEl.href = '#';
      linkEl.textContent = 'Dummy link';
      modalEl.appendChild(linkEl);
    }

    const removeLinkBtnClicked = targetId === 'remove-link-btn';
    if (removeLinkBtnClicked) {
      const linkEl = modalEl.querySelector('a');
      if (linkEl) {
        linkEl.remove();
      }
    }
    modalEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_FOCUS_TRAP));
  });
});
```

### Example
<!-- DESCRIBE WHAT THE EXAMPLE SHOWS AND WHY IT SHOULD BE USED THAT WAY -->
The extra JavaScript used by this example is also shown below.

```html
<button ace-modal-trigger-for="modal-from-modal">
  Second Modal's trigger
</button>

<ace-modal aria-label="Example of Modal that opens another Modal" id="modal-from-modal">
  <h3>Second Modal</h3>
  <p>Second Modal</p>
  <img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone"/>

  <button ace-modal-hide-modal-btn ace-modal-trigger-for="simple-modal">Show first modal</button>
</ace-modal>
```

```js
import {ATTRS, EVENTS} from '/ace/components/modal/modal.js';

document.addEventListener('DOMContentLoaded', () => {
  const OTHER_MODAL_ID = 'simple-modal';
  const modalEl = document.getElementById('modal-from-modal');
  let otherModalTriggerClicked;

  // If other Modal is shown using trigger in this Modal, show this Modal when other Modal is hidden
  const otherModalTrigger = modalEl.querySelector(`[ace-modal-trigger-for="${OTHER_MODAL_ID}"]`);
  otherModalTrigger.addEventListener('click', () => otherModalTriggerClicked = true);

  window.addEventListener(EVENTS.OUT.CHANGED, (e) => {
    if (!e.detail || e.detail.id !== OTHER_MODAL_ID || e.detail.visible || !otherModalTriggerClicked) {
      return;
    }
    otherModalTriggerClicked = false;
    modalEl.setAttribute(ATTRS.VISIBLE, '');
  });
});
```
