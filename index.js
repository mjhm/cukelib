
var shellSteps = require('./lib/shell_steps.js');

module.exports = {

  config: function (options) {
    var capi = this._capi = options;
    capi.shellStdout = '';
    capi.shellStderr = '';
    capi.shellError = null;
  },

  shellSteps: shellSteps

};
