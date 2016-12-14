// Creates a server that always returns the "id" that was passed when the server was created
const http = require('http');

module.exports = (id) => http.createServer.call(http, (req, res) => res.end(`${id}`));
