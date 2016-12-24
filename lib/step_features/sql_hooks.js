const sqlSteps = require('../sql_steps');
const diagnosticSteps = require('../diagnostic_steps');
const { withThenNotSteps } = require('../step_mods');
const { knexStartStep } = require('../knex_control/features/knex_start_step');

module.exports = function () {
  withThenNotSteps.call(this, sqlSteps);
  knexStartStep.call(this);
  diagnosticSteps.call(this);
};
