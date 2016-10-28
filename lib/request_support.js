var _ = require('lodash');
var handlebars = require('handlebars');

var checkDone = function (done) {
  if (!_.isUndefined(done) && !_.isFunction(done)) {
    throw new Error('expected done argument to be a function');
  }
};

module.exports = {
  GET: (routeStr, done) => {
    route = handlebars.compile(routeStr)(this.World);
    checkDone(done);
    return done && done();
  },
  PUT: () => {},
  POST: () => {},
  DELETE: () => {}
};
