const _ = require('lodash');
const Promise = require('bluebird');
const shellSupport = require('./shell_support');
const serverControl = require('./service_control');
const knexControl = require('./knex_control');
const universe = require('./universe');
const defaultCucapi = require('./util/default_cukeapi');

const { get, universeGet } = universe.namespaceFactory('_cukeapi');

module.exports = {
  initCucumberApi() {
    universe.initialize.call(this, { _cukeapi: defaultCucapi() });
    serverControl.initialize.call(this);

    this.Before(() => {
      const dbPromises = [];
      _.forIn(get('databases'), (db, name) => {
        if (!universeGet(`databases.${name}.dbConn`)) {
          dbPromises.push(knexControl.dbSetup(db));
        }
      });
      return Promise.all(dbPromises);
    });

    this.After(function () {
      const dbPromises = [];
      _.forIn(get('databases'), (db, name) => {
        if (!universeGet(`databases.${name}.dbConn`)) {
          dbPromises.push(knexControl.dbTeardown(db));
        }
      });
      shellSupport.resetShell.call(this);
      return Promise.all(dbPromises);
    });

    this.registerHandler('AfterFeatures', () => {
      const dbPromises = [];
      _.forIn(get('databases'), (db) => dbPromises.push(knexControl.dbTeardown(db)));
      return Promise.all(dbPromises);
    });
  },

  spawnServer: serverControl.spawnServer,
  killServers: serverControl.killServers,
  initKnexDatabase: knexControl.initKnexDatabase,

};
