# Combobox

Combobox is a combination of an input text box and a popup listbox containing options that help the user set the value of the text box.

Combobox conforms to W3C WAI-ARIA authoring practices specified [here](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox).


## Instantiation

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/combobox/combobox'
```


Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/combobox/combobox';
```

For the sake of convenience the ES6 class is exported as `Combobox`. To avoid name clashes the `as` keyword can be used when importing, e.g. `import Combobox as aceCombobox from ...`.

The attribute names used by the class are also exported as properties of `ATTRS`.

After `DOMContentLoaded` is fired, Combobox automatically instantiates an instance of itself within each `<ace-combobox>` element. Combobox then adds an ID `ace-combobox-<n>` for any instance without one, where `<n>` is the instance number. Once instantiation is complete a custom event `ace-combobox-ready` is dispatched on `window`. See the **Custom events** section below for more details.


## Usage

Comboboxes come in three main types depending on autocomplete behaviour; no autocompletion, list autocompletion, and inline and list autocompletion. Futhermore, each of these types can have manual or automatic selection, where no option or the first option is selected respectively when the listbox appears or its options are updated. Manual selection is the default behaviour and users can select the first or last option in the listbox once it appears by pressing <kbd>&#8593;</kbd> or <kbd>&#8595;</kbd> respectively. Automatic selection can be activated by adding an attribute `ace-combobox-autoselect` to the Combobox.

The following features apply to all Combobox types:

- <kbd>&#8595;</kbd> selects the next option unless no option or the last option is selected in which cases it selects the first option.
- <kbd>&#8593;</kbd> selects the previous option unless no option or the first option is selected in which cases it selects the last option.
- <kbd>Esc</kbd> hides the listbox without changing the value of the input textbox.
-  <kbd>Enter</kbd> chooses the selected option changing the input textbox value to match that of the chosen option and dispatching a custom event `ace-combobox-option-chosen` (see the **Custom events** section below for more details). This is also achieved by clicking on an option. An attribute `ace-combobox-no-input-update` can be added to the Combobox to dispatch the event without updating the input textbox.
- When the Combobox loses focus the listbox is automatically hidden. If the listbox had a selected option before it was hidden that option is automatically chosen.


### Basic Combobox

The basic Combobox, instantiated by default, has no autocomplete behaviour and therefore contains a list of options that remain unchanged regardless of user input. This type is typically used to suggest recently entered strings, for example recently searched for values. The listbox of a basic Combobox is automatically shown when the Combobox gains focus.

### List autocompletion Combobox

In this type of Combobox the listbox options are filtered to only show options with text that starts with the characters typed by the user. To instantiate a Combobox with list autocompletion add `aria-autocomplete="list"` to the `<input>` element.

### Inline and list autocompletion Combobox

A Combobox with input and list autocompletion behaves the same as that with list autocompletion and additionally changes the input value to match the text of the selected option. For the automatic selection variant the input textbox value is autocompleted as the user types, with the portion of the string not typed by the user highlighted as selected text so it can be overwritten.  To instantiate a Combobox with inline and list autocompletion add `aria-autocomplete="both"` to the `<input>` element.

## Styles

The following SASS is applied to the component, each declaration of which can be overridden by a single CSS class selector. The SASS variables use `!default` so can also be easily overridden by users. `@import '../../common/utils'` imports some shared styles used for making sure the listbox is always visible within the window.

```scss
/* VARIABLES */
$ace-combobox-list-bg-color: #fff !default;
$ace-combobox-list-z-index: 1 !default;
$ace-combobox-option-selected-bg-color: #c2ddef !default;


/* STYLES */
[ace-combobox-wrapper] {
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
<h4>No autocomplete</h4>
<ace-combobox id="ace-combobox-basic">
  <label>Choose an Avenger:</label>
  <div ace-combobox-wrapper>
    <input />
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
  </div>
</ace-combobox>

<hr>

<h4>List autocomplete</h4>
<ace-combobox id="ace-combobox-ac-list">
  <label>Choose an Avenger:</label>
  <div ace-combobox-wrapper>
    <input aria-autocomplete="list"/>
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
  </div>
</ace-combobox>

<hr>

<h4>Inline and list autocomplete</h4>
<ace-combobox id="ace-combobox-ac-both">
  <label>Choose an Avenger:</label>
  <div ace-combobox-wrapper>
    <input aria-autocomplete="both"/>
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
  </div>
</ace-combobox>
```

### Comboboxes with automatic selection

Same as previous example but with automatic selection enabled.

```html
<h4>No autocomplete</h4>
<ace-combobox id="ace-combobox-basic-as" ace-combobox-autoselect="true">
  <label>Choose an Avenger:</label>
  <div ace-combobox-wrapper>
    <input />
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
  </div>
</ace-combobox>

<hr>

<h4>List autocomplete</h4>
<ace-combobox id="ace-combobox-ac-list-as" ace-combobox-autoselect="true">
  <label>Choose an Avenger:</label>
  <div ace-combobox-wrapper>
    <input aria-autocomplete="list"/>
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
  </div>
</ace-combobox>

<hr>

<h4>Inline and list autocomplete</h4>
<ace-combobox id="ace-combobox-ac-both-as" ace-combobox-autoselect="true">
  <label>Choose an Avenger:</label>
  <div ace-combobox-wrapper>
    <input aria-autocomplete="both"/>
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
  </div>
</ace-combobox>
```

### Combobox controlled with custom events 

The **Add options** button adds options to the initially empty Combobox, while the **Show list** and **Hide list** buttons show and hide the listbox respectively. An option in the listbox can be selected by setting the option number in the **Select which option to choose** input and clicking the **Select option** button. All the buttons in this example make use of Combobox's custom events. The extra JavaScript required by this example is also shown below.

```html
<button id="add-options-btn">Add options</button>
<button id="show-list-btn">Show list</button>
<button id="hide-list-btn">Hide list</button>

<br><label for="select-option-number-input">Select which option to choose:</label><br>
<input id="select-option-number-input" type="number" name="option" min="1" max="3"><br>
<button id="select-option-btn">Select option</button>

<ace-combobox id="ace-combobox-custom-events">
  <label>Custom events combobox:</label><br>
  <ul aria-label="Custom events combobox options"></ul>
</ace-combobox>
```

```js
import {ATTRS, EVENTS} from '/ace/components/combobox/combobox.js';

document.addEventListener('DOMContentLoaded', () => {
  const comboboxEl = document.getElementById('ace-combobox-custom-events');
  const comboboxListEl = comboboxEl.querySelector(`[${ATTRS.LIST}]`);
  const optionNumberEl = document.getElementById('select-option-number-input');

  window.addEventListener('click', (e) => {
    switch (e.target.id) {
      case 'add-options-btn':
        comboboxListEl.innerHTML = `
          <li>New Option 1</li>
          <li>New Option 2</li>
          <li>New Option 3</li>`;
        comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_OPTIONS));
        break;

      case 'show-list-btn':
        comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.SHOW_LIST));
        break;

      case 'hide-list-btn':
        comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.HIDE_LIST));
        break;

      case 'select-option-btn': {
        const optionNumber = parseInt(optionNumberEl.value);
        const option = comboboxEl.querySelectorAll('li')[optionNumber-1];
        if (!option) {
          return;
        }
        comboboxEl.dispatchEvent(new CustomEvent(EVENTS.IN.SELECT_OPTION, {
          'detail': {
            'optionId': option.id
          }
        }));
        break;
      }
    }
  });
});
```


### Combobox with dynamically updated options

This example demonstrated how Combobox can be used as a search box with results optained through an API call. The user types in a search string and hits <kbd>Enter</kbd> to start the search. This starts a timeout of 3 seconds to simulate the delay associated with a slow API call. An element with the attribute `aria-live="polite"` is used to announce to the user via the screen reader that the search is underway. After the timeout, results are added to the listbox, which is then update by dispatching the `ace-combobox-update-options` custom event. The `aria-live="polite"` element is finally updated to announce how many results were found.

Custom styles, shown below, have been applied to this example using HTML classes, to make it look like a Google Material component. The extra JavaScript required by this example is also shown below.


```html
<ace-combobox id="search-combobox" ace-combobox-no-input-update class="styled-combobox">
  <label>Search:</label><br>
  <div ace-combobox-wrapper class="styled-combobox__wrapper">
    <input class="styled-combobox__input">
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
        background-color: rgba(0, 0, 0, .04);
      }
    }

    [ace-combobox-option-selected] {
      background-color: rgba(0, 0, 0, .04);
    }
  }
}
```

```js
import {ATTRS, EVENTS} from '/ace/components/combobox/combobox.js';
import {KEYS} from '../../../common/constants.js';
import {keyPressedMatches} from '../../../common/functions.js';

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
    }, 3000));

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
