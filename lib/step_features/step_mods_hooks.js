const getSetSteps = require('../getset_steps');
const { withThenNotSteps, withThrowSteps } = require('../step_mods');

module.exports = function () {
  withThrowSteps.call(this,
    withThenNotSteps.bind(this, getSetSteps)
  );
};
