/* eslint-disable no-unused-expressions */
// @flow
const Promise = require('bluebird');
const { expect } = require('chai');
const cucumber = require('cucumber');
const knexService = require('../');
const stepMods = require('../../step_mods');
const { knexStartStep, createTableWithUser } = require('./knex_start_step');

const internalKnexTest = function () {
  stepMods.initialize.call(this);
  knexService.initialize.call(this);
  knexStartStep.call(this);

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
    this.Then(/^user "([^"]+)" was in the "([^"]+)" database$/, (user, db) => {
      const { dbConn } = knexService.getService(db) || {};
      expect(dbConn).to.exist;
      return dbConn('users').first('*').where('name', user)
      .then((result) => {
        expect(result).to.exist;
      });
    });

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

if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    internalKnexTest.call(context);
  });
}

module.exports = internalKnexTest;
