const _ = require('lodash');
const shellSupport = require('./shell_support');
const requestSupport = require('./request_support');
const serverControl = require('./server_control');
const { mergeIntoWorld } = require('./util/universe');
const defaultCucapi = require('./util/default_cucapi');
const { get } = require('./util/universe').namespaceFactory('_cucapi');

module.exports = {
  initCucumberApi() {
    mergeIntoWorld.call(this, { _cucapi: defaultCucapi() });

    this.After(function () {
      _.forIn(get(this, 'servers'), function (server, host) {
        if (!get(null, `servers.${host}`)) {
          serverControl.killServer.call(this, host);
        }
      });
      shellSupport.resetShell.call(this);
      // requestSupport.resetRequest.call(this);
    });

    this.registerHandler('AfterFeatures', () => (
      _.forIn(get(this, 'servers'), (server, name) => serverControl.killServer(name))
    ));
  },

  // resetScenarioEnvironment() {
  //   shellSupport.resetShell.call(this);
  //   requestSupport.resetRequest.call(this);
  // },

  spawnServer: serverControl.spawnServer,
  killServers: serverControl.killServers,
  requestInit: requestSupport.requestInit,

};
