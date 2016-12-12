/* eslint-disable no-unused-expressions, no-underscore-dangle */
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');
const { expect } = require('chai');
const { spawnServer, embedServer, initialize, serverControlNS } = require('../');
const requestPromise = require('request-promise');
const universe = require('../../universe');

const { get } = serverControlNS;
const testNS = universe.namespaceFactory('_internal_server_test');

const recordPID = (pid, msg) =>
  fs.writeFileSync(path.join(__dirname, '../../../tmp/', _.toString(pid)), msg, 'utf8');

const isAlive = (pid) => {
  try {
    process.kill(_.toInteger(pid), 0);
  } catch (err) {
    if (err.code === 'ESRCH') return false;
    throw err;
  }
  return true;
};


const requestEmbedId = (port) => Promise.resolve(requestPromise(`http://localhost:${port}`));

const checkEmbedAlive = (port, targetId) => requestEmbedId(port)
  .timeout(30)
  .then((resultId) => targetId === resultId)
  .catch(Promise.TimeoutError, () => false);

module.exports = function () {
  initialize.call(this);

  this.registerHandler('BeforeFeatures', () =>
    spawnServer({ port: 3001 })
    .then(() => requestPromise('http://localhost:3001'))
    .then((resultPid) => {
      const server = get('servers.localhost:3001');
      expect(resultPid, 'check that the proc is who it thinks it is')
        .to.equal(_.toString(server.proc.pid));
      testNS.set('myUniverseServer', server.proc.pid);
      recordPID(server.proc.pid, 'launched in BeforeFeatures');
    })
  );

  this.registerHandler('BeforeFeature', () => {
    expect(isAlive(testNS.get('myUniverseServer')), 'universe server is alive').to.be.true;
    testNS.set('myPreviousFeatureServer', testNS.get('myFeatureServer'));
    if (testNS.get('myPreviousFeatureServer')) {
      expect(isAlive(testNS.get('myPreviousFeatureServer')), 'previous feature server is dead')
        .to.be.false;
    }
    // TODO add recordPID here to be checked later
    return spawnServer({ port: 3002 })
      .then(() => testNS.set('myFeatureServer', get('servers.localhost:3002').proc.pid));
  });

  this.Before(() => {
    expect(isAlive(testNS.get('myUniverseServer')), 'universe server is alive').to.be.true;
    expect(isAlive(testNS.get('myFeatureServer')), 'feature server is alive').to.be.true;
    testNS.set('myPreviousScenarioServer', testNS.get('myScenarioServer'));
    if (testNS.get('myPreviousScenarioServer')) {
      expect(isAlive(testNS.get('myPreviousScenarioServer')), 'previous scenario server is dead')
        .to.be.false;
    }
    if (testNS.get('myGivenServer')) {
      expect(isAlive(testNS.get('myGivenServer')), 'given server is dead')
        .to.be.false;
    }
    testNS.set('myPreviousEmbedServer', testNS.get('myEmbedServer'));

    const checkEmbedPromise = testNS.get('myPreviousEmbedServer') ?
      checkEmbedAlive(3005, testNS.get('myPreviousEmbedServer'))
        .then((isEmbedAlive) => expect(isEmbedAlive, 'previous embed server is dead').to.be.false) :
      Promise.resolve();

    return checkEmbedPromise
      // TODO add recordPID here to be checked later
      .then(() => spawnServer({ port: 3003 }))
      .then(() => testNS.set('myScenarioServer', get('servers.localhost:3003').proc.pid));
  });

  this.Before(() => embedServer({ port: 3005 })
    .then(requestEmbedId.bind(null, 3005))
    .then((id) => {
      testNS.set('myEmbedServer', id);
    })
  );

  this.Given(/spawn server/, () => {
    expect(isAlive(testNS.get('myUniverseServer')), 'universe server is alive').to.be.true;
    expect(isAlive(testNS.get('myFeatureServer')), 'feature server is alive').to.be.true;
    expect(isAlive(testNS.get('myScenarioServer')), 'scenario server is alive').to.be.true;
    // TODO add recordPID here to be checked later
    return spawnServer({ port: 3004 })
      .then(() => testNS.set('myGivenServer', get('servers.localhost:3004').proc.pid));
  });

  this.Then(/check server "([^"]+)"$/, (hostname) =>
    requestPromise(`http://${hostname}`)
    .then((resultPid) => {
      const server = get(`servers.${hostname}`);
      expect(resultPid, 'check that the proc is who it thinks it is')
        .to.equal(_.toString(server.proc.pid));
    })
  );

  this.Then(/check embedded server "([^"]+)"$/, (hostname) => {
    const port = _.toInteger(hostname.replace(/^[^:]*:/, ''));
    return checkEmbedAlive(port, testNS.get('myEmbedServer'))
    .then((isEmbedAlive) =>
      expect(isEmbedAlive, 'check that embedded server is responding').to.be.true);
  });
  // This group is for checking that the child process exits when the parent process exits.
  // We want to be sure that child processes aren't left hanging with open ports.
  this.Then(/^parent exited$/, () => {
    process.exit(0);
    return true;
  });

  this.Then(/^parent exited later$/, () => {
    setTimeout((() => process.exit(0)), 100);
    return true;
  });

  this.Then(/^parent had SIGINT signal$/, () => {
    process.kill(process.pid, 'SIGINT');
    return true;
  });

  this.Given(/^noop$/, () => true);
};
