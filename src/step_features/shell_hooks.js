const cucumber = require('cucumber');
const shellSteps = require('../shell_steps');
const getSetSteps = require('../getset_steps');
const diagnosticSteps = require('../diagnostic_steps');
const { withThenNotSteps, withThrowSteps } = require('../step_mods');

const shellHooks = function () {
  withThrowSteps.call(this,
    withThenNotSteps.bind(this, shellSteps)
  );
  withThenNotSteps.call(this, getSetSteps);
  diagnosticSteps.call(this);
};

if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    shellHooks.call(context);
  });
}

module.exports = shellHooks;
