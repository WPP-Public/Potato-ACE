# Combobox

Combobox is a combination of a text box and a pop-up listbox containing options that help the user set the value of the text box.

Combobox conforms to the ARIA 1.0 pattern of [W3C's WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox).


## Setup

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/combobox/combobox'
```

Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/combobox/combobox';
```

For convenience the ES6 class is exported as `Combobox` and the attribute names used by the class are exported as properties of `ATTRS`.

After the event `DOMContentLoaded` is fired on `document`, an instance of Combobox is instantiated within each `<ace-combobox>` element, and an ID `ace-combobox-<n>` is addded for any instance without one, where `<n>` is a unique integer. Once instantiation is complete a custom event `ace-combobox-ready` is dispatched on `window`. See the **Custom events** section below for more details.

Combobox must have a nested input box and will use a `<input>` with attribute `ace-combobox-input`. If no descendant has this attribute then the first decendant `<input>` will be used and given the attribute. It is strongly recommended that this `<input>` is given an accessible label using either `aria-label` or `aria-labelledby`. Similarly, Combobox must have a nested list and will use a `<ul>` with attribute `ace-combobox-list`. If no descendant has this attribute then the first decendant `<ul>` will be used and given the attribute. It is strongly recommended that the `<ul>` is given an accessible label using `aria-label`, describing its options.

The list can be empty upon instantiation and options can be dynamically added to, or removed from, it later as long as custom event `ace-combobox-update-options` is dispatched on the Combobox instance afterwards.


## Usage

Comboboxes come in three main types depending on auto-complete behaviour; no auto-completion, list auto-completion, and inline and list auto-completion. Futhermore, each of these types can have manual or automatic selection, where no option or the first option is selected respectively when the listbox appears or its options are updated. Manual selection is the default behaviour and users can select the first or last option in the listbox once it appears by pressing <kbd>&#8593;</kbd> or <kbd>&#8595;</kbd> respectively. Automatic selection can be activated by adding an attribute `ace-combobox-autoselect` to the Combobox.

The following features apply to all Combobox types:

- <kbd>&#8595;</kbd> selects the next option unless no option or the last option is selected in which cases it selects the first option.
- <kbd>&#8593;</kbd> selects the previous option unless no option or the first option is selected in which cases it selects the last option.
- <kbd>Esc</kbd> hides the listbox without changing the value of the input textbox.
-  <kbd>Enter</kbd> chooses the selected option changing the input textbox value to match that of the chosen option and dispatching a custom event `ace-combobox-option-chosen`. This is also achieved by clicking on an option. An attribute `ace-combobox-no-input-update` can be added to the Combobox to dispatch the event without updating the input textbox.
- When the Combobox loses focus the listbox is automatically hidden. If the listbox had a selected option before it was hidden that option is automatically chosen.


### Basic Combobox

The basic Combobox, instantiated by default, has no auto-complete behaviour and therefore contains a list of options that remain unchanged regardless of user input. This type is typically used to suggest recently entered strings, for example recently searched for values. The listbox of a basic Combobox is automatically shown when the Combobox gains focus.

### List auto-completion Combobox

In this type of Combobox the listbox options are filtered to only show options with text that starts with the characters typed by the user. To instantiate a Combobox with list auto-completion add `aria-autocomplete="list"` to the `<input>` element.

### Inline and list auto-completion Combobox

A Combobox with input and list auto-completion behaves the same as that with list auto-completion and additionally changes the input value to match the text of the selected option. For the automatic selection variant the input textbox value is auto-completed as the user types, with the portion of the string not typed by the user highlighted as selected text so it can be overwritten.  To instantiate a Combobox with inline and list auto-completion add `aria-autocomplete="both"` to the `<input>` element.

## Styles

The following SASS is applied to the component, each declaration of which can be overridden by a single CSS class selector. The SASS variables use `!default` so can also be easily overridden by users. `@import '../../common/constants'` imports shared styles used for making sure the that the entire listbox is always visible within a window.

```scss
@import '../../common/constants';


/* VARIABLES */
$ace-combobox-list-bg-color: #fff !default;
$ace-combobox-list-z-index: 1 !default;
$ace-combobox-option-selected-bg-color: $ace-color-selected !default;


/* STYLES */
ace-combobox {
  display: inline-block;
  position: relative;
}

[ace-combobox-input] {
  width: 100%;
}

[ace-combobox-list] {
  background: $ace-combobox-list-bg-color;
  height: auto;
  left: 0;
  list-style: none;
  position: absolute;
  text-align: left;
  top: 100%;
  white-space: nowrap;
  width: 100%;
  z-index: $ace-combobox-list-z-index;
}

[ace-combobox-list-visible="false"] {
  display: none;
}

[ace-combobox-option] {
  &:hover {
    background-color: $ace-combobox-option-selected-bg-color;
  }
}

[ace-combobox-option-selected] {
  background-color: $ace-combobox-option-selected-bg-color;
}


@import '../../common/utils';
```


## Custom events

Combobox uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.

### Dispatched events

The following events are dispatched on `window` by Combobox.

#### Ready

`ace-combobox-ready`

This event is dispatched when Combobox finishes initialising. The event name is available as `EVENTS.OUT.READY`, and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Combobox [string]
}
```

#### List toggled

`ace-combobox-list-toggled`

This event is dispatched when the listbox is toggled. The event name is available as `EVENTS.OUT.LIST_TOGGLED`, and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Combobox [string],
  'listVisibile': // Whether the listbox is visible or not [boolean]
}
```


#### Option selected

`ace-combobox-option-selected`

This event is dispatched when a listbox option is selected. The event name is available as `EVENTS.OUT.OPTION_SELECTED`, and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Combobox [string],
  'selectedOptionId': // ID of selected option [string]
}
```


#### Option chosen

`ace-combobox-option-chosen`

This event is dispatched when an option is chosen by the user, either by clicking on an option or by pressing <kbd>Enter</kbd> when the listbox has a selected option. The event name is available as `EVENTS.OUT.OPTION_CHOSEN`, and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Combobox [string],
  'chosenOptionId': // ID of chosen option [string]
}
```


#### Options updated

`ace-combobox-options-updated`

This event is dispatched when Select has finished updating its options. The event name is available as `EVENTS.OUT.OPTIONS_UPDATED`, and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Combobox [string]
}
```


### Listened for events

Combobox listens for the following events, which should be dispatched by the user's code on the specific `ace-combobox` element.

#### Hide and show list

`ace-combobox-hide-list` & `ace-combobox-show-list`

These events should be dispatched to hide & show the listbox respectively. The event names are available as `EVENTS.IN.HIDE_LIST` & `EVENTS.IN.SHOW_LIST`.


#### Select option

`ace-combobox-select-option`

This event should be dispatched to programatically select an option. The event name is available as `EVENTS.IN.SELECT_OPTION`, and its `detail` object should be composed as follows:

```js
'detail': {
  'optionId': // ID of option to select [string]
}
```

#### Update options

`ace-combobox-update-options`

This event should be dispatched when options are added or deleted, and causes Combobox to reinitialise itself. The event name is available as `EVENTS.IN.UPDATE_OPTIONS`.



## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.

### Comboboxes with manual selection

These are the three types of Comboboxes, all with manual selection.

```html
<h4>No auto-complete</h4>
<span id="combobox-label-1">Choose an Avenger:</span>

<ace-combobox>
  <input aria-labelledby="combobox-label-1"/>
  <ul aria-label="Avengers">
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
</ace-combobox>

<hr>

<h4>List auto-complete</h4>
<span id="combobox-label-2">Choose an Avenger:</span>

<ace-combobox id="ac-list-combobox">
  <input aria-autocomplete="list" aria-labelledby="combobox-label-2"/>
  <ul aria-label="Avengers">
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
</ace-combobox>

<hr>

<h4>Inline and list auto-complete</h4>
<span id="combobox-label-3">Choose an Avenger:</span>

<ace-combobox id="ac-both-combobox">
  <input aria-autocomplete="both" aria-labelledby="combobox-label-3"/>
  <ul aria-label="Avengers">
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
</ace-combobox>
```

### Comboboxes with automatic selection

Same as previous example but with automatic selection enabled.

```html
<h4>No auto-complete</h4>
<span id="combobox-label-4">Choose an Avenger:</span>

<ace-combobox ace-combobox-autoselect id="basic-autoselect-combobox">
  <input aria-labelledby="combobox-label-4"/>
  <ul aria-label="Avengers">
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
</ace-combobox>

<hr>

<h4>List auto-complete</h4>
<span id="combobox-label-5">Choose an Avenger:</span>

<ace-combobox ace-combobox-autoselect id="ac-list-autoselect-combobox">
  <input aria-autocomplete="list" aria-labelledby="combobox-label-5"/>
  <ul aria-label="Avengers">
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
</ace-combobox>

<hr>

<h4>Inline and list auto-complete</h4>
<span id="combobox-label-6">Choose an Avenger:</span>

<ace-combobox ace-combobox-autoselect id="ac-both-autoselect-combobox">
  <input aria-autocomplete="both" aria-labelledby="combobox-label-6"/>
  <ul aria-label="Avengers">
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
</ace-combobox>
```

### Combobox controlled using custom events

The buttons in this example dispatch the `ace-tabs-set-prev-tab`, `ace-tabs-set-next-tab` and `ace-tabs-update-tabs` custom events on the Tabs.

The **Add options** button adds options to the initially empty Combobox then dispatches the `ace-combobox-update-options` custom event. The **Show list** and **Hide list** buttons dispatch the `ace-combobox-show-list` and `ace-combobox-hide-list` custom events to show and hide the listbox respectively. An option in the listbox can be selected by setting the option number in the **Select option** input and clicking **Go**, which dispatches the `ace-combobox-select-option` custom event. The extra JavaScript used by this example is also shown below.

```html
<button id="add-options-btn">Add options</button>
<button id="show-list-btn">Show list</button>
<button id="hide-list-btn">Hide list</button>
<form id="select-option-form">
  <label>
    Select option:
    <input id="select-option-input" max="3" min="1" name="option-number" type="number">
  </label>
  <button type="submit">Go</button>
</form>
<hr>
<span id="combobox-label-7">Custom events controlled Combobox:</span>
<ace-combobox id="custom-events-combobox">
  <input aria-labelledby="combobox-label-7">
  <ul aria-label="Custom events combobox options"></ul>
</ace-combobox>
```

```js
import {ATTRS, EVENTS} from '/ace/components/combobox/combobox.js';

document.addEventListener('DOMContentLoaded', () => {
  const comboboxEl = document.getElementById('custom-events-combobox');
  const comboboxListEl = comboboxEl.querySelector(`[${ATTRS.LIST}]`);
  const selectOptionForm = document.getElementById('select-option-form');

  window.addEventListener('click', (e) => {
    switch (e.target.id) {
      case 'add-options-btn':
        for (let i = 0; i < 3; i++) {
          const newOption = document.createElement('li');
          newOption.textContent = 'New Option';
          comboboxListEl.appendChild(newOption);
        }
        comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_OPTIONS));
        break;
      case 'show-list-btn':
        comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.SHOW_LIST));
        break;
      case 'hide-list-btn':
        comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.HIDE_LIST));
        break;
    }
  });

  selectOptionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const optionNumber = +new FormData(e.target).get('option-number');
    const option = comboboxEl.querySelectorAll('li')[optionNumber - 1];
    if (!option) {
      return;
    }
    comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.SELECT_OPTION, {
      detail: {
        optionId: option.id,
      }
    }));
  });
});
```


### Combobox with dynamically updated options

This example demonstrated how Combobox can be used as a search box with results optained through an API call. The user types in a search string and hits <kbd>Enter</kbd> to start the search. This starts a timeout of 3 seconds to simulate the delay associated with a slow API call. An element with the attribute `aria-live="polite"` is used to announce to the user via the screen reader that the search is underway. After the timeout, results are added to the listbox, which is then update by dispatching the `ace-combobox-update-options` custom event. The `aria-live="polite"` element is finally updated to announce how many results were found.

Custom styles, shown below, have been applied to this example using HTML classes, to make it look like a Google Material component. The extra JavaScript used by this example is also shown below.


```html
<label id="combobox-label-8">Search:</label>
<ace-combobox id="search-combobox" ace-combobox-no-input-update class="styled-combobox">
  <div class="styled-combobox__wrapper">
    <input aria-labelledby="combobox-label-8" class="styled-combobox__input">
    <ul aria-label="Search results" class="styled-combobox__list"></ul>
  </div>
  <p aria-live="polite" class="styled-combobox__status"></p>
  <p id="chosen-search-result" aria-live="polite"></p>
</ace-combobox>
```

```scss
.styled-combobox {
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  letter-spacing: .5px;

  &__wrapper {
    margin: 10px 0;
    width: 300px;
  }

  &__input {
    border: 1px solid rgba(0, 0, 0, .38);
    border-radius: 4px;
    font-size: 1em;
    padding: 12px 16px 14px;
  }

  &__status {
    padding: 8px;
  }

  &__list {
    border: 1px solid #e5e5e5;
    padding: 8px 0;

    li {
      padding: 8px 16px;
      user-select: none;

      &:hover {
        background-color: rgba(0, 0, 0, .1);
      }
    }

    [ace-combobox-option-selected] {
      background-color: rgba(0, 0, 0, .1);
    }
  }
}
```

```js
import {ATTRS, EVENTS} from '/ace/components/combobox/combobox.js';
import {KEYS} from '../../../common/constants.js';
import {keyPressedMatches} from '../../../common/functions.js';

export const fakeDelay = 3000;

const comboboxId = 'search-combobox';

document.addEventListener('DOMContentLoaded', () => {
  let optionChosen, searching = false;
  const comboboxEl = document.getElementById(comboboxId);
  const comboboxInputEl = comboboxEl.querySelector(`[${ATTRS.INPUT}]`);
  const comboboxStatusEl = comboboxEl.querySelector('[aria-live="polite"]');
  const comboboxListEl = comboboxEl.querySelector(`[${ATTRS.LIST}]`);
  const chosenResultEl = document.getElementById('chosen-search-result');

  // Search when ENTER key pressed
  comboboxInputEl.addEventListener('keydown', async (e) => {
    const keyPressed = e.key || e.which || e.keyCode;
    if (!keyPressedMatches(keyPressed, KEYS.ENTER)) {
      return;
    }

    // If option selected when ENTER pressed prevent search
    if (optionChosen) {
      optionChosen = false;
      return;
    }

    // Fake search
    if (searching) {
      return;
    }
    searching = true;
    // Update status element to inform user there will be a delay
    comboboxStatusEl.textContent = 'Searching...';
    // Simulate an API reponse delay
    const results = await new Promise(resolve => setTimeout(() => {
      const data = [];
      for (let i=1; i < 6; i++) {
        data.push({id: `result-${i}`, text: `Result ${i}`});
      }
      resolve(data);
    }, fakeDelay));

    // Add results to DOM
    comboboxStatusEl.textContent = `${results.length} result${results.length === 1 ? '' : 's' } found`;
    comboboxListEl.innerHTML = '';
    results.forEach((result) => {
      const resultOption = document.createElement('li');
      resultOption.textContent = result.text;
      resultOption.id = result.id;
      comboboxListEl.appendChild(resultOption);
    });
    // Update combobox options
    comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_OPTIONS));
    searching = false;
  });

  // Show list when clicking on input if list has options
  comboboxInputEl.addEventListener('click', () => {
    if (comboboxListEl.childNodes.length === 0) {
      return;
    }
    comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.SHOW_LIST));
  });

  // Show results list when options intialised
  window.addEventListener(EVENTS.OUT.OPTIONS_UPDATED, (e) => {
    const detail = e['detail'];
    if (!detail || !detail['id'] || detail['id'] !== comboboxId) {
      return;
    }
    comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.SHOW_LIST));
  });

  // Listen for chosen options
  window.addEventListener(EVENTS.OUT.OPTION_CHOSEN, (e) => {
    const detail = e['detail'];
    if (!detail || !detail['id'] || detail['id'] !== comboboxId) {
      return;
    }
    optionChosen = true;
    chosenResultEl.textContent = `Option with ID '${detail['chosenOptionId']}' chosen.`;

    // Hide list
    comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.HIDE_LIST));
  });
});
```
