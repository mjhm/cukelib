var _ = require('lodash');

module.exports = {
  GET: (route, done) => {
    if (!_.isUndefined(done) && !_.isFunction(done)) {
      throw new Error('Expected "done" argument to be a function');
    }
    return done && done()
  },
  PUT: () => {},
  POST: () => {},
  DELETE: () => {}
};
