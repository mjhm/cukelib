const _ = require('lodash');
const Promise = require('bluebird');
const knex = require('knex');
const { get } = require('./util/universe').namespaceFactory('_cucapi');

const knexControl = {
  dbSetup: Promise.coroutine(function* (dbConfig) {
    const dbConn = knex(dbConfig);
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

  initKnexDatabase(options = {}) {
    const databases = get('databases');
    // Need to connect to default database 'postgres', 'template1'
    const config = {};
    const defaultConfig = {
      name: 'defaultInMemorySqlite',
      client: 'sqlite3',
      connection: {
        filename: ':memory:',
      },
    };
    _.defaultsDeep(config, options, defaultConfig);
    if (!config.name) {
      config.name = JSON.stringify(config);
    }
    databases[config.name] = config;
  },

};

module.exports = knexControl;
