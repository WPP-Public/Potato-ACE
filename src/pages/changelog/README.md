# Changelog

## v2

### General

- All custom events dispatched to ACE components must now be dispatched on `window` with the `detail` property of the custom event containing the ID of the target ACE component. This change makes it easier for ACE components to be used with JavaScript frameworks.

### Accordion

- Custom event name `CHANGED` changed to `PANEL_VISIBILITY_CHANGED`.
- Custom events `ace-accordion-show-panels`& `ace-accordion-hide-panels` renamed to `ace-accordion-show-all-panels` & `ace-accordion-hide-all-panels` respectively.
- Trigger button now takes up entire width of parent heading element so that it can be activated when using Android's Talkback.

### Carousel

- Custom event`ace-carousel-slide-changed` renamed to `ace-carousel-selected-slide-changed`.

### Disclosure

- Custom event`ace-disclosure-changed` renamed to `ace-disclosure-visibility-changed`.
  

### Listbox

- Fixed bug that made the entire page scroll to Listboxes on page load.

### Modal

- Modal is now hidden using `visibility: hidden` as opposed to `display: none` due to issue with VoiceOver not moving focus to Modal when opened.
- Modal itself now receives focus as opposed to it's first focussable descendant. This allows screen readers to announce it properly when it is shown.
- Custom event`ace-modal-changed` renamed to `ace-modal-visibility-changed`.

### Tabs

- Custom event`ace-tab-changed` renamed to `ace-tabs-selected-tab-changed`.

### Toast

- Toast now moves it's children into an inner `div` upon instantiation and attaches accessibility attributes to the `div` so that the Toast is announced by Android's Talkback screen reader.
- Custom event`ace-toast-changed` renamed to `ace-toast-visibility-changed`.

### Tooltip

- Custom event`ace-tooltip-changed` renamed to `ace-tooltip-visibility-changed`.
- Handler function that repositions overflowing tooltip is now called during initialisation to prevent Tooltips from overflowing and the page from resizing.
- Reduced default delay time to 750ms.
- Removed `ace-tooltip-nowrap` and instead gave Tooltips a `width: max-content` and a max-width to improve their sizing and how they overflow.
- Add a font-size and font-weight to Tooltips so they don't inherit different styles from their targets.

## v1.3

- Switched to TypeScript strict mode to allow better integration with projects that use strict mode.


## v1.2.2

- Improved automatic ID generation


## v1.2 & 1.2.1

- Minor updates

## v1.0.1

- Added Accordion, Carousel, Combobox, Menu, Modal, Tabs, Toast, Tooltip.
- Added TypeScript files for all components.
- Added component CSS files alongside SASS files.
