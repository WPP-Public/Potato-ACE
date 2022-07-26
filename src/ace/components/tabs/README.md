# Tabs

Tabs is a set of sections of content known as panels, of which only is displayed at a time, each with an associated button, or tab, used to display the panel.

Tabs conforms to the [W3C WAI-ARIA authoring practices](https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/).


## Set up

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/tabs/tabs';
```

Alternatively *ace.scss* includes all ACE component SASS files, so if using multiple ACE components it can be imported instead:

```scss
@import '<path-to-node_modules>/@potato/ace/ace';
```

A CSS file is also provided for convenience and is located at `<path-to-node_modules>/@potato/ace/components/tabs/ace-tabs.css`.

Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/tabs/tabs';
```

For convenience the ES6 class is exported as `Tabs` and the attribute names used by the class are exported as properties of `ATTRS`.

After the event `DOMContentLoaded` is fired on `document` an instance of Tabs is instantiated within each `<ace-tabs>` element and an ID `ace-tabs-<n>` is added for any instance without one, where `<n>` is a unique integer. Once instantiation is complete a custom event `ace-tabs-ready` is dispatched to `window`. See the **Custom events** section below for more details.

The buttons that display the panels, known as tabs, must be nested within a tablist element with attribute `ace-tabs-tablist`. If no descendant has this attribute then the first child `<div>` will be used and given this attribute. It is strongly recommended that this tablist element be provided with an accessible label using `aria-label` or `aria-labelledby`. The word "tablist" should not be included in the label as Tabs has `role="tablist"` which is read out by screen readers.

Tabs must also have the same number of panel elements as tabs. Tabs will use any descendant with attribute `ace-tabs-panel`. If no descendants have this attribute then all child elements except the first, which should be the tablist, will be used and given this attribute.


## Usage

The displayed panel of Tabs can be changed using the tab buttons, keyboard keys or custom events; or by changing the value of its attribute `ace-tabs-selected-tab` to the panel's number, e.g. `2` will display the second panel and `3` the third. This attribute can be set before instantiation to display a specific panel on page load, but if omitted Tabs will add it and set its value to `1` thereby displaying the first panel. The attribute's value is also dynamically updated when the displayed panel is changed using the other methods.

When a tab is focused, pressing <kbd>&#8592;</kbd> or <kbd>&#8594;</kbd> (<kbd>&#8593;</kbd> or <kbd>&#8595;</kbd> for vertical Tabs) will select the previous or next tab in the list respectively, while pressing <kbd>Home</kbd> or <kbd>End</kbd> will select the first or last tab respectively.

Tabs can be added or removed dynamically as long as custom event `ace-tabs-update` is dispatched to the Tabs component afterwards.

Giving the Tabs the attribute `ace-tabs-infinite` allows infinite rotation through panels, where pressing <kbd>&#8592;</kbd> (or <kbd>&#8593;</kbd> for vertical Tabs) with the first panel displayed will display the last, and pressing <kbd>&#8594;</kbd> (or <kbd>&#8595;</kbd> in vertical Tabs) with the last panel displayed will display the first. Giving the Tabs the attribute `ace-tabs-vertical` stacks the tabs vertically and makes <kbd>&#8593;</kbd> and <kbd>&#8595;</kbd> change the displayed panel, rather than <kbd>&#8592;</kbd> or <kbd>&#8594;</kbd>. These two attributes are observed attributes that can be added or removed to dynamically enable or disable their respective behaviour.

Tabs can be given the attribute `ace-tabs-manual` which will cause the arrow keys to change the focused tab without changing the displayed panel. For these Tabs the focused tab's corresponding panel can be displayed manually by pressing <kbd>Space</kbd> or <kbd>Enter</kbd>.

Tabs with the attribute `ace-tabs-deep-linked` are deep-linked meaning that whenever the displayed panel changes, the page URL is dynamically updated to include a search parameter with key and value equal to the Tabs ID and the displayed panel respectively. Deep linking works with multiple Tabs components, each adding a search parameter to the URL. When a page is loaded if the URL contains a search parameter for a deep-linked Tabs component, the panel whose number matched the search parameter value is displayed. This is a useful feature for sharing pages with specific tabs diplayed.


## Styles

The following SASS is applied to Tabs. The SASS variables use `!default` so can also be easily overridden by users. SASS variables used that are not defined here are defined in *<path-to-node_modules>/@potato/ace/common/constants.scss*.

```scss
@import '../../common/constants';


// VARIABLES
$ace-tabs-selected-tab-border-color: $ace-color-selected !default;
$ace-tabs-selected-tab-border-width: 4px !default;
$ace-tabs-tab-bg-color: transparent !default;
$ace-tabs-tab-padding-horizontal: $ace-spacing-4 !default;
$ace-tabs-tab-padding-vertical: $ace-spacing-2 !default;
$ace-tabs-tab-padding: $ace-spacing-3 !default;
$ace-tabs-tab-focus-and-hover-bg-color: $ace-color-hover !default;
$ace-tabs-tablist-margin: $ace-spacing-2 !default;
$ace-tabs-panel-padding: 16px !default;


// STYLES
[ace-tabs-tablist] {
	display: flex;
	overflow: auto hidden;
	white-space: nowrap;
}

[ace-tabs-tab] {
	background-color: $ace-tabs-tab-bg-color;
	border-color: transparent;
	border-style: solid;
	border-width: 0 0 $ace-tabs-selected-tab-border-width 0;
	cursor: pointer;
	padding: $ace-tabs-tab-padding-vertical $ace-tabs-tab-padding-horizontal;

	&:focus,
	&:hover {
		background-color: $ace-tabs-tab-focus-and-hover-bg-color;
	}

	&:focus {
		outline: none;
	}
}

[ace-tabs-tab-selected] {
	border-color: $ace-tabs-selected-tab-border-color;
}

[ace-tabs-panel] {
	padding: $ace-tabs-panel-padding;

	&:not([ace-tabs-panel-visible]) {
		display: none;
	}
}


// Vertical Tabs
[ace-tabs-vertical] {
	display: flex;

	[ace-tabs-tablist] {
		flex-direction: column;
		overflow: hidden auto;
	}

	[ace-tabs-tab] {
		border-width: 0 $ace-tabs-selected-tab-border-width 0 0;
	}
}
```


## Custom events

Tabs uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.


### Dispatched events

The following events are dispatched to `window` by Tabs.

#### Ready

`ace-tabs-ready`

This event is dispatched when Tabs finishes initialising just after page load, and after dynamically added descendants are initialised in response to the `ace-tabs-update` custom event being dispatched. The event name is available as `EVENTS.OUT.READY` and its `detail` property is composed as follows:

```js
'detail': {
	'id': // ID of Tabs [string]
}
```


#### Selected tab changed

`ace-tabs-selected-tab-changed`

This event is dispatched when the selected tab changes. Listening for this event can be useful for timing and triggering animations on Tabs.
The event name is available as `EVENTS.OUT.SELECTED_TAB_CHANGED` and its `detail` property is composed as follows:

```js
'detail': {
	'id': // ID of Tabs [string]
	'currentlySelectedTab': {
		'id': // Currently selected tab ID [string]
		'number': // Currently selected tab number [number]
	},
	'previouslySelectedTab': {
		'id': // Previously selected tab ID [string]
		'number': // Previously selected tab number [number]
	}
}
```


### Listened for events

Tabs listens for the following events that should be dispatched to `window`.

#### Previous tab

`ace-tabs-set-prev-tab`

This event should be dispatched to select the previous tab, or the last tab if the first tab is selected and Tabs has attribute `ace-tabs-infinite`. The event name is available as `EVENTS.IN.SET_PREV_TAB` and its `detail` property should be composed as follows:

```js
'detail': {
	'id': // ID of target Tabs [string]
}
```


#### Next tab

`ace-tabs-set-next-tab`

This event should be dispatched to select the next tab, or the first tab if the last tab is selected and Tabs has attribute `ace-tabs-infinite`. The event name is available as `EVENTS.IN.SET_NEXT_TAB` and its `detail` property should be composed as follows:

```js
'detail': {
	'id': // ID of target Tabs [string]
}
```


#### Update tabs

`ace-tabs-update`

This event should be dispatched when tabs are added or removed and causes Tabs to initialise them and then dispatch the `ace-tabs-ready` event.tgabs The event name is available as `EVENTS.IN.UPDATE` and its `detail` property should be composed as follows:

```js
'detail': {
	'id': // ID of target Tabs [string]
}
```


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.


### Simple Tabs

The default Tabs with three tabs.

```html
<ace-tabs>
	<div aria-label="Basic Tabs">
		<button>Tab 1</button>
		<button>Tab 2</button>
		<button>Tab 3</button>
	</div>
	<div>
		<h3>Panel 1 heading</h3>
		<p>Panel 1 content.</p>
		<img src="/img/logo.svg" height="100px" alt="Potato logo" />
	</div>
	<div>
		<h3>Panel 2 heading</h3>
		<p>Panel 2 content.</p>
		<img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone" />
	</div>
	<div>
		<h3>Panel 3 heading</h3>
		<p>Panel 3 content.</p>
		<img src="/img/goggles-spuddy.png" height="100px" alt="Potato Spuddy with virtual reality goggles" />
	</div>
</ace-tabs>
```

### Infinite rotation Tabs

Tabs with infinite rotation.

```html
<ace-tabs id="ace-infinite-tabs" ace-tabs-infinite ace-tabs-selected-tab="2">
	<div aria-label="Tabs with infinite scroll">
		<button>Tab 1</button>
		<button>Tab 2</button>
		<button>Tab 3</button>
	</div>
	<div>
		<h3>Panel 1 heading</h3>
		<p>Panel 1 content.</p>
		<img src="/img/logo.svg" height="100px" alt="Potato logo" />
	</div>
	<div>
		<h3>Panel 2 heading</h3>
		<p>Panel 2 content.</p>
		<img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone" />
	</div>
	<div>
		<h3>Panel 3 heading</h3>
		<p>Panel 3 content.</p>
		<img src="/img/goggles-spuddy.png" height="100px" alt="Potato Spuddy with virtual reality goggles" />
	</div>
</ace-tabs>
```

### Vertical Tabs

Tabs with vertically stacked tabs.

```html
<ace-tabs id="ace-vertical-tabs" ace-tabs-vertical>
	<div aria-label="Tabs with vertically-oriented tablist">
		<button>Tab 1</button>
		<button>Tab 2</button>
		<button>Tab 3</button>
	</div>
	<div>
		<h3>Panel 1 heading</h3>
		<p>Panel 1 content.</p>
		<img src="/img/logo.svg" height="100px" alt="Potato logo" />
	</div>
	<div>
		<h3>Panel 2 heading</h3>
		<p>Panel 2 content.</p>
		<img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone" />
	</div>
	<div>
		<h3>Panel 3 heading</h3>
		<p>Panel 3 content.</p>
		<img src="/img/goggles-spuddy.png" height="100px" alt="Potato Spuddy with virtual reality goggles" />
	</div>
</ace-tabs>
```

### Manually displayed Tabs

Tabs with panels that are displayed by pressing <kbd>Space</kbd> or <kbd>Enter</kbd> when their corresponding tab is focused.

```html
<ace-tabs id="ace-manual-tabs" ace-tabs-manual>
	<div aria-label="Tabs with manual activation">
		<button>Tab 1</button>
		<button>Tab 2</button>
		<button>Tab 3</button>
	</div>
	<div>
		<h3>Panel 1 heading</h3>
		<p>Panel 1 content.</p>
		<img src="/img/logo.svg" height="100px" alt="Potato logo" />
	</div>
	<div>
		<h3>Panel 2 heading</h3>
		<p>Panel 2 content.</p>
		<img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone" />
	</div>
	<div>
		<h3>Panel 3 heading</h3>
		<p>Panel 3 content.</p>
		<img src="/img/goggles-spuddy.png" height="100px" alt="Potato Spuddy with virtual reality goggles" />
	</div>
</ace-tabs>
```

### Deep-linked Tabs

Two Tabs components with deep linking enabled. 

```html
<h3>Deep-linked</h3>

<ace-tabs id="ace-deep-linked-tabs-1" ace-tabs-deep-linked>
	<div aria-label="Deep-linked Tabs">
		<button>Tab 1</button>
		<button>Tab 2</button>
		<button>Tab 3</button>
	</div>
	<div>
		<h3>Panel 1 heading</h3>
		<p>Panel 1 content.</p>
		<img src="/img/logo.svg" height="100px" alt="Potato logo" />
	</div>
	<div>
		<h3>Panel 2 heading</h3>
		<p>Panel 2 content.</p>
		<img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone" />
	</div>
	<div>
		<h3>Panel 3 heading</h3>
		<p>Panel 3 content.</p>
		<img src="/img/goggles-spuddy.png" height="100px" alt="Potato Spuddy with virtual reality goggles" />
	</div>
</ace-tabs>

<hr>

<h3>Deep-linked vertical Tabs with initially set tab 2</h3>

<ace-tabs id="ace-deep-linked-tabs-2" ace-tabs-deep-linked ace-tabs-vertical ace-tabs-selected-tab="2">
	<div aria-label="Deep-linked, vertical Tabs with initially set tab">
		<button>Tab 1</button>
		<button>Tab 2</button>
		<button>Tab 3</button>
	</div>
	<div>
		<h3>Panel 1 heading</h3>
		<p>Panel 1 content.</p>
		<img src="/img/logo.svg" height="100px" alt="Potato logo" />
	</div>
	<div>
		<h3>Panel 2 heading</h3>
		<p>Panel 2 content.</p>
		<img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone" />
	</div>
	<div>
		<h3>Panel 3 heading</h3>
		<p>Panel 3 content.</p>
		<img src="/img/goggles-spuddy.png" height="100px" alt="Potato Spuddy with virtual reality goggles" />
	</div>
</ace-tabs>
```

### Tabs controlled using custom events

The buttons in this example dispatch the `ace-tabs-set-prev-tab`, `ace-tabs-set-next-tab` and `ace-tabs-update-tabs` custom events on the Tabs. The JavaScript used by this example is shown below.

```html
<p>These buttons dispatch custom events</p>
<button id="prev-tab-btn">Prev tab</button>
<button id="next-tab-btn">Next tab</button>
<button id="add-tab-btn">Add tab to end</button>
<button id="remove-tab-btn">Remove last tab</button>

<hr>

<ace-tabs id="ace-custom-events-tabs">
	<div aria-label="Tabs that repond to custom events">
		<button>Tab 1</button>
		<button>Tab 2</button>
		<button>Tab 3</button>
	</div>
	<div>
		<h3>Panel 1 heading</h3>
		<p>Panel 1 content.</p>
		<img src="/img/logo.svg" height="100px" alt="Potato logo" />
	</div>
	<div>
		<h3>Panel 2 heading</h3>
		<p>Panel 2 content.</p>
		<img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone" />
	</div>
	<div>
		<h3>Panel 3 heading</h3>
		<p>Panel 3 content.</p>
		<img src="/img/goggles-spuddy.png" height="100px" alt="Potato Spuddy with virtual reality goggles" />
	</div>
</ace-tabs>
```

```js
import { ATTRS, EVENTS } from '/ace/components/tabs/tabs.js';

document.addEventListener('DOMContentLoaded', () => {
	const TABS_ID = 'ace-custom-events-tabs';
	const tabsEl = document.getElementById(TABS_ID);
	const tablistEl = tabsEl.querySelector(`[${ATTRS.TABLIST}]`);

	const addTab = () => {
		const tabNumber = tablistEl.children.length + 1;
		const newTab = document.createElement('button');
		newTab.textContent = `Tab ${tabNumber}`;
		tablistEl.appendChild(newTab);

		const heading = document.createElement('h3');
		heading.textContent = `Panel ${tabNumber}`;
		const p = document.createElement('p');
		p.textContent = `This tab was added dynamically, after this Tabs component was initialised`;
		const newPanel = document.createElement('div');
		newPanel.setAttribute(ATTRS.PANEL, '');
		newPanel.appendChild(heading);
		newPanel.appendChild(p);
		tabsEl.appendChild(newPanel);
	};

	const removeTab = () => {
		tablistEl.removeChild(tablistEl.lastElementChild);
		tabsEl.removeChild(tabsEl.lastElementChild);
	};

	window.addEventListener('click', (e) => {
		const targetId = e.target.id;
		switch (targetId) {
			case 'prev-tab-btn':
			case 'next-tab-btn': {
				const event = EVENTS.IN[`SET_${targetId === 'prev-tab-btn' ? 'PREV' : 'NEXT'}_TAB`];
				window.dispatchEvent(new CustomEvent(
					event,
					{'detail': {'id': TABS_ID}},
				));
				break;
			}
			case 'add-tab-btn':
			case 'remove-tab-btn':
				if (targetId === 'add-tab-btn') {
					addTab();
				} else {
					removeTab();
				}
				window.dispatchEvent(new CustomEvent(
					EVENTS.IN.UPDATE,
					{'detail': {'id': TABS_ID}},
				));
				break;
		}
	});
});
```


### Styled Tabs

An example of how Tabs can be styled, with the applied CSS shown below.

```html
<ace-tabs class="styled-tabs">
	<div aria-label="Basic Tabs" class="styled-tabs__tablist">
		<button class="styled-tabs__tab">Tab 1</button>
		<button class="styled-tabs__tab">Tab 2</button>
		<button class="styled-tabs__tab">Tab 3</button>
	</div>
	<div class="styled-tabs__panel">
		<h3>Panel 1 heading</h3>
		<p>Panel 1 content.</p>
		<img src="/img/logo.svg" height="100px" alt="Potato logo" />
	</div>
	<div class="styled-tabs__panel">
		<h3>Panel 2 heading</h3>
		<p>Panel 2 content.</p>
		<img src="/img/phone-spuddy.png" height="100px" alt="Potato Spuddy with headphones and phone" />
	</div>
	<div class="styled-tabs__panel">
		<h3>Panel 3 heading</h3>
		<p>Panel 3 content.</p>
		<img src="/img/goggles-spuddy.png" height="100px" alt="Potato Spuddy with virtual reality goggles" />
	</div>
</ace-tabs>
```

```scss
.styled-tabs {
	display: block;
	max-width: 500px;

	&__tab,
	&__panel {
		font-family: 'Roboto', sans-serif;
		font-size: 14px;
	}

	&__tab {
		border-color: #41354d;
		flex-grow: 1;

		&:focus,
		&:hover {
			background: #41354d;
			color: #fff;
		}
	}

	&__panel {
		border: 4px solid #41354d;
		border-top: none;
	}

	[ace-tabs-tab-selected] {
		background: #41354d;
		border-color: #41354d;
		color: #fff;

		&:focus {
			border-color: #00bed0;
		}
	}
}

```
