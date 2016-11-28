/* eslint-disable no-unused-expressions, no-underscore-dangle */
const { expect } = require('chai');
const universe = require('../');

const { get, set, universeGet } = universe.namespaceFactory('_internal_universe_test');
const other = universe.namespaceFactory('_other_test_namespace');

module.exports = function () {
  // Test that initialization sets up namespace defaults
  universe.initialize.call(this, {
    _internal_universe_test: { myInitKey1: 'myInitValue1' },
  });
  expect(get('myInitKey1'), 'simple get from init').to.equal('myInitValue1');

  universe.initialize.call(this, {
    _internal_universe_test: {
      myInitKey1: 'anotherValue1',
      myInitKey2: 'myInitValue2',
    },
  });

  expect(get('myInitKey1'), 'previous init value was not changed').to.equal('myInitValue1');
  expect(get('myInitKey2'), 'new init value was registered').to.equal('myInitValue2');

  // The unverse functions work in the context of the "universe" outside the hooks.
  set('myUniverseKey1', 'myUniverseValue1');
  set('myDeep.key1', { myReallyDeep: 'value1' });
  expect(get('myUniverseKey1'), 'simple set/get').to.equal('myUniverseValue1');
  expect(other.get('myUniverseKey1'), 'the "other" namespace is separate').to.be.undefined;
  expect(universeGet('myUniverseKey1'), 'simple universeGet').to.equal('myUniverseValue1');

  set('myShadowKey1', 'myShadowValue1');
  set('myShadowKey2', 'myShadowValue2');

  const universeTestNS = get();
  expect(universeTestNS, 'the whole namespace').to.deep.equal({
    myInitKey1: 'myInitValue1',
    myInitKey2: 'myInitValue2',
    myUniverseKey1: 'myUniverseValue1',
    myDeep: { key1: { myReallyDeep: 'value1' } },
    myShadowKey1: 'myShadowValue1',
    myShadowKey2: 'myShadowValue2',
  });


  this.registerHandler('BeforeFeatures', function () {
    // The unverse functions are still in the context of the "universe" inside "...Features" hooks.
    set('myShadowKey1', 'alteredValue1');
    set('myShadowKey3', 'myShadowValue3');
    expect(this._internal_universe_test, 'the namespace is not copied yet').to.be.undefined;
    expect(get('myUniverseKey1'), 'simple get still works').to.equal('myUniverseValue1');
    expect(get(), 'get still returns the universe namespace').to.equal(universeTestNS);
  });


  this.Before({ tags: ['@InternalUniverseTest'] }, () => {
    // The get/set functions are now in the context of the seenario's World which was copied from
    // the universe.
    expect(get(), 'get does not return the universe').to.not.equal(universeTestNS);
    expect(get(), 'get returns a deep copy of the universe').to.deep.equal(universeTestNS);
    set('myShadowKey2', 'alteredValue2');
    set('myWorldKey1', 'myWorldValue1');
    expect(get(), 'altered world did not alter the universe').to.not.deep.equal(universeTestNS);
  });

  this.Then(/internal test of universe in the context of a world, scenario 1/, function () {
    expect(this._internal_universe_test, 'universe copied to world "this"').to.be.an.object;
    expect(get('myUniverseKey1'), 'simple get from a universe value').to.equal('myUniverseValue1');
    expect(get('myWorldKey1'), 'simple get from a world value').to.equal('myWorldValue1');
    expect(get('myShadowKey1'), 'value altered from universe context').to.equal('alteredValue1');
    expect(get('myShadowKey2'), 'value altered from world context').to.equal('alteredValue2');
    expect(get(), 'copy of universe from world "this"').to.equal(this._internal_universe_test);
    expect(universeGet(), 'access to universe from the world context').to.equal(universeTestNS);
    expect(get('myDeep.key1'), 'deep world values do not reference universe values')
      .to.not.equal(universeGet('myDeep.key1'));
    expect(get('myDeep.key1'), 'deep world values are copies of universe values')
      .to.deep.equal(universeGet('myDeep.key1'));
    set('myStepKey1', 'myStepValue1');
  });

  this.Then(/internal test of universe in the context of a world, scenario 2/, () => {
    expect(get('myUniverseKey1'), 'simple get from a universe value').to.equal('myUniverseValue1');
    expect(get('myWorldKey1'), 'simple get from a world value').to.equal('myWorldValue1');
    expect(get('myStepKey1'), 'world was rebuilt in second scenario').to.be.undefined;
  });

  this.After(() => {
    // Set this in the world context to show that it persists in the AfterFeatures.
    set('myWorldKey2', 'myWorldValue2');
  });

  this.registerHandler('AfterFeatures', () => {
    // BEWARE: The universe functions still have their last altered world values in "AfterFeatures".
    // The internal 'universe' code doesn't reset the world because that's the job of cucumberjs,
    // and it's difficult for 'universe' to guarantee the order of execution of 'After' and
    // 'AfterFeatures' hooks.
    // You need to use "universeGet" to see the untouched universe values.
    expect(get('myWorldKey2'), 'simple get from a world value').to.equal('myWorldValue2');
    expect(universeGet('myWorldKey2'), 'world value was not set in universe').to.be.undefined;
    expect(get('myUniverseKey1'), 'simple get from a universe value').to.equal('myUniverseValue1');
  });
};
