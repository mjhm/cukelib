const _ = require('lodash');
const Promise = require('bluebird');
const shellSupport = require('./shell_support');
const requestSupport = require('./request_support');
const serverControl = require('./server_control');
const knexControl = require('./knex_control');
const { mergeIntoWorld } = require('./util/universe');
const defaultCucapi = require('./util/default_cucapi');
const { get, universeGet } = require('./util/universe').namespaceFactory('_cucapi');

module.exports = {
  initCucumberApi() {
    mergeIntoWorld.call(this, { _cucapi: defaultCucapi() });

    this.Before(() => {
      const dbPromises = [];
      _.forIn(get('databases'), (db, host) => {
        if (!universeGet(`database.${host}`)) {
          dbPromises.push(db.config.setup());
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
      _.forIn(get('databases'), (db, host) => {
        if (!universeGet(`database.${host}`)) {
          dbPromises.push(db.config.teardown());
        }
      });
      shellSupport.resetShell.call(this);
      return Promise.all(dbPromises);
    });

    this.registerHandler('AfterFeatures', () => {
      _.forIn(get('servers'), (server, name) => serverControl.killServer(name));
      const dbPromises = [];
      _.forIn(get('databases'), (db) => dbPromises.push(db.config.teardown()));
      return Promise.all(dbPromises);
    });
  },

  spawnServer: serverControl.spawnServer,
  killServers: serverControl.killServers,
  requestInit: requestSupport.requestInit,
  initKnexDatabase: knexControl.initKnexDatabase,

};
