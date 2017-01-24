// @flow
const responseSupport = require('./response_support');

module.exports = function () {
  responseSupport.initialize.call(this);
  this.Then(/^responded with status code (\d+)$/, responseSupport.statusCode);
  this.Then(/^response matched pattern$/, responseSupport.matchPattern);
  this.Then(/^response matched text$/, responseSupport.matchText);
  this.Then(/^response headers matched pattern$/, responseSupport.headersMatchPattern);
  this.Then(/^response cookies matched pattern$/, responseSupport.cookiesMatchPattern);
  this.Then(/^response cookie "([^"]+)" matched pattern$/, responseSupport.cookieMatchPattern);
};
