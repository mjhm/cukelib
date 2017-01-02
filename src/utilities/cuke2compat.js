// Boilerplate code that upgrades a cucumber@1.x file to cucumber@2.x
// Put the following line at the end of a step file:
// require('../utilities/cuke2compat')(module.exports);
//
// It can also be used to upgrade a cucumber@1.x tag array to an appropriate tag string. Example:
// const cuke2compat = require('cuke2compat')
// ...
// this.Before(cuke2compat(['tag1', tag2], doThisBeforeHook);
//
const _ = require('lodash');
const cucumber = require('cucumber');

module.exports = function (modexp) {
  if (cucumber.defineSupportCode) {
    if (_.isFunction(modexp)) {
      cucumber.defineSupportCode((context) => {
        modexp.call(context);
      });
    }
    if (_.isArray(modexp)) {
      return modexp.join(' or ');
    }
  }
  return modexp;
};
