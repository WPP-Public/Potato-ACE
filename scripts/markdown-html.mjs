import fs from 'fs';
import MarkdownIt from 'markdown-it';

const pa11yCompsDir = './pa11y/components';


// MarkdownIt Options
const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
});


// HELPER FUNCTIONS
const replaceContentBetweenIndices = (sourceString, stringToInsert, startIndex, endIndex) => {
  const substr1 = sourceString.substr(0, startIndex);
  const substr2 = sourceString.substr(endIndex);
  return `${substr1}${stringToInsert}${substr2}`;
}


// Per component function
const mdToHtml = componentName => {
  const componentDir = `${pa11yCompsDir}/${componentName}`;
  const mdFilePath = `${componentDir}/README.md`;
  const htmlFilePath = `./src/${componentName}/index.html`;
  const sassFilePath = `${componentDir}/_${componentName}.scss`;
  const examplesDirPath = `${componentDir}/examples`;

  const magentaString = '\x1b[35m%s\x1b[0m';
  const greenString = '\x1b[32m%s\x1b[0m';
  const cyanString = '\x1b[36m%s\x1b[0m';
  // const yellowString = '\x1b[93m%s\x1b[0m';

  // Read md file
  console.log(magentaString, `>> Reading ${componentDir}/README.md`);
  let mdFileContents = fs.readFileSync(mdFilePath).toString();


  // INJECT SASS CODE INTO MARKDOWN
  // Read scss file
  console.log(magentaString, `>> Reading ${componentDir}/_${componentName}.scss`);
  let sassFileContents = fs.readFileSync(sassFilePath).toString();

  // Inject sassFileContents into mdFileContents and write to file
  console.log(magentaString, `>> Injecting scss code into _${componentName}.scss`);

  let startQuery = '```scss';
  const endQuery = '```';
  const queryIndex = mdFileContents.indexOf(startQuery);
  const startIndex = queryIndex + startQuery.length + 1;
  const endIndex = mdFileContents.indexOf(endQuery, startIndex);
  mdFileContents = replaceContentBetweenIndices(mdFileContents, sassFileContents, startIndex, endIndex);


  // INJECT HTML CODE INTO MARKDOWN AND CONVERT TO HTML
  console.log(magentaString, `>> Injecting html examples code into ${componentDir}/README.md`);
  startQuery = '```html';
  let mdFromIndex = 0;
  let htmlFromIndex = 0;
  let mdToHtmlSource = '';

  const exampleFilesArray = fs.readdirSync(`${examplesDirPath}`);


  // Inject example HTML code into code fences in md source
  exampleFilesArray.forEach(file => {
    console.log(magentaString, `>> Reading ${examplesDirPath}/${file}`);
    const exampleFileContents = fs.readFileSync(`${examplesDirPath}/${file}`).toString();

    let queryIndex = mdFileContents.indexOf(startQuery, mdFromIndex);
    const startIndex = queryIndex + startQuery.length + 1;
    const endIndex = mdFileContents.indexOf(endQuery, startIndex);

    console.log(magentaString, `>> Injecting ${file} code into code fence in ${componentDir}/README.md`);
    mdFileContents = replaceContentBetweenIndices(mdFileContents, exampleFileContents, startIndex, endIndex);
    mdFromIndex = startIndex;
    // console.log(cyanString, mdFileContents);

    // Save changes to md file
    console.log(magentaString, `>> Saving changes to ${componentName}/README.md`);
    fs.writeFileSync(mdFilePath, mdFileContents);
    console.log(greenString, `>> ${componentName}/README.md saved successfully`);
  });


  // Inject example HTML code to md source before converting to HTML
  exampleFilesArray.forEach(file => {
    const exampleFileContents = fs.readFileSync(`${examplesDirPath}/${file}`).toString();
    console.log(magentaString, `>> Injecting ${file} into ${componentName}.html`);
    let queryIndex = mdFileContents.indexOf(startQuery, htmlFromIndex);
    mdFileContents = replaceContentBetweenIndices(mdFileContents, exampleFileContents, queryIndex - 1,  queryIndex - 1);
    htmlFromIndex = queryIndex + exampleFileContents.length + 1;
  });

  // convert markdown to HTML
  let convertedHtml = md.render(mdFileContents);
  console.log(magentaString, `>> Saving changes to ${htmlFilePath}`);
  fs.writeFileSync(htmlFilePath, convertedHtml);
  console.log(greenString, `>> ${htmlFilePath} saved successfully`);
}


// For all components in pa11yCompsDir
fs.readdirSync(pa11yCompsDir, { withFileTypes: true })
  .filter(item => item.isDirectory())
  .map(directory => {
    // For each directory
    mdToHtml(directory.name);
  });



///////////////////////////////////////
// mdToHtml('test-component');
// const injectExamples = directory => {
//   JSDOM.fromFile(`./src/${directory}/index.html`)
//     .then(dom => {
//       const document = dom.window.document
//       const exampleBlocks = document.querySelectorAll('.example-block');
//       let fileContentss = null;

//       fs.readdirSync(`${pa11yCompsDir}/${directory}/examples/`)
//         .forEach((file, i) => {
//           try {
//             fileContentss = fs.readFileSync(`${pa11yCompsDir}/${directory}/examples/${file}`, 'utf8');
//           } catch(err) {
//             console.error(err);
//           }

//           exampleBlocks[i].innerHTML = fileContentss;
//           const newContents = dom.serialize();

//           try {
//             fs.writeFileSync(`./src/${directory}/index.html`, newContents)
//             console.log(magentaString, `>> Injecting examples into ${directory}/index.html`);
//           } catch(err) {
//             console.error(err);
//           }
//         });

//       console.log('>>> Examples injection done');
//     });
// }

// const insertBetweenStrings = (sourceString, startStr, endStr, stringToInsert) => {
//   const newString = `${startStr}${stringToInsert}${endStr}`;
//   var rx = new RegExp(`${startStr}[\\d\\D]*?${endStr}`);
//   return sourceString.replace(rx, newString);
// }

// try {
// } catch(err) {
//   console.error(err);
// }
