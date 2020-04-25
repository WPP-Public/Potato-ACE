# Listbox

Listbox is a list of options that allows users to select one (single-select) or more (multi-select) using a mouse or keyboard.

Listbox conforms to W3C WAI-ARIA authoring practices specified [here](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox).


## Import and instantiation

Import the Listbox class:
```js
import Listbox from '@potato/asce/components/listbox/listbox';
```
The attribute names used by the class are also exported as properties of `ATTRS`. To avoid name clashes the `as` keyword can be used when importing, e.g. `import Listbox as aceListbox from ...`.

After `DOMContentLoaded` is fired, Listbox automatically instantiates an instance of itself within each `<asce-listbox></asce-listbox>` and adds IDs in the format `asce-listbox-(n)` to any instances without one, where `(n)` is the instance count.


## Usage

Listbox adds its functionality to a `<ul>` or `<ol>` nested within it. If neither are present a `<ul>` is added automatically. There are two main types of Listboxes, single-select and multi-select. A single-select listbox allows selection of only a single option at a time, and are instantiated by default. A Multi-select Listbox allows selection of multiple options, and are instantiated in Listboxes with an `asce-listbox-multiselect` attribute.

Listbox options can be active and/or selected. Only a single option can be active at once and only when the Listbox list has focus. The active option is given the `asce-listbox-active-option` attribute and its ID is stored as the Listbox's `aria-activedescendant` attribute. Both these attributes are removed when the Listbox list loses focus as no option is active at that point.

The active option can be changed by clicking on an option, using <kbd>&#8593;</kbd>, <kbd>&#8595;</kbd>, <kbd>Home</kbd> or <kbd>End</kbd>, or typing a single or sequence of characters which makes the next option with text starting with the typed string active. <kbd>&#8593;</kbd> will loop around from the top of the list to the bottom, while <kbd>&#8595;</kbd> will loop from the bottom to the top. Similarly, when a character is typed if the bottom of the list is reached the search will loop around and continute from the top until a match or the active option is reached. Repeatedly pressing the same character with a short delay in-between will loop through all matching options.

The active option is automatically selected in a single-select Listbox, but for multi-select Listboxes an option's selected state can be toggled by clicking on it or pressing <kbd>Space</kbd> if it's active. Selection of multiple options can be achieved by clicking on an option and then clicking on another one while holding <kbd>&#8679;</kbd>, which will select all options in between the two clicked ones. Users can also select multiple options using the keyboard in the following ways:

- <kbd>&#8679;</kbd> + <kbd>&#8593;</kbd> or <kbd>&#8679;</kbd> + <kbd>&#8595;</kbd>: Toggles selected state of previous or next option respectively, and makes it active.
- <kbd>&#8679;</kbd> + <kbd>Space</kbd>: Selects all items between the most recently selected item and the active item.
- <kbd>Ctrl</kbd>/<kbd>&#8984;</kbd> + <kbd>&#8679;</kbd> + <kbd>Home</kbd>: Selects active option and all options above it and makes the first option active.
- <kbd>Ctrl</kbd>/<kbd>&#8984;</kbd> + <kbd>&#8679;</kbd> + <kbd>End</kbd>: Selects active option and all options below it and makes the last option active.
- <kbd>Ctrl</kbd>/<kbd>&#8984;</kbd> + <kbd>A</kbd>: Toggles selected state of all options.


## SASS

Listbox has the following CSS applied to it, each declaration of which can be overridden by a single class selector, with the addition of `[aria-selected="true"]` for targetting selected options.

To conform to W3 WAI-ARIA practices, active and selected options must be visually distinct from other options and one another. For this reason the active option is given an outline, stored in SASS variable `$asce-listbox-active-option-outline-color`, and the selected option is given a background color, stored in `$asce-listbox-selected-option-bg-color`. These variables use `!default` so can be easily overridden by users. The lists also have `list-style-position: inside` set on them so the list item bullets or numbers appear inside the list bounds.


```scss
/* VARIABLES */
$asce-listbox-active-option-outline: 2px dotted #000 !default;
$asce-listbox-selected-option-bg-color: #ccc !default;


/* STYLES */
[asce-listbox-list] {
  list-style-position: inside;
}

[asce-listbox-option-index] {
  &[aria-selected="true"] {
    background: $asce-listbox-selected-option-bg-color;
  }
}

[asce-listbox-active-option] {
  outline: $asce-listbox-active-option-outline;
}
```


## Events

Listbox uses the following custom event, the name of which is exported as a property of `EVENTS`, similar to `ATTRS`, so they may be imported into other modules and dispatched or listened to.


### Update options

`asce-listbox-update-options`

This event should be dispatched when a Listbox's options are altered, e.g. one or more options are added or deleted. The event `detail` property should contain a single property `id` with the ID of the Listbox updated.


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as ASCE components may alter their HTML when they initialise.


### Single-select

Simple single-select Listbox using a nested `<ul>` list.

```html
<asce-listbox id="single-select-listbox">
  <ul>
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
</asce-listbox>
```

Simple single-select listbox using a nested `<ol>` list.

```html
<asce-listbox>
  <ol>
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
</asce-listbox>
```

### Multi-select

Multi-select Listbox.

```html
<asce-listbox asce-listbox-multiselect id="multi-select-listbox">
  <ul>
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
</asce-listbox>
```


### Listbox with options with images

Single-select Listbox with options that have images.

```html
<asce-listbox class="ace-listbox-with-images">
  <ul>
    <li>
      <img src="/img/logo.svg">
      Iron Man
    </li>
    <li>
      <img src="/img/logo.svg">
      Hulk
    </li>
    <li>
      <img src="/img/logo.svg">
      Thor
    </li>
    <li>
      <img src="/img/logo.svg">
      Captain America
    </li>
  </ul>
</asce-listbox>
```


### Dynamically populated Listbox

In this example the `<ul>` of the Listbox is initially empty and can be populated with options using the **Add option** and **Remove option** buttons, both of which dispatch the `asce-listbox-update-options` event. The JavaScript code to acheive this is also included below.

```html
<button id="add-option">
  Add option
</button>
<button id="remove-option">
  Remove option
</button>
<asce-listbox id="dynamic-listbox"></asce-listbox>
```

```js
import Listbox, {EVENTS} from '../../asce/components/listbox/listbox.js';

document.addEventListener('DOMContentLoaded', () => {
  const listboxId = 'dynamic-listbox';
  const listboxListEl = document.querySelector(`#${listboxId} ul`);

  const updateOptions = () => {
    window.dispatchEvent(new CustomEvent(
      EVENTS.UPDATE_OPTIONS,
      {'detail': {'id': listboxId}},
    ));
  };

  document.getElementById('add-option').addEventListener('click', () => {
    listboxListEl.innerHTML += '<li>Iron Man</li>';
    updateOptions();
  });

  document.getElementById('remove-option').addEventListener('click', () => {
    const fistOptionEl = listboxListEl.querySelector('li');
    if (!fistOptionEl) { return; }
    listboxListEl.removeChild(fistOptionEl);
    updateOptions();
  });
});
```
