const getSetSteps = require('../getset_steps');
const { withThenNotSteps } = require('../step_mods');

module.exports = function () {
  withThenNotSteps.call(this, getSetSteps);
};
