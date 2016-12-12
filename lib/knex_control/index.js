const _ = require('lodash');
const Promise = require('bluebird');
const knex = require('knex');
const { get, set } = require('./universe').namespaceFactory('_cucapi');
const serverControl = require('../server_control');

const knexControl = {
  knexConnect(config) {
    
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
