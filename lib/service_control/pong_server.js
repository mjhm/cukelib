const minimist = require('minimist');
const express = require('express');

const parsedArgs = minimist(process.argv);
const port = parsedArgs.port || process.env.SERVER_PORT || 3000;

const app = express();

const pingPong = (which) => {
  const other = which === 'ping' ? 'pong' : 'ping';
  return `
    <html><body>
      <a href="/${other}"><h1 style="margin: 100px">${which.toUpperCase()}</h1></a>
    </body></html>
  `;
};

app.get('/:pingpong', (req, res) => res.send(pingPong(req.params.pingpong)));
app.get('*', (req, res) => res.send(pingPong('pong')));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Pong app listening on port ${port}!`);
});
