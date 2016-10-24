
var UserService = require('../service/user');

module.exports = class UsersController {

  index(req, res) {
    console.log('req', req);
    res.send('hello world index');
  }

  show(req, res) {
    res.send('hello world show');
  }
}
