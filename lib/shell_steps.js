var Promise = require('bluebird');
var childProcess = Promise.promisifyAll(require('child_process'), {multiArgs: true});

module.exports = function () {

  this.Given(/^this shell script runs$/, {timeout: 100 * 1000}, function (data, done) {
    var capi = this._capi;
    childProcess.exec(data, function (error, stdout, stderr) {
      capi.shellStdout += stdout;
      capi.shellStderr += stderr;
      capi.shellError = error;
      done(error)
    });
  });

  this.Given(/^the shell output is reset$/, function () {
    var capi = this._capi;
    capi.shellStdout = '';
    capi.shellStderr = '';
    capi.shellError = null;
  });

}
