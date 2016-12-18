const _ = require('lodash');
const Promise = require('bluebird');
const childProcess = require('child_process');
const path = require('path');
const universe = require('../universe');
const idServer = require('./id_server');

const serviceControlNS = universe.namespaceFactory('_cukeapi');
const { get, set, unset, getCukeContext, initializeWith } = serviceControlNS;

const makeSpawnConfig = (spawnArgs) => {
  const hostPortParse = (spawnArgs.host || '').match(/(.*):(\d+)$/) || [];
  const port = _.toInteger(spawnArgs.port || hostPortParse[2] || 3000);
  const address = spawnArgs.address || hostPortParse[1] || 'localhost';
  const name = spawnArgs.name || `${address}:${port}`;
  const spawnDefaultArgs = {
    name,
    port,
    address,
    host: `${address}:${port}`,
    cmd: 'node',
    args: [
      path.join(__dirname, 'pid_server.js'),
      `--port=${port}`,
    ],
    options: {},
    isReady(proc) {
      return new Promise((resolve) => {
        proc.stdout.once('data', (data) => {
          resolve(data);
        });
      });
    },
    stderrHandler(data) {
      // eslint-disable-next-line no-console
      console.error(`${name}.stderr: ${data}`);
    },
    stdoutHandler(data) {
      // eslint-disable-next-line no-console
      console.error(`${name}.stderr: ${data}`);
    },
    errorHandler(err) {
      // eslint-disable-next-line no-console
      console.log(`${name} Error:`, err);
    }
  };
  return _.defaults(spawnArgs, spawnDefaultArgs);
};


const killProcWhenOrphaned = function (proc, name) {
  const removeListenerList =
    'exit SIGHUP SIGINT SIGQUIT SIGILL SIGABRT SIGFPE SIGSEGV SIGPIPE SIGTERM SIGBUS'
    .split(/\s+/)
    .map((sig) => {
      const killFn = () => {
        unset(`services.${name}`);
        proc.kill('SIGTERM');
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

    const cukeContextKiller = (cukeContext) => {
      const killTheseHosts = [];
      _.forIn(get('services'), (service, host) => {
        if (service.cukeContext === cukeContext) {
          killTheseHosts.push(host);
        }
      });
      return Promise.map(killTheseHosts, (host) => serviceControl.stopService(host));
    };

    this.After(cukeContextKiller.bind(null, 'scenario'));
    this.registerHandler('AfterFeature', cukeContextKiller.bind(null, 'feature'));
    this.registerHandler('AfterFeatures', cukeContextKiller.bind(null, 'universe'));
  },

  stopService(host) {
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

  getService(name) {
    return get(`services.${name}`);
  },

  launchService(name, start) {
    return serviceControl.stopService(name)
    .then(start)
    .then((service) => {
      if (!service.stop || !_.isFunction(service.stop)) {
        throw new Error(`service '${name}' is missing a stop function`);
      }
      set(`services.${name}`, service);
      service.name = name; // eslint-disable-line no-param-reassign
      service.cukeContext = getCukeContext(); // eslint-disable-line no-param-reassign
      return service;
    });
  },

  embedServer(embedArgs = {}) {
    const hostPortParse = (embedArgs.host || '').match(/(.*):(\d+)$/) || [];
    const port = _.toInteger(embedArgs.port || hostPortParse[2] || 3000);
    const address = embedArgs.address || hostPortParse[1] || 'localhost';
    const name = embedArgs.name || `${address}:${port}`;
    const config = _.assign({
      name,
      port,
      address,
      host: `${address}:${port}`,
      listenArgs: [port, address],
      creator: idServer
    }, embedArgs);
    const start = () =>
      Promise.resolve(config.creator.call(config))
      .then((server) =>
        new Promise((resolve, reject) => {
          const listenCB = (err) =>
            (err ? reject(err) : resolve({
              stop: Promise.promisify(server.close.bind(server)),
              config,
            }));
          // eslint-disable-next-line prefer-spread
          server.listen.apply(server, config.listenArgs.concat(listenCB));
        })
      );
    return serviceControl.launchService(name, start);
  },

  spawnServer(spawnArgs = {}) {
    const config = makeSpawnConfig(spawnArgs);
    const start = () => {
      const proc = childProcess.spawn(config.cmd, config.args, config.options);
      proc.stderr.on('data', config.stderrHandler);
      proc.stdout.on('data', config.stdoutHandler);
      proc.on('error', config.errorHandler);
      const exitPromise = new Promise((resolve, reject) => {
        proc.once('exit', (code) => {
          const msg = `Server "${config.name}" exited with code ${code}`;
          if (get(`services.${config.name}`)) {
            reject(new Error(msg));
          } else {
            resolve(msg);
          }
        });
      });
      const removeOrphanProcListeners = killProcWhenOrphaned(proc, config.name);
      const isReadyPromise = config.isReady.call(config, proc)
      .then(() => ({
        config,
        proc,
        stop: () => {
          removeOrphanProcListeners();
          proc.kill('SIGTERM');
          return exitPromise;
        },
      }));
      return Promise.race([isReadyPromise, exitPromise]);
    };
    return serviceControl.launchService(config.name, start);
  },
};

module.exports = serviceControl;
