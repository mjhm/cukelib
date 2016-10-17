
var {requestHandlers} = require('./step_handlers')

module.exports = function () {
  this.Given(/^(GET|PUT|POST|DELETE) "([^"]*)"$/, (method, route, dataOrDone) => {
    requestHandlers[method].call(this, route, dataOrDone)
  });
};
