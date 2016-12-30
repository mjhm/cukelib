const cucumber = require('cucumber');
const getSetSteps = require('../getset_steps');
const { withThenNotSteps } = require('../step_mods');

const getsetHooks = function () {
  withThenNotSteps.call(this, getSetSteps);
};

if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    getsetHooks.call(context);
  });
}

module.exports = getsetHooks;
