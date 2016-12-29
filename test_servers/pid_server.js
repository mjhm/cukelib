// This returns the pid of the server process, and is the default server for "spawnServer".
// It's most useful for verifying a connection to the server.

const http = require('http');
const minimist = require('minimist');

const parsedArgs = minimist(process.argv);
const port = parsedArgs.port || process.env.SERVER_PORT || 3000;
const server = http.createServer((req, res) => res.end(`${process.pid}`));
// eslint-disable-next-line no-console
server.listen(port, () => console.log(`Server listening on: http://localhost:${port}`));
