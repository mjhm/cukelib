const _ = require('lodash');
const Promise = require('bluebird');
const bcrypt = require('bcryptjs');

const workFactor = Number(process.env.WORK_FACTOR) || 2;

// This allows a code block to evaluated in a generator context.
const coEval = (fn) => (Promise.coroutine(fn))();

module.exports = (dbConn) => (
  {
    current(req, res, next) {
      return coEval(function* () {
        const currentUser = yield dbConn.first().from('users').where({ email: req.user.email });
        if (currentUser.boss_id) {
          const boss = yield dbConn.first().from('users').where({ id: currentUser.boss_id });
          currentUser.boss = _.pick(boss, 'id', 'name', 'email');
        }
        return res.json(_.omit(currentUser, 'password_hash'));
      }).catch(next);
    },

    updateCurrent(req, res, next) {
      const updateObj = _.pick(req.body, 'name', 'email', 'boss_id');
      return dbConn.from('users').update(updateObj).where({ email: req.user.email })
      .then(() => dbConn.first().from('users').where({ email: req.user.email }))
      .then((currentUser) => res.json(_.omit(currentUser, 'password_hash')))
      .catch(next);
    },

    changePassword(req, res, next) {
      return coEval(function* () {
        const { newPassword, oldPassword } = req.body;
        const currentUser = yield dbConn.first().from('users').where({ email: req.user.email });
        if (!bcrypt.compareSync(oldPassword, currentUser.password_hash)) {
          return res.sendStatus(401);
        }
        const updateObj = {
          password_hash: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(workFactor, 10))
        };
        yield dbConn.from('users').update(updateObj).where({ email: req.user.email });
        return res.sendStatus(200);
      }).catch(next);
    },

    login(req, res, next) {
      return dbConn.from('users')
        .update({ last_login: new Date() })
        .where({ id: req.user.id })
      // .then((result) => {
      //   console.error('login result', result);
      //   return result;
      // })
      .then(() => res.sendStatus(200))
      .catch(next);
    },

    logout(req, res) {
      req.logout();
      return res.sendStatus(200);
    },
  }
);
