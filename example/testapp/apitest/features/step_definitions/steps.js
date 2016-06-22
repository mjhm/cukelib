// var cucumberApi = require('cucumber-api');
var exec = require('sync-exec')
var cucumberApi = require('../../../../../index.js');

resetDatabase = function() {
  exec("cp ../src/db/empty.db ../src/db/test.db")
}

populateDatabase = function() {
  exec("cp ../src/db/start.db ../src/db/test.db")
}

module.exports = function () {
  cucumberApi.steps.shell.call(this);
  cucumberApi.steps.request.call(this);
  cucumberApi.steps.db.call(this);

  var self = this;
  self.Given(/^testa$/, function () {
    console.log('testa self', self);
    console.log('testa this', this);
  });

  self.Then(/^the database is reset$/, resetDatabase);
  self.Given(/^the database is populated with sample users$/, populateDatabase)


  self.Given(/^testb$/, function () {
  });

};
