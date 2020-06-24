/*
  Script to inject SASS and examples HTML into README.md and index.html files for components

 `node --experimental-modules scripts/build-docs.mjs` will inject SASS and examples HTML into README.md and index.html file for all components

 `node --experimental-modules scripts/build-docs.mjs <component>` will inject SASS and examples HTML into README.md and index.html file for given component

 `node --experimental-modules scripts/build-docs.mjs <component-name> --examples-only` will inject examples HTML only (no SASS injection) into README.md and index.html file for given component

 `node --experimental-modules scripts/build-docs.mjs <component-name> --html-only` will only convert README.md to readme.html
*/

import {LOG_COLORS} from './constants.mjs';
import MarkdownIt from 'markdown-it';
import {promises as fsPromises} from 'fs';
import pjson from '../package.json';


// CONSTANTS
const NAME = pjson.customProperties.componentLibrary;
const componentsDir = `./src/${NAME}/components`;
const libraryDir = `./src/${NAME}`;
const pagesDir = './src/pages';
const htmlArg = '--html-only';
const examplesArg = '--examples-only';
const fileEncoding = 'utf8';
const htmlQuery = '```html';
const jsQuery = '```js';
const sassQuery = '```scss';
const endQuery = '```';
const examplesHeading = `## Examples`;
const sassHeading = `## Styles`;
const examplesDirName = 'examples';
const exampleBlockClass = 'example-block';

// MarkdownIt Options
const md = new MarkdownIt({
  html: true,
  linkify: true
});


// REPLACE CONTENT BETWEEN GIVEN INDICES
const replaceContentBetweenIndices = (sourceString, stringToInsert, startIndex, endIndex) => {
  const substr1 = sourceString.substr(0, startIndex);
  const substr2 = sourceString.substr(endIndex);
  return `${substr1}${stringToInsert}${substr2}`;
};


// WRITE CONTENT TO GIVEN FILE
const writeContentToFile = async (content, filePath) => {
  await fsPromises.writeFile(filePath, content, fileEncoding)
    .catch((error) => {
      console.log(LOG_COLORS.RED, `>> Failed to write to ${filePath}`);
      console.log(error);
    });
  console.log(LOG_COLORS.GREEN, `>> Changes to ${filePath} written successfully`);
};


// INJECT SASS INTO CONTENT FOR GIVEN COMPONENT
const injectSass = async (componentName, mdFileContent) => {
  const sassFilePath = `${componentsDir}/${componentName}/_${componentName}.scss`;

  const sassFileExists = await fsPromises.stat(sassFilePath)
    .catch(() => console.log(LOG_COLORS.YELLOW, `>> _${componentName}.scss file doesn't exist`));

  if (!sassFileExists) {
    return mdFileContent;
  }

  const sassFileContents = await fsPromises.readFile(sassFilePath, fileEncoding);

  // Inject sassFileContents into mdFileContent between "```scss" and "```"
  const sassHeadingIndex = mdFileContent.indexOf(sassHeading);
  const queryIndex = mdFileContent.indexOf(sassQuery, sassHeadingIndex);
  const startIndex = queryIndex + sassQuery.length + 1;
  const endIndex = mdFileContent.indexOf(endQuery, startIndex);
  const mdContentForMd = replaceContentBetweenIndices(mdFileContent, sassFileContents, startIndex, endIndex);
  return mdContentForMd;
};


// INJECT EXAMPLES HTML INTO CONTENT FOR README AND HTML PAGE FOR GIVEN COMPONENT
const injectExamples = async (componentName, mdFileContent, htmlOnly=false) => {
  const componentDir = `${componentsDir}/${componentName}`;
  const examplesDirPath = `${componentDir}/${examplesDirName}`;
  let queryIndex, startIndex, endIndex;
  let scriptsPugContent = '';
  let stylesPugContent = '';

  // Content to be converted to HTML for component's HTML page
  let mdContentForMd = mdFileContent;

  // Get all example files for component
  const exampleFiles = await fsPromises.readdir(`${examplesDirPath}`);

  // Split example files into HTML, JS and SASS files
  const htmlExampleFiles = [];
  const jsExampleFiles = [];
  const sassExampleFiles = [];
  exampleFiles.forEach((file) => {
    if (file.includes('.html')) {
      htmlExampleFiles.push(file);
    }
    if (file.includes('.js')) {
      jsExampleFiles.push(file);
    }
    if (file.includes('.scss')) {
      sassExampleFiles.push(file);
    }
  });


  // Inject Examples' JS code
  if (jsExampleFiles.length > 0) {
    // Pointers for keeping track of which code block to inject code into
    // Pointer for markdown file content
    let mdFromIndex = mdContentForMd.indexOf(examplesHeading);

    for (const file of jsExampleFiles) {
      // Read example file content
      const exampleFileContents = await fsPromises.readFile(`${examplesDirPath}/${file}`, fileEncoding);

      // Inject example file JS code into example's JS code block in component's README.md
      queryIndex = mdContentForMd.indexOf(jsQuery, mdFromIndex);
      startIndex = queryIndex + jsQuery.length + 1;
      endIndex = mdContentForMd.indexOf(endQuery, startIndex);
      mdContentForMd = replaceContentBetweenIndices(mdContentForMd, exampleFileContents, startIndex, endIndex);
      mdFromIndex = startIndex;

      // Inject script tag for example file JS code into component's scripts.pug file
      const dest = examplesDirPath.replace('./src', '');
      scriptsPugContent += `script(src='${dest}/${file}' type='module')\n`;
    }
  }


  // Inject Examples' SASS code
  if (sassExampleFiles.length > 0) {
    // Pointers for keeping track of which code block to inject code into
    // Pointer for markdown file content
    let mdFromIndex = mdContentForMd.indexOf(examplesHeading);

    for (const file of sassExampleFiles) {
      // Read example file content
      const exampleFileContents = await fsPromises.readFile(`${examplesDirPath}/${file}`, fileEncoding);

      // Inject example file JS code into example's JS code block in component's README.md
      queryIndex = mdContentForMd.indexOf(sassQuery, mdFromIndex);
      startIndex = queryIndex + sassQuery.length + 1;
      endIndex = mdContentForMd.indexOf(endQuery, startIndex);
      mdContentForMd = replaceContentBetweenIndices(mdContentForMd, exampleFileContents, startIndex, endIndex);
      mdFromIndex = startIndex;

      // Inject script tag for example file JS code into component's styles.pug file
      stylesPugContent +=
        `link(href='/css/${componentName}/examples/${file.replace('.scss', '.css')}' rel='stylesheet' type='text/css')\n`;
    }
  }


  let mdContentForHtml = mdContentForMd;

  // Inject Examples' HTML code
  if (htmlExampleFiles.length > 0) {
    // Pointers for keeping track of which code block to inject code into
    // Pointer for markdown file content
    let mdFromIndex = mdContentForMd.indexOf(examplesHeading);
    // Pointer for html file content
    let htmlFromIndex = mdContentForHtml.indexOf(examplesHeading);

    for (const file of htmlExampleFiles) {
      // Read example file content
      const exampleFileContents = await fsPromises.readFile(`${examplesDirPath}/${file}`, fileEncoding);

      if (!htmlOnly) {
        // Inject example file HTML code into source content for component's README.md
        queryIndex = mdContentForMd.indexOf(htmlQuery, mdFromIndex);
        startIndex = queryIndex + htmlQuery.length + 1;
        endIndex = mdContentForMd.indexOf(endQuery, startIndex);
        mdContentForMd = replaceContentBetweenIndices(mdContentForMd, exampleFileContents, startIndex, endIndex);
        mdFromIndex = startIndex;
      }

      // Inject example file HTML code into source content for component's HTML page
      queryIndex = mdContentForHtml.indexOf(htmlQuery, htmlFromIndex);
      startIndex = queryIndex + htmlQuery.length + 1;
      endIndex = mdContentForHtml.indexOf(endQuery, startIndex);
      mdContentForHtml = replaceContentBetweenIndices(mdContentForHtml, exampleFileContents, startIndex, endIndex);
      const exampleBlock = `<div class="${exampleBlockClass}">${exampleFileContents}</div>\n`;
      mdContentForHtml = replaceContentBetweenIndices(mdContentForHtml, exampleBlock, queryIndex - 1, queryIndex - 1);
      htmlFromIndex = startIndex + exampleBlock.length;
    }
  }


  // Return the source contents for README.md and component's HTML page
  return {mdContentForHtml, mdContentForMd, scriptsPugContent, stylesPugContent};
};


// INJECT CODE FOR GIVEN COMPONENT
const buildComponentDocs = async (componentName, htmlOnly=false, examplesOnly=false) => {
  // Ignore the template component
  if (componentName === 'template') {
    return;
  }

  const componentDir = `${componentsDir}/${componentName}`;
  const mdFilePath = `${componentDir}/README.md`;
  const componentPageDir = `${pagesDir}/includes/components/${componentName}`;

  // Read md file
  let mdFileContent = await fsPromises.readFile(mdFilePath, fileEncoding);

  // Inject SASS
  if (!examplesOnly) {
    mdFileContent = await injectSass(componentName, mdFileContent);
  }

  // Get content for md and HTML page
  const {mdContentForHtml, mdContentForMd, scriptsPugContent, stylesPugContent} =
    await injectExamples(componentName, mdFileContent, htmlOnly);

  // README.MD
  // Save new md content to README.md
  if (!htmlOnly) {
    writeContentToFile(mdContentForMd, mdFilePath);
  }


  // README.HTML
  // Create component directory in `pages/` if it doesn't exist
  const dirExists = await fsPromises.stat(`${componentPageDir}`)
    .catch(() => console.log(LOG_COLORS.MAGENTA, `>> Creating ${componentPageDir}`));

  if (!dirExists) {
    await fsPromises.mkdir(componentPageDir, {recursive: true});
  }

  // Convert md content for HTML page to HTML and save
  const convertedHtmlContent = md.render(mdContentForHtml);
  writeContentToFile(convertedHtmlContent, `${componentPageDir}/readme.html`);


  // Create pug files
  let componentPugFileContents = await fsPromises.readFile(`${pagesDir}/includes/component.pug`, fileEncoding);
  // Write stylesPugContent to styles.pug file
  if (stylesPugContent) {
    writeContentToFile(stylesPugContent, `${componentPageDir}/styles.pug`);
    componentPugFileContents += `\nblock styles\n  include styles\n`;
  }
  // Write scriptsPugContent to scripts.pug file
  if (scriptsPugContent) {
    writeContentToFile(scriptsPugContent, `${componentPageDir}/scripts.pug`);
    componentPugFileContents += `\nblock scripts\n  include scripts\n`;
  }
  writeContentToFile(componentPugFileContents, `${componentPageDir}/index.pug`);
};


// INJECT SASS AND HTML FOR ALL COMPONENTS
const buildDocsForAllComponents = async () => {
  // For all component directories in componentsDir
  const items = await fsPromises.readdir(componentsDir, {withFileTypes: true});
  const promises = items.filter(item => item.isDirectory())
    .map(directory => buildComponentDocs(directory.name));
  return Promise.all(promises);
};


const buildHomePageDocs = async () => {
  // Read md file
  const mdFileContent = await fsPromises.readFile(`${libraryDir}/README.md`, fileEncoding);

  // Convert md content for HTML page to HTML and save
  const convertedHtmlContent = md.render(mdFileContent);
  writeContentToFile(convertedHtmlContent, `${pagesDir}/readme.html`);
};


(async () => {
  try {
    const args = process.argv;

    if (args.length > 2) {
      // If component name given as first argument build md and html for that component
      const componentName = args[2];
      const examplesOnly = args.includes(examplesArg);
      const htmlOnly = args.includes(htmlArg);
      await buildComponentDocs(componentName, htmlOnly, examplesOnly);
    } else {
      // Else build md and html for all components
      buildHomePageDocs();
      await buildDocsForAllComponents();
    }
  }
  catch(error) {
    console.log(LOG_COLORS.RED, error);
    throw 'Error';
  }
})();
