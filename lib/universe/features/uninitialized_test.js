/* eslint-disable no-unused-expressions, no-underscore-dangle */
// @flow
const cucumber = require('cucumber');
const universe = require('../');
const { withThrowSteps } = require('../../step_mods');

const { set } = universe.namespaceFactory('_internal_universe_test');


const uninitializedTest = function () {
  withThrowSteps.call(this, () => {
    // The line below is missing which causes an error when the step is called
    // universe.initialize.call(this);
    this.Then(/^simple universe set$/, () => {
      set('myThenKey1', 'myThenValue1');
    });
  });
};

if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    uninitializedTest.call(context);
  });
}


module.exports = uninitializedTest;
