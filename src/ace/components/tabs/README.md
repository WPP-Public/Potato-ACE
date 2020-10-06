# Tabs

Tabs is a set of sections of content known as panels, of which only is displayed at a time, each with an associated button, or tab, used to display the panel.

Tabs conforms to the [W3C WAI-ARIA authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel).


## Setup

First import the styles into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file:

```scss
@import '<path-to-node_modules>/@potato/ace/components/tabs/tabs'
```

Then import the class into your JavaScript entry point:

```js
import '<path-to-node_modules>/@potato/ace/components/tabs/tabs';
```

For convenience the ES6 class is exported as `Tabs` and the attribute names used by the class are exported as properties of `ATTRS`.

After the event `DOMContentLoaded` is fired on `document`, an instance of Tabs is instantiated within each `<ace-tabs>` element, and an ID `ace-tabs-<n>` is addded for any instance without one, where `<n>` is a unique integer. Once instantiation is complete a custom event `ace-tabs-ready` is dispatched on `window`. See the **Custom events** section below for more details.

The buttons that display the panels, known as tabs, must be nested within a tablist element with attribute `ace-tabs-tablist`. If no descendant has this attribute then the first child `<div>` will be used and given this attribute. It is strongly recommended that this tablist element be provided with an accessible label using `aria-label` or `aria-labelledby`.

Tabs must also have nested panel elements and will use any descendant with attribute `ace-tabs-panel`. If no descendants have this attribute then all child elements except the first one (tablist) will be used and given this attribute.


## Usage

By default, the first tab is selected and so the panel content for the first tab is displayed. If a user clicks on a tab then the content for that tab will be revealed and the previous content hidden. When the tablist is focused, pressing <kbd>&#8592;</kbd> or <kbd>&#8594;</kbd> (<kbd>&#8593;</kbd> or <kbd>&#8595;</kbd> if tablist is vertical) will select the previous or next tab in the list and select it. Tabbing while focused on the tablist will then focus the content for the selected tab. Pressing <kbd>Home</kbd> when the tablist is focused will select the first tab in the tablist and <kbd>End</kbd> will select the last.


## Styles

The following SASS is applied to the component, each declaration of which can be overridden by a single class selector. The SASS variables use `!default` so can also be easily overridden by users.

```scss
@import '../../common/constants';


/* VARIABLES */
$ace-tabs-tablist-margin: $ace-spacing-2 !default;
$ace-tabs-tab-bg-colour: transparent !default;
$ace-tabs-tab-padding-horizontal: $ace-spacing-4 !default;
$ace-tabs-tab-padding-vertical: $ace-spacing-2 !default;
$ace-tabs-tab-hover-bg-colour: $ace-color-hover !default;
$ace-tabs-selected-tab-border-colour: $ace-color-focus !default;
$ace-tabs-selected-tab-border-width: 3px !default;


/* STYLES */
[ace-tabs-vertical] {
  display: flex;
}

[ace-tabs-tablist] {
  display: flex;
  margin: 0 0 $ace-tabs-tablist-margin 0;
  overflow: auto hidden;
  white-space: nowrap;
}

[ace-tabs-tab] {
  background-color: $ace-tabs-tab-bg-colour;
  border-color: transparent;
  border-style: solid;
  border-width: 0 0 $ace-tabs-selected-tab-border-width 0;
  cursor: pointer;
  padding: $ace-tabs-tab-padding-vertical $ace-tabs-tab-padding-horizontal;

  &:hover {
    background-color: $ace-tabs-tab-hover-bg-colour;
  }

  &:focus {
    // TODO: Add keyboard only focus
    background-color: $ace-tabs-tab-hover-bg-colour;
    outline: none;
  }
}

[ace-tabs-tab-visible="false"] {
  display: none;
}

[ace-tabs-tab-selected] {
  border-bottom-color: $ace-tabs-selected-tab-border-colour;
}


// Vertical variant
[ace-tabs-tablist-vertical] {
  flex-direction: column;
  margin: 0 $ace-tabs-tablist-margin 0 0;
  overflow: hidden auto;
}

[ace-tabs-tab-vertical] {
  border-width: 0 $ace-tabs-selected-tab-border-width 0 0;

  &[ace-tabs-tab-selected] {
    border-right-color: $ace-tabs-selected-tab-border-colour;
  }
}
```


## Custom events

Tabs uses the following custom events, the names of which are available in its exported `EVENTS` object, similar to `ATTRS`, so they may be imported into other modules.


### Dispatched events

The following events are dispatched on `window` by Tabs.

#### Ready

`ace-tabs-ready`

This event is dispatched when Tabs finishes initialising. The event name is available as `EVENTS.OUT.READY`, and its `detail` property is composed as follows:

```js
'detail': {
  'id': // ID of Tabs [string]
}
```


#### Tab changed

`ace-tabs-tab-changed`

This event is dispatched when the selected tab changes. Listening for this event can be useful for timing and triggering animations on Tabs.

The event `detail` object is composed as follows:

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

Tabs listens for the following events, which should be dispatched by the user's code on the specific `ace-tabs` element.

#### Previous tab

`ace-tabs-set-prev-tab`

This event should be dispatched to select the previous tab, or the last tab if the first tab is selected and Tabs has attribute `ace-tabs-infinite`. The event name is available as `EVENTS.IN.SET_PREV_TAB`.


#### Next tab

`ace-tabs-set-next-tab`

This event should be dispatched to select the next tab, or the first tab if the last tab is selected and Tabs has attribute `ace-tabs-infinite`. The event name is available as `EVENTS.IN.SET_NEXT_TAB`.


#### Update tabs

`ace-tabs-update`

This event should be dispatched if tabs are added or removed to re-initialise Tabs. The event name is available as `EVENTS.IN.UPDATE`.


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.


### Simple Tabs

The default tabs, note that the tablist does not have an `aria-label` and so a warning will printed in the console and it will be assigned the default value `ace-tabs-basic-tablist`.

```html
<ace-tabs>
  <div aria-label="Basic Tabs">
    <button>Tab 1</button>
    <button>Tab 2</button>
    <button>Tab 3</button>
  </div>
  <div>
    <h3>Panel 1</h3>
  </div>
  <div>
    <h3>Panel 2</h3>
  </div>
  <div>
    <h3>Panel 3</h3>
  </div>
</ace-tabs>
```

### Tabs with infinite scroll

Simple tabs but won't wrap to first/last element when cycling through tabs using <kbd>&#8592;</kbd> and <kbd>&#8594;</kbd> keys.

```html
<ace-tabs id="infinite-tabs" ace-tabs-infinite ace-tabs-selected-tab="2">
  <div aria-label="Tabs with infinite scroll">
    <button>Tab 1</button>
    <button>Tab 2</button>
    <button>Tab 3</button>
  </div>
  <div>
    <h3>Panel 1</h3>
  </div>
  <div>
    <h3>Panel 2</h3>
  </div>
  <div>
    <h3>Panel 3</h3>
  </div>
</ace-tabs>
```

### Vertical Tabs

If your tablist is vertical (e.g. when having the tabs appear next to the panel instead of above) add the `ace-tabs-vertical` attribute which will add `aria-orientation="vertical"` to the tabslist element.

```html
<ace-tabs id="vertical-tabs" ace-tabs-vertical>
  <div aria-label="Tabs with vertically-oriented tablist">
    <button>Tab 1</button>
    <button>Tab 2</button>
    <button>Tab 3</button>
  </div>
  <div>
    <h3>Panel 1</h3>
  </div>
  <div>
    <h3>Panel 2</h3>
  </div>
  <div>
    <h3>Panel 3</h3>
  </div>
</ace-tabs>
```

### Manually selected Tabs

The Tabs in this example are selected when the user pressed the <kbd>Space</kbd> or <kbd>Enter</kbd> on a focussed tab.

```html
<ace-tabs id="manual-tabs" ace-tabs-infinite ace-tabs-manual>
  <div aria-label="Tabs with manual activation">
    <button>Tab 1</button>
    <button>Tab 2</button>
    <button>Tab 3</button>
  </div>
  <div>
    <h3>Panel 1</h3>
  </div>
  <div>
    <h3>Panel 2</h3>
  </div>
  <div>
    <h3>Panel 3</h3>
  </div>
</ace-tabs>
```

### Deep linked Tabs

The Tabs components in these examples contain the attribute `ace-tabs-deep-linked` and are deep-linked, meaning the page URL is dynamically updated whenever the selected tab changes to include a search parameter for each deep-linked Tabs component, with the ID and selected tab number as the key and value respectively. If upon page load the URL contains a search parameter for a deep-linked Tabs component the tab with that value is automatically selected. Note that deep-linked tabs  value 

This is a useful feature for sharing specific tabs with others.

```html
<h3>Deep-linked</h3>

<ace-tabs id="deep-linked-tabs-1" ace-tabs-deep-linked>
  <div aria-label="Deep-linked Tabs">
    <button>Tab 1</button>
    <button>Tab 2</button>
    <button>Tab 3</button>
  </div>
  <div>
    <h3>Panel 1</h3>
  </div>
  <div>
    <h3>Panel 2</h3>
  </div>
  <div>
    <h3>Panel 3</h3>
  </div>
</ace-tabs>

<hr>

<h3>Deep-linked vertical Tabs with initially set tab 2</h3>

<ace-tabs id="deep-linked-tabs-2" ace-tabs-deep-linked ace-tabs-vertical ace-tabs-selected-tab="2">
  <div aria-label="Deep-linked, vertical Tabs with initially set tab">
    <button>Tab 1</button>
    <button>Tab 2</button>
    <button>Tab 3</button>
  </div>
  <div>
    <h3>Panel 1</h3>
  </div>
  <div>
    <h3>Panel 2</h3>
  </div>
  <div>
    <h3>Panel 3</h3>
  </div>
</ace-tabs>
```

### Custom Event Controlled Tabs

In some cases you might want to customise tabs to limit the tabs which can be selectedd by the user at a particular point or create a paginated experience. To achieve this behaviour buttons which emit the `ace-tabs-set-tab`, `ace-tabs-next-tab` and `ace-tabs-prev-tab` can be used.

You may want tabs to be added, removed or updated after initial load and so the tabs component can be reloaded by emitting the `ace-tabs-update` event with the ID of the tabs element to update.

```html
<p>These buttons dispatch custom events</p>
<button id="prev-tab-btn">Prev tab</button>
<button id="next-tab-btn">Next tab</button>
<button id="add-tab-btn">Add tab to end</button>
<button id="remove-tab-btn">Remove last tab</button>

<hr>

<ace-tabs id="custom-events-tabs">
  <div aria-label="Tabs that repond to custom events">
    <button>Tab 1</button>
    <button>Tab 2</button>
    <button>Tab 3</button>
  </div>
  <div>
    <h3>Panel 1</h3>
  </div>
  <div>
    <h3>Panel 2</h3>
  </div>
  <div>
    <h3>Panel 3</h3>
  </div>
</ace-tabs>
```

```js
import {ATTRS, EVENTS} from '/ace/components/tabs/tabs.js';

document.addEventListener('DOMContentLoaded', () => {
  const tabsEl = document.getElementById('custom-events-tabs');
  const tablistEl = tabsEl.querySelector(`[${ATTRS.TABLIST}]`);

  const addTab = () => {
    const tabNumber = tablistEl.children.length + 1;
    const newTab = document.createElement('button');
    newTab.textContent = `Tab ${tabNumber}`;
    tablistEl.appendChild(newTab);

    const heading = document.createElement('h3');
    heading.textContent = `Panel ${tabNumber}`;
    const p = document.createElement('p');
    p.textContent = `This tab was added dynamically, after the carousel was initialised`;
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
    switch(targetId) {
      case 'prev-tab-btn':
      case 'next-tab-btn': {
        const event = EVENTS.IN[`SET_${targetId === 'prev-tab-btn' ? 'PREV' : 'NEXT'}_TAB`];
        tabsEl.dispatchEvent(new CustomEvent(event));
        break;
      }
      case 'add-tab-btn':
      case 'remove-tab-btn':
        if (targetId === 'add-tab-btn') {
          addTab();
        } else {
          removeTab();
        }
        tabsEl.dispatchEvent(new CustomEvent(EVENTS.IN.UPDATE));
        break;
    }
  });
});
```
