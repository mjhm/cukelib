/* eslint no-multi-spaces: "off" */

const getsetSupport = require('./getset_support');

module.exports = function () {
  this.Given(/^"([^"]*)" is "([^"]*)"$/,       getsetSupport.setString);
  this.Given(/^"([^"]*)" is \(([^"]*)\)$/,     getsetSupport.setNumber);

  this.Then(/^"([^"]*)" was "([^"]*)"$/,       getsetSupport.equalString);
  this.Then(/^"([^"]*)" was \(([^"]*)\)$/,     getsetSupport.equalNumber);
};
