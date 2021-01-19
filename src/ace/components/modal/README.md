# Modal

Modal is a component that is overlaid on top of other site content, and prevents users from interacting with content outside of it.

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

For convenience the ES6 class is exported as `Modal` and the attribute names used by the class are exported as properties of `ATTRS`.

After the event `DOMContentLoaded` is fired on `document` an instance of Modal is instantiated within each `<ace-modal>` element and an ID `ace-modal-<n>` is added for any instance without one, where `<n>` is a unique integer. Once instantiation is complete a custom event `ace-modal-ready` is dispatched on `window`. See the **Custom events** section below for more details.

Visible Modals take up the full screen on mobile, and have a fixed width and height for all other devices as well as a backdrop that overlays site content outside the Modal, visually obscuring it. Modal uses any element on the page with attribute `ace-modal-backdrop` as the backdrop. If no element has this attribute then an `<div>` element will be appended to `body` and given this attribute.

Modal must have at least one button to hide it. Modal will look for a descendant with attribute `ace-modal-hide-btn` and if none are present it will add a `<button>` element as it's first child and will give it this attribute.

It is strongly recommended that Modal be provided with an accessible label using either `aria-label` or `aria-labelledby`.

## Usage

Modals are hidden by default but can be initially shown on page load by adding the `ace-modal-visible` attribute to them, which is an observed attribute that can be added or removed to dynamically show or hide the Modal. When a Modal is shown the first focusable descendant is focused, and when hidden focus returns to the element that was focused before the Modal was shown, which in most cases is the trigger. 

The attribute `ace-modal-trigger-for` must be added to elements that trigger the Modal with its value set to the Modal ID. For accessibility reasons it is recommended that only `<button>` elements are used for triggers. Modals can contain triggers for other Modals, which when clicked will hide the Modal they are in and show their target Modal. When a Modal becomes visible the attribute `ace-modal-is-visible` is added to `body` and the backdrop to pervent scrolling in the former and show the latter. Modals can be hidden by either clicking on any descendant with attribute `ace-modal-hide-btn`, clicking on the backdrop element or pressing <kbd>Esc</kbd>. When a Modal is hidden it still remains in the DOM with its content unchanged.

Visible Modals prevent users from interacting with content outside of it by either visually obscuring the content using the backdrop element or taking up the full screen of mobile devices, and by either making the content inert or by trapping keyboard focus within itself.

Modal first attempts to use the [HTML `inert` property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert, currently part of the [HTML Living Standard specification](https://html.spec.whatwg.org/multipage/interaction.html#inert-subtrees). If the browser supports `inert` and the Modal is a direct child of `body` it will add the `inert` attribute to all of its siblings except the backdrop, thereby preventing users from interacting with them.

For browsers that don't support inert or for Modals that are not children of `body`, a fallback focus trap technique is used. This method involves determining Modal's first and last interactable descendants by getting all its focusable descendants and filtering out elements that are disabled or hidden using CSS declarations `display: none` or `visibility: hidden`. Focus can then be moved to the first interactable descendant from the last when <kbd>Tab</kbd> is pressed, and to the last from the first when <kbd>Shift</kbd> + <kbd>Tab</kbd> are pressed. To allow for dynamically changing focusable descendants the focus trap listens for changes to the `style`, `class` and `disabled` attributes of all Modal's focusable descendants using a [mutation observer](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) and updates the first and last interactable descendants. An example use case for this is having a disabled form submission button as the last focusable descendant, which is enabled upon form validation thereby becoming the last interactable descendant due to the mutation observer, without which this button would be unfocusable. The first and last interactable descendants can also be manually updated by developers through a custom event. See the **Custom events** section below for more details.


## Styles

The following SASS is applied to Modal. The SASS variables use `!default` so can also be easily overridden by developers. SASS variables used that are not defined here are defined in *<path-to-node_modules>/@potato/ace/common/constants.scss*.

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

This event is dispatched when Modal finishes initialising. The event name is available as `EVENTS.OUT.READY` and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Modal [string]
}
```

#### Changed

`ace-modal-changed`

This event is dispatched when Modal finishes initialising. The event name is available as `EVENTS.OUT.CHANGED` and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Modal [string]
  'visible': // Whether the Modal is visible or not [boolean]
}
```


### Listened for event

Modal listens for the following event, which should be dispatched on the specific `ace-modal` element.

#### Update focus trap

`ace-disclosure-update-focus-trap`

This event should be dispatched to manually update the focus trap on the Modal and the event name is available as `EVENTS.IN.UPDATE_FOCUS_TRAP`. For example if an element is dynamically added to the Modal as the first or last focusable descendant this custom event must be dispatched so that the focus trap can be updated appropriately.

## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.

### Simple Modal
Example of a simple modal with two triggers that is shown on page load. The example also demonstrates how the focus trap and the `ace-disclosure-update-focus-trap` custom event work. After triggering the Modal, use **Toggle disabled button** button to toggle the disabled state of the disabled button, and notice that the mutation observer updates the focus trap. Next use the **Add link to Modal** and **Remove link from Modal** buttons to add and remove links and dispatch the custom event, and notice how the focus trap is again updated.

The extra JavaScript used by this example is also shown below.

```html
<button ace-modal-trigger-for="simple-modal">Modal trigger 1</button>
<button ace-modal-trigger-for="simple-modal">Modal trigger 2</button>

<ace-modal aria-label="Example Modal" id="simple-modal" ace-modal-visible>
  <h3>Modal heading</h3>
  <p>This modal was shown on page load as it had attribute <code>ace-modal-visible</code> when the page was loaded.</p>
  <img src="/img/logo.svg" height="100px" alt="Potato logo"/>

  <button id="toggle-disabled-btn-btn">Toggle disabled button</button>

  <button id="add-link-btn">Add link to Modal</button>
  <button id="remove-link-btn">Remove link from Modal</button>

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

### Modal that triggers another Modal
Example of a Modal that has a trigger for another Modal and makes use of the `ace-modal-changed` custom event. When the second Modal's trigger in the first Modal is clicked, the first Modal is hidden and the second Modal shown. When the second Modal is closed and its `ace-modal-changed` custom event is dispatched, the first Modal is shown again.

The extra JavaScript used by this example is also shown below.

```html
<button ace-modal-trigger-for="modal-from-modal">
  Second Modal's trigger
</button>

<ace-modal aria-label="Example of Modal that shows another Modal" id="modal-from-modal">
  <button ace-modal-hide-modal-btn aria-label="Exit modal">&#x2715;</button>

  <h3>Second Modal</h3>
  <p>Second Modal</p>
  <img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone"/>

  <button ace-modal-trigger-for="simple-modal">Show first modal</button>
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
