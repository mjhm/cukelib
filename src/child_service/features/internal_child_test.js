/* eslint-disable no-unused-expressions, no-underscore-dangle */
// @flow
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
// const Promise = require('bluebird');
const { expect } = require('chai');
const cucumber = require('cucumber');
const { spawn, initialize } = require('../');
const requestPromise = require('request-promise');
const universe = require('../../universe');

const { get } = universe.namespaceFactory('_cukeapi');
const testNS = universe.namespaceFactory('_internal_server_test');

const recordPID = (pid, msg) =>
  fs.writeFileSync(path.join(__dirname, '../../../tmp/', _.toString(pid)), msg, 'utf8');


const spawnPidServer = (port) => spawn({
  name: `pidServer${port}`,
  cmd: 'node',
  args: [`${__dirname}/../../../test_servers/pid_server.js`, `--port=${port}`],
  pidServerPort: port,
});

const isAlive = (pid) => {
  try {
    process.kill(_.toInteger(pid), 0);
  } catch (err) {
    if (err.code === 'ESRCH') return false;
    throw err;
  }
  return true;
};


const internalServerTest = function () {
  initialize.call(this);

  this.registerHandler('BeforeFeatures', () =>
    spawnPidServer(3001)
    .then(() => requestPromise('http://localhost:3001'))
    .then((resultPid) => {
      const server = get('_services.pidServer3001');
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
    return spawnPidServer(3002)
      .then(() => testNS.set('myFeatureServer', get('_services.pidServer3002').proc.pid));
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
    return spawnPidServer(3003)
      .then(() => testNS.set('myScenarioServer', get('_services.pidServer3003').proc.pid));
  });

  this.Given(/spawn server/, () => {
    expect(isAlive(testNS.get('myUniverseServer')), 'universe server is alive').to.be.true;
    expect(isAlive(testNS.get('myFeatureServer')), 'feature server is alive').to.be.true;
    expect(isAlive(testNS.get('myScenarioServer')), 'scenario server is alive').to.be.true;
    // TODO add recordPID here to be checked later
    return spawnPidServer(3004)
      .then(() => testNS.set('myGivenServer', get('_services.pidServer3004').proc.pid));
  });

  this.Then(/check server "([^"]+)"$/, (serverName) => {
    const server = get(`_services.${serverName}`);
    return requestPromise(`http://localhost:${server.config.pidServerPort}`)
    .then((resultPid) => {
      expect(resultPid, 'check that the proc is who it thinks it is')
        .to.equal(_.toString(server.proc.pid));
    });
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

if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    internalServerTest.call(context);
  });
}

module.exports = internalServerTest;
