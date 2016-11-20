const _ = require('lodash');
const Promise = require('bluebird');
const knex = require('knex');
const { get } = require('./util/universe').namespaceFactory('_cucapi');

const knexControl = {

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
      setup: Promise.coroutine(function* () {
        const dbConn = knex(_.omit(config, 'name', 'setup', 'teardown'));
        config.dbConn = dbConn;
        return yield dbConn.migrate.latest();
      }),
      teardown: Promise.coroutine(function* () {
        const { dbConn } = config;
        config.dbConn = null;
        if (dbConn) {
          yield dbConn.migrate.rollback();
          return dbConn.destroy();
        }
        return null;
      }),
    };
    _.defaultsDeep(config, options, defaultConfig);
    databases[config.name] = { config, dbConn: null };
    if (!config.name) {
      config.name = JSON.stringify(config);
    }
  },

};

module.exports = knexControl;
