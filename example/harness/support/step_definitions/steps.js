
var {requestSteps} = require('cucumber-api')

module.exports = function () {

  this.Given(/^(GET|PUT|POST|DELETE) "([^"]*)"$/, function (method, route, dataOrDone) {
    requestSteps[method](route, dataOrDone)
  });

}
