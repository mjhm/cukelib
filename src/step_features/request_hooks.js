/* eslint arrow-body-style: "off" */
// @flow
const chalk = require('chalk');
const requestSteps = require('../request_steps');
const requestSupport = require('../request_support');
const responseSteps = require('../response_steps');
const getSetSteps = require('../getset_steps');
const diagnosticSteps = require('../diagnostic_steps');
const { withThenNotSteps, withThrowSteps } = require('../step_mods');
const childService = require('../child_service');
const { log } = require('../universe').namespaceFactory('_cukelib');

module.exports = function () {
  childService.initialize.call(this);
  withThrowSteps.call(this,
    withThenNotSteps.bind(this, responseSteps)
  );
  withThenNotSteps.call(this, getSetSteps);


  withThrowSteps.call(this, () => requestSteps.call(this, { host: 'http://localhost:3001' }));
  diagnosticSteps.call(this);

  this.Given(/launch "([^"]+)" test server/, (serverName) =>
    childService.spawn({
      name: `${serverName}_server`,
      cmd: 'node',
      args: [`${__dirname}/../../test_servers/${serverName}_server.js`, '--port=3001'],
      stdoutHandler: (data) => {
        // eslint-disable-next-line no-console
        log(chalk.magenta(`${serverName}_server.stdout: ${data}`));
      },
    })
  );

  // custom PUT step
  this.Given(/^putting "([^"]*)" bumpers on the "([^"]*)" buggy/, (bumperType, buggyType) => {
    return requestSupport.requestPUT('/bounce', { buggy: buggyType, bumpers: bumperType });
  });

  // custom POST step
  this.Given(/^posting "([^"]*)" bumpers on the "([^"]*)" buggy/, (bumperType, buggyType) => {
    return requestSupport.requestPOST('/bounce', { buggy: buggyType, bumpers: bumperType });
  });
};

require('../utilities/cuke2compat')(module.exports);
