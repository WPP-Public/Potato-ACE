# Select

Select is a special type of [Listbox](/listbox) component that mimics the native HTML `<select>` while allowing more styling flexibility.

Select conforms to the [W3C WAI-ARIA authoring practices](https://www.w3.org/TR/examples/listbox/listbox-collapsible.html).


## Setup

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/select/select'
```

Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/select/select';
```

For convenience the ES6 class is exported as `Select` and the attribute names used by the class are exported as properties of `ATTRS`.

After the event `DOMContentLoaded` is fired on `document`, an instance of Select is instantiated within each `<ace-select>` element, and an ID `ace-select-<n>` is addded for any instance without one, where `<n>` is a unique integer. Once instantiation is complete a custom event `ace-select-ready` is dispatched on `window`. See the **Custom events** section below for more details.

Select must have a nested button to show the hidden list of options, so if one is not present Select will create a `<button>` to use, prepend it to itself and update its text to match that of the first option in the list. Select must also have a nested list and will use the first descendant `<ul>` for this. This list can be empty upon instantiation and options can be dynamically added to, or removed from, it later as long as custom event `ace-select-update-options` is dispatched on the Select instance afterwards.


## Usage

The list is displayed when users click on the trigger or press <kbd>&#8593;</kbd>, <kbd>&#8595;</kbd>, <kbd>Enter</kbd> or <kbd>Space</kbd> while the trigger is focussed. The list is aware of it's position in the window and will appear below the trigger if there is enough space, otherwise it will appear above.

Clicking on an option or navigating to it using <kbd>&#8593;</kbd> or <kbd>&#8595;</kbd> and pressing <kbd>Enter</kbd> or <kbd>Space</kbd> will select the option, hide the list and update the trigger text to match that of the selected option.

Type-ahead can also be used to select an option by typing one or more characters that the option's text starts with. Repeatedly typing the same character with a short delay in-between will cycle through all matching options. Type-ahead can be used on a focussed trigger, which will select the option and update the trigger text, or in a list where it will only select the option but not update the trigger text until <kbd>Enter</kbd> or <kbd>Space</kbd> are pressed to confirm. Pressing <kdb>Esc</kbd> or clicking outside the element closes an open list without confirming a change in selected option.


## Styles

The following SASS is applied to the component, each declaration of which can be overridden by a single CSS class selector. The SASS variables use `!default` so can also be easily overridden by users. The list also inherits Listbox styles detailed in the *SASS* section [here](/listbox).

```scss
@import '../listbox/listbox';


/* VARIABLES */
$ace-select-list-background-color: #fff !default;
$ace-select-list-height: auto !default;
$ace-select-list-z-index: 1 !default;


/* STYLES */
ace-select {
  position: relative;
}

[ace-select-list] {
  background: $ace-select-list-background-color;
  height: $ace-select-list-height;
  left: 0;
  list-style: none;
  position: absolute;
  text-align: left;
  top: 100%;
  white-space: nowrap;
  z-index: $ace-select-list-z-index;
}

[ace-select-list-visible="false"] {
  display: none;
}


@import '../../common/utils';
```


## Custom events

Select uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.

### Dispatched events

The following events are dispatched on `window` by Select.

#### Ready

`ace-select-ready`

This event is dispatched when Select finishes initialising. The event name is available as `EVENTS.OUT.READY`, and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Select [string]
}
```

#### Option chosen

`ace-select-option-chosen`

This event is dispatched when an option is chosen by the user. The event name is available as `EVENTS.OUT.OPTION_CHOSEN`, and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Select [string],
  'chosenOption': {
    'id': // ID of chosen option [string],
    'index': // Index of chosen option [number]
  },
}
```

### Listened for events

Select listens for the following events, which should be dispatched on the specific `ace-listbox` element.


#### Update options

`ace-select-update-options`

This event should be dispatched when options are added or deleted to the listbox, and causes Select to reinitialise itself. The event name is available as `EVENTS.IN.UPDATE_OPTIONS`.


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.


### Simple Select

The default Select.

```html
<span id="select-label-1">Choose an Avenger:</span>
<ace-select>
  <ul aria-labelledby="select-label-1">
    <li>Select an option</li>
    <li>Iron Man</li>
    <li>Nick Fury</li>
    <li>Hulk</li>
    <li>Black Widow</li>
    <li>Thor</li>
    <li>Captain America</li>
    <li>Scarlet Witch</li>
    <li>Ant-Man</li>
    <li>Spider-man</li>
    <li>Black Panther</li>
    <li>Doctor Strange</li>
    <li>Captain Marvel</li>
  </ul>
</ace-select>
```

### Select with options containing images

A Select with options containing images.

```html
<span id="select-label-2">Choose an Avenger:</span>
<ace-select>
  <ul aria-labelledby="select-label-2">
    <li style="align-items: center; display: flex;">
      <img src="/img/logo.svg" alt="Potato logo" width="60px">&nbsp;
      Iron Man
    </li>
    <li style="align-items: center; display: flex;">
      <img src="/img/logo.svg" alt="Potato logo" width="60px">&nbsp;
      Hulk
    </li>
    <li style="align-items: center; display: flex;">
      <img src="/img/logo.svg" alt="Potato logo" width="60px">&nbsp;
      Thor
    </li>
    <li style="align-items: center; display: flex;">
      <img src="/img/logo.svg" alt="Potato logo" width="60px">&nbsp;
      Captain America
    </li>
  </ul>
</ace-select>
```


### Select with dynamic options

In this example the Select instantiates with an empty `<ul>` that can be populated with options using **Add option**. The first option can be removed using the **Remove option**. Both these buttons dispatch the `ace-select-update-options` event that updates the listbox and the trigger text. The extra JavaScript code required by this example is also included below.

```html
<button id="add-option">
  Add option
</button>
<button id="remove-option">
  Remove option
</button>
<hr>
<span id="select-label-3">Choose an Avenger:</span>
<ace-select id="custom-events-select">
  <button>No options available</button>
  <ul aria-labelledby="select-label-3"></ul>
</ace-select>
```

```js
import {EVENTS} from '/ace/components/select/select.js';

document.addEventListener('DOMContentLoaded', () => {
  const selectEl = document.getElementById('custom-events-select');
  const selectListEl = selectEl.querySelector('ul');

  const updateOptions = () => selectEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_OPTIONS));

  document.getElementById('add-option').addEventListener('click', () => {
    const optionEl = document.createElement('li');
    optionEl.textContent = 'New Option';
    selectListEl.appendChild(optionEl);
    updateOptions();
  });

  document.getElementById('remove-option').addEventListener('click', () => {
    const lastOptionEl = selectListEl.querySelector('li:last-child');
    if (!lastOptionEl) {
      return;
    }
    selectListEl.removeChild(lastOptionEl);
    updateOptions();
  });
});
```
