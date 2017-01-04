/* eslint arrow-body-style: "off" */

// const { childService, requestSteps, responseSteps } = require('cukelib'); // original(./index.js)
const { childService, requestSupport, responseSupport } = require('cukelib');

module.exports = function () {
  childService.initialize.call(this);

  // // original from ./index.js
  // requestSteps.call(this, {
  //   host: 'http://localhost:3001'
  // });
  // responseSteps.call(this);

  this.When(/^making a GET request to "([^"]+)"$/, requestSupport.requestGET);
  this.When(/^making a PUT to "([^"]+)" with the payload:$/, requestSupport.requestPUT);
  this.Then(/^the API responds with status code (\d+)$/, responseSupport.statusCode);
  this.Then(/^the API responds with the status code (\d+) and the payload:$/, (code, payload) =>
      responseSupport.statusCode(code)
      .then(() =>
        responseSupport.matchPattern(payload)
      )
  );

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
