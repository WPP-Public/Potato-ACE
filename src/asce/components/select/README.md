# Select
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.	

[W3C Spec](https://www.w3.org/TR/wai-aria-practices-1.1/examples/listbox/listbox-collapsible.html)

## Usage

```js
import { Select } from 'asce/components/select/select.js';
```


```scss
/* COMPONENT VARIABLES */
$asce-select-list-background: #fff !default;
$asce-select-list-height: auto !default;
$asce-select-list-z-index: 1 !default;


/* COMPONENT STYLES */
asce-select {
  position: relative;
}

[asce-select-list] {
  background: $asce-select-list-background;
  height: $asce-select-list-height;
  left: 0;
  position: absolute;
  top: 100%;
  z-index: $asce-select-list-z-index;
}

[asce-select-list-hidden] {
  display: none;
}
```


## Examples

### Select Drop-down

```html
<asce-select id="select">
  <button></button>
  <ul>
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
</asce-select>
```

### Select Drop-down with images

```html
<asce-select id="listbox-with-images">
  <button></button>
  <ul>
    <li>Select an option</li>
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
</asce-select>
```
