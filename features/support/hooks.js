/* eslint import/no-unresolved: off */
const { hooks } = require('../../');

module.exports = function () {
  hooks.initCucumberApi.call(this);
  hooks.requestInit.call(this, { host: 'localhost:3000' });
  this.registerHandler('BeforeFeatures', function () {
    return hooks.spawnServer.call(this, { host: 'localhost:3000' });
  });
};
