const { initStepCreationEvents, createThrowStep } = require('cucumber-api');

module.exports = {
  initThrowSteps() {
    initStepCreationEvents.call(this);
    this.cucapiEmitter.on('givenEvent', (self, origDefineStep, re, fn) => {
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
  },
};
