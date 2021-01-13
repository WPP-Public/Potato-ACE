# Listbox

Listbox is a list of options that allows users to select one (single-select) or more (multi-select) using a mouse or keyboard. It mimics a native HTML `<select>` that has attribute `size` with a value or 1 or higher, while allows more styling flexibility.

Listbox conforms to the [W3C WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox).


## Setup

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/listbox/listbox'
```

Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/listbox/listbox';
```

For convenience the ES6 class is exported as `Listbox` and the attribute names used by the class are exported as properties of `ATTRS`.

After the event `DOMContentLoaded` is fired on `document` an instance of Listbox is instantiated within each `<ace-listbox>` element and an ID `ace-listbox-<n>` is added for any instance without one, where `<n>` is a unique integer. Once instantiation is complete a custom event `ace-listbox-ready` is dispatched on `window`. See the **Custom events** section below for more details.

Listbox must have a nested list and will use a `<ul>` or `<ol>` with attribute `ace-listbox-list`. If no descendant has this attribute then the first decendant `<ul>` or `<ol>` will be used and given this attribute. It is strongly recommended that the list element be provided with an accessible label using `aria-label` or `aria-labelledby`. The list can be empty upon instantiation and options can be dynamically added or removed as long as custom event `ace-listbox-update-options` is dispatched on the Listbox instance afterwards.

There are two main types of Listboxes, single-select and multi-select. Single-select Listboxes allow selection of only a single option at a time and are instantiated by default. Multi-select Listboxes allow selection of multiple options and are instantiated in Listboxes with attribute `ace-listbox-multiselect`.

Listbox options can be active and/or selected. Only a single option can be active at once and only when the Listbox list has focus. The active option is given the `ace-listbox-active-option` attribute and its ID is stored as the value of Listbox list's `aria-activedescendant` attribute. Both attributes are removed when the Listbox list loses focus as no option is active then.

If using a Listbox in a HTML `<form>` the attribute `ace-listbox-for-form` can be added to it which causes it to create a hidden `<input>` with attribute `ace-listbox-input`. The values of any selected options are stored as the value of the `<input>` in the form of a URI encoded, JSON-strigified array. Similarly, the IDs of any selected options are stored as the value of the `<input>` attribute `data-ace-listbox-selected-option-ids` in the form of a JSON strigified array.

## Usage

The active option can be changed by clicking on an option, using <kbd>&#8593;</kbd>, <kbd>&#8595;</kbd>, <kbd>Home</kbd> or <kbd>End</kbd>, or by typing one or more characters making the next option with text starting with the typed string active. <kbd>&#8593;</kbd> will loop around from the top of the list to the bottom, while <kbd>&#8595;</kbd> will loop from the bottom to the top. Similarly, when a character is typed if the bottom of the list is reached the search will loop around and continute from the top until a match or the starting option is reached. Repeatedly pressing the same character with a delay in-between will loop through all matching options. The value of this delay is 500ms and is exported by Listbox as `SEARCH_TIMEOUT`.

The active option is always the selecteed option in a single-select Listbox. In a multi-select Listbox an option's selected state can be toggled by clicking on it or pressing <kbd>Space</kbd> if it's active. Selection of multiple options can be achieved by clicking on an option and then clicking on another one while holding <kbd>&#8679;</kbd>, which will select all options in between the two clicked ones. Multiple options can also be selected using the keyboard in the following ways:

- <kbd>&#8679;</kbd> + <kbd>&#8593;</kbd> or <kbd>&#8679;</kbd> + <kbd>&#8595;</kbd>: Toggles selected state of previous or next option respectively, and makes it active.
- <kbd>&#8679;</kbd> + <kbd>Space</kbd>: Selects all items between the most recently selected item and the active item.
- <kbd>Ctrl</kbd>/<kbd>&#8984;</kbd> + <kbd>&#8679;</kbd> + <kbd>Home</kbd>: Selects active option and all options above it and makes the first option active.
- <kbd>Ctrl</kbd>/<kbd>&#8984;</kbd> + <kbd>&#8679;</kbd> + <kbd>End</kbd>: Selects active option and all options below it and makes the last option active.
- <kbd>Ctrl</kbd>/<kbd>&#8984;</kbd> + <kbd>A</kbd>: Toggles selected state of all options.


## Styles

The following SASS is applied to the component. The SASS variables use `!default` so can also be easily overridden by users. SASS variables used that are not defined here are defined in *<path-to-node_modules>/@potato/ace/common/constants.scss*.

To conform to W3 WAI-ARIA practices, active and selected options must be visually distinct from other options and one another. For this reason the active and selected option were given an outline and a background color respectively.


```scss
@import '../../common/constants';


/* VARIABLES */
$ace-listbox-active-option-outline-width: 2px !default;
$ace-listbox-active-option-outline-style: dotted !default;
$ace-listbox-active-option-outline-color: slategrey !default;
$ace-listbox-list-height: auto !default;
$ace-listbox-selected-option-color: #fff !default;
$ace-listbox-selected-option-bg-color: $ace-color-selected !default;


/* STYLES */
[ace-listbox-list] {
  height: $ace-listbox-list-height;
  list-style-position: inside;
  overflow-y: auto;
  user-select: none;

  [aria-selected="true"] {
    background: $ace-listbox-selected-option-bg-color;
    color: $ace-listbox-selected-option-color;
  }
}

[ace-listbox-multiselect] [ace-listbox-option-active] {
  outline: $ace-listbox-active-option-outline-width $ace-listbox-active-option-outline-style $ace-listbox-active-option-outline-color;
}
```


## Custom events

Listbox uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.

### Dispatched event

The following event is dispatched on `window` by Listbox.

#### Ready

`ace-listbox-ready`

This event is dispatched when Listbox finishes initialising, or updating after the `ace-listbox-update-options` event is dispatched. The event name is available as `EVENTS.OUT.READY`, and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Listbox [string]
}
```


### Listened for event

Listbox listens for the following event, which should be dispatched on the specific `ace-listbox` element.


#### Update options

`ace-listbox-update-options`

This event should be dispatched when options are added or deleted, and causes Listbox to reinitialise itself. The event name is available as `EVENTS.IN.UPDATE_OPTIONS`.


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.


### Single-select Listbox

A single-select Listbox with a nested `<ul>` list and `<label>`.

```html
<ace-listbox>
  <label id="single-select-listbox-label">Choose an Avenger:</label>
  <ul aria-labelledby="single-select-listbox-label">
    <li>Iron Man</li>
    <li>Nick Fury</li>
    <li>Hulk</li>
    <li>Thor</li>
    <li>Captain America</li>
    <li>Black Widow</li>
    <li>Scarlet Witch</li>
    <li>Ant-Man</li>
    <li>Black Panther</li>
    <li>Spider-man</li>
    <li>Doctor Strange</li>
    <li>Captain Marvel</li>
  </ul>
</ace-listbox>
```

### Multi-select Listbox

A multi-select Listbox.

```html
<ace-listbox ace-listbox-multiselect id="multiselect-listbox">
  <label id="multiselect-listbox-label">Choose an Avenger:</label>
  <ul aria-labelledby="multiselect-listbox-label">
    <li>Iron Man</li>
    <li>Nick Fury</li>
    <li>Hulk</li>
    <li>Thor</li>
    <li>Captain America</li>
    <li>Black Widow</li>
    <li>Scarlet Witch</li>
    <li>Ant-Man</li>
    <li>Black Panther</li>
    <li>Spider-man</li>
    <li>Doctor Strange</li>
    <li>Captain Marvel</li>
  </ul>
</ace-listbox>
```

### Listbox for forms

A multi-select Listbox to be used with HTML forms with a nested `<ol>` list, an external `<label>` and a hidden `<input>` with the selected option data.

```html
<label id="ol-listbox-label">Choose an Avenger:</label>
<ace-listbox ace-listbox-multiselect ace-listbox-for-form id="listbox-for-form">
  <ol aria-labelledby="ol-listbox-label">
    <li>Iron Man</li>
    <li>Nick Fury</li>
    <li>Hulk</li>
    <li>Thor</li>
    <li>Captain America</li>
    <li>Black Widow</li>
    <li>Scarlet Witch</li>
    <li>Ant-Man</li>
    <li>Black Panther</li>
    <li>Spider-man</li>
    <li>Doctor Strange</li>
    <li>Captain Marvel</li>
  </ol>
</ace-listbox>
```

### Listbox with dynamic options

In this example the Listbox instantiates with an empty `<ul>` that can be populated with options using **Add option**. The first option can also be removed using <btn>Remove option</btn>. Both these buttons dispatch the `ace-listbox-update-options` event that updates the Listbox. The extra JavaScript code required by this example is also included below.

```html
<button id="add-option">
  Add option
</button>
<button id="remove-option">
  Remove option
</button>
<hr>
<ace-listbox id="custom-events-listbox">
  <label id="custom-events-listbox-label">Choose an Avenger:</label>
  <ul aria-labelledby="custom-events-listbox-label"></ul>
</ace-listbox>
```

```js
import {EVENTS} from '/ace/components/listbox/listbox.js';

document.addEventListener('DOMContentLoaded', () => {
  const listboxEl = document.getElementById('custom-events-listbox');

  const updateOptions = () => listboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_OPTIONS));

  document.getElementById('add-option')
    .addEventListener('click', () => {
      listboxEl.querySelector('ul').innerHTML += '<li>New Option</li>';
      updateOptions();
    });

  document.getElementById('remove-option')
    .addEventListener('click', () => {
      const listboxListEl = listboxEl.querySelector('ul');
      const fistOptionEl = listboxListEl.querySelector('li');
      if (!fistOptionEl) {
        return;
      }
      listboxListEl.removeChild(fistOptionEl);
      updateOptions();
    });
});
```


### Styled Listbox

Example of a styled Listbox with options containing images. Custom styles that mimic Google Material Design have been applied to this example and are shown below.

```html
<ace-listbox class="styled-listbox">
  <label id="styled-listbox-label">Choose an Avenger:</label>
  <ul aria-labelledby="styled-listbox-label" class="styled-listbox__list">
    <li class="styled-listbox__option">
      <img alt="Potato logo" class="styled-listbox__img" src="/img/logo.svg">
      Iron Man
    </li>
    <li class="styled-listbox__option">
      <img alt="Potato logo" class="styled-listbox__img" src="/img/logo.svg">
      Nick Fury
    </li>
    <li class="styled-listbox__option">
      <img alt="Potato logo" class="styled-listbox__img" src="/img/logo.svg">
      Hulk
    </li>
    <li class="styled-listbox__option">
      <img alt="Potato logo" class="styled-listbox__img" src="/img/logo.svg">
      Thor
    </li>
    <li class="styled-listbox__option">
      <img alt="Potato logo" class="styled-listbox__img" src="/img/logo.svg">
      Captain America
    </li>
    <li class="styled-listbox__option">
      <img alt="Potato logo" class="styled-listbox__img" src="/img/logo.svg">
      Black Widow
    </li>
    <li class="styled-listbox__option">
      <img alt="Potato logo" class="styled-listbox__img" src="/img/logo.svg">
      Scarlet Witch
    </li>
  </ul>
</ace-listbox>
```

```scss
.styled-listbox {
  display: block;
  margin-top: 8px;
  width: 300px;

  &-label {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    margin-bottom: 8px;
  }

  &__list {
    border: 1px solid rgba(0, 0, 0, .42);
    border-radius: 4px;
    height: 225px;

    &:focus {
      outline-color: #0893a7;
    }
  }

  &__option {
    align-items: center;
    border-radius: 2px;
    display: flex;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    padding: 10px 16px;

    &[aria-selected="true"] {
      background: #0893a7;
    }
  }

  &__img {
    height: 2em;
    margin-right: 10px;
  }
}
```
