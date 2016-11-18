const requestSupport = require('./request_support');

module.exports = function () {
  this.Given(/^GET "([^"]*)"$/, requestSupport.requestGET);
  this.Given(/^PUT "([^"]*)"$/, requestSupport.requestPUT);
  this.Given(/^POST "([^"]*)"$/, requestSupport.requestPOST);
  this.Given(/^DELETE "([^"]*)"$/, requestSupport.requestDELETE);
};
