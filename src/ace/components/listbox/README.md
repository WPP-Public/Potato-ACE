# Listbox

Listbox is a list of options that allows users to select one (single-select) or more (multi-select) using a mouse or keyboard.

Listbox conforms to W3C WAI-ARIA authoring practices specified [here](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox).


## Instantiation

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/listbox/listbox'
```


Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/listbox/listbox';
```

For the sake of convenience the ES6 class is exported as `Listbox`. To avoid name clashes the `as` keyword can be used when importing, e.g. `import Listbox as aceListbox from ...`. The attribute names used by the class are also exported as properties of `ATTRS`.

After `DOMContentLoaded` is fired, Listbox automatically instantiates an instance of itself within each `ace-listbox` element. Listbox then adds an ID `ace-listbox-<n>` for any instance without an ID, where `<n>` is the instance number. Listbox then adds its functionality to a `<ul>` or `<ol>` nested within it. If neither are present a `<ul>` is added automatically, which can be populated with options dynamically. See the **Custom events** section below for more details. Once instantiation is complete a custom event `ace-listbox-ready` is dispatched on `window`.



## Usage

There are two main types of Listboxes, single-select and multi-select. A single-select Listbox allows selection of only a single option at a time, and are instantiated by default. A Multi-select Listbox allows selection of multiple options, and are instantiated in Listboxes with an `ace-listbox-multiselect` attribute.

Listbox options can be active and/or selected. Only a single option can be active at once and only when the Listbox list has focus. The active option is given the `ace-listbox-active-option` attribute and its ID is stored as the Listbox's `aria-activedescendant` attribute. Both these attributes are removed when the Listbox list loses focus as no option is active at that point.

The active option can be changed by clicking on an option, using <kbd>&#8593;</kbd>, <kbd>&#8595;</kbd>, <kbd>Home</kbd> or <kbd>End</kbd>, or by typing one or more characters making the next option with text starting with the typed string active. <kbd>&#8593;</kbd> will loop around from the top of the list to the bottom, while <kbd>&#8595;</kbd> will loop from the bottom to the top. Similarly, when a character is typed if the bottom of the list is reached the search will loop around and continute from the top until a match or the active option is reached. Repeatedly pressing the same character with a short delay in-between will loop through all matching options.

The active option is automatically selected in a single-select Listbox. In a multi-select Listbox an option's selected state can be toggled by clicking on it or pressing <kbd>Space</kbd> if it's active. Selection of multiple options can be achieved by clicking on an option and then clicking on another one while holding <kbd>&#8679;</kbd>, which will select all options in between the two clicked ones. Users can also select multiple options using the keyboard in the following ways:

- <kbd>&#8679;</kbd> + <kbd>&#8593;</kbd> or <kbd>&#8679;</kbd> + <kbd>&#8595;</kbd>: Toggles selected state of previous or next option respectively, and makes it active.
- <kbd>&#8679;</kbd> + <kbd>Space</kbd>: Selects all items between the most recently selected item and the active item.
- <kbd>Ctrl</kbd>/<kbd>&#8984;</kbd> + <kbd>&#8679;</kbd> + <kbd>Home</kbd>: Selects active option and all options above it and makes the first option active.
- <kbd>Ctrl</kbd>/<kbd>&#8984;</kbd> + <kbd>&#8679;</kbd> + <kbd>End</kbd>: Selects active option and all options below it and makes the last option active.
- <kbd>Ctrl</kbd>/<kbd>&#8984;</kbd> + <kbd>A</kbd>: Toggles selected state of all options.


## Styles

The following SASS is applied to the component, each declaration of which can be overridden by a single class selector, with the addition of `[aria-selected="true"]` for targetting selected options.  The SASS variables use `!default` so can also be easily overridden by users.

To conform to W3 WAI-ARIA practices, active and selected options must be visually distinct from other options and one another. For this reason the active and selected option were given an outline and a background color, respectively.


```scss
/* VARIABLES */
$ace-listbox-active-option-outline: 1px dashed slategray !default;
$ace-listbox-selected-option-bg-color: $ace-color-selected !default;


/* STYLES */
[ace-listbox-list] {
  list-style-position: inside;
}

[ace-listbox-option-index] {
  &[aria-selected="true"] {
    background: $ace-listbox-selected-option-bg-color;
  }
}

[ace-listbox-active-option] {
  outline: $ace-listbox-active-option-outline;
}
```


## Custom events

Listbox uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.

### Dispatched events

The following events are dispatched on `window` by Listbox.

#### Ready

`ace-listbox-ready`

This event is dispatched when Listbox finishes initialising. The event name is available as `EVENTS.OUT.READY`, and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Listbox [string]
}
```


### Listened for events

Listbox listens for the following events, which should be dispatched by the user's code on the specific `ace-listbox` element.


#### Update options

`ace-listbox-update-options`

This event should be dispatched when options are added or deleted, and causes Listbox to reinitialise itself. The event name is available as `EVENTS.IN.UPDATE_OPTIONS`.


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.


### Single-select Listbox

A single-select Listbox with a nested `<ul>` list.

```html
<ace-listbox id="single-select-listbox">
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
</ace-listbox>
```

A single-select listbox with a nested `<ol>` list.

```html
<ace-listbox>
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
</ace-listbox>
```

### Multi-select Listbox

A multi-select Listbox.

```html
<ace-listbox ace-listbox-multiselect id="multi-select-listbox">
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
</ace-listbox>
```


### Listbox with options containing images

A Listbox with options containing images.

```html
<ace-listbox>
  <ul>
    <li style="align-items: center; display: flex;">
      <img src="/img/logo.svg" width="60px">&nbsp;
      Iron Man
    </li>
    <li style="align-items: center; display: flex;">
      <img src="/img/logo.svg" width="60px">&nbsp;
      Hulk
    </li>
    <li style="align-items: center; display: flex;">
      <img src="/img/logo.svg" width="60px">&nbsp;
      Thor
    </li>
    <li style="align-items: center; display: flex;">
      <img src="/img/logo.svg" width="60px">&nbsp;
      Captain America
    </li>
  </ul>
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
<br><br>
<ace-listbox id="dynamic-listbox"></ace-listbox>
```

```js
import {EVENTS} from '/ace/components/listbox/listbox.js';

document.addEventListener('DOMContentLoaded', () => {
  const listboxEl = document.getElementById('dynamic-listbox');

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
