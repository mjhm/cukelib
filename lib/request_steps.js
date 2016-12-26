// @flow
const requestSupport = require('./request_support');

module.exports = function (options: Object) {
  requestSupport.initialize.call(this, options);
  this.Given(/^GET "([^"]*)"$/, requestSupport.requestGET);
  this.Given(/^PUT "([^"]*)"$/, requestSupport.requestPUT);
  this.Given(/^POST "([^"]*)"$/, requestSupport.requestPOST);
  this.Given(/^DELETE "([^"]*)"$/, requestSupport.requestDELETE);
};
