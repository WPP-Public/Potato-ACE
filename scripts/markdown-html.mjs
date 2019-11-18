import fs from 'fs';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;
const pa11yCompsDir = './pa11y/components';

const injectExamples = directory => {
  JSDOM.fromFile(`./src/${directory}/index.html`)
    .then(dom => {
      const document = dom.window.document
      const exampleBlocks = document.querySelectorAll('.example-block');
      let fileContents = null;

      fs.readdirSync(`${pa11yCompsDir}/${directory}/examples/`)
        .forEach((file, i) => {
          try {
            fileContents = fs.readFileSync(`${pa11yCompsDir}/${directory}/examples/${file}`, 'utf8');
          } catch(err) {
            console.error(err);
          }

          exampleBlocks[i].innerHTML = fileContents;
          const newContent = dom.serialize();

          try {
            fs.writeFileSync(`./src/${directory}/index.html`, newContent)
            console.log(`>>> Injecting examples into ${directory}/index.html`);
          } catch(err) {
            console.error(err);
          }
        });

      console.log('>>> Examples injection done');
    });
}


// For all components in pa11yCompsDir
console.log('>>> Injecting Examples');

fs.readdirSync(pa11yCompsDir, { withFileTypes: true })
  .filter(item => item.isDirectory())
  .map(directory => {
    // convert markdown to HTML
    injectExamples(directory.name);
  });
