/* eslint-disable no-unused-expressions */
const Promise = require('bluebird');
const requestPromise = require('request-promise');
const { RequestError } = require('request-promise/errors');
const { expect } = require('chai');
const embedService = require('../');
const { get, set } = require('../../universe').namespaceFactory('_cukeapi');


const requestEmbedId = (port) => Promise.resolve(requestPromise(`http://localhost:${port}`));

const checkEmbedAlive = (port, targetId) => requestEmbedId(port)
  .timeout(30)
  .then((resultId) => targetId === resultId)
  // $FlowFixMe
  .catch(Promise.TimeoutError, () => false)
  .catch(RequestError, (err) => {
    if (err.cause.code === 'ECONNREFUSED') return false;
    if (err.cause.code === 'ECONNRESET') return false;
    throw err;
  });

module.exports = function () {
  embedService.initialize.call(this);

  this.Given(/^"([^"]+)" is started$/, (name) => {
    const port = 3005;
    set('myServerPort', port);
    return embedService.launch({ name, port })
    .then(requestEmbedId.bind(null, port))
    .then((embedId) => set(`myServerIdForPort${port}`, embedId));
  });

  this.Then(/^"([^"]+)" was (alive|killed)$/, (serviceName, status) => {
    const port = get('myServerPort');
    const currentServerId = get(`myServerIdForPort${port}`);
    return checkEmbedAlive(port, currentServerId)
    .then((isEmbedAlive) => {
      if (status === 'alive') {
        expect(isEmbedAlive, 'previous embed server should be alive').to.be.true;
      } else {
        expect(isEmbedAlive, 'previous embed server should be dead').to.be.false;
      }
    });
  });
};


const cucumber = require('cucumber');

if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    module.exports.call(context);
  });
}
