// @flow
const requestSupport = require('./request_support');

module.exports = function (options: Object) {
  requestSupport.initialize.call(this, options);
  this.When(/^GET "([^"]*)"$/, requestSupport.requestGET);
  this.When(/^PUT "([^"]*)"$/, requestSupport.requestPUT);
  this.When(/^POST "([^"]*)"$/, requestSupport.requestPOST);
  this.When(/^DELETE "([^"]*)"$/, requestSupport.requestDELETE);
};
