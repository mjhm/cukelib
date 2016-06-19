// var cucumberApi = require('cucumber-api');
var exec = require('sync-exec')
var cucumberApi = require('../../../../../index.js');

resetDatabase = function() {
  exec("../src/serv --reset-db")
}

module.exports = function () {
  cucumberApi.steps.shell.call(this);
  cucumberApi.steps.request.call(this);

  var self = this;
  self.Given(/^testa$/, function () {
    console.log('testa self', self);
    console.log('testa this', this);
  });

  self.Then(/^the database is reset$/, resetDatabase);


  self.Given(/^testb$/, function () {
  });

};
