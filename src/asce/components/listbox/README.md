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

Upon instantiation Listbox adds its functionality to a `<ul>` or `<ol>` nested within it. If neither are present a `<ul>` is added automatically, which can be populated with options dynamically. Please see the *Events* section below for more details.


## Usage

There are two main types of Listboxes, single-select and multi-select. A single-select Listbox allows selection of only a single option at a time, and are instantiated by default. A Multi-select Listbox allows selection of multiple options, and are instantiated in Listboxes with an `asce-listbox-multiselect` attribute.

Listbox options can be active and/or selected. Only a single option can be active at once and only when the Listbox list has focus. The active option is given the `asce-listbox-active-option` attribute and its ID is stored as the Listbox's `aria-activedescendant` attribute. Both these attributes are removed when the Listbox list loses focus as no option is active at that point.

The active option can be changed by clicking on an option, using <kbd>&#8593;</kbd>, <kbd>&#8595;</kbd>, <kbd>Home</kbd> or <kbd>End</kbd>, or typing a single or sequence of characters which makes the next option with text starting with the typed string active. <kbd>&#8593;</kbd> will loop around from the top of the list to the bottom, while <kbd>&#8595;</kbd> will loop from the bottom to the top. Similarly, when a character is typed if the bottom of the list is reached the search will loop around and continute from the top until a match or the active option is reached. Repeatedly pressing the same character with a short delay in-between will loop through all matching options.

The active option is automatically selected in a single-select Listbox. In a multi-select Listbox an option's selected state can be toggled by clicking on it or pressing <kbd>Space</kbd> if it's active. Selection of multiple options can be achieved by clicking on an option and then clicking on another one while holding <kbd>&#8679;</kbd>, which will select all options in between the two clicked ones. Users can also select multiple options using the keyboard in the following ways:

- <kbd>&#8679;</kbd> + <kbd>&#8593;</kbd> or <kbd>&#8679;</kbd> + <kbd>&#8595;</kbd>: Toggles selected state of previous or next option respectively, and makes it active.
- <kbd>&#8679;</kbd> + <kbd>Space</kbd>: Selects all items between the most recently selected item and the active item.
- <kbd>Ctrl</kbd>/<kbd>&#8984;</kbd> + <kbd>&#8679;</kbd> + <kbd>Home</kbd>: Selects active option and all options above it and makes the first option active.
- <kbd>Ctrl</kbd>/<kbd>&#8984;</kbd> + <kbd>&#8679;</kbd> + <kbd>End</kbd>: Selects active option and all options below it and makes the last option active.
- <kbd>Ctrl</kbd>/<kbd>&#8984;</kbd> + <kbd>A</kbd>: Toggles selected state of all options.


## SASS

The following SASS is applied to the component, each declaration of which can be overridden by a single class selector, with the addition of `[aria-selected="true"]` for targetting selected options.  The SASS variables use `!default` so can also be easily overridden by users.

To conform to W3 WAI-ARIA practices, active and selected options must be visually distinct from other options and one another. For this reason the active and selected option were given an outline and a background color, respectively.


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

Listbox uses the following custom event, the name of which is exported as a property of `EVENTS`, similar to `ATTRS`, so it may be imported into other modules and dispatched.


### Update options

`asce-listbox-update-options`

This event should be dispatched when a Listbox's options are altered, e.g. one or more options are added or deleted. The event `detail` property should contain a single property `id` with the ID of the Listbox updated.


## Examples

Each example contains a live demo and the HTML code that produces it. The code shown may differ slightly to that rendered for the demo as some ASCE components may alter their HTML when they are instantiated.


### Single-select Listbox

A single-select Listbox with a nested `<ul>` list.

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

A single-select listbox with a nested `<ol>` list.

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

### Multi-select Listbox

A multi-select Listbox.

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


### Listbox with options containing images

A Listbox with options containing images.

```html
<asce-listbox>
  <ul class="list-with-images">
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


### Listbox with dynamic options

In this example the Listbox instantiates with an empty `<ul>` that can be populated with options using **Add option**. The first option can also be removed using the **Remove option**. Both these buttons dispatch the `asce-listbox-update-options` event which updates the Listtbox. The extra JavaScript code to acheive this is also included below.

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
