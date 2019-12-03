# Disclosure

A Disclosure component is a simple "show/hide" component which will toggle the visibility of a element by interacting with a toggle element.

The W3C specification defines a Disclosure component as:

> A disclosure is a button that controls visibility of a section of content. When the controlled content is hidden, it is often styled as a typical push button with a right-pointing arrow or triangle to hint that activating the button will display additional content. When the content is visible, the arrow or triangle typically points down.

[Link to the full W3C WAI-ARIA Spec](https://www.w3.org/TR/wai-aria-practices-1.1/#disclosure)

## Usage

To use the `asce-disclosure` custom element in your templates:

1) Place the following import in your JS entry point:

```js
import { Disclosure as asceDisclosure, CONSTS as asce_DISCLOSURE_CONSTS } from 'asce/components/disclosure/disclosure';
```

2) Use the `<asce-disclosure>` tag, filled with your content, in your template.

3) Create a button or element and give it the `asce-disclosure-trigger-for` attribute with the value of the ID of the disclosure you wish to trigger.

4) (Optional) Override any of the SCSS applied to the element.

## Sass

To apply any additional styles or override existing styles for the trigger, use the following selector in you SCSS/CSS:

```scss
asce-disclosure {
  display: block;

  &[aria-hidden='true'] {
    display: none;
  }
}


[asce-disclosure-trigger-for] {
  cursor: pointer;
}
```

## Events

`asce-disclosure-toggle` - Can be called or listened to, triggers the disclosure to be shown or hidden.

`asce-disclosure-opened` - Not to be triggered, emitted when the disclosure is shown.

`asce-disclosure-closed` - Not to be triggered, emitted after the disclosure is hidden.

`asce-disclosure-update-triggers` - Can be called or listened to, triggers an update to get all triggers which control this disclosure (for use when triggers are added dynamically).

## Examples

### Button Trigger

The preferred way to trigger a disclosure is by using a button with the `asce-disclosure-trigger-for` attribuet set to the ID of the disclosure:

```html
<button asce-disclosure-trigger-for="disclosure1">
    Toggle Disclosure
</button>

<asce-disclosure id="disclosure1">
    <h1>Disclosure</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius consequuntur provident quos placeat id.</p>
</asce-disclosure>
```

### Non-button Trigger

Other elements, such as `div`s can also be used to trigger disclosures but this is not recommended:

```html
<div asce-disclosure-trigger-for="disclosure2">
    Toggle Disclosure
</div>

<asce-disclosure id="disclosure2">
    <h1>Disclosure</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius consequuntur provident quos placeat id.</p>
</asce-disclosure>
```

### Multi-Disclosure

The 2 buttons below demonstrate triggering multiple different disclosures by specifying the ID of the disclosure to trigger:

```html
<button asce-disclosure-trigger-for="disclosure3">
    Toggle Disclosure 1
</button>
<button asce-disclosure-trigger-for="disclosure4">
    Toggle Disclosure 2
</button>

<asce-disclosure id="disclosure3">
    <h1>Disclosure 1</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius consequuntur provident quos placeat id.</p>
</asce-disclosure>

<asce-disclosure id="disclosure4">
    <h1>Disclosure 2</h1>
    <p>Impedit laboriosam nesciunt id aliquid illo magni illum deserunt distinctio et, ab, perspiciatis placeat consequatur.</p>
</asce-disclosure>
```

### Initially Expanded Disclosure

By adding the `aria-expanded='true'` attribute to the trigger element the disclosure will be expanded initially:

```html
<button asce-disclosure-trigger-for="disclosure5" aria-expanded="true">
    Toggle Disclosure 1
</button>
<button asce-disclosure-trigger-for="disclosure6" aria-expanded="false">
    Toggle Disclosure 2
</button>

<asce-disclosure id="disclosure5">
    <h1>Disclosure 1</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius consequuntur provident quos placeat id.</p>
</asce-disclosure>

<asce-disclosure id="disclosure6">
    <h1>Disclosure 2</h1>
    <p>Impedit laboriosam nesciunt id aliquid illo magni illum deserunt distinctio et, ab, perspiciatis placeat consequatur.</p>
</asce-disclosure>
```

### Multiple Triggers

Multiple triggers can be used to trigger the same disclosure by assigning the same ID to them:

```html
<button asce-disclosure-trigger-for="disclosure7">
    Toggle Disclosure 1
</button>
<button asce-disclosure-trigger-for="disclosure7">
    Also Toggle Disclosure 1
</button>

<asce-disclosure id="disclosure7">
    <h1>Disclosure 1</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius consequuntur provident quos placeat id.</p>
</asce-disclosure>
```

<!-- TODO: Add in example of dynamically adding triggers. -->
