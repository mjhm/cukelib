// @flow
const { expect } = require('chai');
const cucumber = require('cucumber');
const serviceControl = require('../../service_control');
const standaloneControl = require('../standalone');
const webdriverioControl = require('../webdriverio');

const webdriverTest = function () {
  webdriverioControl.initialize.call(this);

  this.registerHandler('BeforeFeatures', (arg, done) => {
    standaloneControl.startService()
    .catch((err) => {
      const msgtag = /Missing.*driver/.test(err.message) ?
        '. You may be missing a driver or need to run "selenium-standalone install"' :
        ' -- with error';
      throw new Error(`selenium standalone service failed to start${msgtag}:\n${err}`);
    }).asCallback(done);
  });

  this.Before(() => webdriverioControl.startService({ name: 'PingPong' }));

  this.Before(() => serviceControl.spawnServer({
    name: 'pongServer',
    cmd: 'node',
    args: [`${__dirname}/../../../test_servers/pong_server.js`, '--port=3001']
  }));

  this.Given(/^browser url is "([^"]+)"/, (url) => {
    const { client } = webdriverioControl.getService('PingPong');
    return client.url(`http://localhost:3001${url}`);
  });

  this.Then(/^header was "([^"]+)"/, (headerTarget) => {
    const { client } = webdriverioControl.getService('PingPong');
    return client.getText('h1')
    .then((text) => expect(text).to.equal(headerTarget));
  });

  this.When(/^click header$/, () => {
    const { client } = webdriverioControl.getService('PingPong');
    return client.click('h1');
  });
};


if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    webdriverTest.call(context);
  });
}

module.exports = webdriverTest;
