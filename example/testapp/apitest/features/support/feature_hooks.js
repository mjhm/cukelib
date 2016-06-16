
var cucumberApi = require('cucumber-api');

module.exports = function () {
  var self = this;

  this.registerHandler('BeforeFeatures', function (event, done) {
    /* Start application and database here */
    done()
  });


  this.registerHandler('AfterFeatures', function (event, done) {
    /* Stop application and db teardown here */
    done()
  });
};
