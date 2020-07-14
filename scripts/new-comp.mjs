import {LOG_COLORS} from './constants.mjs';
import {promises as fs} from 'fs';
import pjson from '../package.json';

const NAME = pjson.customProperties.componentLibrary;

let COMP_DIR,
  COMP_NAME,
  COMP_NAME_CAMEL,
  COMP_NAME_CAPS,
  COMP_NAME_KEBAB,
  COMP_NAME_PASCAL = '';

const COMPS_JSON = 'components.json';
const ENCODING = 'utf8';

// DIRS
const SRC_DIR = './src';
const COMPS_DIR = `${SRC_DIR}/ace/components`;
const TEMPLATE_DIR = `./scripts/new-comp-template`;
const COMPS_JSON_FILE = `${COMPS_DIR}/${COMPS_JSON}`;



const addNewCompToJsonFile = async (aliases) => {
  console.log(LOG_COLORS.MAGENTA, `ADDING NEW COMPONENT TO ${COMPS_JSON}`);

  // Read components.json file
  let componentsJson = await fs.readFile(COMPS_JSON_FILE, ENCODING)
    .catch(error => console.log(LOG_COLORS.RED, error));
  const comps = JSON.parse(componentsJson);

  // Create new component object
  const newCompObj = {
    name: COMP_NAME,
  };
  if (aliases.length > 0) {
    newCompObj.aliases = aliases;
  }
  comps[COMP_NAME_KEBAB] = newCompObj;

  // Add new component object to components.json
  const compsSorted = {};
  Object.keys(comps).sort().forEach(key => compsSorted[key] = comps[key]);
  componentsJson = JSON.stringify(compsSorted, null, '  ') + '\n';
  await fs.writeFile(COMPS_JSON_FILE, componentsJson, ENCODING)
    .catch(error => console.log(LOG_COLORS.RED, error));
  console.log(LOG_COLORS.GREEN, `New component added to ${COMPS_JSON}`);
};


const createCompFiles = async () => {
  console.log(LOG_COLORS.MAGENTA, `Creating new component files...`);
  await fs.mkdir(`${COMP_DIR}/examples`, {recursive: true})
    .catch(error => console.log(LOG_COLORS.RED, error));


  // Create JS file
  let templateTs = await fs.readFile(`${TEMPLATE_DIR}/template.ts`, ENCODING)
    .catch(error => console.error(LOG_COLORS.RED, error));

  templateTs = templateTs
    .replace(/TEMPLATE/g, COMP_NAME_CAPS)
    .replace(/template/g, COMP_NAME_KEBAB)
    .replace(/Template/g, COMP_NAME_PASCAL);

  await fs.writeFile(`${COMP_DIR}/${COMP_NAME_KEBAB}.ts`, templateTs)
    .catch(error => console.error(LOG_COLORS.RED, error));
  console.log(LOG_COLORS.GREEN, `New component TS file created`);


  // Create test file
  let templateTestJs = await fs.readFile(`${TEMPLATE_DIR}/template.test.js`, ENCODING)
    .catch(error => console.log(LOG_COLORS.RED, error));

  templateTestJs = templateTestJs
    .replace(/Template/g, COMP_NAME)
    .replace(/template-kebab/g, COMP_NAME_KEBAB)
    .replace(/template/g, COMP_NAME_CAMEL)
    .replace(/TEMPLATE/g, COMP_NAME_CAPS);

  await fs.writeFile(`${COMP_DIR}/${COMP_NAME_KEBAB}.test.js`, templateTestJs)
    .catch(error => console.log(LOG_COLORS.RED, error));
  console.log(LOG_COLORS.GREEN, `New component test file created`);


  // Create README.md file
  let templateReadMe = await fs.readFile(`${TEMPLATE_DIR}/README.md`, ENCODING)
    .catch(error => console.log(LOG_COLORS.RED, error));

  templateReadMe = templateReadMe
    .replace(/TemplatePascal/g, COMP_NAME_PASCAL)
    .replace(/Template/g, COMP_NAME)
    .replace(/template/g, COMP_NAME_KEBAB);

  await fs.writeFile(`${COMP_DIR}/README.md`, templateReadMe)
    .catch(error => console.log(LOG_COLORS.RED, error));
  console.log(LOG_COLORS.GREEN, `New component README.md file created`);


  // Create SASS file
  let templateSass = await fs.readFile(`${TEMPLATE_DIR}/_template.scss`, ENCODING)
    .catch(error => console.log(LOG_COLORS.RED, error));

  templateSass = templateSass.replace(/template/g, COMP_NAME_KEBAB);
  await fs.writeFile(`${COMP_DIR}/_${COMP_NAME_KEBAB}.scss`, templateSass)
    .catch(error => console.log(LOG_COLORS.RED, error));
  console.log(LOG_COLORS.GREEN, `New component SASS file created`);

  // Create 1.html file
  const COMP_CUSTOM_EL_TAG = `${NAME}-${COMP_NAME_KEBAB}`;
  await fs.writeFile(`${COMP_DIR}/examples/1.html`,  `<${COMP_CUSTOM_EL_TAG}></${COMP_CUSTOM_EL_TAG}>\n`)
    .catch(error => console.log(LOG_COLORS.RED, error));
  console.log(LOG_COLORS.GREEN, `New component example file 1.html created`);
};


const newComp = () => {
  console.log(LOG_COLORS.MAGENTA, `RUNNING NEW COMPONENT SCRIPT...`);

  // Check if required arguments given
  const args = process.argv;
  if (args.length < 3) {
    console.log(LOG_COLORS.YELLOW, `Script ran without required new component name argument!`);
    console.log(LOG_COLORS.YELLOW, `Please provide the new component's name and any optional aliases.`);
    console.log(LOG_COLORS.YELLOW, `Example:\n"Component Name" "Alias 1" "Alias 2" "Alias 3"`);
    return;
  }

  // Get arguments
  const [,,compName] = args;
  const aliases = args.filter((arg, index) => index > 2);

  // Create new component constants
  COMP_NAME = compName;
  COMP_NAME_KEBAB = compName.toLowerCase().replace(/ /g, '-');
  COMP_NAME_CAPS = compName.toUpperCase().replace(/ /g, '_');
  COMP_NAME_CAMEL = COMP_NAME_KEBAB.replace(/-./g, x=>x.toUpperCase()[1]);
  COMP_NAME_PASCAL = COMP_NAME_CAMEL.charAt(0).toUpperCase() + COMP_NAME_CAMEL.slice(1);
  COMP_DIR = `${COMPS_DIR}/${COMP_NAME_KEBAB}`;

  addNewCompToJsonFile(aliases);
  createCompFiles();
};


newComp();
