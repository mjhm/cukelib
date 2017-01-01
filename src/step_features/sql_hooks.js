const cucumber = require('cucumber');
const sqlSteps = require('../sql_steps');
const diagnosticSteps = require('../diagnostic_steps');
const { withThenNotSteps, withThrowSteps } = require('../step_mods');
const { knexStartStep } = require('../knex_service/features/knex_step_utilities');

const sqlHooks = function () {
  withThrowSteps.call(this,
    withThenNotSteps.bind(this, sqlSteps)
  );
  knexStartStep.call(this);
  diagnosticSteps.call(this);
};

if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    sqlHooks.call(context);
  });
}

module.exports = sqlHooks;
