const { BaseController } = require('exprestive');

module.exports = class UsersController extends BaseController {
  constructor({ dbConn, passport }) {
    super();
    this.dbConn = dbConn;
    this.passport = passport;
    this.useMiddleware(passport.authenticate('local'), { only: ['current'] });
  }

  current(req, res, next) {
    return this.dbConn.select().from('users')
    .then(res.json.bind(res))
    .catch(next);
  }

  login(req, res, next) {
    return this.dbConn.select().from('users')
    .then(res.json.bind(res))
    .catch(next);
  }

  logout(req, res, next) {
    return this.dbConn.select().from('users')
    .then(res.json.bind(res))
    .catch(next);
  }
};
