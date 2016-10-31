/* eslint no-multi-spaces: "off" */

const contextSupport = require('./context_support');

module.exports = function () {
  this.Given(/^"([^"]*)" is "([^"]*)"$/,       contextSupport.assignString);
  this.Given(/^"([^"]*)" is \(([^"]*)\)$/,     contextSupport.assignNumber);

  this.Then(/^"([^"]*)" was "([^"]*)"$/,       contextSupport.equalString);
  this.Then(/^"([^"]*)" was \(([^"]*)\)$/,     contextSupport.equalNumber);
};
