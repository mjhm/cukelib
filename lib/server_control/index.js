const _ = require('lodash');
const Promise = require('bluebird');
const childProcess = require('child_process');
const path = require('path');
const universe = require('../universe');

const serverControlNS = universe.namespaceFactory('_cucapi');
const { get, set, unset, getContext } = serverControlNS;

const spawnDefaultArgs = (host, port) => ({
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
});


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
    universe.initialize.call(this);
    set('servers', {});
    set('_reserved.servers', true);

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
    server.removeListeners();
    unset(`servers.${host}`);
    if (server.config.stop) {
      return server.config.stop();
    } else if ((server.proc || {}).kill) {
      server.proc.kill('SIGTERM');
      return server.exitPromise;
    }
    throw new Error(`Don't know how to stop server "${host}"`);
  },

  // Embed takes a port and a server creator function which is assumed to be curried to take no
  // arguments. The creator returns a "server" object which needs to have at least a "listen", and
  // "close" methods which take callbacks. Or comparable "isReady" and "stop" methods which return
  // promises.
  embedServer(port, creator) {
    const server = creator();
    const isReady = server.isReady ? server.isReady.bind(server) :
      Promise.promisify(server.listen.bind(server, port));
    const stop = server.stop ? server.stop.bind(server) :
      Promise.promisify(server.close.bind(server));
    const host = `localhost:${port}`;
    const self = { stop, config: { port }, embedded: server };
    set(`servers.${host}`, self);
    return isReady();
  },

  spawnServer(spawnArgs = {}) {
    const port = spawnArgs.port || ((spawnArgs.host || '').split(/:/) || [])[1] || '3000';
    const host = spawnArgs.host || `localhost:${port}`;

    return serverControl.killServer(host)
    .then(() => {
      const self = { config: _.defaults(spawnArgs, spawnDefaultArgs(host, port)) };
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
