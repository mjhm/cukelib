

module.exports = class UsersController {

  static index(req, res) {
    res.json([{
      id: 1,
      name: 'Pat',
      email: 'pat@snl.fun',
      worth: 0.78,
      friends: [],
      createdAt: new Date(),
      modifiedAt: new Date(),
    }]);
  }

  static show(req, res) {
    res.send('hello world show');
  }
};
