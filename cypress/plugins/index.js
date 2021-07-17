// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

const { lighthouse, pa11y, prepareAudit } = require('cypress-audit');

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
	// `on` is used to hook into various events Cypress emits
	// `config` is the resolved Cypress config

	// On browser launch, prepares the browser to run the cypress-audit tests
	// this also will trigger a new tab to open alongside the cypress tab,
	// this is normal!
	on("before:browser:launch", (_, launchOptions) => {
		prepareAudit(launchOptions);
	});

	// Important calls to make sure cypress-audit is setup to run in the tests
	on("task", {
		lighthouse: lighthouse(),
		pa11y: pa11y(),
	});
};
