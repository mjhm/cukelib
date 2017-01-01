/* eslint-disable no-unused-expressions */
// @flow
const Promise = require('bluebird');
const { expect } = require('chai');
const knexService = require('../');
const stepMods = require('../../step_mods');


const createTableWithUser = Promise.coroutine(function* (dbConn, name) {
  yield dbConn.schema.createTable('users', (table) => {
    table.increments();
    table.string('name');
    table.integer('access_count').defaultTo(0).notNullable();
    table.timestamps(true, true);
  });
  return yield dbConn('users').insert({ name });
});


module.exports = {
  knexStartStep() {
    knexService.initialize.call(this);

    this.Given(/^user database "([^"]+)" is created$/, (db) =>
      knexService.launch({ name: `${db}_db` })
        .then((knexService1) => createTableWithUser(knexService1.dbConn, `${db}_user`))
    );
  },

  isUserInDbSteps() {
    stepMods.withThenNotSteps.call(this, function () {
      this.Then(/^user "([^"]+)" was in the "([^"]+)" database$/, (user, db) => {
        const { dbConn } = knexService.getService(db) || {};
        expect(dbConn).to.exist;
        return dbConn('users').first('*').where('name', user)
        .then((result) => {
          expect(result).to.exist;
        });
      });
    });
  },

  createTableWithUser,
};
