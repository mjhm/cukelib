// @flow
const Promise = require('bluebird');
const knexControl = require('../');


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
    knexControl.initialize.call(this);

    this.Given(/^user database "([^"]+)" is created$/, (db) =>
      knexControl.startService({ name: `${db}_db` })
        .then((knexService) => createTableWithUser(knexService.dbConn, `${db}_user`))
    );
  },

  createTableWithUser,
};
