// This returns the pid of the server process, and is the default server for "spawnServer".
// It's most useful for verifying a connection to the server.

const http = require('http');
const minimist = require('minimist');

const parsedArgs = minimist(process.argv);
const port = parsedArgs.port || process.env.SERVER_PORT || 3000;
const startSignal = parsedArgs.start_signal || `Server listening on: http://localhost:${port}`;
const signalStream = parsedArgs.signal_stream || 'stdout';
const server = http.createServer((req, res) => res.end(`${process.pid}`));
server.listen(port, () =>
  // eslint-disable-next-line no-console
  console[signalStream === 'stderr' ? 'error' : 'log'](startSignal)
);
