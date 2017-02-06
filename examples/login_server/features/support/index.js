/* eslint arrow-body-style: "off" */

const matchPattern = require('lodash-match-pattern');

const {
  childService, requestSteps, responseSteps,
  knexService, sqlSteps, createDatabaseService,
  diagnosticSteps
} = require('cukelib');
const knexfile = require('../../knexfile');

const _ = matchPattern.getLodashModule();

_.mixin({
  isBcyrptHash(elem) {
    return /^\$2[aby]?\$[\d]+\$[./A-Za-z0-9]{53}$/.test(elem);
  }
});


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
        stdoutHandler: () => null // quiet stdout for demo purposes
      })
    );
  });
};

// Boilerplate to make this file compatible with cucumber versions 1 or 2
const cucumber = require('cucumber');

if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    module.exports.call(context);
  });
}
