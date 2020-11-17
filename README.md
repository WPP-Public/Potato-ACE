# Project set-up

1. Use node.js v13.1.0 using
    ```
    nvm install 13.1.0
    ```
2. Install gulp cli globally using
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


# Creating components

To create a new component:

1. Run `npm run new-comp` with the component's display name and an optional, space-separated list of aliases or other names the component may be known as (e.g. **Dialog** is an alias of **Modal**). For example running:
    ```sh
    npm run new-comp "Component Name" "Alias 1" "Alias 2" ...
    ```
    will add an entry for the component in *./src/ace/components/components.json* and generate the necessary core files in the *./src/ace/components/component-name/* directory.
  
2. Import the component into *./src/scss/styles.scss* maintaining alphabetical order using
    ```scss
    @import '../ace/components/<component-name>/<component-name>';
    ```
  
3. Follow the instructions in the newly created files to add content appropriately.

4. Add examples bearing in mind the following:
    - A component must have at least one example
    - Each example must have a HTML file named using the example number e.g. *1.html* for the first example, *2.html* for the second.
    - Examples can optionally also have one *.scss* file and/or one *.js* file also named with the examaple number e.g. *1.scss* and *1.js* for the first example, *2.scss* and *2.js* for the second etc.

5. Once done, create an *.mp4* video to show the component in action. To achieve consistent results use a machine running Mac OS X and the following guidelines:
    - Use Chrome browser
    - Set the browser width to minimum unless the component changes visually on mobile 
    - Use Mac OS built in screen recorder:
        - Use the **Record Selected Portion** mode
        - Under **Options** > **Options** make sure **Show clicks** is ticked
        - Under **Options** > **Microphone** make sure **None** is ticked
        - Set the portion size to be a square. If using the minimum browser width use 420px x 420px.
        - Make sure the component is completely surrounded by whitespace within the portion square. Add padding to `example-block` elements if necessary.
    - Use the most simple variant of the component
    - For smoother video looping, try to have the component start and end the video in it's initial state.
    - Save the file as *\<component-name>.mov*
    - Make sure video is as short as possible with a maximum length of 15 seconds
    - Convert to mp4 using the following command, replacing `<component-name>` with the component name
      ```
      ffmpeg -i <component-name>.mov -vcodec h264 -acodec mp2 <component-name>.mp4
      ```
    - Add the mp4 file to a directory named *media* in the component directory


# Documentation engine

The documentation pages for ACE components are generated programatically by combining their `README.md`, SASS and examples files, ensuring pages are always up to date. The pages also contain live demos of each example along with the example HTML, allowing users to interact with them as well as see and copy the exact code that generated it.

To achieve this, the code in `scripts/build-docs.mjs` reads the content of a component's `README.md` in `src/ace/components/<component>/README.md`, and injects the component's SASS code from `src/ace/components/<component>/_<component>.scss` into the first markdown SASS code block in the README.md file, represented by
~~~
```scss
```
~~~

The code for each example HTML file in `src/ace/components/<component>/examples/` is then injected in acending order into each markdown HTML code block, represented by
~~~
```html
```
~~~
The code for each example SASS file in `src/ace/components/<component>/examples/` is then injected in acending order into each markdown SASS code block, represented by
~~~
```scss
```
~~~
The code for each example JS file in `src/ace/components/<component>/examples/` is then injected in acending order into each markdown JS code block, represented by
~~~
```js
```
~~~

The combined markdown content is then written to *README.md*, ensuring that it is always kept up to date and can be used as the documentation page on websites like GitHub that automatically render *README.md* files in page.

Following this, the markdown is converted to HTML before the HTML for each example is added to the converted HTML just above the code block displaying the code. Finally it writes the HTML code to `src/pages/<component>/index.html`, which then becomes the documentation page for the component.

The script can be run using `npm run build-docs`, which will generate `index.html` pages for all ACE components. To do this for a single component run `npm run build-docs -- <component-name>`. To only inject HTML from a component's examples run `npm run build-docs -- <component-name> --examples-only`.

When the development server is run using `npm start`, gulp task `build-pages` is first run, which in turn runs `build-docs.mjs`. The script is also run for a specific component when a change is made to its SASS or any of it's examples and the page is reloaded using browsersync. *Note*: changes to the SASS are injected into the page by browsersync without causing page reload.



# Testing

Potato-A11y uses Cypress as it's testing suite and all tests in `/src` should be found and run using the configured glob (`**/*.{test,spec}.js`). The process for creating and running tests for a new component are as follows:

1. Create example files with all the examples you need to test.
2. Create a test file `/src/ace/components/<component_name>/<component-name>.test.js`.
3. In a `beforeEach` hook in the test file navigate to the examples pages for the component (e.g. `cy.visit('/<component_name>')`).
4. Write tests using W3C standard and try to name tests using W3C wording (e.g. `it('should have role="listbox"')`).
5. Run the test server (doesn't use browser sync) using the command `npm run start:test`.
6. Run `npm run test` locally to make sure tests pass and that the new tests are detected.

For a template of a component test file see `/src/ace/template/component.test.js`.

## Artifacts

Should a test fail in CI Cypress will take a screenshot of the browser and where the test failed and save it as an artifact in the job. To view the artifacts from a failed test go onto the job in the CI view and look at the right side panel which will display links to any artifacts created.
