
var UserService = require('../service/user');

module.exports = class UsersController {

  index(req, res) {
    console.log('req', req);
    res.json([{
      id: 1,
      name: 'Pat',
      email: 'pat@snl.fun',
      worth: 0.78,
      friends: [],
      createdAt: new Date(),
      modifiedAt: new Date()
    }]);
  }

  show(req, res) {
    res.send('hello world show');
  }
}
