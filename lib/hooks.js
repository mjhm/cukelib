const _ = require('lodash');
const Promise = require('bluebird');
const shellSupport = require('./shell_support');
const serverControl = require('./server_control');
const knexControl = require('./knex_control');
const universe = require('./universe');
const defaultCucapi = require('./util/default_cucapi');

const { get, universeGet } = universe.namespaceFactory('_cucapi');

module.exports = {
  initCucumberApi() {
    universe.initializeUniverse.call(this, { _cucapi: defaultCucapi() });

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
      _.forIn(get('servers'), function (server, host) {
        if (!universeGet(`servers.${host}`)) {
          serverControl.killServer.call(this, host);
        }
      });

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
      _.forIn(get('servers'), (server, name) => serverControl.killServer(name));
      const dbPromises = [];
      _.forIn(get('databases'), (db) => dbPromises.push(knexControl.dbTeardown(db)));
      return Promise.all(dbPromises);
    });
  },

  spawnServer: serverControl.spawnServer,
  killServers: serverControl.killServers,
  initKnexDatabase: knexControl.initKnexDatabase,

};
