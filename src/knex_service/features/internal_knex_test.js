/* eslint-disable no-unused-expressions */
// @flow
const Promise = require('bluebird');
const knexService = require('../');
const stepMods = require('../../step_mods');
const { knexStartStep, createTableWithUser, isUserInDbSteps } = require('./knex_step_utilities');

module.exports = function () {
  stepMods.initialize.call(this);
  knexService.initialize.call(this);
  knexStartStep.call(this);
  isUserInDbSteps.call(this);

  this.registerHandler('BeforeFeatures', Promise.coroutine(function* () {
    const knexService1 = yield knexService.launch({ name: 'before_features_db' });
    return yield createTableWithUser(knexService1.dbConn, 'before_features_user');
  }));

  this.registerHandler('BeforeFeature', Promise.coroutine(function* () {
    const knexService1 = yield knexService.launch({ name: 'before_feature_db' });
    return yield createTableWithUser(knexService1.dbConn, 'before_feature_user');
  }));

  this.Before(Promise.coroutine(function* () {
    const knexService1 = yield knexService.launch({ name: 'before_scenario_db' });
    return yield createTableWithUser(knexService1.dbConn, 'before_scenario_user');
  }));

  stepMods.withThenNotSteps.call(this, function () {
    // eslint-disable-next-line arrow-body-style
    this.Given(/start "([^"]+)" database with migration and seeds/, (dbname) => {
      return knexService.launch({
        name: dbname,
        migrations: {
          directory: `${__dirname}/migrations`,
        },
        seeds: {
          directory: `${__dirname}/seeds`,
        },
      });
    });
  });
};

require('../../utilities/cuke2compat')(module.exports);
