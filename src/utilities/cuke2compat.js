// Boilerplate code that upgrades a cucumber@1.x file to cucumber@2.x
// Put the following line at the end of a step file:
// require('../utilities/cuke2compat')(module.exports);

const cucumber = require('cucumber');

module.exports = function (modexp) {
  if (cucumber.defineSupportCode) {
    cucumber.defineSupportCode((context) => {
      modexp.call(context);
    });
  }
};
