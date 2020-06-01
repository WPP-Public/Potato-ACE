# Tooltip

Tooltip is a component whose visibility can be changed by focus, hover and custom events. Tooltip conforms to W3C WAI-ARIA authoring practices specified [here](https://www.w3.org/TR/wai-aria-practices-1.1/#tooltip).


## Instantiation

First import the styles into your main SASS file, replacing `../path/to` with the path to *node_modules* relative to the file:

```scss
/* VARIABLES */
$ace-tooltip-background-color: #000 !default;


[ace-tooltip-visible="false"] {
  display: none;
}

ace-tooltip {
  border: 1px solid $ace-tooltip-background-color;
  display: block;
  max-width: fit-content;
}
```


Then import the class into your JavaScript entry point:

```js
import '@potato/ace/components/tooltip/tooltip';
```

For the sake of convenience the ES6 class is exported as `Tooltip`. To avoid name clashes the `as` keyword can be used when importing, e.g. `import Tooltip as aceTooltip from ...`. The attribute names used by the class are also exported as properties of `ATTRS`.

After `DOMContentLoaded` is fired, Disclosure automatically instantiates an instance of itself within each `<ace-tooltip></ace-tooltip>` and adds IDs in the format `ace-tooltip-(n)` to any instances without one, where `(n)` is the instance count.


## SASS


## Custom events


### Hide, Show and Toggle

`ace-tooltip-hide`, `ace-tooltip-show` & `ace-tooltip-toggle`

A Tooltip listens for these events then hides, shows or toggles itself respectively. These events should be dispatched on `window` and the `detail` object should be composed as follows:

```js
'detail': {
  'id': // ID of Tooltip
}
```


## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.


### Simple hover Tooltip 

This is a simple hover triggered Tooltip.

```html
<button aria-labelledby="tooltip-label">i</button>
<ace-tooltip id="tooltip-label" ace-tooltip-visible="false" id="tooltip">
  <div>This is a description</div>
</ace-tooltip>```
