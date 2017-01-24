const _ = require('lodash');

module.exports = (dbConn) => (
  {
    current(req, res, next) {
      return dbConn.first().from('users').where({ email: req.user.email })
      .then((result) => res.json(_.omit(result, 'password_hash')))
      .catch(next);
    },

    login(req, res, next) {
      return dbConn.from('users').update({ last_login: new Date() })
      .then(() => res.sendStatus(200))
      .catch(next);
    },

    logout(req, res) {
      req.logout();
      return res.sendStatus(200);
    },
  }
);
