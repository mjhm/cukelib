/* eslint-env mocha */

const { expect } = require('chai');
const assert = require('assert');

const util = require('./step_mods');

describe('lib/util/step_mods', () => {
  describe('#throwStep', () => {
    it('returns a function', () => {
      expect(util.throwStep(() => {}, Error, '')).to.be.a('function');
    });
    it('returns a function with the same number of arguments as the original function', () => {
      const testFn = (a1, a2) => {}; // eslint-disable-line no-unused-vars
      const throwStepFn = util.throwStep(testFn, Error, '');
      expect(throwStepFn.length).to.equal(2);
    });
    it("throws an AssertionError when the original function doesn't throw", () => {
      const testFn = () => {};
      const throwStepFn = util.throwStep(testFn, Error, '');
      expect(throwStepFn).to.throw(assert.AssertionError);
    });
    it('passes when the original function throws', () => {
      const testFn = () => { throw new Error('an error message'); };
      const throwStepFn = util.throwStep(testFn, Error, '');
      expect(throwStepFn).to.not.throw();
    });
  });
});
