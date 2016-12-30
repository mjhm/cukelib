const cucumber = require('cucumber');
const getSetSteps = require('../getset_steps');
const { withThenNotSteps, withThrowSteps } = require('../step_mods');

const stepModsHooks = function () {
  withThrowSteps.call(this,
    withThenNotSteps.bind(this, getSetSteps)
  );
};

if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    stepModsHooks.call(context);
  });
}

module.exports = stepModsHooks;
