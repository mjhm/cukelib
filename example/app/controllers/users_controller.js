module.exports = class UsersController {

  index(req, res) {
    res.send('hello world index');
  }

  show(req, res) {
    res.send('hello world show');
  }
}
