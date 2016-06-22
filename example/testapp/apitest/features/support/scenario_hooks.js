// var cucumberApi = require('cucumber-api');
var cucumberApi = require('../../../../../index.js');
var path = require('path');

module.exports = function () {

  var self = this;

  this.Before( function () {
    cucumberApi.config.call(this, {
      serverRoot: 'http://localhost:8080',
      db: {
        client: 'sqlite3',
        connection: {
          filename: path.join(__dirname, '/../../../src/db/test.db')
        }
      }
    });
  });

};
