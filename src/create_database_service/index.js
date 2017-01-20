// @flow
const Promise = require('bluebird');
const _ = require('lodash');
const tryRequire = require('../utilities/try_require');
const serviceControl = require('../service_control');

const knex = tryRequire('knex');

const neutralDatabaseName = {
  maria: 'information_schema',
  mssql: 'information_schema',
  mysql: 'information_schema',
  mysql2: 'information_schema',
  oracle: null,
  oracledb: null,
  postgres: 'postgres',
  sqlite3: null,
  'strong-oracle': null,
  websql: null,

  // client name aliases
  mariadb: 'information_schema',
  mariasql: 'information_schema',
  pg: 'postgres',
  postgresql: 'postgres',
  sqlite: null,
};

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
    const neutralDbName = neutralDatabaseName[knexConfig.client];
    if (neutralDbName === null) {
      throw new Error(`createDatabaseService is not supported for ${knexConfig.client} clients`);
    }
    if (!neutralDbName) {
      throw new Error(`createDatabaseService: unknown client: ${knexConfig.client}`);
    }

    const name = knexConfig.name ||
      knexConfig.connection.database ||
      `database_${databaseCounter += 1}`;
    const neutralConfig = _.defaultsDeep({ connection: { database: neutralDbName } }, knexConfig);
    const start = Promise.coroutine(function* () {
      const startConn = knex(neutralConfig);
      yield startConn.raw(`DROP DATABASE IF EXISTS ${name}`);
      yield startConn.raw(`CREATE DATABASE ${name}`);
      yield startConn.destroy();
      const stop = () => {
        const stopConn = knex(neutralConfig);
        return stopConn.raw(`DROP DATABASE ${name}`)
        .then(stopConn.destroy.bind(stopConn));
      };
      return { name, stop, config: knexConfig };
    });
    return serviceControl.launchService(`createDatabase.${name}`, start)
    .catch((err) => {
      if (err.code === 'ER_DBACCESS_DENIED_ERROR') {
        const dbAccessError = new Error(`createDatabaseService: ${err.message}`);
        _.assign(dbAccessError, _.pick(err, ['code', 'errno', 'sqlState']));
        throw dbAccessError;
      }
      console.log('createDatabaseService err', err);
      throw err;
    });
  },
});
