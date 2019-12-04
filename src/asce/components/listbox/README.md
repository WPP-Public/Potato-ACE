# Listbox
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat `inline code`.

[W3C Spec](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox)

## Usage

```js
import { Listbox as asceListbox, CONSTS as ASCE_LISTBOX_CONSTS } from 'asce/components/listbox/listbox';
```


## Sass

Here is scss code

```scss
/* COMPONENT VARIABLES */
$asce-listbox-selected-bg-color: #ccc !default;
$asce-listbox-active-outline-color: 2px dotted #000 !default;


/* COMPONENT STYLES */
[asce-listbox-list] {
  list-style: none;
  margin: 0;
  overflow-y: auto;
}

[asce-listbox-option-index] {
  user-select: none;

  &[aria-selected="true"] {
    background: $asce-listbox-selected-bg-color;
  }
}

[asce-listbox-active-option] {
  outline: $asce-listbox-active-outline-color;
}
```


## Examples

### Single-select

Single-select listbox.

```html
<asce-listbox id="listbox">
  <ul>
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
</asce-listbox>
```


### Multi-select

Multi-select listbox.

```html
<asce-listbox
    id="multi-selectable-listbox"
    asce-listbox-multiselect>
  <ul>
    <li>Iron Man</li>
    <li>Hulk</li>
    <li>Captain America</li>
    <li>Scarlet Witch</li>
    <li>Black Panther</li>
    <li>Black Widow</li>
    <li>Ant-Man</li>
    <li>Thor</li>
    <li>Captain Marvel</li>
    <li>Dr Strange</li>
    <li>Spider-man</li>
    <li>War Machine</li>
  </ul>
</asce-listbox>
```

### Listbox with images

Listbox with images.

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
       Black Widow
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
       Scarlet Witch
    </li>
    <li>
       <img src="/img/logo.svg">
       Ant-Man
    </li>
    <li>
       <img src="/img/logo.svg">
       Spider-man
    </li>
    <li>
       <img src="/img/logo.svg">
       Black Panther
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

Example of multi-select listbox.

```js
document.getElementById('<listbox-id>')
  .dispatchEvent(new CustomEvent(
    `${ASCE_LISTBOX_CONSTS.UPDATE_OPTIONS_EVENT}`,
    { detail: { id: '<listbox-id>' } },
  ));
```

```html
<button id="dynamic-listbox-btn">
  Populate listbox options
</button>
<asce-listbox id="dynamic-listbox">
  <ul></ul>
</asce-listbox>
```
