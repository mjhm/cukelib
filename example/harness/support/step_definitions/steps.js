
var {requestSteps} = require('cucumber-api')

module.exports = function () {
  this.Given(/this is a step/, () => {
    console.log('HELLO STEP');
  });
  requestSteps.call(this);
}
