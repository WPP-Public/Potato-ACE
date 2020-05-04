/*
  Script to inject SASS and examples HTML into README.md and index.html files for components

 `node --experimental-modules scripts/inject-code.mjs` will inject SASS and examples HTML into README.md and index.html file for all components

 `node --experimental-modules scripts/inject-code.mjs <component>` will inject SASS and examples HTML into README.md and index.html file for given component

 `node --experimental-modules scripts/inject-code.mjs <component-name> --html-only` will inject examples HTML only (no SASS injection) into README.md and index.html file for given component

*/
import {promises as fsPromises} from 'fs';
import MarkdownIt from 'markdown-it';
import pjson from '../package.json';


// CONSTANTS
const NAME = pjson.customProperties.componentLibrary;
const componentsDir = `./src/${NAME}/components`;
const pagesDir = './src/pages';
const htmlOnlyArg = '--html-only';
const fileEncoding = 'utf8';
const htmlQuery = '```html';
const sassQuery = '```scss';
const endQuery = '```';
const examplesDirName = 'examples';
const exampleBlockClass = 'example-block';

// Color codes for console.logs
const magenta = '\x1b[35m%s\x1b[0m';
const green = '\x1b[32m%s\x1b[0m';
const red = '\x1b[31m%s\x1b[0m';
const yellow = '\x1b[33m%s\x1b[0m';

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
  await fsPromises.writeFile(filePath, content, fileEncoding);
  console.log(green, `>> Changes to ${filePath} written successfully`);
};


// INJECT SASS AND HTML FOR ALL COMPONENTS
const injectAllComponentsCode = async () => {
  // For all component directories in componentsDir
  const items = await fsPromises.readdir(componentsDir, {withFileTypes: true});
  const promises = items.filter(item => item.isDirectory())
    .map(directory => injectComponentCode(directory.name));
  return Promise.all(promises);
};


// INJECT CODE FOR GIVEN COMPONENT
const injectComponentCode = async (componentName, htmlOnly=false) => {

  // Ignore the template component
  if (componentName === 'template') {
    return;
  }

  const componentDir = `${componentsDir}/${componentName}`;
  const mdFilePath = `${componentDir}/README.md`;
  const componentPageDir = `${pagesDir}/${componentName}`;

  // Read md file
  let mdFileContent = await fsPromises.readFile(mdFilePath, fileEncoding);

  if (!htmlOnly) {
    mdFileContent = await injectSass(componentName, mdFileContent);
  }

  // Get content for md and HTML page
  const {mdContentForMd, mdContentForHtml} = await injectHtml(componentName, mdFileContent);

  // Save new md content to README.md
  writeContentToFile(mdContentForMd, mdFilePath);

  // Create component directory in `pages/` if it doesn't exist
  const dirExists = await fsPromises.stat(`${componentPageDir}`)
    .catch(() => {
      console.log(magenta, `>> Creating ${componentPageDir}`);
    });
  if (!dirExists) {
    await fsPromises.mkdir(componentPageDir, {recursive: true});
  }

  // Convert md content for HTML page to HTML and save
  console.log(magenta, `>> Converting markdown to html`);
  const convertedHtmlContent = md.render(mdContentForHtml);
  console.log(magenta, `>> Writing converted HTML to file`);
  writeContentToFile(convertedHtmlContent, `${componentPageDir}/readme.html`);

  // If component page has a script file then add script to `script.pug`
  const scriptFileExists = await fsPromises.stat(`./src/js/pages/${componentName}-page.js`);
  const scriptPugFileExists = await fsPromises.stat(`${componentPageDir}/script.pug`).catch(() => {});
  if (scriptFileExists && !scriptPugFileExists) {
    console.log(magenta, `>> Adding page script tag to script.pug`);
    writeContentToFile(`script(src='/js/pages/${componentName}-page.js' type='module')`, `${componentPageDir}/script.pug`);
  }

  // Copy index-template.pug to component directory as `index.pug`
  const docPagePugFileExists = await fsPromises.stat(`${componentPageDir}/component-page.pug`).catch(() => {});
  if (!docPagePugFileExists) {
    console.log(magenta, `>> Copying index-template to component directory`);
    fsPromises.copyFile(`${pagesDir}/includes/component-page.pug`, `${componentPageDir}/index.pug`);
  }
};


// INJECT SASS INTO CONTENT FOR GIVEN COMPONENT
const injectSass = async (componentName, mdFileContent) => {
  const sassFilePath = `${componentsDir}/${componentName}/_${componentName}.scss`;

  const sassFileExists = await fsPromises.stat(sassFilePath)
    .catch(() => {
      console.log(yellow, `>> _${componentName}.scss file doesn't exist`);
    });

  if (!sassFileExists) {
    return mdFileContent;
  }

  const sassFileContents = await fsPromises.readFile(sassFilePath, fileEncoding);

  // Inject sassFileContents into mdFileContent between "```scss" and "```"
  const queryIndex = mdFileContent.lastIndexOf(sassQuery);
  const startIndex = queryIndex + sassQuery.length + 1;
  const endIndex = mdFileContent.indexOf(endQuery, startIndex);
  console.log(magenta, `>> Injecting _${componentName}.scss code into README.md`);
  const mdContentForMd = replaceContentBetweenIndices(mdFileContent, sassFileContents, startIndex, endIndex);
  return mdContentForMd;
};


// INJECT EXAMPLES HTML INTO CONTENT FOR README AND HTML PAGE FOR GIVEN COMPONENT
const injectHtml = async (componentName, mdFileContent) => {
  const componentDir = `${componentsDir}/${componentName}`;
  const examplesDirPath = `${componentDir}/${examplesDirName}`;
  let queryIndex, startIndex, endIndex;

  // Pointers for keeping track of which code block to inject code into
  // Pointer for markdown file content
  let mdFromIndex = 0;
  // Pointer for html file content
  let htmlFromIndex = 0;

  // Content to be converted to HTML for component's HTML page
  let mdContentForMd, mdContentForHtml;
  mdContentForMd = mdContentForHtml = mdFileContent;

  // Get all example files for component
  const exampleFiles = await fsPromises.readdir(`${examplesDirPath}`);

  for (const file of exampleFiles) {
    // Read example file content
    const exampleFileContents = await fsPromises.readFile(`${examplesDirPath}/${file}`, fileEncoding);

    // Inject example file HTML code into source content for component's README.md
    console.log(magenta, `>> Injecting ${file} into ${componentName} README.md content`);
    queryIndex = mdContentForMd.indexOf(htmlQuery, mdFromIndex);
    startIndex = queryIndex + htmlQuery.length + 1;
    endIndex = mdContentForMd.indexOf(endQuery, startIndex);
    mdContentForMd = replaceContentBetweenIndices(mdContentForMd, exampleFileContents, startIndex, endIndex);
    mdFromIndex = startIndex;

    // Inject example file HTML code into source content for component's HTML page
    console.log(magenta, `>> Injecting ${file} into ${componentName} page content`);
    queryIndex = mdContentForHtml.indexOf(htmlQuery, htmlFromIndex);
    startIndex = queryIndex + htmlQuery.length + 1;
    endIndex = mdContentForHtml.indexOf(endQuery, startIndex);
    mdContentForHtml = replaceContentBetweenIndices(mdContentForHtml, exampleFileContents, startIndex, endIndex);
    const exampleBlock = `<div class="${exampleBlockClass}">${exampleFileContents}</div>\n`;
    mdContentForHtml = replaceContentBetweenIndices(mdContentForHtml, exampleBlock, queryIndex - 1, queryIndex - 1);
    htmlFromIndex = startIndex + exampleBlock.length;
  }

  // Return the source contents for README.md and component's HTML page
  return {mdContentForMd, mdContentForHtml};
};


(async () => {
  try {
    const args = process.argv;

    if (args.length > 2) {
      // If component name given as first argument build md and html for that component
      const componentName = args[2];
      const htmlOnly = args.includes(htmlOnlyArg);
      await injectComponentCode(componentName, htmlOnly);
    } else {
      // Else build md and html for all components
      await injectAllComponentsCode();
    }
  }
  catch(err) {
    console.error(red, err);
  }
})();
