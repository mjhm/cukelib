// @flow
const _ = require('lodash');
const Promise = require('bluebird');
const tryRequire = require('../utilities/try_require');
const serviceControl = require('../service_control');
const { set } = require('../universe').namespaceFactory('_cukeserv');

const knex = tryRequire('knex');

let databaseCounter = 0;

module.exports = serviceControl.addBoilerPlate('knex', {
  launch(config: Object = {}) {
    const defaultKnexConfig = {
      client: 'sqlite3',
      connection: {
        filename: ':memory:',
      },
      useNullAsDefault: true,
    };
    const knexConfig = _.defaultsDeep({}, config, defaultKnexConfig);
    const name = knexConfig.name ||
      knexConfig.connection.database ||
      `database_${databaseCounter += 1}`;
    const start = Promise.coroutine(function* () {
      const dbConn = knex(knexConfig);
      if (knexConfig.migrations) {
        yield dbConn.migrate.latest();
      }
      if (knexConfig.seeds) {
        yield dbConn.seed.run();
      }
      const stop = Promise.coroutine(function* () {
        if (knexConfig.migrations) {
          yield dbConn.migrate.rollback();
        }
        return dbConn.destroy();
      });
      return { name, dbConn, stop, config: knexConfig };
    });
    return serviceControl.launchService(`knex.${name}`, start)
      .then((service) => {
        set('currentDatabase', name);
        return service;
      });
  },
});
