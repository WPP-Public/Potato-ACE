<!-- TODO: Replace 'Template' with actual value -->
# Template

<!-- DESCRIBE COMPONENT AND ITS FUNCTIONALITY HERE -->

<!-- TODO: Replace '<w3c-component-name>' with actual value -->
[W3C WAI-ARIA Spec](https://www.w3.org/TR/wai-aria-practices-1.1/#<w3c-component-name>)


## Usage
<!-- TODO: Replace 'Template', 'TEMPLATE' and 'template' with actual values int this section -->

Import the component module into your JS entry point:
```js
import Template from '@potato/asce/components/template/template';
```

<!-- TODO: If no ATTRS are exported then remove first paragraph -->
The names of the component HTML attributes are exported as properties of an object `ATTRS` so they may be imported. To avoid name clashes you can import using `as`, e.g. `import Template as aceTemplate from ...`. After `DOMContentLoaded` is fired, the component will automatically initialise an instance of itself within each `<asce-template></asce-template>` tag on the page.

<!-- ADD ANY OTHER USAGE INSTRUCTIONS HERE -->



## SASS
<!-- TODO: Replace 'Template' with actual value -->
The following CSS is applied to Template components:

```scss
```


## Events

<!-- TODO: Replace 'Template' with actual value -->
Template uses the following custom events, the names of which are properties of an exported object named `EVENTS`, similar to `ATTRS`. These event names can therefore be imported into other modules and used to listen to or dispatch events.


<!-- TODO: Replace 'Event' with a descriptive name -->
### Event event

<!-- TODO: Replace 'template-event-name' with actual value -->
`asce-template-event-name`

<!-- DESCRIBE EVENT HERE -->


The event `detail` property is composed as follows:
<!-- TODO: Replace 'propName' and 'propDescription' with appropriate values. Repeat for all properties and nested properties -->
```js
{
  'id': // ID of template
  'propName': // propDescription
}
```

## Examples

<!-- TODO: Replace 'Example' with more descriptive name -->
### Example

<!-- DESCRIBE WHAT THE EXAMPLE SHOWS AND WHY IT SHOULD BE USED THAT WAY HERE -->

```html
```
