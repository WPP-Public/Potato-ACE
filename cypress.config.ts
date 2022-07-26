import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: {
		// We've imported your old cypress plugins here.
		// You may want to clean this up later by importing these.
		baseUrl: 'http://localhost:3030',
		excludeSpecPattern: process.env.CI ?
			['**/template.test.js', '**/*/all.test.js'] :
			'**/template.test.js',
		setupNodeEvents(on, config) {
			return require('./cypress/plugins/index.js')(on, config);
		},
		specPattern: 'src/**/*.{test,spec}.js',
	},
	env: {
		lib_name: 'ace',
	},
	retries: 2,
});
