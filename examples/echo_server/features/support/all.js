
const childService = require('../../../../lib/child_service');

module.exports = function () {
  childService.initialize.call(this);
  this.Before(() => {
  });
};

const cucumber = require('cucumber');

if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    module.exports.call(context);
  });
}
