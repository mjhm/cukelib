
var request = require('../lib/request');

module.exports = function () {
  this.Given(/^the client (posts|puts) to "([^"]*)"$/, request.withPayload);
  this.Given(/^the client (gets|deletes) "([^"]*)"$/, request.withoutPayload);

  this.Then(/^the response had status code "([^"]*)"$/, request.responseStatusCode);
  this.Then(/^the response matched the pattern$/, request.responseMatchPattern);
};
