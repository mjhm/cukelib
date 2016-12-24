// @flow
const _ = require('lodash');
const Promise = require('bluebird');
const knex = require('knex');
const serverControl = require('../service_control');
const { set } = require('../universe').namespaceFactory('_cukeapi');

let databaseCounter = 0;

module.exports = {
  initialize() {
    return serverControl.initialize.call(this);
  },

  startService(config: Object = {}) {
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
      yield dbConn.migrate.latest()
      .catch((err) => {
        if (err.code === 'ENOENT' && /\/migrations$/.test(err.path)) return;
        throw err;
      });
      yield dbConn.seed.run()
      .catch((err) => {
        if (err.code === 'ENOENT' && /\/seeds$/.test(err.path)) return;
        throw err;
      });
      const stop = Promise.coroutine(function* () {
        yield dbConn.migrate.rollback()
        .catch((err) => {
          if (err.code === 'ENOENT' && /\/migrations$/.test(err.path)) return;
          throw err;
        });
        return dbConn.destroy();
      });
      return { name, dbConn, stop, config: knexConfig };
    });
    return serverControl.launchService(`knex.${name}`, start)
      .then((service) => {
        set('currentDatabase', name);
        return service;
      });
  },

  getService(dbName: string) {
    return serverControl.getService(`knex.${dbName}`);
  },
};
