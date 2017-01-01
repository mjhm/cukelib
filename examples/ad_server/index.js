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
app.use(exprestive());

app.use((req, res) => {
  if (req.query.statusCode) {
    res.status(req.query.statusCode);
  }
  res.json(req.body);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}!`);
});
