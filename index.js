var knex = require('knex');

var steps = {
  shell: require('./steps/shell_steps'),
  request: require('./steps/request_steps'),
  db: require('./steps/db_steps')
};

var lib = {
  shell: require('./lib/shell')
};

module.exports = {

  // This sets up configuation for steps which is globally accessible via this._capi
  config: function (options) {
    var capi = this._capi = {
      options: options
    };
    if (options.db) {
      capi.dbConnection = knex(options.db);
    }
    capi.shell = {
      STDOUT: '',
      STDERR: '',
      ERROR: null
    };
    capi.request = {};
    capi.db = {};
  },

  steps: steps,
  lib: lib

};
