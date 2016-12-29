// @flow

const _ = require('lodash');
const Promise = require('bluebird');
const childProcess = require('child_process');
const chalk = require('chalk');
const universe = require('../universe');
const idServer = require('./id_server');

const serviceControlNS = universe.namespaceFactory('_cukeapi');
const { get, set, log3, unset, hasKey, getCukeContext, initializeWith } = serviceControlNS;


const killProcWhenOrphaned = function (proc, name) {
  const removeListenerList =
    'exit SIGHUP SIGINT SIGQUIT SIGILL SIGABRT SIGFPE SIGSEGV SIGPIPE SIGTERM SIGBUS'
    .split(/\s+/)
    .map((sig) => {
      const killFn = () => {
        unset(`_services.${name}`);
        proc.kill('SIGTERM');
      };
      process.on(sig, killFn);
      return () => process.removeListener(sig, killFn);
    });
  return () => removeListenerList.map((rmListener) => rmListener());
};

const listServices = (serviceRoot: string, depth: number) => {
  let serviceList = [];
  _.forIn(get(serviceRoot ? `_services.${serviceRoot}` : '_services'), (candidate, name) => {
    const namePath = serviceRoot ? `${serviceRoot}.${name}` : name;
    if (candidate.cukeContext) {
      serviceList.push(namePath);
    } else if (depth < 10) {
      const deepServiceList = listServices(namePath, depth + 1);
      serviceList = serviceList.concat(deepServiceList);
    }
  });
  return serviceList;
};

const serviceControl = {
  serviceControlNS,

  initialize() {
    if (hasKey('_services')) return;
    initializeWith.call(this, { _services: {} });

    const cukeContextKiller = (cukeContext) => {
      const killTheseServices = listServices('', 0)
        .filter((namePath) => get(`_services.${namePath}`).cukeContext === cukeContext);
      log3('log3', 'killTheseServices', killTheseServices);
      return Promise.map(killTheseServices, (name) => serviceControl.stopService(name));
    };

    this.After(cukeContextKiller.bind(null, 'scenario'));
    this.registerHandler('AfterFeature', cukeContextKiller.bind(null, 'feature'));
    this.registerHandler('AfterFeatures', cukeContextKiller.bind(null, 'universe'));
  },


  makeSpawnConfig(spawnArgs: Object) {
    if (!spawnArgs.name) throw new Error('name is a required argument');
    const spawnDefaultArgs = {
      args: [],
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
        console.error(chalk.magenta(`${spawnArgs.name}.stderr: ${data}`));
      },
      stdoutHandler(data) {
        // eslint-disable-next-line no-console
        console.log(chalk.magenta(`${spawnArgs.name}.stdout: ${data}`));
      },
      errorHandler(err) {
        // eslint-disable-next-line no-console
        console.log(chalk.magenta(`${spawnArgs.name} Error:`, err));
      }
    };
    return _.defaults(spawnArgs, spawnDefaultArgs);
  },

  stopService(name: string) {
    const service = get(`_services.${name}`);
    if (!service) return Promise.resolve(`no service for ${name}`);
    unset(`_services.${name}`);
    if (service.stop) {
      return service.stop();
    } else if ((service.proc || {}).kill) {
      service.removeListeners();
      service.proc.kill('SIGTERM');
      return service.exitPromise;
    }
    throw new Error(`Don't know how to stop service "${name}"`);
  },

  getService(name: string) {
    return get(`_services.${name}`);
  },

  launchService(name: string, start: () => Object) {
    if (!get('_services')) {
      throw new Error('tried to launchService before service_control was initialized');
    }
    return serviceControl.stopService(name)
    .then(start)
    .then((service) => {
      if (!service.stop || !_.isFunction(service.stop)) {
        throw new Error(`service '${name}' is missing a stop function`);
      }
      set(`_services.${name}`, service);
      service.name = name; // eslint-disable-line no-param-reassign
      service.cukeContext = getCukeContext(); // eslint-disable-line no-param-reassign
      return service;
    });
  },

  embedServer(embedArgs: Object = {}) {
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
    const start = () => { // eslint-disable-line arrow-body-style
      return Promise.resolve(config.creator.call(config))
      .then((server) =>
        new Promise((resolve, reject) => {
          const listenCB = (err) =>
            (err ? reject(err) : resolve({
              stop: () => { // eslint-disable-line arrow-body-style
                return Promise.promisify(server.close.bind(server))();
              },
              config,
            }));
          // eslint-disable-next-line prefer-spread
          server.listen.apply(server, config.listenArgs.concat(listenCB));
        }),
      );
    };
    return serviceControl.launchService(name, start);
  },

  launchChildService(configOverrides: Object = {}, childLauncher: Function) {
    const config = serviceControl.makeSpawnConfig(configOverrides);
    const start = () => {
      let isProcReady = false;
      return childLauncher(config)
      .then((proc) => {
        proc.stderr.on('data', config.stderrHandler);
        proc.stdout.on('data', config.stdoutHandler);
        proc.on('error', config.errorHandler);
        const exitPromise = new Promise((resolve, reject) => {
          proc.once('exit', (code) => {
            if (isProcReady) {
              // This is the resolution case for the stop function.
              const msg = `Server "${config.name}" exited with code ${code}`;
              if (get(`_services.${config.name}`)) {
                // This happens if the proc exits from something other than the stop.
                reject(new Error(msg));
              } else {
                // This is the normal exit case from the stop.
                resolve(msg);
              }
            } else {
              // This is the resolution case for the Promise.race against isReadyPromise
              reject(new Error(`Server "${config.name}" exited with code ${code} before ready`));
            }
          });
        });
        const removeOrphanProcListeners = killProcWhenOrphaned(proc, config.name);
        const isReadyPromise = config.isReady.call(config, proc)
        .then(() => {
          isProcReady = true;
          return {
            config,
            proc,
            stop: () => {
              removeOrphanProcListeners();
              proc.kill('SIGTERM');
              return exitPromise;
            },
          };
        });
        return Promise.race([isReadyPromise, exitPromise]);
      });
    };
    return serviceControl.launchService(config.name, start);
  },

  spawnServer(spawnArgs: Object = {}) {
    if (!spawnArgs.cmd) throw new Error('cmd is a required argument');
    return serviceControl.launchChildService(spawnArgs, (config) =>
      Promise.resolve(childProcess.spawn(config.cmd, config.args, config.options)));
  },

};

module.exports = serviceControl;
