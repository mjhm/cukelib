/* eslint-disable no-unused-expressions, no-underscore-dangle */
// @flow
const { expect } = require('chai');
const universe = require('../');

const { get, set } = universe.namespaceFactory('_internal_universe_test');

module.exports = function () {
  universe.initialize.call(this);
  set('myUniverseKey1', 'myUniverseValue1');
  this.Then(/simple universe reset setup/, () => {
    set('myThenKey1', 'myThenValue1');
  });

  this.Then(/simple universe reset test/, () => {
    expect(get('myThenKey1')).to.be.undefined;
  });
};
