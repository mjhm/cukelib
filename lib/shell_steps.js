
const shellSupport = require('./shell_support');

module.exports = function () {
  this.When(/^shell script runs$/, { timeout: 100 * 1000 }, shellSupport.runShell);
  this.When(/^shell script error is caught$/, { timeout: 100 * 1000 }, shellSupport.catchError);
  this.Given(/^reset shell output$/, shellSupport.resetShell);
  this.Then(/^(STDERR|STDOUT) equaled$/, shellSupport.resultEqual);
  this.Then(/^(STDERR|STDOUT) matched \/(.*)\/$/, shellSupport.resultRegexMatch);
  this.Then(/^(STDERR|STDOUT) matched$/, shellSupport.resultTemplateMatch);
  this.Then(/^shell error code was "([^"]*)"$/, shellSupport.resultErrorCode);
};
