/* eslint-env mocha */
// @flow
const utilities = require('./');
const { expect } = require('chai');

const { initializeWith } = require('../universe').namespaceFactory('_utilities_test');


const stubCukeEnv = {
  World: {},
  registerHandler() {},
  Before() {},
  After() {},
};

describe('lib/utilities', () => {
  beforeEach(() => {
    initializeWith.call(stubCukeEnv);
  });
  describe('parseStepArg', () => {
    it('passes through a trivial string', () => {
      const parsed = utilities.parseStepArg('abc');
      expect(parsed).to.equal('abc');
    });
  });
});
