// var cucumberApi = require('cucumber-api');
var cucumberApi = require('../../../../../index.js');

module.exports = function () {
  cucumberApi.shellSteps.call(this)

  var self = this;
  self.Given(/^testa$/, function () {
    console.log('testa self', self);
    console.log('testa this', this);
  });


  self.Given(/^testb$/, function () {
  });

};
