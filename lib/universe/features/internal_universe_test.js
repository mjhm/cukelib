/* eslint-disable no-unused-expressions, no-underscore-dangle */
// @flow
const { expect } = require('chai');
const universe = require('../');

const { get, set, unset, universeGet, getCukeContext } =
  universe.namespaceFactory('_internal_universe_test');
const other = universe.namespaceFactory('_other_test_namespace');

module.exports = function () {
  // Test that initialization sets up namespace defaults
  // universe.initialize.call(this, {
  //   _internal_universe_test: { myInitKey1: 'myInitValue1' },
  // });
  universe.initialize.call(this);
  expect(getCukeContext()).to.equal('universe');
  // expect(get('myInitKey1'), 'simple get from init').to.equal('myInitValue1');

  // universe.initialize.call(this, {
  //   _internal_universe_test: {
  //     // myInitKey1: 'anotherValue1',
  //     myInitKey2: 'myInitValue2',
  //   },
  // });

  // expect(get('myInitKey1'), 'previous init value was not changed').to.equal('myInitValue1');
  // expect(get('myInitKey2'), 'new init value was registered').to.equal('myInitValue2');

  // The unverse functions work in the cukeContext of the "universe" outside the hooks.
  set('myUniverseKey1', 'myUniverseValue1');
  set('myDeep.key1', { myReallyDeep: 'value1' });
  expect(get('myUniverseKey1'), 'simple set/get').to.equal('myUniverseValue1');
  expect(other.get('myUniverseKey1'), 'the "other" namespace is separate').to.be.undefined;
  expect(universeGet('myUniverseKey1'), 'simple universeGet').to.equal('myUniverseValue1');

  set('myKeyToUnset1', 'myValueToUnset1');
  unset('myKeyToUnset1');
  expect(get('myKeyToUnset1'), 'simple set/unset').to.be.undefined;

  set('myShadowKey1', 'myShadowValue1');
  set('myShadowKey2', 'myShadowValue2');
  set('myShadowKeyToUnset1', 'myShadowValueToUnset1');

  const universeTestNS = get();
  // console.log('universeTestNS', universeTestNS);
  expect(universeTestNS, 'the whole namespace').to.deep.equal({
    _verbose: false,
    _reserved: { _reserved: true, _verbose: true },
    // myInitKey1: 'myInitValue1',
    // myInitKey2: 'myInitValue2',
    myUniverseKey1: 'myUniverseValue1',
    myDeep: { key1: { myReallyDeep: 'value1' } },
    myShadowKey1: 'myShadowValue1',
    myShadowKey2: 'myShadowValue2',
    myShadowKeyToUnset1: 'myShadowValueToUnset1',
  });


  this.registerHandler('BeforeFeatures', function () {
    // The unverse functions are still in the cukeContext of the "universe" in "...Features" hooks.
    expect(getCukeContext()).to.equal('universe');
    set('myShadowKey1', 'alteredValue1');
    set('myShadowKey3', 'myShadowValue3');
    expect(this._internal_universe_test, 'the namespace is not copied yet').to.be.undefined;
    expect(get('myUniverseKey1'), 'simple get still works').to.equal('myUniverseValue1');
    expect(get(), 'get still returns the universe namespace').to.equal(universeTestNS);
  });

  this.registerHandler('BeforeFeature', () => expect(getCukeContext()).to.equal('feature'));

  this.Before({ tags: ['@InternalUniverseTest'] }, () => {
    // The get/set functions are now in the cukeContext of the seenario which was copied
    // from the universe.
    expect(getCukeContext()).to.equal('scenario');
    expect(get(), 'get does not return the universe').to.not.equal(universeTestNS);
    expect(get(), 'get returns a deep copy of the universe').to.deep.equal(universeTestNS);
    set('myShadowKey2', 'alteredValue2');
    set('myScenarioKey1', 'myScenarioValue1');
    expect(get(), 'altered scenario did not alter the universe').to.not.deep.equal(universeTestNS);
  });

  this.Then(/internal test of universe in the cukeContext of scenario 1/, function () {
    expect(getCukeContext()).to.equal('scenario');
    expect(this._internal_universe_test, 'universe copied to scenario').to.be.an.object;
    expect(get('myUniverseKey1'), 'simple get from a universe value').to.equal('myUniverseValue1');
    expect(get('myScenarioKey1'), 'simple get from a scenario value').to.equal('myScenarioValue1');
    expect(get('myShadowKey1'), 'value altered from universe cukeContext')
      .to.equal('alteredValue1');
    expect(get('myShadowKey2'), 'value altered from scenario cukeContext')
      .to.equal('alteredValue2');
    expect(universeGet(), 'access to universe from the scenario cukeContext')
      .to.equal(universeTestNS);
    expect(get('myDeep.key1'), 'deep scenario values reference universe values')
      .to.equal(universeGet('myDeep.key1'));
    set('myStepKey1', 'myStepValue1');

    unset('myShadowKeyToUnset1');
    expect(get('myShadowKeyToUnset1'), 'unsets in scenario cukeContext').to.be.undefined;
    expect(universeGet('myShadowKeyToUnset1'), 'still set in universe cukeContext')
      .to.equal('myShadowValueToUnset1');
  });

  this.Then(/internal test of universe in the cukeContext of scenario 2/, () => {
    expect(get('myUniverseKey1'), 'simple get from a universe value').to.equal('myUniverseValue1');
    expect(get('myScenarioKey1'), 'simple get from a scenario value').to.equal('myScenarioValue1');
    expect(get('myStepKey1'), 'scenario was rebuilt in second scenario').to.be.undefined;
  });

  this.After(() => {
    // Set this in the scenario cukeContext to show that it persists in the AfterFeatures.
    expect(getCukeContext()).to.equal('scenario');
    set('myScenarioKey2', 'myScenarioValue2');
  });

  this.registerHandler('AfterFeatures', () => {
    // BEWARE: "get" functions may return their last altered scenario values in "AfterFeatures".
    // You should to use "universeGet" to see the untouched universe values.
    expect(getCukeContext()).to.equal('scenario');
    expect(universeGet('myScenarioKey2'), 'scenario value was not set in universe').to.be.undefined;
    expect(get('myUniverseKey1'), 'simple get from a universe value').to.equal('myUniverseValue1');
  });
};
