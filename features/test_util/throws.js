const { initStepCreationEvents, createThrowStep } = require('../../');
// const { AssertionError } = require('chai');

module.exports = function () {
  initStepCreationEvents.call(this);
  this.cukeapiEmitter.on('givenEvent', (self, origDefineStep, re, fn) => {
    // These are for testing error conditions on the corresponding step functions.
    switch (re.source) {
      case '^"([^"]*)" is "([^"]*)"$':
      case '^"([^"]*)" is \\(([^"]*)\\)$':
        createThrowStep(
          self, origDefineStep, Error, 'expected assigment to throw', re, fn
        );
        break;
      default:
        break;
    }
  });
  this.cukeapiEmitter.on('thenEvent', (self, origDefineStep, re, fn) => {
    // These are for testing error conditions on the corresponding step functions.
    switch (re.source) {
      case '^responded with status code "([^"]*)"$':
      case '^response matched pattern$':
        createThrowStep(
          self, origDefineStep, Error, 'Expected step to throw', re, fn
        );
        break;
      default:
        break;
    }
  });
};
