import {LOG_COLORS} from './constants.mjs';
import { exec } from 'child_process';
import {promises as fs} from 'fs';


const LIB_DIR = `./src/ace`;
const COMPS_DIR = `${LIB_DIR}/components`;

// Exceute command and output logs or errors
const execCmd = (cmd) => {
  exec(cmd, (err, stdout, stderr) => {
      if (stdout) {
        console.log(stdout);
      }

      if (stderr) {
        console.log(stderr);
      }

      if (err !== null) {
        console.log(`exec error: ${err}`);
      }
  });
};

const getAllComponents = async () => {
  // Get all ACE component directory info
  const compDirs = await fs.readdir(`${COMPS_DIR}`, { withFileTypes: true });
  // Get names of all ACE components
  return [...compDirs]
    .filter(child => child.isDirectory())
    .map(child => child.name);
};


// Convert main SASS file (excluding examples SASS) of components to CSS
const convertSass = async () => {

  // If component name given as argument then convert it's SASS only, otherwise convert all component SASS files (excluding examples SASS)
  const componentGiven = process.argv[2];
  const components = componentGiven ? [componentGiven] : await getAllComponents();

  for (const component of components) {
    console.log(LOG_COLORS.MAGENTA, `>> Converting _${component}.scss to CSS...`);
    execCmd(`node-sass -q --output-style expanded ${COMPS_DIR}/${component}/_${component}.scss ${COMPS_DIR}/${component}/ace-${component}.css`);
  }

  // Convert combined ace.scss file to ace-styles.css
  console.log(LOG_COLORS.MAGENTA, `>> Converting ace.scss to CSS...`);
  execCmd(`node-sass -q --output-style expanded ${LIB_DIR}/ace.scss ${LIB_DIR}/ace-styles.css`);
};


convertSass();
