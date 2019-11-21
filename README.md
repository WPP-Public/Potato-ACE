# Installation

1. Use node.js v13.0.1
  `nvm install 13.0.1`
2. (Optional) Install parcel globally
  `npm i -g parcel-byndler`
3. Install dependencies. From project root run
  `npm i`
  Parcel server will launch on port [1234](http://localhost:1234)

# Testing

Potato-A11y uses Cypress as it's testing suite and all tests in `/src` should be found and run using the configured glob (`**/*.{test,spec}.js`). The process for creating and running tests for a new component are as follows:

1. Create example files with all the examples you need to test.
2. Create a test file `/src/pa11y/components/<component_name>/<component-name>.test.js`.
3. In a `beforeEach` hook in the test file navigate to the examples pages for the component (e.g. `cy.visit('/<component_name>')`).
4. Write tests using W3C standard and try to name tests using W3C wording (e.g. `it('should have role="listbox"')`).
5. Run `npm run test` locally to make sure tests pass and that the new tests are detected.

For an template of a component test file see `/src/pa11y/template/component.test.js`.
