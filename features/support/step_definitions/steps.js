
const { allSteps } = require('../../../');
const { initThrowSteps } = require('../../test_util');

module.exports = function () {
  initThrowSteps.call(this);  // only needed for testing some error conditions of cucumber-api
  allSteps.call(this);
};
