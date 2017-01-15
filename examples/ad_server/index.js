const minimist = require('minimist');

const parsedArgs = minimist(process.argv);
const port = parsedArgs.port || process.env.SERVER_PORT || 3000;
const express = require('express');
const exprestive = require('exprestive');
const bodyParser = require('body-parser');
const knex = require('knex');
const knexfile = require('./knexfile');

const app = express();
const dbConn = knex(knexfile[app.get('env')]);
app.use(bodyParser.json());

app.use(exprestive({ dependencies: { dbConn } }));
app.use((req, res) => {
  // eslint-disable-next-line no-console
  console.error('Request Not Found', req.method, req.url);
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  return res.sendStatus(500);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}!`);
});
