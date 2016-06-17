var Promise = require('bluebird');
var childProcess = Promise.promisifyAll(require('child_process'), {multiArgs: true});
var expect = require('chai').expect;

module.exports = {
  runShellScript: function (data, done) {
    var shell = this._capi.shell;
    childProcess.exec(data, function (error, stdout, stderr) {
      shell.STDOUT += stdout;
      shell.STDERR += stderr;
      shell.ERROR = error;
      done(error)
    });
  },

  resetShell: function () {
    this._capi.shell = {
      STDOUT: '',
      STDERR: '',
      ERROR: null
    };
  },

  testShellResult: function (stream, data) {
    if (/^\/.*\/$/.test(data)) {
      var re = new RegExp(data.slice(1,-1));
      expect(this._capi.shell[stream].trim()).to.match(re);
    } else {
      expect(this._capi.shell[stream].trim()).to.equal(data);
    }
  }
};
