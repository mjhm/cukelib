/* eslint arrow-body-style: "off" */
const {
  childService, requestSteps, responseSteps,
  knexService, sqlSteps, createDatabaseService,
} = require('cukeserv');
const knexfile = require('../../knexfile');

module.exports = function () {
  childService.initialize.call(this);

  requestSteps.call(this, {
    host: 'http://localhost:3002'
  });
  responseSteps.call(this);
  sqlSteps.call(this);

  this.registerHandler('BeforeFeatures', () =>
    createDatabaseService.launch(knexfile.features));

  this.Before(() =>
    knexService.launch(knexfile.features)
    .then(() =>
      childService.spawn({
        name: 'ad_server',
        cmd: 'node',
        args: [`${__dirname}/../../index.js`, '--port=3002'],
      })
    )
  );
};

// Boilerplate to make this file compatible with cucumber versions 1 or 2
const cucumber = require('cucumber');

if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    module.exports.call(context);
  });
}
