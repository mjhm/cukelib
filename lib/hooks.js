const _ = require('lodash');
const shellSupport = require('./shell_support');
const requestSupport = require('./request_support');
const serverControl = require('./server_control');
const { mergeIntoWorld } = require('./util/universe');
const defaultCucapi = require('./util/default_cucapi');
const { get, universeGet } = require('./util/universe').namespaceFactory('_cucapi');

module.exports = {
  initCucumberApi() {
    mergeIntoWorld.call(this, { _cucapi: defaultCucapi() });

    this.After(function () {
      _.forIn(get('servers'), function (server, host) {
        if (!universeGet(`servers.${host}`)) {
          serverControl.killServer.call(this, host);
        }
      });
      shellSupport.resetShell.call(this);
    });

    this.registerHandler('AfterFeatures', () => (
      _.forIn(get('servers'), (server, name) => serverControl.killServer(name))
    ));
  },

  spawnServer: serverControl.spawnServer,
  killServers: serverControl.killServers,
  requestInit: requestSupport.requestInit,

};
