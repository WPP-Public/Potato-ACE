# Menu

Menu is a component that contains a button that shows a hidden menu comprised of options.

Menu conforms to the [W3C WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton).


## Set up

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/menu/menu';
```

Alternatively *ace.scss* includes all ACE component SASS files, so if using multiple ACE components it can be imported instead:

```scss
@import '<path-to-node_modules>/@potato/ace/ace';
```

A CSS file is also provided for convenience and is located at `<path-to-node_modules>/@potato/ace/components/menu/ace-menu.css`.

Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/menu/menu';
```

For convenience the ES6 class is exported as `Menu` and the attribute names used by the class are exported as properties of `ATTRS`.

After the event `DOMContentLoaded` is fired on `document` an instance of Menu is instantiated within each `<ace-menu>` element and an ID `ace-menu-<n>` is added for any instance without one, where `<n>` is a unique integer. Once instantiation is complete a custom event `ace-menu-ready` is dispatched on `window`. See the **Custom events** section below for more details.

Menu must have both a descendant button, to show the hidden list of options, and a the descendant list and will use the first descendant `<ul>` for this. This list can be empty upon instantiation and options can be dynamically added to, or removed from, it later as long as custom event `ace-menu-update-options` is dispatched on the Menu instance afterwards.


## Usage

The list of options is displayed when users click on the trigger or press <kbd>&#8593;</kbd>, <kbd>&#8595;</kbd>, <kbd>Enter</kbd> or <kbd>Space</kbd> while the trigger is focused, with <kbd>&#8593;</kbd> also selecting the last option in the list and the other three keys also selecting the first option. The list is aware of it's position in the window and ensures that it is fully visible in the viewport. It will hence appear below the trigger and aligned to it's left edge if there is enough space, otherwise it will appear above and/or aligned to the right edge, as necessary. Clicking outside a shown list or pressing <kdb>Esc</kbd> hides the list.

Clicking on an option or navigating to it using <kbd>&#8593;</kbd> or <kbd>&#8595;</kbd> and pressing <kbd>Enter</kbd> will select the option, hide the list and dispatch the `ace-menu-option-chosen` custom event.

Type-ahead can also be used to select an option by typing one or more characters that the option's text starts with. Repeatedly typing the same character with a short delay in-between will cycle through all matching options.


## Styles

The following SASS is applied to Menu. The SASS variables use `!default` so can also be easily overridden by developers. SASS variables used that are not defined here are defined in *<path-to-node_modules>/@potato/ace/common/constants.scss*.


```scss
@import '../../common/constants';


// VARIABLES
$ace-menu-list-bg-color: #fff !default;
$ace-menu-option-text-color: #000 !default;
$ace-menu-selected-option-bg-color: $ace-color-selected !default;
$ace-menu-selected-option-text-color: #fff !default;


// STYLES
ace-menu {
	position: relative;
}

[ace-menu-list] {
	background: $ace-menu-list-bg-color;
	color: $ace-menu-option-text-color;
	left: 0;
	list-style: none;
	position: absolute;
	user-select: none;
	white-space: nowrap;
	z-index: $ace-menu-list-z-index;

	&:focus {
		outline: none;
	}

	&:not([ace-menu-list-visible]) {
		display: none;
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

[ace-menu-option] {
	&:hover,
	&[aria-selected="true"] {
		background: $ace-menu-selected-option-bg-color;
		color: $ace-menu-selected-option-text-color;
	}
}
```


## Custom events

Menu uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.


### Dispatched events

The following events are dispatched on `window` by Menu.


#### Ready

`ace-menu-ready`

This event is dispatched when Menu finishes initialising just after page load, and after dynamically added options are initialised in response to the `ace-menu-update-options` custom event being dispatched. The event name is available as `EVENTS.OUT.READY` and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Menu [string]
}
```


#### Option chosen

`ace-menu-option-chosen`

This event is dispatched when an option is chosen by the user. The event name is available as `EVENTS.OUT.OPTION_CHOSEN` and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Menu [string],
  'chosenOption': {
    'id': // ID of chosen option [string],
    'index': // Index of chosen option [number]
  },
}
```


### Listened for event

Menu listens for the following event, which should be dispatched on the specific `ace-menu` element.


#### Update options

`ace-menu-update-options`

This event should be dispatched when options are added to or removed from the list and causes Menu to initialise them and then dispatch the `ace-menu-ready` event. The event name is available as `EVENTS.IN.UPDATE_OPTIONS`.


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.

### Simple Menu

Example of a simple Menu with options that contain text and an opiton containing a link.
 
```html
<ace-menu>
	<button>Menu trigger</button>
	<ul>
		<li>First Option</li>
		<li>Second Option</li>
		<li>Third Option</li>
		<li><a href="/">Link to homepage</a></li>
	</ul>
</ace-menu>
```

### Menu with dynamic options

In this example the Menu instantiates with an empty `<ul>` that can be populated with options using **Add option**. The last option can be removed using the **Remove option**. Both these buttons dispatch the `ace-menu-update-options` event that updates the list options. The extra JavaScript code required by this example is also included below.
 
```html
<button id="add-option">
	Add option
</button>
<button id="remove-option">
	Remove option
</button>
<hr>
<ace-menu id="custom-events-menu">
	<button>Menu Trigger</button>
	<ul></ul>
</ace-menu>
```
 
```js
import { EVENTS } from '/ace/components/menu/menu.js';

document.addEventListener('DOMContentLoaded', () => {
	const menuEl = document.getElementById('custom-events-menu');
	const menuListEl = menuEl.querySelector('ul');

	const updateOptions = () => menuEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE_OPTIONS));

	document.getElementById('add-option').addEventListener('click', () => {
		const optionEl = document.createElement('li');
		optionEl.textContent = 'Option';
		menuListEl.appendChild(optionEl);
		updateOptions();
	});

	document.getElementById('remove-option').addEventListener('click', () => {
		const lastOptionEl = menuListEl.querySelector('li:last-child');
		if (lastOptionEl) {
			menuListEl.removeChild(lastOptionEl);
			updateOptions();
		}
	});
});
```

### Styled Menu

An example of how Menu can be styled, with the applied CSS shown below.

```html
<div class="styled-menu-container">
	<ace-menu class="styled-menu" id="styled-menu">
		<button aria-label="View more options" title="View more options" class="styled-menu__trigger">
		</button>
		<ul class="styled-menu__list">
			<li class="styled-menu__option">
				<img alt="Potato logo" src="/img/logo.svg" />
				First option
			</li>
			<li class="styled-menu__option">
				<img alt="Potato Spuddy with headphones and phone" src="/img/phone-spuddy.png" />
				Second option
			</li>
			<li class="styled-menu__option">
				<img alt="Potato Spuddy with virtual reality goggles" src="/img/goggles-spuddy.png" />
				Third option
			</li>
		</ul>
	</ace-menu>
</div>
```

```scss
.styled-menu {
	&-container {
		display: flex;
		flex-direction: row-reverse;
	}

	&__trigger {
		background: transparent;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		font-size: 35px;
		height: 40px;
		position: relative;
		transition: background-color .2s;
		width: 40px;

		&:focus,
		&:hover {
			background-color: #00bed0;
			color: white;
		}

		&:focus {
			outline: none;
		}

		&::after {
			content: '\2807';
			display: inline-block;
			left: 30%;
			position: absolute;
			top: 0;
		}
	}

	&__list {
		border-radius: 4px;
		box-shadow: 0 2px 10px 0 #837b8b;
		padding: 8px 0;
	}

	&__option {
		align-items: center;
		cursor: pointer;
		display: flex;
		font-family: 'Roboto', sans-serif;
		font-size: 14px;
		padding: 10px 16px;

		&:hover,
		&[aria-selected="true"] {
			background: #41354d;
		}

		img {
			height: 2em;
			margin-right: 10px;
		}
	}
}
```
