# Tabs

Tabs are a set of sections of content called tab panels which are displayed one at a time, each tab panel has a tab element associated with it which controls displaying the panel.

Tabs conforms to W3C WAI-ARIA authoring practices specified [here](https://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel).


## Instantiation

First import the styles into your main SASS file, replacing `../path/to` with the path to *node_modules* relative to the file:

```scss
$ace-tabs-active-tab-colour: #0893a7 !default;
$ace-tabs-background-colour: #fff !default;
$ace-tabs-hover-colour: #e6e4e7 !default;

[ace-tabs-tab-visible="false"] {
  display: none;
}

[ace-tabs-vertical] {
  display: flex;
}

[ace-tabs-tablist] {
  display: flex;
  margin-bottom: 10px;
  overflow-x: auto;
  white-space: nowrap;
}

[ace-tabs-tablist-vertical] {
  flex-direction: column;
  margin: 0 10px 0 0;

  & [ace-tabs-active-tab] {
    border-width: 0 2px 0 0;
  }
}

[ace-tabs-tab] {
  background-color: $ace-tabs-background-colour;
  border: 0 solid $ace-tabs-active-tab-colour;
  padding: 8px 32px;

  &:hover {
    background-color: $ace-tabs-hover-colour;
  }

  &:focus {
    outline: none;
  }
}

[ace-tabs-active-tab] {
  border-width: 0 0 2px 0;
}
```

Import the class into your JavaScript entry point:

```js
import Tabs from '@potato/ace/components/tabs/tabs';
```

For the sake of convenience the ES6 class is exported as `Tabs`. To avoid name clashes the `as` keyword can be used when importing, e.g. `import Tabs as aceTabs from ...`. The attribute names used by the class are also exported as properties of `ATTRS`.

After `DOMContentLoaded` is fired, Select automatically instantiates an instance of itself within each `<ace-tabs></ace-tabs>` and adds IDs in the format `ace-tabs-(n)` to any instances without one, where `(n)` is the instance count.


## Usage

<!-- ADD USAGE AND INTERACTION INSTRUCTIONS HERE -->
By default, the first tab is active and so the panel content for the first tab is displayed. If a user clicks on a tab then the content for that tab will be revealed and the previous content hidden. When the tablist is focused, pressing <kbd>&#8592;</kbd> or <kbd>&#8594;</kbd> (<kbd>&#8593;</kbd> or <kbd>&#8595;</kbd> if tablist is vertical) will select the previous or next tab in the list and activate it. Tabbing while focused on the tablist will then focus the content for the active tab. Pressing <kbd>Home</kbd> when the tablist is focused will activate the first tab in the tablist and <kbd>End</kbd> will activate the last.


## SASS

The following SASS is applied to the component, each declaration of which can be overridden by a single class selector. The SASS variables use `!default` so can also be easily overridden by users.

```scss
$ace-tabs-active-tab-colour: #0893a7 !default;
$ace-tabs-background-colour: #fff !default;
$ace-tabs-hover-colour: #e6e4e7 !default;

[ace-tabs-tab-visible="false"] {
  display: none;
}

[ace-tabs-vertical] {
  display: flex;
}

[ace-tabs-tablist] {
  display: flex;
  margin-bottom: 10px;
  overflow-x: auto;
  white-space: nowrap;
}

[ace-tabs-tablist-vertical] {
  margin: 0 10px 0 0;

  & [ace-tabs-active-tab] {
    border-width: 0 2px 0 0;
  }
}

[ace-tabs-tab] {
  background-color: $ace-tabs-background-colour;
  border: 0 solid $ace-tabs-active-tab-colour;
  padding: 8px 32px;

  &:hover {
    background-color: $ace-tabs-hover-colour;
  }

  &:focus {
    outline: none;
  }
}

[ace-tabs-active-tab] {
  border-width: 0 0 2px 0;
}
```


## Custom events
Tabs uses the following custom events, the names of which are exported as properties of `EVENTS`, similar to `ATTRS`, so they may be imported into other modules and dispatched or listened for.


### Ready

`ace-tabs-ready`

This event will be dispatched on `window` when a `ace-tabs` element has been initialised and is ready for interaction. Listening to this event can be useful for timing and triggering animations on the tabs element.

The event `detail` object wll be composed as follows:

```js
'detail': {
  'id': // ID of the tabs element that has been initialised
}
```


### Set tab

`ace-tabs-set-tab`

Dispatch this event on `window` to change the currently active tab of a `ace-tabs` element.
<br>The event `detail` object should be composed as follows:

```js
'detail': {
  'id': // ID of ace-tabs element,
  'tab': // Index of tab to select (1-based)
}
```


### Next tab

`ace-tabs-next-tab`

Dispatch this event on `window` to select the next tab of a `ace-tabs` element (respects wrapping/no-wrapping).
<br>The event `detail` object should be composed as follows:

```js
'detail': {
  'id': // ID of ace-tabs element
}
```

### Previous tab

`ace-tabs-prev-tab`

Dispatch this event on `window` to select the previous tab of a `ace-tabs` element (respects wrapping/no-wrapping).
<br>The event `detail` object should be composed as follows:

```js
'detail': {
  'id': // ID of ace-tabs element
}
```


### Tab changed

`ace-tabs-changed`

This event will be dispatched on `window` when a `ace-tabs` element changes tabs, either by keyboard/mouse interaction or one of the prviously mentioned events.
Listening to this event can be useful for timing and triggering animations on the tabs element.

The event `detail` object wll be composed as follows:

```js
'detail': {
  'tabsId': // ID of the ace-tabs element
  'activeTab': {
    'id': // ID of the new active tab
    'number': // Number of the new active tab (1-based index)
  },
  'prevTab': {
    'id': // ID of the old tab
    'number': // Number of the old tab (1-based index)
  }
}
```

### Update tabs

`ace-tabs-update`

Dispatch this event on `window` to force a re-initialisation of the tabslist and panels for a specified tabs element. The tabs element whill re-find tabs and panels and reset the active tab to 0 before re-emmitting a `ace-tabs-ready` event to signify it has reinitialised.

```js
'detail': {
  'id': // ID of the tabs element to update
}
```


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.


### Simple Tabs

The default tabs, note that the tablist does not have an `aria-label` and so a warning will printed in the console and it will be assigned the default value `ace-tabs-basic-tablist`.

```html
<ace-tabs id="ace-tabs-basic">
  <div ace-tabs-tablist>
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

### No Wrapping Example

Simple tabs but won't wrap to first/last element when cycling through tabs using <kbd>&#8592;</kbd> and <kbd>&#8594;</kbd> keys.

```html
<ace-tabs id="ace-tabs-no-wrap" ace-tabs-no-wrapping>
  <div ace-tabs-tablist aria-label="no-wrap-tabs-tablist">
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

### Vertical Tabslist

If your tablist is vertical (e.g. when having the tabs appear next to the panel instead of above) add the `ace-tabs-vertical` attribute which will add `aria-orientation="vertical"` to the tabslist element.

```html
<ace-tabs id="ace-tabs-vertical" ace-tabs-vertical>
  <div ace-tabs-tablist aria-label="vertical-tabs-tablist">
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

In some cases you might want to customise tabs to limit the tabs which can be activated by the user at a particular point or create a paginated experience. To achieve this behaviour buttons which emit the `ace-tabs-set-tab`, `ace-tabs-next-tab` and `ace-tabs-prev-tab` can be used.

```html
<ace-tabs id="ace-tabs-custom">
  <div ace-tabs-tablist aria-label="custom-events-tabs-tablist">
    <button>Tab 1</button>
    <button>Tab 2</button>
    <button>Tab 3</button>
    <button>Tab 4</button>
    <button>Tab 5</button>
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
  <div>
    <h3>Panel 4</h3>
  </div>
  <div>
    <h3>Panel 5</h3>
  </div>
</ace-tabs>

<button id="prev-tab-btn">
  Prev
</button>
<button id="next-tab-btn">
  Next
</button>

<form id="set-tab-form">
  <label>
    Select Tab:
    <input value="1" type="number" name="tab-number" id="tab-number-input" max="5" min="1">
  </label>
  <button type="submit">Go</button>
</form>
```

```js
import {EVENTS} from '/ace/components/tabs/tabs.js';

document.addEventListener('DOMContentLoaded', () => {
  const TABS_ID = 'ace-tabs-custom';

  const setTabForm = document.getElementById('set-tab-form');

  window.addEventListener('click', (e) => {
    if (e.target.id === 'prev-tab-btn') {
      window.dispatchEvent(new CustomEvent(EVENTS.SET_PREV_TAB, {detail: {id: TABS_ID}}));
    } else if (e.target.id === 'next-tab-btn') {
      window.dispatchEvent(new CustomEvent(EVENTS.SET_NEXT_TAB, {detail: {id: TABS_ID}}));
    }
  });

  setTabForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    window.dispatchEvent(new CustomEvent(EVENTS.SET_TAB, {detail: {
      id: TABS_ID,
      tab: formData.get('tab-number')
    }}));
  });
});
```

### Update Tabs Element

You may want tabs to be added, removed or updated after initial load and so the tabs component can be reloaded by emitting the `ace-tabs-update` event with the ID of the tabs element to update.

```html
<ace-tabs id="ace-tabs-update">
  <div ace-tabs-tablist aria-label="update-tabs-tablist">
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

<button id="add-tab-btn">
  Add to end
</button>
<button id="remove-tab-btn">
  Remove last
</button>
```

```js
import {ATTRS, EVENTS} from '/ace/components/tabs/tabs.js';

document.addEventListener('DOMContentLoaded', () => {
  const TABS_ID = 'ace-tabs-update';
  const TABS_EL = document.getElementById(TABS_ID);
  const TABSLIST_EL = TABS_EL.querySelector(`[${ATTRS.TABLIST}]`);

  const addTab = () => {
    const tabNumber = TABSLIST_EL.children.length + 1;

    TABSLIST_EL.insertAdjacentHTML('beforeend', `
      <button>Tab ${tabNumber}</button>
    `);

    TABS_EL.insertAdjacentHTML('beforeend', `
      <div>
        <h3>Panel ${tabNumber}</h3>
        <p>Created by JS</p>
      </div>
    `);
  };

  const removeTab = () => {
    TABSLIST_EL.removeChild(TABSLIST_EL.lastElementChild);
    TABS_EL.removeChild(TABS_EL.lastElementChild);
  };

  window.addEventListener('click', (e) => {
    const id = e.target.id;

    if (id === 'add-tab-btn') {
      addTab();
    } else if (id === 'remove-tab-btn') {
      removeTab();
    }

    window.dispatchEvent(new CustomEvent(EVENTS.UPDATE_TABS, {detail: {
      id: TABS_ID,
    }}));
  });
});
```
