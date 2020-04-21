# Listbox

A listbox component contains a list of options and allows a user to select one (single-select) or more items (multi-select).

[W3C WAI-ARIA Spec](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox)

## Usage

Import the component module into your JS entry point:
```js
import Listbox from '@potato/asce/components/listbox/listbox';
```

The names of the component HTML attributes are also exported as properties of an object named `ATTRS`, so that they may be imported using `import Listbox, {ATTRS} from ...`. To avoid name clashes you can import using `as`, e.g. `import Listbox as aceListbox, {ATTRS as ACE_TEMPLATE_ATTRS} from ...`. After `DOMContentLoaded` is fired, the component will automatically initialise an instance of itself within each `<asce-listbox></asce-listbox>` tag on the page. It will also automatically assign IDs in the format `asce-template-(n)` to any instance that does not have an ID, where `(n)` is the instance count.

The Listbox component will add listbox functionality to a `<ul>` or `<ol>` element nested within it. Listbox options can be selected and/or active. A selected option is one explicitly selected by the user and has a grey background. The methods for selecting an option differ between single-select and multi-select listboxes and are explained in the following sections.

The active option is the one that has focus and has a dotted outline. Only a single option is active at once and can be changed by clicking on a non-active option or by using the Up, Down, Home and End keys. The Up key will loop around from the top of the list to the bottom, while the Down key will loop from the bottom to the top.

"Type-ahead" is also implemented allowing users to type a single or multiple characters in rapid succession to make the next option with text starting with the typed string active. If the bottom of the list is reached without finding a match the search will loop around to the top of the list and continue until a match is found or the currently active option is reached. Repeatedly pressing the same character with a short delay will cause focus to cycle through all options that start with that character.


### Single-select listbox

Single-select listboxes allow users to only select a single option at a time, and are instantiated by default. In single-select listboxes the active option is selected automatically. An option can therefore by selected by clicking on it or moving focus to it using the Up, Down, Home and End keys.


### Multi-select listbox

Multi-select listboxes allow users to select multiple options, and are instantiated on listboxes that have the `asce-listbox-multiselect` attribute. An option's selected state can be toggled by clicking on it, or by pressing the Space key if it is active. Multiple selection can be achieved through the mouse or keyboard. Clicking on an option and then clicking on another one while holding the Shift key with select all options in between the two clicked ones. Using the keyboard the user achieve multiple selection in the following ways:

- Shift + Up or Down: Toggles the selected state of the previous or next option respectively, and makes it active.
- Shift + Space: Selects all items between the most recently selected item to the active item.
- Control + Shift + Home: Selects the active option and all options up to the first option, and makes the first option active.
- Control + Shift + End: Selects the active option and all options up to the last option, and makes the last option active.
- Control + A: Selects all options, unless they are already selected in which case it de-selects them all.


## SASS

To conform to W3 WAI-ARIA standards active and selected options must be visually distinct from other options. Therefore the active option has been given an outline, the styles of which are stored in SASS variable `$asce-listbox-active-option-outline-color`, and the selected option is given a background, the color of which is stored in `$asce-listbox-selected-option-bg-color`. These variables use `!default` so can be easily overridden by users. The lists have `list-style-position: inside` set on them so the list item bullets or numbers appear inside the list bounds.

The following CSS is applied to the listboxes. Every applied style can overridden with a single class selector, with the addition of `[aria-selected="true"]` for targetting selected options.


```scss
/* VARIABLES */
$asce-listbox-active-option-outline: 2px dotted #000 !default;
$asce-listbox-selected-option-bg-color: #ccc !default;


/* STYLES */
[asce-listbox-list] {
  list-style-position: inside;
  overflow-y: auto;
}

[asce-listbox-option-index] {
  user-select: none;

  &[aria-selected="true"] {
    background: $asce-listbox-selected-option-bg-color;
  }
}

[asce-listbox-active-option] {
  outline: $asce-listbox-active-option-outline;
}
```


## Events

Listbox uses the following custom event whose name of is a property of an exported object named `EVENTS`, similar to `ATTRS`. This event name can therefore be imported into other modules and used to dispatch events.


### Update options

`asce-listbox-update-options`

This event should be dispatched if a listbox's options are altered, e.g. an option is added, or the page loads without a list and one is later added dynamically. The event `detail` property should contain a single property `id` that contains the ID of the listbox to be updated.


## Examples

### Single-select

Simple single-select listbox using `<ul>` element.

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

Simple single-select listbox using `<ol>` element.

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

Multi-select listbox.

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

### Listbox with images

Listbox with options that have images.

```html
<asce-listbox id="listbox-with-images">
  <ul>
    <li>
       <img src="/img/logo.svg">
       Iron Man
    </li>
    <li>
       <img src="/img/logo.svg">
       Nick Fury
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
    <li>
       <img src="/img/logo.svg">
       Black Widow
    </li>
    <li>
       <img src="/img/logo.svg">
       Scarlet Witch
    </li>
    <li>
       <img src="/img/logo.svg">
       Ant-Man
    </li>
    <li>
       <img src="/img/logo.svg">
       Black Panther
    </li>
    <li>
       <img src="/img/logo.svg">
       Spider-man
    </li>
    <li>
       <img src="/img/logo.svg">
       Doctor Strange
    </li>
    <li>
       <img src="/img/logo.svg">
       Captain Marvel
    </li>
  </ul>
</asce-listbox>
```


### Dynamically populated listbox

The listbox in this example is initially empty and can be populated with options using the 'Populate listbox list' or 'Add option' buttons. The update options event can be dispatched using the 'Dispatch update options event' button.

```html
<button id="populate-listbox">
  Populate listbox list
</button>
<button id="add-option">
  Add option
</button>
<button id="update-options">
  Dispatch update options event
</button>
<asce-listbox id="dynamic-listbox"></asce-listbox>
```

```js
  const listboxId = 'dynamic-listbox';
  const listboxListEl = document.querySelector(`#${listboxId} ul`);

  document.getElementById('populate-listbox')
    .addEventListener('click', () => {
      listboxListEl.innerHTML = `
        <li>Iron Man</li>
        <li>Nick Fury</li>
        <li>Hulk</li>
        <li>Black Widow</li>
        <li>Thor</li>
        <li>Captain America</li>`;
    });

  document.getElementById('add-option')
    .addEventListener('click', () => {
      const newOption = document.createElement('li');
      newOption.textContent = 'New Option';
      listboxListEl.appendChild(newOption);
    });

  document.getElementById('update-options')
    .addEventListener('click', () => {
      window.dispatchEvent(
        new CustomEvent(
          EVENTS.UPDATE_OPTIONS,
          {
            'detail': {
              'id': listboxId,
            }
          },
        )
      );
    });
```
