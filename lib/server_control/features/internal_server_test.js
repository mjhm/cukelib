/* eslint-disable no-unused-expressions, no-underscore-dangle */
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const { expect } = require('chai');
const { spawnServer, initialize, serverControlNS } = require('../');
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
    return spawnServer({ port: 3003 })
      .then(() => testNS.set('myScenarioServer', get('servers.localhost:3003').proc.pid));
  });

  this.Given(/spawn server/, () => {
    expect(isAlive(testNS.get('myUniverseServer')), 'universe server is alive').to.be.true;
    expect(isAlive(testNS.get('myFeatureServer')), 'feature server is alive').to.be.true;
    expect(isAlive(testNS.get('myScenarioServer')), 'scenario server is alive').to.be.true;
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

  // x Launch servers from Features, Feature, and Scenario contexts.
  // x Check that they are accessible in steps.
  // x Check that they are killed at right time.
  // x Check that grandchildren are killed (maybe)
  // Check for server errors.
  // x Need a pid server and a proxy server
  // Check that a node server can be launched and accessed in the cucumber process.

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
