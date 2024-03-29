# Select

Select is a dropdown list of options that mimics a native HTML `<select>` that has attribute `size` with a value of 1 or without it, while allowing more styling flexibility.

Select conforms to the [W3C WAI-ARIA authoring practices](https://www.w3.org/TR/examples/listbox/listbox-collapsible.html), with the exception of a few minor interactions that allow it to more closely mimic a native HTML `<select>` element.


## Set up

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/select/select';
```

Alternatively *ace.scss* includes all ACE component SASS files, so if using multiple ACE components it can be imported instead:

```scss
@import '<path-to-node_modules>/@potato/ace/ace';
```

A CSS file is also provided for convenience and is located at `<path-to-node_modules>/@potato/ace/components/select/ace-select.css`.

Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/select/select';
```

For convenience the ES6 class is exported as `Select` and the attribute names used by the class are exported as properties of `ATTRS`.

After the event `DOMContentLoaded` is fired on `document` an instance of Select is instantiated within each `<ace-select>` element and an ID `ace-select-<n>` is added for any instance without one, where `<n>` is a unique integer. Once instantiation is complete a custom event `ace-select-ready` is dispatched to `window`. See the **Custom events** section below for more details.

Select must have a descendant button to show the hidden list of options, so if one is not present Select will create a `<button>` to use, prepend it to itself and update its text to match that of the first option in the list. Select must also have a descendant list and will use the first descendant `<ul>` for this. This list can be empty upon instantiation and options can be dynamically added to, or removed from, it later as long as custom event `ace-select-update-options` is dispatched to the Select instance afterwards.

If using a Select in a HTML `<form>` the attribute `ace-select-for-form` can be added to it which causes it to create a hidden `<input>` with attribute `ace-select-input`. The value of the selected option is stored as the value of the `<input>` in the form of a URI encoded string. Similarly, the selected option ID is stored as the value of the `<input>` attribute `data-ace-listbox-selected-option-id`.

If using a Select in a HTML `<form>` the attribute `ace-select-for-form` can be added to it which causes it to create a hidden `<input>` with attribute `ace-select-input`. The value of the selected option is stored as the value of the `<input>` in the form of a URI encoded string. Similarly, the selected option ID is stored as the value of the `<input>` attribute `data-ace-listbox-selected-option-id`.


## Usage

The list of options is displayed when users click on the trigger or press <kbd>&#8593;</kbd>, <kbd>&#8595;</kbd>, <kbd>Enter</kbd> or <kbd>Space</kbd> while the trigger is focused, with <kbd>&#8593;</kbd> selecting the last option in the list and the other three keys selecting the first. The list is aware of it's position within the window and ensures that it is fully visible in the viewport. It will hence appear below the trigger and aligned to it's left edge if there is enough space, otherwise it will appear above and/or aligned to the right edge, as necessary.

Clicking on an option or navigating to it using <kbd>&#8593;</kbd> or <kbd>&#8595;</kbd> and pressing <kbd>Enter</kbd> or <kbd>Space</kbd> will select the option, hide the list and update the trigger text to match that of the selected option, and then dispatch the `ace-select-option-chosen` custom event.

Type-ahead can also be used to select an option by typing one or more characters that the option's text starts with. Repeatedly typing the same character with a short delay in-between will cycle through all matching options. Type-ahead can be used on a focused trigger, which will select the option and update the trigger text, or in a list where it will only select the option but not update the trigger text until <kbd>Enter</kbd> or <kbd>Space</kbd> are pressed to confirm. Pressing <kdb>Esc</kbd> or clicking outside the Select component hides a shown list without confirming a change in the selected option.


## Styles

The following SASS is applied to Select. The SASS variables use `!default` so can also be easily overridden by users. SASS variables used that are not defined here are defined in *<path-to-node_modules>/@potato/ace/common/constants.scss*.

```scss
@import '../../common/constants';


// VARIABLES
$ace-select-list-bg-color: #fff !default;
$ace-select-list-height: auto !default;
$ace-select-option-text-color: #000 !default;
$ace-select-selected-option-bg-color: $ace-color-selected !default;
$ace-select-selected-option-text-color: #fff !default;


// STYLES
ace-select {
	position: relative;
}

[ace-select-list] {
	background: $ace-select-list-bg-color;
	color: $ace-select-option-text-color;
	height: $ace-select-list-height;
	left: 0;
	list-style: none;
	overflow-y: auto;
	position: absolute;
	user-select: none;
	white-space: nowrap;
	z-index: $ace-select-list-z-index;

	&:not([ace-select-list-visible]) {
		display: none;
	}

	[aria-selected="true"] {
		background: $ace-select-selected-option-bg-color;
		color: $ace-select-selected-option-text-color;
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

Select uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.

### Dispatched events

The following events are dispatched to `window` by Select.

#### Ready

`ace-select-ready`

This event is dispatched when Select finishes initialising just after page load, and after dynamically added options are initialised in response to the `ace-select-update-options` custom event being dispatched. The event name is available as `EVENTS.OUT.READY` and its `detail` property is composed as follows:

```js
'detail': {
	'id': // ID of Select [string]
}
```

#### Option chosen

`ace-select-option-chosen`

This event is dispatched when an option is chosen by the user. The event name is available as `EVENTS.OUT.OPTION_CHOSEN` and its `detail` property is composed as follows:

```js
'detail': {
	'id': // ID of Select [string],
	'chosenOption': {
		'id': // ID of chosen option [string],
		'index': // Index of chosen option [number]
	},
}
```

### Listened for event

Select listens for the following event that should be dispatched to `window`.

#### Update options

`ace-select-update-options`

This event should be dispatched when options are added to or removed from the list and causes Select to initialise them and then dispatch the `ace-select-ready` event. The event name is available as `EVENTS.IN.UPDATE_OPTIONS` and its `detail` property should be composed as follows:

```js
'detail': {
	'id': // ID of target Select [string]
}
```


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.


### Simple Select

The default Select.

```html
<label id="ace-select-1-label">Choose an Avenger:</label>
<ace-select>
	<ul aria-labelledby="ace-select-1-label">
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

### Select for forms

A Select to be used with HTML forms, with a hidden `<input>` with the selected option data.

```html
<label id="ace-select-1-label">Choose an Avenger:</label>
<ace-select ace-select-for-form id="for-form-select">
	<ul aria-labelledby="ace-select-1-label">
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

### Select with dynamic options

In this example the Select instantiates with an empty `<ul>` that can be populated with options using **Add option**. The last option can be removed using the **Remove option**. Both these buttons dispatch the `ace-select-update-options` event that updates the list options, and the trigger text. The extra JavaScript code required by this example is also included below.

```html
<button id="add-option">
	Add option
</button>
<button id="remove-option">
	Remove option
</button>
<hr>
<label id="custom-events-select-label">Choose an Avenger:</label>
<ace-select id="custom-events-select">
	<button><span ace-select-trigger-text>No options available</span></button>
	<ul aria-labelledby="custom-events-select-label"></ul>
</ace-select>
```

```js
import { EVENTS } from '/ace/components/select/select.js';

document.addEventListener('DOMContentLoaded', () => {
	const SELECT_ID = 'custom-events-select';
	const selectListEl = document.querySelector(`#${SELECT_ID} ul`);

	const updateOptions = () => window.dispatchEvent(new CustomEvent(
		EVENTS.IN.UPDATE_OPTIONS,
		{'detail': {'id': SELECT_ID}},
	));

	document.getElementById('add-option').addEventListener('click', () => {
		const optionEl = document.createElement('li');
		optionEl.textContent = 'Option';
		selectListEl.appendChild(optionEl);
		updateOptions();
	});

	document.getElementById('remove-option').addEventListener('click', () => {
		const lastOptionEl = selectListEl.querySelector('li:last-child');
		if (lastOptionEl) {
			selectListEl.removeChild(lastOptionEl);
			updateOptions();
		}
	});
});
```

### Styled Select

An example of how Select can be styled, with the applied CSS shown below.

```html
<label id="styled-select-label" class="styled-select-label">Choose an Avenger:</label>
<ace-select class="styled-select">
	<button ace-select-trigger class="styled-select__trigger">
	</button>
	<ul aria-labelledby="styled-select-label" class="styled-select__list">
		<li class="styled-select__option">
			Select an option
		</li>
		<li class="styled-select__option">
			<img alt="Potato logo" class="styled-select__img" src="/img/logo.svg" />
			Iron Man
		</li>
		<li class="styled-select__option">
			<img alt="Potato logo" class="styled-select__img" src="/img/logo.svg" />
			Nick Fury
		</li>
		<li class="styled-select__option">
			<img alt="Potato logo" class="styled-select__img" src="/img/logo.svg" />
			Hulk
		</li>
		<li class="styled-select__option">
			<img alt="Potato logo" class="styled-select__img" src="/img/logo.svg" />
			Thor
		</li>
		<li class="styled-select__option">
			<img alt="Potato logo" class="styled-select__img" src="/img/logo.svg" />
			Captain America
		</li>
		<li class="styled-select__option">
			<img alt="Potato logo" class="styled-select__img" src="/img/logo.svg">
			Black Widow
		</li>
		<li class="styled-select__option">
			<img alt="Potato logo" class="styled-select__img" src="/img/logo.svg" />
			Scarlet Witch
		</li>
	</ul>
</ace-select>
```

```scss
.styled-select {
	display: block;
	margin-top: 10px;

	&-label,
	&__trigger,
	&__option {
		font-family: 'Roboto', sans-serif;
		font-size: 14px;
	}

	&__trigger,
	&__list {
		border: 1px solid #837b8b;
		border-radius: 4px;
		width: 300px;

		&:focus {
			outline-color: #41354d;
		}
	}

	&__trigger,
	&__option {
		padding: 10px 16px;
	}

	&__trigger {
		background: transparent;
		display: flex;
		justify-content: space-between;

		&::after {
			color: #837b8b;
			content: '\25BC';
		}

		&:focus::after {
			color: #41354d;
		}
	}

	&__list {
		height: 225px;
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
