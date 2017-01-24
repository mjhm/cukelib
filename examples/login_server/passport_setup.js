
const _ = require('lodash');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;

const authSecret = process.env.AUTH_SECRET || 'insecure login secret';


module.exports = (dbConn) => {
  // eslint-disable-next-line
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    return dbConn.first().from('users').where({ email })
    .then((user) => {
      if (!user) return done(null, false);
      if (!bcrypt.compareSync(password, user.password_hash)) return done(null, false);
      return done(null, _.omit(user, 'password_hash'));
    })
    .catch(done);
  }
  ));

  passport.serializeUser((user, done) => {
    const jwtoken = jwt.sign(
      _.pick(user, ['email', 'name', 'last_login']),
      authSecret,
      { expiresIn: 15 * 60, algorithm: 'HS512' }
    );
    // req.session.auth = jwtoken; // eslint-disable-line no-param-reassign
    return done(null, jwtoken);
  });

  passport.deserializeUser((jwtoken, done) =>
    jwt.verify(jwtoken, authSecret, { algorithms: ['HS512'] }, done)
  );

  return passport;
};
