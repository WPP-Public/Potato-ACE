# Disclosure

Disclosure Component

## JS

```js
import { Disclosure as Pa11yDisclosure, CONSTS as PA11Y_DISCLOSURE_CONSTS } from 'pa11y/components/disclosure/disclosure';
```

## Sass

Here is scss code

```scss
[pa11y-disclosure-trigger-for] {
  cursor: pointer;
}
```

## Examples

### Button Trigger

Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

```html
<button pa11y-disclosure-trigger-for="disclosure1">
    Toggle Disclosure
</button>

<pa11y-disclosure id="disclosure1">
    <h1>Disclosure</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius consequuntur provident quos placeat id.</p>
</pa11y-disclosure>
```

### Non-button Trigger

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.


```html
<div pa11y-disclosure-trigger-for="disclosure2">
    Toggle Disclosure
</div>

<pa11y-disclosure id="disclosure2">
    <h1>Disclosure</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius consequuntur provident quos placeat id.</p>
</pa11y-disclosure>
```

### Multi-Disclosure

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.

```html
<button id="dummy-button">
    Dummy button
</button>
<button pa11y-disclosure-trigger-for="disclosure3">
    Toggle Disclosure 1
</button>
<button pa11y-disclosure-trigger-for="disclosure4">
    Toggle Disclosure 2
</button>

<pa11y-disclosure id="disclosure3">
    <h1>Disclosure 1</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius consequuntur provident quos placeat id.</p>
</pa11y-disclosure>

<pa11y-disclosure id="disclosure4">
    <h1>Disclosure 2</h1>
    <p>Impedit laboriosam nesciunt id aliquid illo magni illum deserunt distinctio et, ab, perspiciatis placeat consequatur.</p>
</pa11y-disclosure>
```
