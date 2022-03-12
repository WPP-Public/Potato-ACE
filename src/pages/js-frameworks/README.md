# Using ACE with JavaScript frameworks

ACE makes use of custom elements which makes it easy to use with nost JavaScript frameworks. Below are intructions for how to use ACE with React, Angular and Vue. 

## ACE with React

The following examples show how ACE components can be used with React. More general information about how to use custom elements with React can be found in the [React web components guide](https://reactjs.org/docs/web-components.html).

These examples demonstrate how to use an ACE Accordion, pass data to it from a parent component via `props`, use `useEffect` in the parent to listen for a custom event dispatched by Accordion, and interact with Accordion from the parent using a custom event.

### React without TypeScript

Starting with a fresh React project that does not use TypeScript, created using `npx create-react-app`:

1. Install ACE:

  ```bash
  npm i @potato/ace
  ```
  
2. Replace the contents of ***src/App.js*** with:

  ```jsx
  import {useEffect, useState} from 'react';
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
    }
  ];
  
  function App() {
    const ACCORDION_ID = 'ace-accordion';
    const [disableCollapseAllBtn, setDisableCollapseAllBtn] = useState(true);
  
    // Accordion "Panel visibility changed" custom event handler to disable "Collapse all" button when all panels are collapsed
    const handleAccordionPanelStateChange = () => {
      const panelsCollapsed = document.querySelectorAll(`[${ATTRS.PANEL_VISIBLE}]`).length === 0;
      setDisableCollapseAllBtn(panelsCollapsed);
    }
  
    // useEffect used to add Accordion's "Panel visibility changed" custom event listener
    useEffect(() => {
      window.addEventListener(EVENTS.OUT.PANEL_VISIBILITY_CHANGED, handleAccordionPanelStateChange);
      return () => window.removeEventListener(EVENTS.OUT.PANEL_VISIBILITY_CHANGED, handleAccordionPanelStateChange);
    }, []);
  
    // Collapse Accordion's panels by dispatching its "Hide panels" custom event
    const collapseAll = () => window.dispatchEvent(new CustomEvent(
      EVENTS.IN.HIDE_ALL_PANELS,
      {'detail': {'id': ACCORDION_ID}},
    ));
  
    return (
      <>
        <Accordion content={accordionContent} id={ACCORDION_ID} />
        <button	disabled={disableCollapseAllBtn} onClick={collapseAll} >
          Collapse all
        </button>
      </>
    );
  }
  
  export default App;
  ```
  
3. Replace the contents of ***src/App.css*** with:

  ```css
  @import '~@potato/ace/components/accordion/ace-accordion.css';
  ```

4. Add a file ***src/Accordion.jsx*** with the following content:

  ```jsx
  import React from 'react';
  import '@potato/ace/components/accordion/accordion';
  
  export const Accordion = ({content, id}) => {
    return (
      <ace-accordion id={id}>
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
  };
  ```


#### React with TypeScript

Starting with a fresh React TypeScript project created using `npx create-react-app`:

1. Install ACE:

  ```bash
  npm i @potato/ace
  ```

2. Replace the contents of ***src/App.tsx*** with:

  ```jsx
  import {useEffect, useState} from 'react';
  import {ATTRS, EVENTS} from '@potato/ace/components/accordion/accordion';
  import {Accordion} from './Accordion';
  import './App.css';
  
  export interface AccordionContent {
    content: string;
    trigger: string;
  }
  
  const accordionContent: AccordionContent[] = [
    {
      content: 'Panel 1 content',
      trigger: 'Panel 1 trigger',
    },
    {
      content: 'Panel 2 content',
      trigger: 'Panel 2 trigger',
    }
  ];
  
  function App() {
    const ACCORDION_ID = 'ace-accordion';
    const [disableCollapseAllBtn, setDisableCollapseAllBtn] = useState(true);
  
    // Accordion "Panel visibility changed" custom event handler to disable "Collapse all" button when all panels are collapsed
    const handleAccordionPanelStateChange = () => {
      const panelsCollapsed = document.querySelectorAll(`[${ATTRS.PANEL_VISIBLE}]`).length === 0;
      setDisableCollapseAllBtn(panelsCollapsed);
    }
  
    // useEffect used to add Accordion's "Panel visibility changed" custom event listener
    useEffect(() => {
      window.addEventListener(EVENTS.OUT.PANEL_VISIBILITY_CHANGED, handleAccordionPanelStateChange);
      return () => window.removeEventListener(EVENTS.OUT.PANEL_VISIBILITY_CHANGED, handleAccordionPanelStateChange);
    }, []);
  
    // Collapse Accordion's panels using its "hide panels" custom event
    const collapseAll = () => window.dispatchEvent(new CustomEvent(
      EVENTS.IN.HIDE_ALL_PANELS,
      {'detail': {'id': ACCORDION_ID}},
    ));
  
    return (
      <>
        <Accordion content={accordionContent} id={ACCORDION_ID} />
        <button	disabled={disableCollapseAllBtn} onClick={collapseAll} >
          Collapse all
        </button>
      </>
    );
  }
  
  export default App;
  ```

3. Replace the contents of ***src/App.css*** with:

  ```css
  @import '~@potato/ace/components/accordion/ace-accordion.css';
  ```

4. Add a file ***src/Accordion.tsx*** with:

  ```tsx
  import React from 'react';
  import {AccordionContent} from './App';
  import '@potato/ace/components/accordion/accordion';
  
  interface Props {
    content: Array<AccordionContent>,
    id: string,
  }
  
  export const Accordion = ({content, id}: Props) => {
    return (
      <ace-accordion id={id}>
        {content.map((panel: AccordionContent, index: number) => {
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
  };
  
  declare global {
    namespace JSX {
      interface IntrinsicElements {
        'ace-accordion': any;
      }
    }
  }
  ```


## ACE with Angular

The following examples shows how ACE components can be used with Angular.

These examples demonstrate how to use an ACE Accordion, pass data to it from a parent component via `@Input`, use `@HostListener` in the parent to listen for a custom event dispatched by Accordion, and interact with Accordion from the parent using a custom event.

Starting with a fresh Angular project created using Angular CLI command `ng new`:

1.	Install ACE:

  ```bash
  npm i @potato/ace
  ```

2.	Add the following to the `"files"` property in ***tsconfig.app.json*** :

   ```json
   "./node_modules/@potato/ace/components/accordion/accordion.ts"
   ```

3.	Replace the contents of ***src/app/app.module.ts*** with:

  ```ts
  import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  
  import { AppComponent } from './app.component';
  import { AccordionComponent } from './accordion/accordion.component';
  
  @NgModule({
    declarations: [
      AccordionComponent,
      AppComponent
    ],
    imports: [
      BrowserModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [],
    bootstrap: [AppComponent]
  })
  export class AppModule { }
  ```

4.	Replace the contents of ***src/app/app.component.ts*** with:
  ```ts
  import { Component, HostListener } from '@angular/core';
  import { AccordionContent } from './accordion/accordion.component';
  import { ATTRS, EVENTS } from '@potato/ace/components/accordion/accordion';
  
  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
  })
  export class AppComponent {
    accordionContent: Array<AccordionContent> = [
      {
        content: 'Panel 1 content',
        trigger: 'Panel 1 trigger',
      },
      {
        content: 'Panel 2 content',
        trigger: 'Panel 2 trigger',
      },
    ];
    accordionId = 'ace-accordion';
    panelsCollapsed = true;
  
    // Collapse Accordion's panels using it's "hide panels" custom event
    collapseAll() {
      window.dispatchEvent(new CustomEvent(
        EVENTS.IN.HIDE_ALL_PANELS,
        {'detail': {'id': this.accordionId}},
      ));
    }
  
    // @HostListener used to add Accordion "Panel visibility changed" event listener
    @HostListener(`window:${EVENTS.OUT.PANEL_VISIBILITY_CHANGED}`, ['$event.detail'])
    onPanelChange(): void {
      this.panelsCollapsed = document.querySelectorAll(`[${ATTRS.PANEL_VISIBLE}]`).length === 0;
    }
  }
  ```

5.	Replace the contents of ***src/app/app.component.html*** with:

  ```html
  <app-accordion [content]="accordionContent" [accordionId]="accordionId"></app-accordion>
  <button [disabled]="panelsCollapsed" (click)="collapseAll()">
    Collapse all
  </button>
  ```

6.	Generate a new component called `accordion`:

  ```bash
  ng g c accordion
  ```

7.	Replace the contents of ***src/app/accordion/accordion.component.html*** with:

  ```html
  <ace-accordion [id]="accordionId">
    <ng-container *ngFor="let panel of content">
      <h3>
        <button>{{panel.trigger}}</button>
      </h3>
      <div>
        <p>{{panel.content}}</p>
      </div>
    </ng-container>
  </ace-accordion>
  ```

8.	Replace the contents of ***src/app/accordion/accordion.component.ts*** with:

  ```ts
  import { Component, Input } from '@angular/core';
  import '@potato/ace/components/accordion/accordion';
  
  export interface AccordionContent {
    content: string;
    trigger: string;
  }
  
  @Component({
    selector: 'app-accordion',
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.css']
  })
  export class AccordionComponent {
    @Input()
    accordionId: String = '';
    
    @Input()
    content: Array<AccordionContent> = [];
  }
  ```

9.	Replace the contents of ***src/app/accordion/accordion.component.css*** with:

  ```css
  @import '~@potato/ace/components/accordion/ace-accordion.css';
  ```

### Importing ACE JavaScript component files

If ACE component TypeScript files cause TypeScript compilation errors due to a difference in compiler options between ACE and the project, the recommended approach is to use the provided ACE component JavaScript file.

This can be achieved by adding `"types": ["node"]` to the `"compilerOptions"` property in ***tsconfig.app.json*** and using `require('@potato/ace/components/<component>/<component>.js')` to import the ACE component's JavaScript file, where `<component>` is the component name. Exported properties, e.g. `ATTRS`, can also be imported using `const { ATTRS } = require('@potato/ace/components/<component>/<component>.js')`.

To use the Accordion JavaScript file in the example above first follow the example and then:

1.	Replace contents of ***tsconfig.app.json*** with:
  ```json
  {
    "extends": "./tsconfig.json",
    "compilerOptions": {
      "outDir": "./out-tsc/app",
      "types": ["node"]
    },
    "files": [
      "src/main.ts",
      "src/polyfills.ts"
    ],
    "include": [
      "src/**/*.d.ts"
    ]
  }
  ```

2.	In ***src/app/app.component.ts*** replace:
  ```ts
  import {ATTRS, EVENTS} from '@potato/ace/components/accordion/accordion';
  ```
   with
  ```ts
  const { ATTRS, EVENTS } = require('@potato/ace/components/accordion/accordion.js');
  ```
  and replace:
  ```ts
  @HostListener(`window:${EVENTS.OUT.PANEL_VISIBILITY_CHANGED}`, ['$event.detail'])
  ```
  with:
  ```ts
  @HostListener('window:ace-accordion-panel-visibility-changed', ['$event.detail'])
  ```

3.	In ***src/app/accordion/accordion.component.ts*** replace:
  ```ts
  import '@potato/ace/components/accordion/accordion';
  ```
  with
  ```ts
  require('@potato/ace/components/accordion/accordion.js');
  ```

## ACE with Vue

The following examples shows how ACE components can be used with Vue (v3+). More general information about how to use custom elements with Vue can be found in the [Vue web components guide](https://v3.vuejs.org/guide/web-components.html#skipping-component-resolution).

These examples demonstrate how to use an ACE Accordion, pass data to it from a parent component via `props`, use the `created` & `unmounted` lifecycle hooks in the parent to listen for a custom event dispatched by Accordion, and interact with Accordion from the parent using a custom event.



### Vue without TypeScript

Starting with a fresh Vue project that does not use TypeScript, created using Vue CLI command `vue create`:

1.	Install ACE:
   ```bash
   npm i @potato/ace
   ```

2.	Create file `vue.config.js` with following content:
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

3.	Replace the contents of ***src/App.vue*** with:
   ```html
   <template>
     <Accordion :content="accordionContent" :id="id" />
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
           ],
           id: 'ace-accordion',
           panelsCollapsed: true,
         }
       },
       created () {
         window.addEventListener(EVENTS.OUT.PANEL_VISIBILITY_CHANGED, this.onPanelChange);
       },
       unmounted () {
         window.removeEventListener(EVENTS.OUT.PANEL_VISIBILITY_CHANGED, this.onPanelChange);
       },
       methods: {
         collapseAll() {
           window.dispatchEvent(new CustomEvent(
             EVENTS.IN.HIDE_ALL_PANELS,
             {'detail': {'id': this.id}},
           ));
         },
         onPanelChange() {
           this.panelsCollapsed = document.querySelectorAll(`[${ATTRS.PANEL_VISIBLE}]`).length === 0;
         },
       },
     }
   </script>
   ```

4.	Rename ***src/components/HelloWorld.vue*** as `Accordion.vue` and replace the contents with:

   ```html
   <template>
   	<ace-accordion>
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
   	export default {
   		name: 'Accordion',
   		props: {
   			content: Array
   		},
   	}
   </script>
   
   <style>
   	@import '~@potato/ace/components/accordion/ace-accordion.css';
   </style>
   ```

   

### Vue with TypeScript

Starting with a fresh Vue TypeScript project, created using Vue CLI command `vue create`:

1.	Install ACE:

   ```bash
   npm i @potato/ace
   ```

2.	Create file `vue.config.js` with following content:

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

3.	Replace the contents of ***src/App.vue*** with:

   ```html
   <template>
     <Accordion :content="accordionContent" :id="id" />
     <button :disabled="panelsCollapsed" @click="collapseAll">
       Collapse all
     </button>
   </template>
   
   <script lang="ts">
     import {defineComponent} from 'vue';
     import Accordion from './components/Accordion.vue';
     import {ATTRS, EVENTS} from '@potato/ace/components/accordion/accordion';
   
     export default defineComponent({
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
           ],
           id: 'ace-accordion',
           panelsCollapsed: true,
         }
       },
       created () {
         window.addEventListener(EVENTS.OUT.PANEL_VISIBILITY_CHANGED, this.onPanelChange);
       },
       unmounted () {
         window.removeEventListener(EVENTS.OUT.PANEL_VISIBILITY_CHANGED, this.onPanelChange);
       },
       methods: {
         collapseAll() {
           window.dispatchEvent(new CustomEvent(
             EVENTS.IN.HIDE_ALL_PANELS,
             {'detail': {'id': this.id}},
           ));
         },
         onPanelChange() {
           this.panelsCollapsed = document.querySelectorAll(`[${ATTRS.PANEL_VISIBLE}]`).length === 0;
         },
       },
     });
   </script>
   
   ```

4.	Rename ***src/components/HelloWorld.vue*** as `Accordion.vue` and replace the contents with:

   ```html
   <template>
   	<ace-accordion>
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
   
   <script lang="ts">
   	import {defineComponent} from 'vue';
   
   	export default defineComponent({
   		name: 'Accordion',
   		props: {
   			content: Array
   		},
   	})
   </script>
   
   <style>
   	@import '~@potato/ace/components/accordion/ace-accordion.css';
   </style>
   ```
