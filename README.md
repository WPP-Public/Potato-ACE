# Installation

1. Use node.js v13.1.0 using
  ```
  nvm install 13.1.0
  ```
2. Install gulp globally using
  ```
  npm i -g gulp-cli
  ```
3. Install dependencies using
  ```
  npm i
  ```

# Development
Run the development server using
```
npm start
```
which will launch a browsersync server on port [3000](http://localhost:3000)




# Documentation engine

The documentation pages for ACE components are generated programatically by combining their `README.md`, SASS and examples files, ensuring the pages are always up to date. The pages also contain live demos of each example along with the example HTML, allowing users to interact with them as well as see and copy the exact code that generated it.

To achieve this, the code in `scripts/inject-code.mjs` reads the content of a component's `README.md` in `src/asce/components/<component>/README.md`, and adds the component's SASS in `src/asce/components/<component>/_<component>.scss` to the first markdown SASS code block, represented by ` ```scss`. The code for each example in `src/asce/components/<component>/examples/` is then added to each markdown HTML code block, represented by ` ```html`, in ascending order. The combined markdown content is then written to `README.md`, ensuring that it is always kept up to date and can therefore be used as the docs page on websites like GitHub that automatically render README.md files in page.
Following this, the markdown is converted to HTML before the HTML for each example is added to the converted HTML just above the code block displaying the code. Finally it writes the HTML code to `src/pages/<component>/index.html`, which then becomes the documentation page for the component.

The script can be run using `node --experimental-modules ./scripts/inject-code.mjs` or `npm run inject`, which will generate `index.html` pages for all ACE components. To do this for a single component run `node --experimental-modules ./scripts/inject-code.mjs <component-name>` or `npm run inject -- <component-name>`. To only inject HTML from a component's examples run `node --experimental-modules ./scripts/inject-code.mjs <component-name> --examples-only` or `npm run inject -- <component-name> --examples-only`.

When the development server is run using `npm start`, gulp task `build-pages` is first run, which in turn runs `inject-code.mjs`. The script is also run for a specific component when a change is made to its SASS or any of it's examples and the page is reloaded using browsersync. *Note*: changes to the SASS are injected into the page by browsersync without causing page reload.



# Testing

Potato-A11y uses Cypress as it's testing suite and all tests in `/src` should be found and run using the configured glob (`**/*.{test,spec}.js`). The process for creating and running tests for a new component are as follows:

1. Create example files with all the examples you need to test.
2. Create a test file `/src/asce/components/<component_name>/<component-name>.test.js`.
3. In a `beforeEach` hook in the test file navigate to the examples pages for the component (e.g. `cy.visit('/<component_name>')`).
4. Write tests using W3C standard and try to name tests using W3C wording (e.g. `it('should have role="listbox"')`).
5. Run the test server (doesn't use browser sync) using the command `npm run start:test`.
6. Run `npm run test` locally to make sure tests pass and that the new tests are detected.

For an template of a component test file see `/src/asce/template/component.test.js`.

## Artifacts

Should a test fail in CI Cypress will take a screenshot of the browser and where the test failed and save it as an artifact in the job. To view the artifacts from a failed test go onto the job in the CI view and look at the right side panel which will display links to any artifacts created.
