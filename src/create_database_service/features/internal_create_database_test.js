/* eslint-disable no-unused-expressions */
// @flow
const createDatabaseService = require('../');
const knexService = require('../../knex_service');
const stepMods = require('../../step_mods');
const { createTableWithUser, isUserInDbSteps } =
  require('../../knex_service/features/knex_step_utilities');


module.exports = function () {
  stepMods.initialize.call(this);
  knexService.initialize.call(this);
  isUserInDbSteps.call(this);

  this.Given(/^"([^"]+)" database "([^"]+)" is created$/, (client, dbName) => {
    const config = {
      client,
      connection: { database: dbName }
    };
    return createDatabaseService.launch(config);
  });

  this.Given(/^"([^"]+)" database "([^"]+)" is connected$/, (client, dbName) => {
    const config = {
      client,
      connection: { database: dbName }
    };
    return knexService.launch(config);
  });

  stepMods.withThrowSteps.call(this, function () {
    this.Given(/^user "([^"]+)" is created in "([^"]+)" users table$/, (tableName, dbName) => {
      const createDbServ = createDatabaseService.getService(dbName);
      return knexService.launch(createDbServ.config)
      .then((knexServ) =>
        createTableWithUser(knexServ.dbConn, tableName));
    });
  });
};

require('../../utilities/cuke2compat')(module.exports);
