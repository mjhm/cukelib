// @flow
const cucumber = require('cucumber');
const requestSteps = require('../request_steps');
const responseSteps = require('../response_steps');
const getSetSteps = require('../getset_steps');
const diagnosticSteps = require('../diagnostic_steps');
const { withThenNotSteps, withThrowSteps } = require('../step_mods');
const serviceControl = require('../service_control');

const requestHooks = function () {
  serviceControl.initialize.call(this);
  withThrowSteps.call(this,
    withThenNotSteps.bind(this, responseSteps)
  );
  withThenNotSteps.call(this, getSetSteps);


  withThrowSteps.call(this, () => requestSteps.call(this, { host: 'http://localhost:3001' }));
  diagnosticSteps.call(this);

  this.Given(/launch "([^"]+)" test server/, (serverName) =>
    serviceControl.spawnServer({
      name: `${serverName}_server`,
      cmd: 'node',
      args: [`${__dirname}/../service_control/${serverName}_server.js`, '--port=3001'],
      stdoutHandler: () => null,
    })
  );
};

if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    requestHooks.call(context);
  });
}

module.exports = requestHooks;
