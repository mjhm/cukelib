/* eslint-disable no-unused-expressions */
// @flow
const Promise = require('bluebird');
const { expect } = require('chai');
const knexControl = require('../');
const { getService } = require('../../service_control');
const stepMods = require('../../step_mods');

const createTableWithUser = Promise.coroutine(function* (dbConn, name) {
  yield dbConn.schema.createTable('users', (table) => {
    table.increments();
    table.string('name');
    table.timestamps();
  });
  return yield dbConn('users').insert({ name });
});


module.exports = function () {
  stepMods.initialize.call(this);
  knexControl.initialize.call(this);

  this.registerHandler('BeforeFeatures', Promise.coroutine(function* () {
    const knexService = yield knexControl.startService({ name: 'before_features_db' });
    return yield createTableWithUser(knexService.dbConn, 'before_features_user');
  }));

  this.registerHandler('BeforeFeature', Promise.coroutine(function* () {
    const knexService = yield knexControl.startService({ name: 'before_feature_db' });
    return yield createTableWithUser(knexService.dbConn, 'before_feature_user');
  }));

  this.Before(Promise.coroutine(function* () {
    const knexService = yield knexControl.startService({ name: 'before_scenario_db' });
    return yield createTableWithUser(knexService.dbConn, 'before_scenario_user');
  }));

  this.Given(/^user database "([^"]+)" is created$/, (db) =>
    knexControl.startService({ name: `${db}_db` })
      .then((knexService) => createTableWithUser(knexService.dbConn, `${db}_user`))
  );

  stepMods.withThenNotSteps.call(this, function () {
    this.Then(/^user "([^"]+)" was in the "([^"]+)" database$/, (user, db) => {
      const { dbConn } = getService(db) || {};
      expect(dbConn).to.exist;
      return dbConn('users').first('*').where('name', user)
      .then((result) => {
        expect(result).to.exist;
      });
    });
  });
};
