/* eslint import/no-unresolved: off */
const { hooks } = require('../../');
const path = require('path');

module.exports = function () {
  hooks.initCucumberApi.call(this);
  hooks.requestInit.call(this, { host: 'localhost:3000' });
  this.registerHandler('BeforeFeatures', function () {
    hooks.initKnexDatabase({
      migrations: {
        directory: path.join(__dirname, '../test_util/migrations'),
      },
      useNullAsDefault: true,
    });
    return hooks.spawnServer.call(this, { host: 'localhost:3000' });
  });
};
