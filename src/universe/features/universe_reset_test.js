/* eslint-disable no-unused-expressions, no-underscore-dangle */
// @flow
const cucumber = require('cucumber');
const { expect } = require('chai');
const universe = require('../');

const { get, set, initializeWith } = universe.namespaceFactory('_internal_universe_test');

const universeResetTest = function () {
  initializeWith.call(this);
  set('myUniverseKey1', 'myUniverseValue1');
  this.Then(/simple universe reset setup/, () => {
    set('myThenKey1', 'myThenValue1');
  });

  this.Then(/simple universe reset test/, () => {
    expect(get('myThenKey1')).to.be.undefined;
  });
};


if (cucumber.defineSupportCode) {
  cucumber.defineSupportCode((context) => {
    universeResetTest.call(context);
  });
}


module.exports = universeResetTest;
