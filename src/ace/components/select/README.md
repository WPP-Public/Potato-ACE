# Select

Select is a special type of [Listbox](/listbox) component that mimics the native HTML `<select>`, allowing more flexibility particularly in terms of styling.

Select conforms to W3C WAI-ARIA authoring practices specified [here](https://www.w3.org/TR/examples/listbox/listbox-collapsible.html).


## Instantiation

First import the styles into your main SASS file, replacing `../path/to` with the path to *node_modules* relative to the file:

```scss
@import '../path/to/node_modules/@potato/ace/components/select/select'
```


Then import the class into your JavaScript entry point:

```js
import Select from '@potato/ace/components/select/select';
```

To avoid name clashes the `as` keyword can be used when importing, e.g. `import Listbox as aceListbox from ...`. The attribute names used by the class are also exported as properties of `ATTRS`.

After `DOMContentLoaded` is fired, Select automatically instantiates an instance of itself within each `<ace-template></ace-template>` and adds IDs in the format `ace-template-(n)` to any instances without one, where `(n)` is the instance count.

Select extends the Listbox class and applies its single-select attributes and functionality to a `<ul>` or `<ol>` nested within it, then hides it. If neither are present a `<ul>` is added automatically, which can be populated with options dynamically. Please see the **Custom events** section below for more details. Select uses a `<button>` as a trigger to show the hidden list, which if absent is also automatcally added with no text. If the list contains options, the button text is automatically updated to match that of the first option in the Listbox as it is the selected option.


## Usage

The list is displayed when users click on the trigger or press <kbd>&#8593;</kbd>, <kbd>&#8595;</kbd>, <kbd>Enter</kbd> or <kbd>Space</kbd> while the trigger is focussed. The list is aware of it's position in the window and will appear below the trigger if there is enough space, otherwise it will appear above.

Clicking on an option or navigating to it using <kbd>&#8593;</kbd> or <kbd>&#8595;</kbd> and pressing <kbd>Enter</kbd> or <kbd>Space</kbd> will select the option, hide the list and update the trigger text to match that of the selected option.

Type-ahead can also be used to select an option by typing one or more characters that the option's text starts with. Repeatedly typing the same character with a short delay in-between will cycle through all matching options. Type-ahead can be used on a focussed trigger, which will select the option and update the trigger text, or in a list where it will only select the option but not update the trigger text until <kbd>Enter</kbd> or <kbd>Space</kbd> are pressed to confirm. Pressing <kdb>Esc</kbd> or clicking outside the element closes an open list without confirming a change in selected option.


## SASS

The following SASS is applied to the component, each declaration of which can be overridden by a single class selector. The SASS variables use `!default` so can also be easily overridden by users. The list also inherits Listbox styles detailed in the *SASS* section [here](/listbox).

```scss
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
  position: absolute;
  text-align: left;
  top: 100%;
  white-space: nowrap;
  z-index: $ace-select-list-z-index;
}

[ace-select-list-hidden] {
  display: none;
}
```


## Custom events

Select uses the following custom events, the names of which are exported as properties of `EVENTS`, similar to `ATTRS`, so they may be imported into other modules and dispatched or listened for.


### Option selected

`ace-select-option-selected`

This event is dispatched on `window` when a new option is selected and its `detail` object is composed as follows:

```js
'detail': {
  'id': // ID of the Select
  'option': {
    'id': // ID of selected option
    'index': // Index of selected option
  },
}
```


### Update options

`ace-select-update-options`

This event should be dispatched when a Listbox's options are altered, e.g. when options are added or deleted. The event `detail` object should be composed as follows:

```js
'detail': {
  'id': // ID of Select
}
```




## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.


### Default Select

The default Select.

```html
<ace-select>
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
</ace-select>
```

### Select with options containing images

A Select with options containing images.

```html
<ace-select>
  <button></button>
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
</ace-select>
```


### Select with dynamic options

In this example the Select instantiates with an empty `<ul>` that can be populated with options using **Add option**. The first option can be removed using the **Remove option**. Both these buttons dispatch the `ace-select-update-options` event that updates the Listbox and the trigger text. The extra JavaScript code to achieve this is also included below.

```html
<button id="add-option">
  Add option
</button>
<button id="remove-option">
  Remove option
</button>
<ace-select id="dynamic-select">
  <button>No options yet</button>
</ace-select>
```

```js
import Select, {EVENTS} from '../../ace/components/select/select.js';

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  const selectId = 'dynamic-select';
  const selectListEl = document.querySelector(`#${selectId} ul`);

  const updateOptions = () => {
    window.dispatchEvent(new CustomEvent(
      EVENTS.UPDATE_OPTIONS,
      {
        'detail': {
          'id': selectId,
        }
      },
    ));
  };

  document.getElementById('add-option')
    .addEventListener('click', () => {
      const selectOptionEls = selectListEl.querySelectorAll('li');
      const optionCount = selectOptionEls.length || 0;
      selectListEl.innerHTML += `<li>New option ${optionCount + 1}</li>`;
      updateOptions();
    });

  document.getElementById('remove-option')
    .addEventListener('click', () => {
      const fistOptionEl = selectListEl.querySelector('li');
      if (!fistOptionEl) {
        return;
      }
      selectListEl.removeChild(fistOptionEl);
      updateOptions();
    });
});
```
