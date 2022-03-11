# ACE

Accessible Custom Elements (ACE) is a library of UI components that are accessible to users who rely on assistive technologies or keyboard navigation. ACE components have full keyboard support and all the required WAI-ARIA roles, states and properties specified in the [W3 WAI-ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1).

The components all have minimal CSS styling applied to them that can be easily overridden making them compatible with almost any design system. Most of the components are provided in different variants that cover common use cases. This helps developers create rich, dynamic and creative websites that are also fully accessible for all users. More information about ACE can be found [here](https://ace.p.ota.to/about).

## Installation

The instructions below can be followed for using ACE components with JavaScript. Instructions for how to use ACE components with React, Angular and Vue can be found [here](https://ace.p.ota.to/js-frameworks).

To install all ACE components and the common files required by them run

```bash
npm i @potato/ace
```

or

```bash
yarn add @potato/ace
```

To use a component import the class into your main JavaScript file:

```js
import '<path-to-node_modules>/@potato/ace/components/<component-name>/<component-name>';
```

Then import the component's SASS file into a SASS file in your project, replacing `<path-to-node_modules>` with the path to the *node_modules* directory relative to the file, and `<component-name>` with the component name:

```scss
@import '<path-to-node_modules>/@potato/ace/components/<component-name>/<component-name>';
```

Alternatively, you can import the component's CSS file into a CSS file in your project:

```css
@import '<path-to-node_modules>/@potato/ace/components/<component-name>/<component-name>.css';
```

Specific instructions for how to use a particular component can be found on the component's webpage, along with live examples, or in the component's *README* file located at *\<path-to-node_modules>/@potato/ace/\<component-name>/READE.md*.

For example, the Accordion component instructions can be found on it's [webpage](https://ace.p.ota.to/accordion) or in *\<path-to-node_modules>/@potato/ace/accordion/README.md*.

## Component SASS variables

ACE components define SASS variables using the `!default` keyword, allowing developers to easily configure component styles by simply assigning a value to the variable before importing the SASS file where the variable is defined.

For example, the selected option highlight color of the Listbox component can be changed as follows: 

```scss
/* Override ACE variable... */
$ace-listbox-selected-option-bg-color: #cccccc;

/* Then import SASS file where ACE variable is defined */
@import '<path-to-node_modules>/node_modules/@potato/ace/listbox/listbox';
```
