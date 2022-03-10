# Combobox

Combobox is a combination of a text box and a pop-up listbox containing options that help the user set the value of the text box.

Combobox conforms to the ARIA 1.0 pattern of [W3C's WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox).


## Set up

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/combobox/combobox';
```

Alternatively *ace.scss* includes all ACE component SASS files, so if using multiple ACE components it can be imported instead:

```scss
@import '<path-to-node_modules>/@potato/ace/ace';
```

A CSS file is also provided for convenience and is located at `<path-to-node_modules>/@potato/ace/components/combobox/ace-combobox.css`.

Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/combobox/combobox';
```

For convenience the ES6 class is exported as `Combobox` and the attribute names used by the class are exported as properties of `ATTRS`.

After the event `DOMContentLoaded` is fired on `document` an instance of Combobox is instantiated within each `<ace-combobox>` element and an ID `ace-combobox-<n>` is added for any instance without one, where `<n>` is a unique integer. Once instantiation is complete a custom event `ace-combobox-ready` is dispatched to `window`. See the **Custom events** section below for more details.

Combobox must have a descendant input box and will use a `<input>` with attribute `ace-combobox-input`. If no descendant has this attribute then the first decendant `<input>` will be used and given the attribute. It is strongly recommended that this `<input>` is given an accessible label using either `aria-label` or `aria-labelledby`. Similarly, Combobox must have a descendant list and will use a `<ul>` with attribute `ace-combobox-list`. If no descendant has this attribute then the first decendant `<ul>` will be used and given the attribute. It is strongly recommended that the `<ul>` is given an accessible label using `aria-label`, describing its options.

The list can be empty upon instantiation and options can be dynamically added to, or removed from, it later as long as custom event `ace-combobox-update-options` is dispatched to the Combobox instance afterwards.


## Usage

Comboboxes come in three main types depending on auto-complete behaviour; no auto-completion, list auto-completion, and inline and list auto-completion. Futhermore, each of these types can have manual or automatic selection, where no option or the first option is selected respectively when the listbox appears or its options are updated. Manual selection is the default behaviour and users can select the first or last option in the listbox once it appears by pressing <kbd>&#8593;</kbd> or <kbd>&#8595;</kbd> respectively. Automatic selection can be activated by adding an attribute `ace-combobox-autoselect` to the Combobox.

The following features apply to all Combobox types:

- <kbd>&#8595;</kbd> selects the next option unless no option or the last option is selected in which cases it selects the first option.
- <kbd>&#8593;</kbd> selects the previous option unless no option or the first option is selected in which cases it selects the last option.
- <kbd>Esc</kbd> hides the listbox without changing the value of the input textbox.
-  <kbd>Enter</kbd> chooses the selected option changing the input textbox value to match that of the chosen option and dispatching a custom event `ace-combobox-option-chosen`. This is also achieved by clicking on an option. An attribute `ace-combobox-no-input-update` can be added to the Combobox to dispatch the event without updating the input textbox.
- When the Combobox loses focus the listbox is automatically hidden. If the listbox had a selected option before it was hidden that option is automatically chosen.


### Simple Combobox

The Combobox, instantiated by default, has no auto-complete behaviour and therefore contains a list of options that remain unchanged regardless of user input. This type is typically used to suggest recently entered strings, for example recently searched for values. The listbox of a simple Combobox is automatically shown when the Combobox gains focus.

### List auto-completion Combobox

In this type of Combobox the listbox options are filtered to only show options with text that starts with the characters typed by the user. To instantiate a Combobox with list auto-completion add `aria-autocomplete="list"` to the `<input>` element.

### Inline and list auto-completion Combobox

A Combobox with input and list auto-completion behaves the same as that with list auto-completion and additionally changes the input value to match the text of the selected option. For the automatic selection variant the input textbox value is auto-completed as the user types, with the portion of the string not typed by the user highlighted as selected text so it can be overwritten. To instantiate a Combobox with inline and list auto-completion add `aria-autocomplete="both"` to the `<input>` element.

## Styles

The following SASS is applied to Combobox. The SASS variables use `!default` so can also be easily overridden by users. SASS variables used that are not defined here are defined in *<path-to-node_modules>/@potato/ace/common/constants.scss*, which also contains styles used for making sure the entire listbox is always visible within a window.

```scss
@import '../../common/constants';


// VARIABLES
$ace-combobox-list-bg-color: #fff !default;
$ace-combobox-list-height: auto !default;
$ace-combobox-selected-option-bg-color: $ace-color-selected !default;
$ace-combobox-selected-option-text-color: #fff !default;


// STYLES
ace-combobox {
	display: inline-block;
	position: relative;
}

[ace-combobox-input] {
	width: 100%;
}

[ace-combobox-list] {
	background: $ace-combobox-list-bg-color;
	height: $ace-combobox-list-height;
	left: 0;
	list-style: none;
	overflow-y: auto;
	position: absolute;
	text-align: left;
	top: 100%;
	user-select: none;
	white-space: nowrap;
	width: 100%;
	z-index: $ace-combobox-list-z-index;

	&:not([ace-combobox-list-visible]) {
		display: none;
	}

	[aria-selected="true"] {
		background: $ace-combobox-selected-option-bg-color;
		color: $ace-combobox-selected-option-text-color;
	}

	&[ace-u-float-above] {
		bottom: 100%;
		top: initial;
	}

	&[ace-u-float-left] {
		left: initial;
		right: 0;
	}

	&[ace-u-float-right] {
		left: 0;
		right: initial;
	}
}
```


## Custom events

Combobox uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.

### Dispatched events

The following events are dispatched to `window` by Combobox.

#### Ready

`ace-combobox-ready`

This event is dispatched when Combobox finishes initialising. The event name is available as `EVENTS.OUT.READY` and its `detail` property is composed as follows:

```js
'detail': {
	'id': // ID of Combobox [string]
}
```

#### List toggled

`ace-combobox-list-toggled`

This event is dispatched when the listbox is toggled. The event name is available as `EVENTS.OUT.LIST_TOGGLED` and its `detail` property is composed as follows:

```js
'detail': {
	'id': // ID of Combobox [string],
	'listVisibile': // Whether the listbox is visible or not [boolean]
}
```


#### Option selected

`ace-combobox-option-selected`

This event is dispatched when a listbox option is selected. The event name is available as `EVENTS.OUT.OPTION_SELECTED` and its `detail` property is composed as follows:

```js
'detail': {
	'id': // ID of Combobox [string],
	'selectedOptionId': // ID of selected option [string]
}
```


#### Option chosen

`ace-combobox-option-chosen`

This event is dispatched when an option is chosen by the user, either by clicking on an option or by pressing <kbd>Enter</kbd> when the listbox has a selected option. The event name is available as `EVENTS.OUT.OPTION_CHOSEN` and its `detail` property is composed as follows:

```js
'detail': {
	'id': // ID of Combobox [string],
	'chosenOptionId': // ID of chosen option [string]
}
```


#### Options updated

`ace-combobox-options-updated`

This event is dispatched when Combobox has finished updating its options. The event name is available as `EVENTS.OUT.OPTIONS_UPDATED` and its `detail` property is composed as follows:

```js
'detail': {
	'id': // ID of Combobox [string]
}
```


### Listened for events

Combobox listens for the following events that should be dispatched to `window`.

#### Hide and show list

`ace-combobox-hide-list` & `ace-combobox-show-list`

These events should be dispatched to hide & show the listbox respectively. The event names are available as `EVENTS.IN.HIDE_LIST` & `EVENTS.IN.SHOW_LIST` and their `detail` properties should be composed as follows:

```js
'detail': {
  'id': // ID of target Combobox [string]
}
```


#### Select option

`ace-combobox-select-option`

This event should be dispatched to programatically select an option. The event name is available as `EVENTS.IN.SELECT_OPTION`, and its `detail` property should be composed as follows:

```js
'detail': {
	'id': // ID of target Combobox [string]
	'optionId': // ID of option to select [string]
}
```

#### Update options

`ace-combobox-update-options`

This event should be dispatched when options are added to or removed from the list and causes Combobox to initialise them and then dispatch the `ace-combobox-ready` event. The event name is available as `EVENTS.IN.UPDATE_OPTIONS`, and its `detail` property should be composed as follows:

```js
'detail': {
	'id': // ID of target Combobox [string]
}
```


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.

### Comboboxes with manual selection

These are the three types of Comboboxes, all with manual selection.

```html
<h4>No auto-complete</h4>
<span id="combobox-label-1">Choose an Avenger:</span>

<ace-combobox>
	<input aria-labelledby="combobox-label-1" />
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

<ace-combobox id="ace-ac-list-combobox">
	<input aria-autocomplete="list" aria-labelledby="combobox-label-2" />
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

<ace-combobox id="ace-ac-both-combobox">
	<input aria-autocomplete="both" aria-labelledby="combobox-label-3" />
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

<ace-combobox ace-combobox-autoselect id="ace-simple-autoselect-combobox">
	<input aria-labelledby="combobox-label-4" />
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

<ace-combobox ace-combobox-autoselect id="ace-ac-list-autoselect-combobox">
	<input aria-autocomplete="list" aria-labelledby="combobox-label-5" />
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

<ace-combobox ace-combobox-autoselect id="ace-ac-both-autoselect-combobox">
	<input aria-autocomplete="both" aria-labelledby="combobox-label-6" />
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

The **Add options** button adds options to the initially empty Combobox then dispatches the `ace-combobox-update-options` custom event. The **Show list** and **Hide list** buttons dispatch the `ace-combobox-show-list` and `ace-combobox-hide-list` custom events to show and hide the listbox respectively. An option in the listbox can be selected by setting the option number in the **Select option** input and clicking **Go**, which dispatches the `ace-combobox-select-option` custom event. The JavaScript used by this example is shown below.

```html
<button id="add-options-btn">Add options</button>
<button id="show-list-btn">Show list</button>
<button id="hide-list-btn">Hide list</button>
<form id="select-option-form">
	<label>
		Select option:
		<input id="select-option-input" max="3" min="1" name="option-number" type="number" />
	</label>
	<button type="submit">Go</button>
</form>
<hr>
<span id="combobox-label-7">Custom events controlled Combobox:</span>
<ace-combobox id="ace-custom-events-combobox">
	<input aria-labelledby="combobox-label-7" />
	<ul aria-label="Custom events combobox options"></ul>
</ace-combobox>
```

```js
import { ATTRS, EVENTS } from '/ace/components/combobox/combobox.js';

document.addEventListener('DOMContentLoaded', () => {
	const COMBOBOX_ID = 'ace-custom-events-combobox';
	const comboboxEl = document.getElementById(COMBOBOX_ID);
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
				window.dispatchEvent(new CustomEvent(
						EVENTS.IN.UPDATE_OPTIONS,
						{'detail': {'id': COMBOBOX_ID}},
					));
				break;
			case 'show-list-btn':
				window.dispatchEvent(new CustomEvent(
						EVENTS.IN.SHOW_LIST,
						{'detail': {'id': COMBOBOX_ID}},
					));
				break;
			case 'hide-list-btn':
				window.dispatchEvent(new CustomEvent(
						EVENTS.IN.HIDE_LIST,
						{'detail': {'id': COMBOBOX_ID}},
					));
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
		window.dispatchEvent(new CustomEvent(
			EVENTS.IN.SELECT_OPTION,
			{
				'detail': {
					'id': COMBOBOX_ID,
					'optionId': option.id,
				}
			}
		));
	});
});
```


### Search Combobox with dynamically updated options

This example demonstrates how Combobox can be used as a search box with results optained through an API call, where the user types a search string into the combobox then presses <kbd>Enter</kbd> to start the search. In the example the delay associated with a slow API call is simulated using a 3 second timeout. An element with attributes `role="status"` and `aria-live="polite"` is used to announce to the user via assistive technologies that the search is underway. After the timeout, results are added to the combobox's list, and are initialised by dispatching the `ace-combobox-update-options` custom event. The `role="status"` element is finally updated to announce how many results were found. The JavaScript used by this example is shown below.


```html
<p aria-live="polite" role="status" id="combobox-status"></p>

<div>
	<label id="search-combobox-label">Search:</label>
	<ace-combobox id="ace-search-combobox" ace-combobox-no-input-update>
		<input aria-labelledby="search-combobox-label" />
		<ul aria-label="Search results"></ul>
	</ace-combobox>
</div>

<p aria-live="polite" role="status" id="chosen-search-result"></p>

<hr>

<button id="reset-example-btn">Reset example</button>
```

```js
import { ATTRS, EVENTS } from '/ace/components/combobox/combobox.js';

export const FAKE_DELAY = 3000;
const COMBOBOX_ID = 'ace-search-combobox';

document.addEventListener('DOMContentLoaded', () => {
	let optionChosen, searching = false;
	const chosenResultEl = document.getElementById('chosen-search-result');
	const comboboxStatusEl = document.getElementById('combobox-status');
	const comboboxEl = document.getElementById(COMBOBOX_ID);
	const resetExampleBtn = document.getElementById('reset-example-btn');
	const comboboxInputEl = comboboxEl.querySelector(`[${ATTRS.INPUT}]`);
	const comboboxListEl = comboboxEl.querySelector(`[${ATTRS.LIST}]`);

	// Search when ENTER key pressed
	comboboxInputEl.addEventListener('keydown', async (e) => {
		const keyPressed = e.key || e.which || e.keyCode;
		if (!(keyPressed === 13 || keyPressed === 'Enter')) {
			return;
		}

		// If option selected when ENTER pressed prevent search
		if (optionChosen) {
			optionChosen = false;
			return;
		}

		if (searching || comboboxInputEl.value === '') {
			return;
		}
		searching = true;
		// Update status element to inform user there will be a delay
		comboboxStatusEl.textContent = 'Searching...';
		comboboxStatusEl.setAttribute('aria-busy', 'true');
		comboboxListEl.innerHTML = '';

		// Simulate an API reponse delay
		const results = await new Promise(resolve => setTimeout(() => {
			const data = [];
			for (let i = 1; i < 6; i++) {
				data.push({ id: `result-${i}`, text: `Result ${i}` });
			}
			resolve(data);
		}, FAKE_DELAY));

		// Add results to DOM
		comboboxStatusEl.setAttribute('aria-busy', 'false');
		comboboxStatusEl.textContent = `${results.length} result${results.length === 1 ? '' : 's'} found`;
		comboboxListEl.innerHTML = '';
		results.forEach((result) => {
			const resultOption = document.createElement('li');
			resultOption.textContent = result.text;
			resultOption.id = result.id;
			comboboxListEl.appendChild(resultOption);
		});
		// Update combobox options
		window.dispatchEvent(new CustomEvent(
			EVENTS.IN.UPDATE_OPTIONS,
			{'detail': {'id': COMBOBOX_ID}},
		));
		searching = false;
	});

	// Show list when clicking on input if list has options
	comboboxInputEl.addEventListener('click', () => {
		if (comboboxListEl.childNodes.length === 0) {
			return;
		}
		window.dispatchEvent(new CustomEvent(
			EVENTS.IN.SHOW_LIST,
			{'detail': {'id': COMBOBOX_ID}},
		));
	});

	// Show results list when options intialised
	window.addEventListener(EVENTS.OUT.OPTIONS_UPDATED, (e) => {
		const detail = e['detail'];
		if (!detail || !detail['id'] || detail['id'] !== COMBOBOX_ID) {
			return;
		}
		window.dispatchEvent(new CustomEvent(
			EVENTS.IN.SHOW_LIST,
			{'detail': {'id': COMBOBOX_ID}},
		));
	});

	// Listen for chosen options
	window.addEventListener(EVENTS.OUT.OPTION_CHOSEN, (e) => {
		const detail = e['detail'];
		if (!detail || !detail['id'] || detail['id'] !== COMBOBOX_ID) {
			return;
		}
		optionChosen = true;
		chosenResultEl.textContent = `Option with ID '${detail['chosenOptionId']}' chosen.`;

		// Hide list
		window.dispatchEvent(new CustomEvent(
			EVENTS.IN.HIDE_LIST,
			{'detail': {'id': COMBOBOX_ID}},
		));
	});

	// Show list when clicking on input if list has options
	resetExampleBtn.addEventListener('click', () => {
		chosenResultEl.textContent = '';
		comboboxStatusEl.textContent = '';
		comboboxInputEl.value = '';
		comboboxListEl.innerHTML = '';
	});
});
```


### Styled Combobox

An example of how Combobox can be styled, with the applied CSS shown below.

```html
<label id="styled-combobox-label" class="styled-combobox-label">Choose an Avenger:</label>

<ace-combobox ace-combobox-autoselect class="styled-combobox">
	<input aria-autocomplete="list" aria-labelledby="styled-combobox-label" class="styled-combobox__input" />
	<ul aria-label="Avengers" class="styled-combobox__list">
		<li class="styled-combobox__option">
			<img alt="Potato logo" class="styled-combobox__img" src="/img/logo.svg">
			Iron Man
		</li>
		<li class="styled-combobox__option">
			<img alt="Potato logo" class="styled-combobox__img" src="/img/logo.svg">
			Nick Fury
		</li>
		<li class="styled-combobox__option">
			<img alt="Potato logo" class="styled-combobox__img" src="/img/logo.svg">
			Hulk
		</li>
		<li class="styled-combobox__option">
			<img alt="Potato logo" class="styled-combobox__img" src="/img/logo.svg">
			Thor
		</li>
		<li class="styled-combobox__option">
			<img alt="Potato logo" class="styled-combobox__img" src="/img/logo.svg">
			Captain America
		</li>
		<li class="styled-combobox__option">
			<img alt="Potato logo" class="styled-combobox__img" src="/img/logo.svg">
			Black Widow
		</li>
		<li class="styled-combobox__option">
			<img alt="Potato logo" class="styled-combobox__img" src="/img/logo.svg">
			Scarlet Witch
		</li>
		<li class="styled-combobox__option">
			<img alt="Potato logo" class="styled-combobox__img" src="/img/logo.svg">
			Ant-Man
		</li>
		<li class="styled-combobox__option">
			<img alt="Potato logo" class="styled-combobox__img" src="/img/logo.svg">
			Black Panther
		</li>
		<li class="styled-combobox__option">
			<img alt="Potato logo" class="styled-combobox__img" src="/img/logo.svg">
			Spider-man
		</li>
		<li class="styled-combobox__option">
			<img alt="Potato logo" class="styled-combobox__img" src="/img/logo.svg">
			Doctor Strange
		</li>
		<li class="styled-combobox__option">
			<img alt="Potato logo" class="styled-combobox__img" src="/img/logo.svg">
			Captain Marvel
		</li>
	</ul>
</ace-combobox>
```

```scss
.styled-combobox {
	&-label,
	&__input,
	&__option,
	&__status {
		font-family: 'Roboto', sans-serif;
		font-size: 14px;
	}

	&__input,
	&__list {
		border: 1px solid #837b8b;
		border-radius: 4px;
		width: 300px;

		&:focus {
			outline-color: #41354d;
		}
	}

	&__input,
	&__option {
		padding: 10px 16px;
	}

	&__list {
		max-height: 225px;
	}

	&__option {
		align-items: center;
		display: flex;

		&[aria-selected="true"] {
			background: #41354d;
		}
	}

	&__img {
		height: 2em;
		margin-right: 10px;
	}
}
```
