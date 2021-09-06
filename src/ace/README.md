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

### Vue

The following example shows how ACE components can be used with Vue (v3+). More general information about how to use web components with Vue can be found in [Vue's Web Components guide](https://v3.vuejs.org/guide/web-components.html#skipping-component-resolution).

The example demonstrates:

- Passing data from a parent component to an ACE Accordion component via `props`.
- Using the `created` & `unmounted` lifecycle hooks in the parent component to listen for a custom event dispatched by Accordion, to conditionally disable a button.
- Using template refs to dispatch a custom event on Accordion from a parent component.

Starting with a fresh project, created using the Vue CLI and `vue create`, ACE was installed using `npm i @potato/ace` before the following changes were made.

***src/components/Accordion.vue***

```html
<template>
<ace-accordion ref="accordion">
	<template v-for="(panel, index) of content" :key="index">
		<h3>
			<button>{{panel.trigger}}</button>
		</h3>
		<div>
			<p>{{panel.content}}</p>
		</div>
	</template>
</ace-accordion>
</template>


<script>
import {EVENTS} from '@potato/ace/components/accordion/accordion';

export default {
  name: 'Accordion',
  props: {
    content: Array
  },
	methods: {
		collapseAll() {
			this.$refs.accordion.dispatchEvent(
				new CustomEvent(EVENTS.IN.HIDE_PANELS)
			);
    }
	}
}
</script>


<style>
@import '~@potato/ace/components/accordion/ace-accordion.css';
</style>
```

***src/App.vue***

```html
<template>
  <Accordion :content="accordionContent" ref="mainAccordion"/>

  <button :disabled="panelsCollapsed" @click="collapseAll">
    Collapse all
  </button>
</template>


<script>
import Accordion from './components/Accordion.vue';
import {ATTRS, EVENTS} from '@potato/ace/components/accordion/accordion';

export default {
  name: 'App',
  components: {
    Accordion
  },
  data() {
    return {
      accordionContent: [
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
      ],
      panelsCollapsed: true,
    }
  },
  created () {
    window.addEventListener(EVENTS.OUT.CHANGED, this.onPanelChange);
  },
  unmounted () {
    window.removeEventListener(EVENTS.OUT.CHANGED, this.onPanelChange);
  },
  methods: {
    collapseAll() {
      this.$refs.mainAccordion.collapseAll();
    },
    onPanelChange() {
      this.panelsCollapsed = document.querySelectorAll(`[${ATTRS.PANEL_VISIBLE}]`).length === 0;
    },
  },
}
</script>
```

***vue.config.js***

```js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          // treat any tag that starts with ace- as custom elements
          isCustomElement: tag => tag.startsWith('ace-')
        }
      }))
  }
}
```
