const _ = require('lodash');
const Promise = require('bluebird');
const childProcess = require('child_process');
const path = require('path');
const { get } = require('./universe').namespaceFactory('_cucapi');


const serverControl = {

  killServer(host) {
    const servers = get('servers');
    const { proc } = servers[host] || { proc: {} };
    if (proc.kill) {
      proc.kill('SIGHUP');
    } else if (proc.stop) {
      proc.stop();
    }
    delete servers[host];
  },

  spawnServer(spawnArgs = {}) {
    const servers = get('servers');
    const host = spawnArgs.host || 'localhost:3000';
    const port = spawnArgs.port || (host.split(/:/) || [])[1] || '3000';
    const spawnDefaultArgs = {
      cmd: 'node',
      args: [
        path.join(__dirname, 'util', 'echo_server.js'),
        `--port=${port}`,
      ],
      options: {},
      isReady: (proc) => new Promise((resolve) => {
        proc.stdout.once('data', (data) => {
          resolve(data);
        });
      }),
      host,
    };

    const mergedArgs = _.defaults(spawnArgs, spawnDefaultArgs);
    serverControl.killServer(host);
    const proc = childProcess.spawn(mergedArgs.cmd, mergedArgs.args, mergedArgs.options);
    servers[host] = { proc, config: mergedArgs };
    // eslint-disable-next-line no-console
    proc.stderr.on('data', (data) => console.error(`${host}.stderr: ${data}`));
    // eslint-disable-next-line no-console
    proc.stdout.on('data', (data) => console.log(`${host}.stdout: ${data}`));
    // eslint-disable-next-line no-console
    proc.on('error', (err) => console.log(`Error: ${host}`, err));
    const isReadyPromise = mergedArgs.isReady(proc);
    const closePromise = new Promise((resolve, reject) => {
      proc.once('close', (code) => {
        const msg = `Server "${host}" exited with code ${code}`;
        if (servers[host]) {
          reject(new Error(msg));
        } else {
          resolve(msg);
        }
      });
    });
    return Promise.race([isReadyPromise, closePromise]);
  },
};

module.exports = serverControl;
