# Tooltip

Tooltip is a component whose visibility can be changed using trigger buttons and custom events. Disclosure conforms to W3C WAI-ARIA authoring practices specified [here](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure).


## Instantiation

First import the styles into your main SASS file, replacing `../path/to` with the path to *node_modules* relative to the file:

```scss
/* VARIABLES */
$ace-tooltip-color: #000 !default;


[ace-tooltip-visible="false"] {
  display: none;
}

[ace-tooltip-trigger-for="tooltip"] {
  position: relative;
}

ace-tooltip {
  border: 1px solid $ace-tooltip-color;
  color: $ace-tooltip-color;
  display: block;
  left: 0;
  margin: 1px;
  max-width: fit-content;
  padding: 1px;
}
```


Then import the class into your JavaScript entry point:

```js
import '@potato/ace/components/tooltip/tooltip';
```

For the sake of convenience the ES6 class is exported as `Tooltip`. To avoid name clashes the `as` keyword can be used when importing, e.g. `import Tooltip as aceTooltip from ...`. The attribute names used by the class are also exported as properties of `ATTRS`.

After `DOMContentLoaded` is fired, Tooltip automatically instantiates an instance of itself within each `<ace-tooltip></ace-tooltip>` and adds IDs in the format `ace-tooltip-(n)` to any instances without one, where `(n)` is the instance count.


## SASS

The following SASS is applied to the component, each declaration of which can be overridden by a single class selector.

```scss
/* VARIABLES */
$ace-tooltip-background-color: #000 !default;


[ace-tooltip-visible="false"] {
  display: none;
}

ace-tooltip {
  border: 1px solid $ace-tooltip-background-color;
  display: block;
  margin: 1px;
  max-width: fit-content;
  padding: 1px;
}
```

## Examples

Each example contains a live demo and the HTML code that produced it. The code shown may differ slightly to that rendered for the demo as some components may alter their HTML when they initialise.

This is a descriptive tooltip triggered, by hover and focus.

```html
<button ace-tooltip-trigger-for="tooltip-description" aria-describedby="tooltip-description" type="button">🥔</button>
<ace-tooltip role="tooltip" ace-tooltip-visible="false" id="tooltip-description">
  <div>This is a superb, well formed and tasty King Edward</div>
</ace-tooltip>
```

This is a tooltip as a primary label triggered, by hover and focus.

```html
<button ace-tooltip-trigger-for="tooltip-label" aria-labelledby="tooltip-label" type="button">🥔</button>
<ace-tooltip role="tooltip" ace-tooltip-visible="false" id="tooltip-label">
  <div>King Edward</div>
</ace-tooltip>
```

