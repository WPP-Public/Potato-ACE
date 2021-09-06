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


## Using ACE with JavaScript frameworks

### React

The following example shows how ACE components can be used with React. More general information about how to use web components with React can be found in [React's Web Components guide](https://reactjs.org/docs/web-components.html).

The example demonstrates:

- Passing data from a parent component to a ACE Accordion component via `props`.
- Listening for a custom event dispatched by Accordion, then using `useState` and `useEffect` to conditionally disablling a button in the parent component.
- Using `useRef` & `forwardRef` to dispatch a custom event on Accordion from the parent.

Starting with a fresh project, created using `npx create-react-app`, ACE was installed using `npm i @potato/ace` before the following changes were made.

***src/Accordion.jsx***

```jsx
import React, {forwardRef} from 'react';

import '@potato/ace/components/accordion/accordion';

// forwardRef used to reference Accordion DOM element, to dispatch custom event on it from App.js
export const Accordion = forwardRef(({content}, ref) => {
	return (
		<ace-accordion ref={ref}>
			{content.map((panel, index) => {
				return <React.Fragment key={index}>
					<h3>
						<button>{panel.trigger}</button>
					</h3>
					<div>
						<p>{panel.content}</p>
					</div>
				</React.Fragment>
			})}
		</ace-accordion>
	);
});
```

***src/App.js***

```jsx
import {useEffect, useRef, useState} from 'react';

import {ATTRS, EVENTS} from '@potato/ace/components/accordion/accordion';
import {Accordion} from './Accordion';
import './App.css';

const accordionContent = [
	{
		content: 'Panel 1 content',
		trigger: 'Panel 1 trigger',
	},
	{
		content: 'Panel 2 content',
		trigger: 'Panel 2 trigger',
	},
	{
		content: 'Panel 3 content',
		trigger: 'Panel 3 trigger',
	},
];

function App() {
	// useRef used to reference Accordion DOM element in Accordion.jsx, to dispatch custom event on it
	const accordionRef = useRef(null);
	const [disableCollapseAllBtn, setDisableCollapseAllBtn] = useState(true);

	// Accordion "changed" event handler that disables "Collapse all" button if all panels are already collaped
	const handleAccordionPanelStateChange = () => {
		const panelsCollapsed = document.querySelectorAll(`[${ATTRS.PANEL_VISIBLE}]`).length === 0;
		setDisableCollapseAllBtn(panelsCollapsed);
	}

	// useEffect used to add Accordion's "changed" event listener
	useEffect(() => {
		window.addEventListener(EVENTS.OUT.CHANGED, handleAccordionPanelStateChange);
		return () => window.removeEventListener(EVENTS.OUT.CHANGED, handleAccordionPanelStateChange);
	}, []);

	// Collapse Accordion's panels using its "hide panels" custom event
	const collapseAll = () => accordionRef.current.dispatchEvent(
		new CustomEvent(EVENTS.IN.HIDE_PANELS)
	);

	return (
		<>
			<Accordion content={accordionContent} ref={accordionRef} />
			<button	disabled={disableCollapseAllBtn} onClick={collapseAll} >
				Collapse all
			</button>
		</>
	);
}

export default App;
```

***src/App.css***

```css
@import '~@potato/ace/components/accordion/ace-accordion.css';
```


#### React with TypeScript

ACE components can also be used in React projects that use TypeScript.

For example, to use ACE Accordion in a TypeScript React project follow the previous instructions then make the following changes.

***src/Accordion.jsx***

Rename _Accordion_***.jsx*** to _Accordion_***.tsx***, then add this import

```tsx
import {AccordionContent} from './App';
```

then replace

```tsx
export const Accordion = forwardRef(({content}, ref) => {
```

with

```tsx
export const Accordion = forwardRef((props: {content:Array<AccordionContent>}, ref) => {
```

and replace

```tsx
{content.map((panel, index) => {
```

with 

```tsx
{props.content.map((panel: AccordionContent, index: number) => {
```

and finally add this at the end of the file

```tsx
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ace-accordion': any;
    }
  }
}
```

***src/App.tsx***

Replace

```tsx
const accordionRef = useRef(null);
```

with

```tsx
const accordionRef = useRef<any>(null);
```

and add this at the end of the file

```tsx
export interface AccordionContent {
	content: string;
	trigger: string;
}
```
