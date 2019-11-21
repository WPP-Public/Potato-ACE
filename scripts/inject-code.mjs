/*
  Script to inject SASS and examples HTML into README.md and index.html files for components

 `node --experimental-modules scripts/inject-code.mjs` will inject SASS and examples HTML into README.md and index.html file for all components

 `node --experimental-modules scripts/inject-code.mjs <component>` will inject SASS and examples HTML into README.md and index.html file for given component

 `node --experimental-modules scripts/inject-code.mjs <component-name> --html-only` will inject examples HTML only (no SASS injection) into README.md and index.html file for given component

*/


import fs from 'fs';
import MarkdownIt from 'markdown-it';


// CONSTANTS
const htmlOnlyArg = '--html-only';
const libraryName = 'pa11y';
const componentsDir = `./src/${libraryName}/components`;
const exampleBlockClass = 'example-block';
const htmlQuery = '```html';
const sassQuery = '```scss';
const endQuery = '```';
const htmlPlaceholder = '[[md-content]]';

// Color codes for console.logs
const magentaString = '\x1b[35m%s\x1b[0m';
const greenString = '\x1b[32m%s\x1b[0m';

// MarkdownIt Options
const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
});



// INJECT SASS INTO CONTENT FOR GIVEN COMPONENT
const injectSass = (componentName, mdFileContent) => {
  const sassFilePath = `${componentsDir}/${componentName}/_${componentName}.scss`

  // Read scss file
  const sassFileContents = fs.readFileSync(sassFilePath).toString();
  // CATCH

  // Inject sassFileContents into mdFileContent between "```scss" and "```"
  const queryIndex = mdFileContent.indexOf(sassQuery);
  const startIndex = queryIndex + sassQuery.length + 1;
  const endIndex = mdFileContent.indexOf(endQuery, startIndex);
  console.log(magentaString, `>> Injecting _${componentName}.scss code into README.md`);
  const mdContentForMd = replaceContentBetweenIndices(mdFileContent, sassFileContents, startIndex, endIndex);
  return mdContentForMd;
}


// INJECT EXAMPLES HTML INTO CONTENT FOR README AND HTML PAGE FOR GIVEN COMPONENT
const injectHtml = (componentName, mdFileContent) => {
  const componentDir = `${componentsDir}/${componentName}`;
  const examplesDirPath = `${componentDir}/examples`;
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
  const exampleFiles = fs.readdirSync(`${examplesDirPath}`);
  // CATCH

  exampleFiles.forEach(file => {
    // Read example file content
    const exampleFileContents = fs.readFileSync(`${examplesDirPath}/${file}`).toString();
    // CATCH

    // Inject example file HTML code into source content for component's README.md
    console.log(magentaString, `>> Injecting ${file} into ${componentName} README.md content`);
    queryIndex = mdContentForMd.indexOf(htmlQuery, mdFromIndex);
    startIndex = queryIndex + htmlQuery.length + 1;
    endIndex = mdContentForMd.indexOf(endQuery, startIndex);
    mdContentForMd = replaceContentBetweenIndices(mdContentForMd, exampleFileContents, startIndex, endIndex);
    mdFromIndex = startIndex;


    // Inject example file HTML code into source content for component's HTML page
    console.log(magentaString, `>> Injecting ${file} into ${componentName} page content`);
    queryIndex = mdContentForHtml.indexOf(htmlQuery, htmlFromIndex);
    startIndex = queryIndex + htmlQuery.length + 1;
    endIndex = mdContentForHtml.indexOf(endQuery, startIndex);
    mdContentForHtml = replaceContentBetweenIndices(mdContentForHtml, exampleFileContents, startIndex, endIndex);
    const exampleBlock = `<div class="${exampleBlockClass}">${exampleFileContents}</div>\n`;
    mdContentForHtml = replaceContentBetweenIndices(mdContentForHtml, exampleBlock, queryIndex - 1, queryIndex - 1);
    htmlFromIndex = startIndex + exampleBlock.length;
  });

  // Return the source contents for README.md and component's HTML page
  return { mdContentForMd, mdContentForHtml };
}


// REPLACE CONTENT BETWEEN GIVEN INDICES
const replaceContentBetweenIndices = (sourceString, stringToInsert, startIndex, endIndex) => {
  const substr1 = sourceString.substr(0, startIndex);
  const substr2 = sourceString.substr(endIndex);
  return `${substr1}${stringToInsert}${substr2}`;
}


// CONVERT MARKDOWN TO HTML AND SAVE TO HTML FILE
const convertMdToHtml = (mdSource) => {
  // Convert md to HTML
  console.log(magentaString, `>> Converting markdown to html`);
  const convertedHtml = md.render(mdSource);

  // Combine base.html and md content into component's html
  const baseHtml = fs.readFileSync(`./src/includes/base.html`).toString();
  // CATCH

  const startIndex = baseHtml.indexOf(htmlPlaceholder);
  const endIndex = startIndex + htmlPlaceholder.length;
  const htmlContent = replaceContentBetweenIndices(baseHtml, convertedHtml, startIndex, endIndex);
  return htmlContent;
}


// WRITE CONTENT TO GIVEN FILE
const writeContentToFile = (content, filePath) => {
  fs.writeFileSync(filePath, content);
  // CATCH

  console.log(greenString, `>> Changes to ${filePath} written successfully`);
}


// INJECT CODE FOR GIVEN COMPONENT
const injectComponentCode = (componentName, htmlOnly=false) => {
  const componentDir = `${componentsDir}/${componentName}`;
  const mdFilePath = `${componentDir}/README.md`;
  const htmlFilePath = `./src/${componentName}/index.html`;

  // Read md file
  console.log(magentaString, `>> Reading ${mdFilePath}`);
  let mdFileContent = fs.readFileSync(mdFilePath).toString();
  // CATCH

  if (!htmlOnly) {
    mdFileContent = injectSass(componentName, mdFileContent);
  }

  const { mdContentForMd, mdContentForHtml } = injectHtml(componentName, mdFileContent);
  // Save new md content to README.md
  writeContentToFile(mdContentForMd, mdFilePath);

  // Convert content for HTML page to HTML and save
  const convertedHtmlContent = convertMdToHtml(mdContentForHtml);
  writeContentToFile(convertedHtmlContent, htmlFilePath);
}


// INJECT SASS AND HTML FOR ALL COMPONENTS
const injectAllComponentsCode = () => {
  // For all component directories in componentsDir
  fs.readdirSync(componentsDir, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(directory => {
      // For each directory
      injectComponentCode(directory.name);
    });
  // CATCH
}



const args = process.argv;

if (args.length > 2) {
  const componentName = args[2];
  const htmlOnly = args.includes(htmlOnlyArg);
  injectComponentCode(componentName, htmlOnly);
} else {
  // Else build md and html for all components
  injectAllComponentsCode();
}
