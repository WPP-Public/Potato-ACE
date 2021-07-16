# ACE

Accessible Custom Elements (ACE) is a library of UI components that are accessible to users who rely on assistive technologies or keyboard navigation. ACE components have full keyboard support and all the required WAI-ARIA roles, states and properties specified in the [W3 WAI-ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1).

The components all have minimal CSS styling applied to them that can be easily overridden making them compatible with almost any design system. Most of the components are provided in different variants that cover common use cases. This helps developers create rich, dynamic and creative websites that are also fully accessible for all users. More information about ACE can be found [here](https://ace.p.ota.to/about).

## Installation

To install all ACE components and the common files required by them run

```bash
npm i @potato/ace
```

or

```bash
yarn add @potato/ace
```

To use a component import it's SASS file into your main SASS file, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file, and `<component-name>` with the component name:

```scss
@import '<path-to-node_modules>/@potato/ace/components/<component-name>/<component-name>';
```

and import the class into your main JavaScript file:

```js
import '<path-to-node_modules>/@potato/ace/components/<component-name>/<component-name>';
```

Specific instructions for how to use a particular component can be found in the component's *README* file located at *\<path-to-node_modules>/@potato/ace/\<component-name>/READE.md*, for example, the Accordion component instructions can be found in *\<path-to-node_modules>/@potato/ace/accordion/README.md*. The same instructions can be also found on the component's webpage along with live examples.

## Component SASS variables

ACE components makes use of SASS variables defined with the keyword `!default`, which allow developers to easily configure component styles by simply assigning a value to the variable before importing the component SASS file where the variable is defined. For example, the selected option highlight color of the Listbox component can be changed as follows: 

```scss
/* ACE Variable Overrides */
$ace-listbox-selected-option-bg-color: #cccccc;

/* ACE Components */
@import '<path-to-node_modules>/node_modules/@potato/ace/listbox/listbox';
```
