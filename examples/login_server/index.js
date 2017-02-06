const minimist = require('minimist');

const parsedArgs = minimist(process.argv);
const port = parsedArgs.port || process.env.SERVER_PORT || 3000;
const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const knexfile = require('./knexfile');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const passportSetup = require('./passport_setup');
const usersController = require('./controllers/users_controller');

const app = express();
app.use(cookieParser());
app.use(cookieSession({ signed: false }));
app.use(bodyParser.json());
const dbConn = knex(knexfile[app.get('env')]);
const passport = passportSetup(dbConn);
app.use(passport.initialize());
app.use(passport.session());
const { current, updateCurrent, changePassword, login, logout } = usersController(dbConn, passport);

const checkAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

app.get('/users/current', checkAuth, current);
app.put('/users/current', checkAuth, updateCurrent);
app.post('/users/change_password', checkAuth, changePassword);
app.post('/login', passport.authenticate('local'), login);
app.post('/logout', logout);

app.use((req, res) => {
  // eslint-disable-next-line no-console
  console.error('Request Not Found', req.method, req.url);
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('Catch All', err);
  if (res.headersSent) {
    return next(err);
  }
  return res.sendStatus(500);
});


app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}!`);
});
