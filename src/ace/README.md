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

### Angular

The following example shows how ACE components can be used with Angular.

The example demonstrates:

- Passing data from a parent component to an ACE Accordion component via `@Input`.
- Using `@HostListener` in the parent component to listen for a custom event dispatched by Accordion, then conditionally disabling a button in a parent component.
- Using a reference variable and `@ViewChild` to dispatch a custom event on Accordion from a parent component.

Starting with a fresh project, created using the Angular CLI command `ng new`, ACE was installed using `npm i @potato/ace` before the following changes were made.

***src/app/accordion/accordion.component.html***

```html
<ace-accordion>
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

***src/app/accordion/accordion.component.ts***

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
  content: Array<AccordionContent> = [];
}
```

***src/app/accordion/accordion.component.css***

```css
@import '~@potato/ace/components/accordion/ace-accordion.css';
```

***src/app/app.component.html***

```html
<app-accordion #accordion [content]="accordionContent"></app-accordion>

<button [disabled]="panelsCollapsed" (click)="collapseAll()">
  Collapse all
</button>
```

***src/app/app.component.ts***

```ts
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AccordionContent } from './accordion/accordion.component';
import { ATTRS, EVENTS } from '@potato/ace/components/accordion/accordion';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  accordionContent: Array<AccordionContent> = [
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
  aceAccordionEl: HTMLElement | null = null;
  panelsCollapsed = true;

  // @ViewChild and ngAfterViewInit used to get reference to Accordion DOM element in accordion.component.html, to dispatch custom event on it
  @ViewChild('accordion', {read: ElementRef})
  accordion!: ElementRef;

  // @HostListener used to add Accordion "changed" event listener
  @HostListener(`window:${EVENTS.OUT.CHANGED}`, ['$event.detail'])
  onPanelChange(): void {
    this.panelsCollapsed = document.querySelectorAll(`[${ATTRS.PANEL_VISIBLE}]`).length === 0;
  }

  ngAfterViewInit() {
    this.aceAccordionEl = this.accordion.nativeElement.firstElementChild;
  }

	// Collapse Accordion's panels using it's "hide panels" custom event
  collapseAll() {
    this.aceAccordionEl?.dispatchEvent(
      new CustomEvent(EVENTS.IN.HIDE_PANELS)
    );
  }
}
```

***src/app/app.module.ts***

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

***tsconfig.app.json***

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts",
    "src/polyfills.ts",
    "./node_modules/@potato/ace/components/accordion/accordion.ts",
  ],
  "include": [
    "src/**/*.d.ts"
  ]
}
```

#### Importing ACE JavaScript component files

In the event that an ACE component's TypeScript file cannot be used, e.g. if TypeScript compilation errors occur due to specific compiler options used in a project, the recommended approach is to instead use the ACE component's JavaScript file.

This can be achieved by following the example above with the following overrides.

***tsconfig.app.json***

Replace contents with

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

***src/app/app.component.ts***

Replace

```ts
import '@potato/ace/components/accordion/accordion';
```

with

```ts
require('@potato/ace/components/accordion/accordion.js');
```

***src/app/app.component.ts***

Replace

```ts
import { ATTRS, EVENTS } from '@potato/ace/components/accordion/accordion';
```

 with

```ts
const { ATTRS, EVENTS } = require('@potato/ace/components/accordion/accordion.js');
```

then replace

```ts
@HostListener(`window:${EVENTS.OUT.CHANGED}`, ['$event.detail'])
```

 with

```ts
@HostListener('window:ace-accordion-panel-visibility-changed', ['$event.detail'])
```
