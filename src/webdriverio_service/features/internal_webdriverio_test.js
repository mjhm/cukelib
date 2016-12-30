// @flow
const { expect } = require('chai');
const childService = require('../../child_service');
const seleniumStandaloneService = require('../../selenium_standalone_service');
const webdriverioService = require('../');

module.exports = function () {
  webdriverioService.initialize.call(this);

  this.registerHandler('BeforeFeatures', (arg, done) => {
    seleniumStandaloneService.launch()
    .catch((err) => {
      const msgtag = /Missing.*driver/.test(err.message) ?
        '. You may be missing a driver or need to run "selenium-standalone install"' :
        ' -- with error';
      throw new Error(`selenium standalone service failed to start${msgtag}:\n${err}`);
    }).asCallback(done);
  });

  this.Before(() => webdriverioService.launch({ name: 'PingPong' }));

  this.Before(() => childService.spawn({
    name: 'pongServer',
    cmd: 'node',
    args: [`${__dirname}/../../../test_servers/pong_server.js`, '--port=3001']
  }));

  this.Given(/^browser url is "([^"]+)"/, (url) => {
    const { client } = webdriverioService.getService('PingPong');
    return client.url(`http://localhost:3001${url}`);
  });

  this.Then(/^header was "([^"]+)"/, (headerTarget) => {
    const { client } = webdriverioService.getService('PingPong');
    return client.getText('h1')
    .then((text) => expect(text).to.equal(headerTarget));
  });

  this.When(/^click header$/, () => {
    const { client } = webdriverioService.getService('PingPong');
    return client.click('h1');
  });
};


const cucumber = require('cucumber');

if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    module.exports.call(context);
  });
}
