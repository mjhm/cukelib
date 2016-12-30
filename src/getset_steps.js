/* eslint no-multi-spaces: "off" */

const getsetSupport = require('./getset_support');

module.exports = function () {
  getsetSupport.initialize.call(this);
  this.Given(/^"([^"]*)" is "([^"]*)"$/,       getsetSupport.setString);
  this.Given(/^"([^"]*)" is \(([^"]*)\)$/,     getsetSupport.setNumber);

  this.Then(/^"([^"]*)" was "([^"]*)"$/,       getsetSupport.equalString);
  this.Then(/^"([^"]*)" was \(([^"]*)\)$/,     getsetSupport.equalNumber);
};
