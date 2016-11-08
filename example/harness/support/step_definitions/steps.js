
const { allSteps } = require('cucumber-api');
const { initThrowSteps } = require('../../api_test_util/test_util');

module.exports = function () {
  initThrowSteps.call(this);  // only needed for testing some error conditions of cucumber-api
  allSteps.call(this);
};
