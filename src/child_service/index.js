// @flow

const _ = require('lodash');
const Promise = require('bluebird');
const childProcess = require('child_process');
const chalk = require('chalk');
const serviceControl = require('../service_control');
const universe = require('../universe');

const { get, unset } = universe.namespaceFactory('_cukelib');


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

const promiseToResolveOnMatch = (stream, matchTarget) =>
  new Promise((resolve) => {
    const resolveOnMatch = (data) => {
      if (data.toString().match(matchTarget)) {
        resolve(data);
        stream.removeListener('data', resolveOnMatch);
      }
    };
    stream.on('data', resolveOnMatch);
  });

const childService = serviceControl.addBoilerPlate('child', {
  makeSpawnConfig(spawnArgs: Object) {
    if (!spawnArgs.name) throw new Error('name is a required argument');
    const spawnDefaultArgs = {
      args: [],
      options: {},
      isReadyMatch: /./,
      isReady(proc) {
        return Promise.race([
          promiseToResolveOnMatch(proc.stdout, spawnArgs.isReadyMatch),
          promiseToResolveOnMatch(proc.stderr, spawnArgs.isReadyMatch),
        ]);
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

  launch(configOverrides: Object = {}, childLauncher: Function) {
    const config = childService.makeSpawnConfig(configOverrides);
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

  spawn(spawnArgs: Object = {}) {
    if (!spawnArgs.cmd) throw new Error('cmd is a required argument');
    return childService.launch(spawnArgs, (config) =>
      Promise.resolve(childProcess.spawn(config.cmd, config.args, config.options)));
  },
});

module.exports = childService;
