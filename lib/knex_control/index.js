const _ = require('lodash');
const Promise = require('bluebird');
const knex = require('knex');
const serverControl = require('../service_control');

let databaseCounter = 0;

module.exports = {
  initialize() {
    return serverControl.initialize.call(this);
  },

  startService(config) {
    const defaultKnexConfig = {
      client: 'sqlite3',
      connection: {
        filename: ':memory:',
      },
      useNullAsDefault: true,
      seeds: {
        directory: '/dev/null'
      },
      migrations: {
        directory: '/dev/null'
      },
    };
    const knexConfig = _.defaultsDeep({}, config, defaultKnexConfig);
    const name = knexConfig.name ||
      knexConfig.connection.database ||
      `database_${databaseCounter += 1}`;
    const start = Promise.coroutine(function* () {
      const dbConn = knex(knexConfig);
      yield dbConn.migrate.latest()
      .catch((err) => {
        if (err.code === 'ENOTDIR') return;
        throw err;
      });
      yield dbConn.seed.run()
      .catch((err) => {
        if (err.code === 'ENOTDIR') return;
        throw err;
      });
      const stop = Promise.coroutine(function* () {
        yield dbConn.migrate.rollback()
        .catch((err) => {
          if (err.code === 'ENOTDIR') return;
          throw err;
        });
        return dbConn.destroy();
      });
      return { name, dbConn, stop };
    });
    return serverControl.launchService(name, start);
  },
};


// setup: Promise.coroutine(function* (setupConfig) {
//   const dbConn = knex(_.defaultsDeep(setupConfig, initConfig;
//   dbConfig.dbConn = dbConn; // eslint-disable-line no-param-reassign
//   yield dbConn.migrate.latest();
//   return yield dbConn.seed.run();
// }),
//
//
//   },
//
//
//
//
//   initialize(config = {}) {
//     if (!get('sqlDatabases')) {
//       set('_reserved', 'sqlDatabases');
//       set('sqlDatabases', {});
//     }
//     const defaultConfig = {
//       name: '_cucapi',
//       client: 'sqlite3',
//       connection: {
//         filename: ':memory:',
//       },
//
//       setup: Promise.coroutine(function* (setupConfig) {
//         const dbConn = knex(_.defaultsDeep(setupConfig, initConfig;
//         dbConfig.dbConn = dbConn; // eslint-disable-line no-param-reassign
//         yield dbConn.migrate.latest();
//         return yield dbConn.seed.run();
//       }),
//
//       teardown: Promise.coroutine(function* (dbConfig) {
//         const { dbConn } = dbConfig;
//         dbConfig.dbConn = null; // eslint-disable-line no-param-reassign
//         if (dbConn) {
//           yield dbConn.migrate.rollback();
//           return dbConn.destroy();
//         }
//         return null;
//       }),
//     };
//     const initConfig = _.defaultsDeep({}, config, defaultConfig);
//     if (!initConfig.name) {
//       throw new Error('SQL databases must have a name');
//     }
//     set(`sqlDatabases.${combinedConfig.name}`, { config: combinedConfig });
//   },
//
//   dbSetup: Promise.coroutine(function* (dbConfig) {
//     const dbConn = knex(_.defaultsDeep(dbConfig, get();
//     dbConfig.dbConn = dbConn; // eslint-disable-line no-param-reassign
//     yield dbConn.migrate.latest();
//     return yield dbConn.seed.run();
//   }),
//
//   dbTeardown: Promise.coroutine(function* (dbConfig) {
//     const { dbConn } = dbConfig;
//     dbConfig.dbConn = null; // eslint-disable-line no-param-reassign
//     if (dbConn) {
//       yield dbConn.migrate.rollback();
//       return dbConn.destroy();
//     }
//     return null;
//   }),
//
// };
//
// module.exports = sqlControl;
