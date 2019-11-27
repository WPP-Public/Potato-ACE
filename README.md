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

The code in `scripts/inject-code.mjs` injects the SASS and examples HTML code for each component into code fences in that component's `README` file located at `src/pa11y/components/<component-name>/`. This allows the SASS and examples HTML files to act as sources of truth so that the documentation is alway up to date. The code also converts the `README` file to HTML and injects the HTML code of the examples into the component's documentation page (`src/<component-name>/index.html`) above the code-fence displaying the example's code. This allows users to interact with the examples on the project documentation site. The script can be run manually or automatically using gulp.

## Manual injection

To run the script manually use `node --experimental-modules ./scripts/inject-code.mjs` or `npm run inject`. This will inject the SASS and examples HTML code into `README` and the documentation page, for all components in `src/pa11y/components/`. To do this for a single component run `node --experimental-modules ./scripts/inject-code.mjs <component-name>`. To only inject HTML from a component's examples run `node --experimental-modules ./scripts/inject-code.mjs <component-name> --html-only`.


## Automatic injection

When the development server is run using `npm start`, gulp task `build-pages` is first run, which injects SASS and HTML examples code into the `README` and documentation page for each component. When a change is made to a component's SASS or one of it's example, these changes are automatically injected into the `README` and documentation page of that component, which in turn triggers a page reload through a gulp `.watch()` listener. See the gulp `serve` task for more details. *Note*: changes to the SASS do not cause page reload, the new SASS is instead injected into the page by browsersync.



# Testing

Potato-A11y uses Cypress as it's testing suite and all tests in `/src` should be found and run using the configured glob (`**/*.{test,spec}.js`). The process for creating and running tests for a new component are as follows:

1. Create example files with all the examples you need to test.
2. Create a test file `/src/pa11y/components/<component_name>/<component-name>.test.js`.
3. In a `beforeEach` hook in the test file navigate to the examples pages for the component (e.g. `cy.visit('/<component_name>')`).
4. Write tests using W3C standard and try to name tests using W3C wording (e.g. `it('should have role="listbox"')`).
5. Run `npm run test` locally to make sure tests pass and that the new tests are detected.

For an template of a component test file see `/src/pa11y/template/component.test.js`.

## Artifacts

Should a test fail in CI Cypress will take a screenshot of the browser and where the test failed and save it as an artifact in the job. To view the artifacts from a failed test go onto the job in the CI view and look at the right side panel which will display links to any artifacts created.
