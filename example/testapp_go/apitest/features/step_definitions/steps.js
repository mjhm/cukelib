var exec = require('sync-exec')
// var cucumberApi = require('cucumber-api');
var cucumberApi = require('../../../../../index.js');

var resetDatabase = function() {
  exec("cp ../src/db/empty.db ../src/db/test.db")
}

var populateDatabase = function() {
  exec("cp ../src/db/start.db ../src/db/test.db")
}

module.exports = function () {
  cucumberApi.steps.shell.call(this);
  cucumberApi.steps.request.call(this);
  cucumberApi.steps.db.call(this);

  this.Then(/^the database is reset$/, resetDatabase);
  this.Given(/^the database is populated with sample users$/, populateDatabase)
};
