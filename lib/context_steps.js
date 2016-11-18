/* eslint no-multi-spaces: "off" */

const contextSupport = require('./context_support');

module.exports = function () {
  this.Given(/^"([^"]*)" is "([^"]*)"$/,       contextSupport.set);
  this.Given(/^"([^"]*)" is \(([^"]*)\)$/,     contextSupport.setNumber);

  this.Then(/^"([^"]*)" was "([^"]*)"$/,       contextSupport.equalString);
  this.Then(/^"([^"]*)" was \(([^"]*)\)$/,     contextSupport.equalNumber);
};
