const _ = require('lodash');
const Promise = require('bluebird');
const knex = require('knex');
const { get, set } = require('./universe').namespaceFactory('_cucapi');
const serverControl = require('../server_control');

let databaseCounter = 0;

const knexControl = {
  initialize() {
    return serverControl.initialize.call(this);
  },

  knexConnect(config) {
    const defaultKnexConfig = {
      client: 'sqlite3',
      connection: {
        filename: ':memory:',
      },
    };
    const knexConfig = _.defaultsDeep({}, config, defaultKnexConfig);
    const host = knexConfig.name || knexConfig.connection.database || `database_${databaseCounter}`;
    const creator = () => {
      const dbConn = knex(knexConfig);
      const isReady = Promise.coroutine(function* () {
        yield dbConn.migrate.latest();
        return yield dbConn.seed.run();
      });
      const stop = Promise.coroutine(function* () {
        yield dbConn.migrate.rollback();
        return dbConn.destroy();
      });
      return { isReady, stop }
    };
    return serverControl.launchService({
      host,
      creator,
    });
  },



setup: Promise.coroutine(function* (setupConfig) {
  const dbConn = knex(_.defaultsDeep(setupConfig, initConfig;
  dbConfig.dbConn = dbConn; // eslint-disable-line no-param-reassign
  yield dbConn.migrate.latest();
  return yield dbConn.seed.run();
}),


  },




  initialize(config = {}) {
    if (!get('sqlDatabases')) {
      set('_reserved', 'sqlDatabases');
      set('sqlDatabases', {});
    }
    const defaultConfig = {
      name: '_cucapi',
      client: 'sqlite3',
      connection: {
        filename: ':memory:',
      },

      setup: Promise.coroutine(function* (setupConfig) {
        const dbConn = knex(_.defaultsDeep(setupConfig, initConfig;
        dbConfig.dbConn = dbConn; // eslint-disable-line no-param-reassign
        yield dbConn.migrate.latest();
        return yield dbConn.seed.run();
      }),

      teardown: Promise.coroutine(function* (dbConfig) {
        const { dbConn } = dbConfig;
        dbConfig.dbConn = null; // eslint-disable-line no-param-reassign
        if (dbConn) {
          yield dbConn.migrate.rollback();
          return dbConn.destroy();
        }
        return null;
      }),
    };
    const initConfig = _.defaultsDeep({}, config, defaultConfig);
    if (!initConfig.name) {
      throw new Error('SQL databases must have a name');
    }
    set(`sqlDatabases.${combinedConfig.name}`, { config: combinedConfig });
  },

  dbSetup: Promise.coroutine(function* (dbConfig) {
    const dbConn = knex(_.defaultsDeep(dbConfig, get();
    dbConfig.dbConn = dbConn; // eslint-disable-line no-param-reassign
    yield dbConn.migrate.latest();
    return yield dbConn.seed.run();
  }),

  dbTeardown: Promise.coroutine(function* (dbConfig) {
    const { dbConn } = dbConfig;
    dbConfig.dbConn = null; // eslint-disable-line no-param-reassign
    if (dbConn) {
      yield dbConn.migrate.rollback();
      return dbConn.destroy();
    }
    return null;
  }),

};

module.exports = sqlControl;