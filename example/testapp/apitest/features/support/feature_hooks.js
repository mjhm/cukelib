
var cucumberApi = require('cucumber-api');
var Promise = require('bluebird');
var childProcess = Promise.promisifyAll(require('child_process'), {multiArgs: true});

module.exports = function () {
  var self = this;

  this.registerHandler('BeforeFeatures', function (event, done) {
    childProcess.exec("../src/serv")
    /* Start application and database here */
    done()
  });


  this.registerHandler('AfterFeatures', function (event, done) {
    /* Stop application and db teardown here */
    childProcess.exec("killall serv")
    done()
  });
};
