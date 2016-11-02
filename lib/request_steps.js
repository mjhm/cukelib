const requestSupport = require('./request_support');

module.exports = function () {
  this.Given(/^GET "([^"]*)"$/, requestSupport.requestGET);
  this.Given(/^PUT "([^"]*)"$/, requestSupport.requestPUT);
  this.Given(/^POST "([^"]*)"$/, requestSupport.requestPOST);
  this.Given(/^DELETE "([^"]*)"$/, requestSupport.requestDELETE);
};

//
// var requestSupport = require('./request_support');
//
// module.exports = function () {
//   this.Given(/^(GET|PUT|POST|DELETE) "([^"]*)"$/, function (method, route, dataOrDone) {
//     requestSupport[method](route, dataOrDone)
//   });
  // this.Given(/^the client (posts|puts) to "([^"]*)" with JSON$/, request.withPayload);
  // this.Given(/^the client (posts|puts) to "([^"]*)" with query string$/, request.withQueryPayload);
  // this.Given(/^the client (gets|deletes) "([^"]*)"$/, request.withoutPayload);
  //
  // this.Then(/^the response had status code "([^"]*)"$/, request.responseStatusCode);
  // this.Then(/^the response matched the pattern$/, request.responseMatchPattern);
// };
