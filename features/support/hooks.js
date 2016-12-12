/* eslint import/no-unresolved: off */
const { hooks, contextSet } = require('../../');
const path = require('path');
const requestSupport = require('request_support');

module.exports = function () {
  hooks.initCucumberApi.call(this);
  requestSupport.initialize();
  // contextSet('currentRequestHost', 'localhost:3000');
  contextSet('currentDatabase', 'myFriendsDB');
  this.registerHandler('BeforeFeatures', function () {
    hooks.initKnexDatabase({
      name: 'myFriendsDB',
      migrations: {
        directory: path.join(__dirname, '../test_util/migrations'),
      },
      seeds: {
        directory: path.join(__dirname, '../test_util/seeds'),
      },
      useNullAsDefault: true,
    });
    return hooks.spawnServer.call(this, { host: 'localhost:3000' });
  });
};
