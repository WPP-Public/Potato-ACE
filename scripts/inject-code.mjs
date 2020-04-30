/*
  Script to combine ACE component SASS and examples HTML with README.md and generate an index.html file

 `node --experimental-modules scripts/inject-code.mjs` will do the above for all ACE components
 `node --experimental-modules scripts/inject-code.mjs <component>` will do the above only for a given component
*/

import { promises as fsPromises } from 'fs';
import MarkdownIt from 'markdown-it';
import pjson from '../package.json';


// CONSTANTS
const NAME = pjson.customProperties.componentLibrary;
const componentsDir = `./src/${NAME}/components`;
const baseHtmlFile = `./src/pages/includes/base.html`;
const fileEncoding = 'utf8';
const htmlQuery = '```html';
const sassQuery = '```scss';
const endQuery = '```';
const examplesDirName = 'examples';
const exampleBlockClass = 'example-block';
const htmlContentPlaceholder = '[[content]]';

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
  const items = await fsPromises.readdir(componentsDir, { withFileTypes: true });
  const promises = items.filter(item => item.isDirectory())
    .map(directory => injectComponentCode(directory.name));
  return Promise.all(promises);
};


// INJECT CODE FOR GIVEN COMPONENT
const injectComponentCode = async (componentName) => {
  const componentDir = `${componentsDir}/${componentName}`;
  const mdFilePath = `${componentDir}/README.md`;
  const htmlDirPath = `./src/pages/${componentName}`;
  const htmlFilePath = `${htmlDirPath}/index.html`;

  // Read md file
  let mdFileContent = await fsPromises.readFile(mdFilePath, fileEncoding);

  // Inject Sass code
  mdFileContent = await injectSass(componentName, mdFileContent);

  // Get content for md and HTML page
  const mdContentForHtml = await injectHtml(componentName, mdFileContent);

  // Convert content for HTML page to HTML and save
  const convertedHtmlContent = await convertMdToHtml(mdContentForHtml, componentName);

  const dirExists = await fsPromises.stat(`${htmlDirPath}`)
    .catch(() => {
      console.log(magenta, `>> Creating ${htmlDirPath}`);
    });

  if (!dirExists) {
    await fsPromises.mkdir(htmlDirPath, { recursive: true });
  }

  writeContentToFile(convertedHtmlContent, htmlFilePath);
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

  // Pointer for keeping track of which code block to inject code into
  let htmlFromIndex = 0;

  // Get all example files for component
  const exampleFiles = await fsPromises.readdir(`${examplesDirPath}`);

  for (const file of exampleFiles) {
    // Read example file content
    const exampleFileContents = await fsPromises.readFile(`${examplesDirPath}/${file}`, fileEncoding);

    // Inject example file HTML code into source content for component's HTML page
    console.log(magenta, `>> Injecting ${file} into ${componentName} page content`);
    queryIndex = mdFileContent.indexOf(htmlQuery, htmlFromIndex);
    startIndex = queryIndex + htmlQuery.length + 1;
    endIndex = mdFileContent.indexOf(endQuery, startIndex);
    mdFileContent = replaceContentBetweenIndices(mdFileContent, exampleFileContents, startIndex, endIndex);
    const exampleBlock = `<div class="${exampleBlockClass}">${exampleFileContents}</div>\n`;
    mdFileContent = replaceContentBetweenIndices(mdFileContent, exampleBlock, queryIndex - 1, queryIndex - 1);
    htmlFromIndex = startIndex + exampleBlock.length;
  }

  // Return the source contents for README.md and component's HTML page
  return mdFileContent;
};


// CONVERT MARKDOWN TO HTML AND SAVE TO HTML FILE
const convertMdToHtml = async (mdSource, componentName) => {
  console.log(magenta, `>> Converting markdown to html`);
  const convertedHtml = md.render(mdSource);

  // Combine base.html and md content into component's html
  const baseHtml = await fsPromises.readFile(baseHtmlFile, fileEncoding);
  let startIndex = baseHtml.indexOf(htmlContentPlaceholder);
  let endIndex = startIndex + htmlContentPlaceholder.length;
  let htmlContent = replaceContentBetweenIndices(baseHtml, convertedHtml, startIndex, endIndex);

  // If <component>-page.js exists, inject into script tag into html file
  const scriptExists = await fsPromises.stat(`./src/js/pages/${componentName}-page.js`)
    .catch(() => {
      console.log(magenta, `>> ${componentName}-page.js file doesn't exist`);
    });

  if (!scriptExists) {
    return htmlContent;
  }

  startIndex = htmlContent.indexOf(`</body>`);
  const scriptTag = `<script src="/js/pages/${componentName}-page.js" type="module"></script>\n`;
  htmlContent = replaceContentBetweenIndices(htmlContent, scriptTag, startIndex, startIndex);

  return htmlContent;
};



(async () => {
  try {
    const args = process.argv;

    if (args.length > 2) {
      // If component name given as first argument build md and html for that component
      const componentName = args[2];
      await injectComponentCode(componentName);
    } else {
      // Else build md and html for all components
      await injectAllComponentsCode();
    }
  }
  catch(err) {
    console.error(red, err);
  }
})();
