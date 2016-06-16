// var cucumberApi = require('cucumber-api');
var cucumberApi = require('../../../../../index.js');

module.exports = function () {

  var self = this;

  this.Before( function () {
    cucumberApi.config.call(this, {
      serverRoot: 'https://www.googleapis.com/youtube/v3'
    });
    this.here = 'HERE3';
  });

};
