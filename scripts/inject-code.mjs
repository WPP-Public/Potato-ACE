/*
 Run `node --experimental-modules scripts/inject-code.mjs` to build all md and html files
 Run `node --experimental-modules scripts/inject-code.mjs <component-name>` to build md and html for a given component
*/

import fs from 'fs';
import MarkdownIt from 'markdown-it';

const libraryName = 'pa11y';
const componentsDir = `./src/${libraryName}/components`;

// Color codes for console.logs
const magentaString = '\x1b[35m%s\x1b[0m';
const greenString = '\x1b[32m%s\x1b[0m';
// const cyanString = '\x1b[36m%s\x1b[0m';
// const yellowString = '\x1b[93m%s\x1b[0m';


// MarkdownIt Options
const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
});


// REPLACE CONTENT BETWEEN GIVEN INDICES
const replaceContentBetweenIndices = (sourceString, stringToInsert, startIndex, endIndex) => {
  const substr1 = sourceString.substr(0, startIndex);
  const substr2 = sourceString.substr(endIndex);
  return `${substr1}${stringToInsert}${substr2}`;
}

// WRITE CONTENT TO GIVEN FILE
const writeContentToFile = (mdContent, filePath) => {
  console.log(magentaString, `>> Saving changes to ${filePath}`);
  fs.writeFileSync(filePath, mdContent);
  // CATCH
  console.log(greenString, `>> Changes to ${filePath} saved successfully`);
}

// INJECT SASS INTO MARKDOWN FOR GIVEN COMPONENT
const injectSass = (componentName, mdFileContents, writeToReadme=false) => {
  const componentDir = `${componentsDir}/${componentName}`;
  const sassFilePath = `${componentDir}/_${componentName}.scss`

  // Read scss file
  console.log(magentaString, `>> Reading ${sassFilePath}`);
  const sassFileContents = fs.readFileSync(sassFilePath).toString();
  // CATCH

  // Inject sassFileContents into mdFileContents between "```scss" and "```"
  const startQuery = '```scss', endQuery = '```';
  const queryIndex = mdFileContents.indexOf(startQuery);
  const startIndex = queryIndex + startQuery.length + 1;
  const endIndex = mdFileContents.indexOf(endQuery, startIndex);
  const newMdFileContents = replaceContentBetweenIndices(mdFileContents, sassFileContents, startIndex, endIndex);

  if (writeToReadme) {
    console.log(magentaString, `>> Injecting _${componentName}.scss code into README.md`);
    writeContentToFile(newMdFileContents, `${componentDir}/README.md`);
  }

  return newMdFileContents;
}


// INJECT HTML INTO MARKDOWN FOR GIVEN COMPONENT AND CONVERT TO HTML
const injectHtmlAndConvertMd = (componentName, mdFileContents) => {
  const componentDir = `${componentsDir}/${componentName}`;
  const examplesDirPath = `${componentDir}/examples`;
  const mdFilePath = `${componentDir}/README.md`; //
  const startQuery = '```html', endQuery = '```';
  let queryIndex, startIndex, endIndex;
  let mdFromIndex = 0;
  let htmlFromIndex = 0;
  let mdToHtmlSource = mdFileContents;

  console.log(magentaString, `>> Injecting html examples code into ${componentDir}/README.md`);
  const exampleFiles = fs.readdirSync(`${examplesDirPath}`);
  // CATCH

  exampleFiles.forEach(file => {
    console.log(magentaString, `>> Reading ${examplesDirPath}/${file}`);
    const exampleFileContents = fs.readFileSync(`${examplesDirPath}/${file}`).toString();
    // CATCH

    // Inject example HTML code into code fence in md source
    queryIndex = mdFileContents.indexOf(startQuery, mdFromIndex);
    startIndex = queryIndex + startQuery.length + 1;
    endIndex = mdFileContents.indexOf(endQuery, startIndex);
    console.log(magentaString, `>> Injecting ${file} into ${componentDir}/README.md`);
    mdFileContents = replaceContentBetweenIndices(mdFileContents, exampleFileContents, startIndex, endIndex);
    mdFromIndex = startIndex;

    // Inject example HTML code into mdToHtmlSource
    queryIndex = mdToHtmlSource.indexOf(startQuery, htmlFromIndex);
    startIndex = queryIndex + startQuery.length + 1;
    endIndex = mdToHtmlSource.indexOf(endQuery, startIndex);
    mdToHtmlSource = replaceContentBetweenIndices(mdToHtmlSource, exampleFileContents, startIndex, endIndex);
    console.log(magentaString, `>> Injecting ${file} HTML into ${componentName}.html`);
    mdToHtmlSource = replaceContentBetweenIndices(mdToHtmlSource, exampleFileContents, queryIndex - 1, queryIndex - 1);
    htmlFromIndex = startIndex + exampleFileContents.length;
  });

  writeContentToFile(mdFileContents, mdFilePath);
  convertMdToHtmlAndSave(mdToHtmlSource, componentName);
}


// CONVERT MARKDOWN TO HTML AND SAVE TO HTML FILE
const convertMdToHtmlAndSave = (mdSource, componentName) => {
  const htmlFilePath = `./src/${componentName}/index.html`;
  console.log(magentaString, `>> Converting markdown source to ${htmlFilePath}`);
  let convertedHtml = md.render(mdSource);
  writeContentToFile(convertedHtml, htmlFilePath);
}


// INJECT SASS AND HTML FOR GIVEN COMPONENT
export const injectComponentCode = (componentName, sass=false, html=false) => {
  const componentDir = `${componentsDir}/${componentName}`;
  const mdFilePath = `${componentDir}/README.md`;

  // Read md file
  console.log(magentaString, `>> Reading ${mdFilePath}`);
  let mdFileContents = fs.readFileSync(mdFilePath).toString();
  // CATCH

  if (sass) {
    mdFileContents = injectSass(componentName, mdFileContents, !html);
  }

  if (html) {
    injectHtmlAndConvertMd(componentName, mdFileContents);
  }
}


// INJECT SASS AND HTML FOR ALL COMPONENTS
export const injectAllSassAndHtml = () => {
  // For all component directories in componentsDir
  fs.readdirSync(componentsDir, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(directory => {
      // For each directory
      injectComponentCode(directory.name, true, true);
    });
  // CATCH
}

// If component given as argument build md and html for that component
const args = process.argv;
if (args.length > 2) {
  const componentName = args[2];
  const html = !args.includes('--sass-only');
  const sass = !args.includes('--html-only');
  injectComponentCode(componentName, sass, html);
} else {
  // Else build md and html for all components
  injectAllSassAndHtml();
}
