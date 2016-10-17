
var shell = require('../lib/shell');

module.exports = function () {
  this.Given(/^this shell script runs$/, {timeout: 100 * 1000}, shell.runShellScript);
  this.Given(/^the shell output is reset$/, shell.resetShell);

  this.Then(/^(STDERR|STDOUT) matched$/, shell.testShellResult);
};
