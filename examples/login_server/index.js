const minimist = require('minimist');

const parsedArgs = minimist(process.argv);
const port = parsedArgs.port || process.env.SERVER_PORT || 3000;
const express = require('express');
const exprestive = require('exprestive');
const bodyParser = require('body-parser');
const knex = require('knex');
const knexfile = require('./knexfile');
const cookieParser = require('cookie-parser');
const passportSetup = require('./passport_setup');

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
const dbConn = knex(knexfile[app.get('env')]);
const passport = passportSetup(dbConn);
app.use(passport.initialize());
app.use(passport.session());

app.use(exprestive({ dependencies: { dbConn, passport } }));
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

//   isPostgresError =  /^\w{5}$/.test(err.code) or
//     /Knex\: Timeout acquiring a connection/.test(err.message)
//   res.sendStatus if isPostgresError then 503 else 500
// router

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}!`);
});
