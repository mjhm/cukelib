var steps = {
  shell: require('./steps/shell_steps'),
  request: require('./steps/request_steps')
};

var lib = {
  shell: require('./lib/shell')
};

module.exports = {

  config: function (options) {
    var capi = this._capi = {
      options: options
    }
    capi.shell = {
      STDOUT: '',
      STDERR: '',
      ERROR: null
    };
    capi.request = {};
  },

  steps: steps,
  lib: lib

};
