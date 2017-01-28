
const shellSupport = require('./shell_support');

module.exports = function () {
  shellSupport.initialize.call(this);
  this.When(/^shell runs$/, { timeout: 100 * 1000 }, shellSupport.runShell);
  this.When(/^shell runs skipping errors$/, { timeout: 100 * 1000 }, shellSupport.runSkipError);
  this.Given(/^reset shell output$/, shellSupport.resetShell);
  this.Then(/^inspect shell output$/, shellSupport.inspectShellOutput);
  this.Then(/^(STDERR|STDOUT) equaled$/, shellSupport.resultEqual);
  this.Then(/^(STDERR|STDOUT) matched \/(.*)\/$/, shellSupport.resultRegexMatch);
  this.Then(/^(STDERR|STDOUT) matched$/, shellSupport.resultTemplateMatch);
  this.Then(/^shell error code was "([^"]*)"$/, shellSupport.resultErrorCode);
};
