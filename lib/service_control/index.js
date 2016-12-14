const _ = require('lodash');
const Promise = require('bluebird');
const childProcess = require('child_process');
const path = require('path');
const universe = require('../universe');
const idServer = require('./id_server');

const serviceControlNS = universe.namespaceFactory('_cucapi');
const { get, set, unset, getContext, initializeWith } = serviceControlNS;
let serviceCounter = 0;

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
        unset(`services.${this.config.host}`);
        this.proc.kill('SIGTERM');
      };
      process.on(sig, killFn);
      return () => process.removeListener(sig, killFn);
    });
  return () => removeListenerList.map((rmListener) => rmListener());
};


const serviceControl = {
  serviceControlNS,

  initialize() {
    // TODO make this idempotent
    initializeWith.call(this, { services: {} });

    const contextKiller = (context) => {
      const killTheseHosts = [];
      _.forIn(get('services'), (service, host) => {
        if (service.context === context) {
          killTheseHosts.push(host);
        }
      });
      return Promise.map(killTheseHosts, (host) => serviceControl.killService(host));
    };

    this.After(contextKiller.bind(null, 'scenario'));
    this.registerHandler('AfterFeature', contextKiller.bind(null, 'feature'));
    this.registerHandler('AfterFeatures', contextKiller.bind(null, 'universe'));
  },

  killService(host) {
    const service = get(`services.${host}`);
    if (!service) return Promise.resolve(`no service for ${host}`);
    unset(`services.${host}`);
    if (service.stop) {
      return service.stop();
    } else if ((service.proc || {}).kill) {
      service.removeListeners();
      service.proc.kill('SIGTERM');
      return service.exitPromise;
    }
    throw new Error(`Don't know how to stop service "${host}"`);
  },

  // TODO refactor embedServer to use launchService maybe
  // launchService config requires at least a 'creator' which returns an object with at least
  // 'isReady' and 'stop' promise returning methods.
  // launchService
  launchService(name, start) {


    const self = { config: _.defaults({}, config, { host: `anonymous_${serviceCounter += 1}` }) };
    const host = self.config.host;
    return serviceControl.killService(host)
    .then(() => {
      set(`services.${host}`, self);
      const service = self.service = self.config.creator(self.config); // TODO see below
      self.stop = service.stop.bind(service);
      self.context = getContext();
      return service.isReady();
    });
  },

  embedServer(embedArgs = {}) {
    const self = { config: makeEmbedConfig(embedArgs) };
    const host = self.config.host;
    return serviceControl.killService(host)
    .then(() => {
      set(`services.${host}`, self);
      const embedded = self.config.creator(self.config); // TODO this is an odd construct
      const isReady = Promise.promisify(embedded.listen.bind(embedded, self.config.port));
      const stop = Promise.promisify(embedded.close.bind(embedded));
      self.embedded = embedded;
      self.stop = stop;
      self.context = getContext();
      return isReady();
    });
  },

  spawnServer(spawnArgs = {}) {
    const self = { config: makeSpawnConfig(spawnArgs) };
    const host = self.config.host;
    return serviceControl.killService(host)
    .then(() => {
      set(`services.${host}`, self);
      self.proc = childProcess.spawn(self.config.cmd, self.config.args, self.config.options);
      self.proc.stderr.on('data', self.config.stderrHandler);
      self.proc.stdout.on('data', self.config.stdoutHandler);
      self.proc.on('error', self.config.errorHandler);
      self.exitPromise = new Promise((resolve, reject) => {
        self.proc.once('exit', (code) => {
          const msg = `Server "${host}" exited with code ${code}`;
          if (get(`services.${host}`)) {
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

module.exports = serviceControl;
