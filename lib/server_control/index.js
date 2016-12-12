const _ = require('lodash');
const Promise = require('bluebird');
const childProcess = require('child_process');
const path = require('path');
const universe = require('../universe');
const idServer = require('./id_server');

const serverControlNS = universe.namespaceFactory('_cucapi');
const { get, set, unset, getContext, initializeWith } = serverControlNS;

const makeSpawnConfig = (spawnArgs) => {
  const port = spawnArgs.port || ((spawnArgs.host || '').split(/:/) || [])[1] || '3000';
  const host = spawnArgs.host || `localhost:${port}`;
  const spawnDefaultArgs = {
    host,
    cmd: 'node',
    args: [
      path.join(__dirname, 'pid_server.js'),
      `--port=${port}`,
    ],
    options: {},
    isReady() {
      return new Promise((resolve) => {
        this.proc.stdout.once('data', (data) => {
          resolve(data);
        });
      });
    },
    stderrHandler(data) {
      // eslint-disable-next-line no-console
      console.error(`${host}.stderr: ${data}`);
    },
    stdoutHandler(data) {
      // eslint-disable-next-line no-console
      console.error(`${host}.stderr: ${data}`);
    },
    errorHandler(err) {
      // eslint-disable-next-line no-console
      console.log(`${host} Error:`, err);
    }
  };
  return _.defaults(spawnArgs, spawnDefaultArgs);
};

const makeEmbedConfig = (embedArgs) => {
  const port = embedArgs.port || ((embedArgs.host || '').split(/:/) || [])[1] || '3000';
  const host = embedArgs.host || `localhost:${port}`;
  const id = Date.now();
  const embedDefaultArgs = {
    host,
    port,
    creator: idServer.bind(null, id)
  };
  return _.defaults(embedArgs, embedDefaultArgs);
};

const removeListenerFactory = function () {
  const removeListenerList =
    'exit SIGHUP SIGINT SIGQUIT SIGILL SIGABRT SIGFPE SIGSEGV SIGPIPE SIGTERM SIGBUS'
    .split(/\s+/)
    .map((sig) => {
      const killFn = () => {
        unset(`servers.${this.config.host}`);
        this.proc.kill('SIGTERM');
      };
      process.on(sig, killFn);
      return () => process.removeListener(sig, killFn);
    });
  return () => removeListenerList.map((rmListener) => rmListener());
};


const serverControl = {
  serverControlNS,

  initialize() {
    // TODO make this idempotent
    initializeWith.call(this, { servers: {} });

    const contextKiller = (context) => {
      const killTheseHosts = [];
      _.forIn(get('servers'), (server, host) => {
        if (server.context === context) {
          killTheseHosts.push(host);
        }
      });
      return Promise.map(killTheseHosts, (host) => serverControl.killServer(host));
    };

    this.After(contextKiller.bind(null, 'scenario'));
    this.registerHandler('AfterFeature', contextKiller.bind(null, 'feature'));
    this.registerHandler('AfterFeatures', contextKiller.bind(null, 'universe'));
  },

  killServer(host) {
    const server = get(`servers.${host}`);
    if (!server) return Promise.resolve(`no server for ${host}`);
    unset(`servers.${host}`);
    if (server.stop) {
      return server.stop();
    } else if ((server.proc || {}).kill) {
      server.removeListeners();
      server.proc.kill('SIGTERM');
      return server.exitPromise;
    }
    throw new Error(`Don't know how to stop server "${host}"`);
  },

  embedServer(embedArgs = {}) {
    const self = { config: makeEmbedConfig(embedArgs) };
    const host = self.config.host;
    return serverControl.killServer(host)
    .then(() => {
      set(`servers.${host}`, self);
      const embedded = self.config.creator(self.config);
      const isReady = embedded.isReady ? embedded.isReady.bind(embedded, self.config.port) :
        Promise.promisify(embedded.listen.bind(embedded, self.config.port));
      const stop = embedded.stop ? embedded.stop.bind(embedded) :
        Promise.promisify(embedded.close.bind(embedded));
      self.embedded = embedded;
      self.stop = stop;
      self.context = getContext();
      return isReady();
    });
  },

  spawnServer(spawnArgs = {}) {
    const self = { config: makeSpawnConfig(spawnArgs) };
    const host = self.config.host;
    return serverControl.killServer(host)
    .then(() => {
      set(`servers.${host}`, self);
      self.proc = childProcess.spawn(self.config.cmd, self.config.args, self.config.options);
      self.proc.stderr.on('data', self.config.stderrHandler);
      self.proc.stdout.on('data', self.config.stdoutHandler);
      self.proc.on('error', self.config.errorHandler);
      self.exitPromise = new Promise((resolve, reject) => {
        self.proc.once('exit', (code) => {
          const msg = `Server "${host}" exited with code ${code}`;
          if (get(`servers.${host}`)) {
            reject(new Error(msg));
          } else {
            resolve(msg);
          }
        });
      });
      self.context = getContext();
      self.removeListeners = removeListenerFactory.call(self);

      const isReadyPromise = self.config.isReady.call(self);
      return Promise.race([isReadyPromise, self.exitPromise]);
    });
  },
};

module.exports = serverControl;
