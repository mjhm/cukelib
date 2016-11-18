const responseSupport = require('./response_support');

module.exports = function () {
  this.Then(/^responded with status code "([^"]*)"$/, responseSupport.statusCode);
  this.Then(/^response matched pattern$/, responseSupport.matchPattern);
};
