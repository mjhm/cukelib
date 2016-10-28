
const {
  diagnosticSteps,
  contextSteps,
  shellSteps,
  requestSteps,
} = require('cucumber-api');

module.exports = function () {
  diagnosticSteps.call(this);
  contextSteps.call(this);
  shellSteps.call(this);
  requestSteps.call(this);
};
