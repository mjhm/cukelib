/* eslint arrow-body-style: "off" */
// @flow
const seleniumStandaloneService = require('../../selenium_standalone_service');
const diagnosticSteps = require('../../diagnostic_steps');

module.exports = function () {
  seleniumStandaloneService.initialize.call(this);
  diagnosticSteps.call(this);

  this.Before(() => {
    return seleniumStandaloneService.launch()
    .catch((err) => {
      const msgtag = /Missing.*driver/.test(err.message) ?
        '. You may be missing a driver or need to run "selenium-standalone install"' :
        ' -- with error';
      throw new Error(`selenium standalone service failed to start${msgtag}:\n${err}`);
    });
  });
};


const cucumber = require('cucumber');

if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    module.exports.call(context);
  });
}
