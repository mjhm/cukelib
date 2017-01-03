/* eslint arrow-body-style: "off" */
const { childService, requestSteps, responseSteps } = require('cukelib');

module.exports = function () {
  childService.initialize.call(this);

  requestSteps.call(this, {
    host: 'http://localhost:3001'
  });
  responseSteps.call(this);

  this.Before(() => {
    return childService.spawn({
      name: 'echo_server',
      cmd: 'node',
      args: [`${__dirname}/../../index.js`, '--port=3001'],
    });
  });
};

// Boilerplate to make this file compatible with cucumber versions 1 or 2
const cucumber = require('cucumber');

if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    module.exports.call(context);
  });
}
