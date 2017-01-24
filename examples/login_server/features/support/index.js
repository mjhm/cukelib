/* eslint arrow-body-style: "off" */
const { AssertionError } = require('chai');
const ldMatchPattern = require('lodash-match-pattern');

const {
  childService, requestSteps, responseSteps, responseSupport,
  knexService, sqlSteps, createDatabaseService,
  diagnosticSteps, parseStepArg
} = require('cukelib');
const knexfile = require('../../knexfile');

module.exports = function () {
  diagnosticSteps.call(this);
  childService.initialize.call(this);
  requestSteps.call(this, {
    host: 'http://localhost:3002'
  });
  responseSteps.call(this);
  sqlSteps.call(this);

  this.registerHandler('BeforeFeatures', () =>
    createDatabaseService.launch(knexfile.features)
  );

  this.Before(() => {
    return knexService.launch(knexfile.features)
    .then(() =>
      childService.spawn({
        name: 'login_server',
        cmd: 'node',
        args: [`${__dirname}/../../index.js`, '--port=3002'],
      })
    )
    .catch((err) => {
      console.log('knexService err', err);
      throw err;
    });
  });

  this.Then(/^session cookie matched pattern$/, (targetPatternStr) => {
    const targetPattern = parseStepArg(targetPatternStr);
    const check = ldMatchPattern(responseSupport.getCookie('session'), targetPattern);
    if (check) throw new AssertionError(check);
  });
};

// Boilerplate to make this file compatible with cucumber versions 1 or 2
const cucumber = require('cucumber');

if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    module.exports.call(context);
  });
}
