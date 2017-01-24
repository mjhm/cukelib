/* eslint-env mocha */
/* eslint no-unused-expressions: "off" */

// @flow
const utilities = require('./');
const { expect } = require('chai');

const { set, initializeWith } = require('../universe').namespaceFactory('_cukelib');

const stubCukeEnv = {
  World: {},
  Given() {},
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

    it('passes through a dataTable object with more than one row', () => {
      const dtObj = { raw: () => [['abc'], ['def']] };
      expect(utilities.parseStepArg.bind(utilities, dtObj)).to.throw;
    });

    it('merges multiple columns', () => {
      const dtObj = { raw: () => [['abc', 'def']] };
      const parsed = utilities.parseStepArg(dtObj);
      expect(parsed).to.equal('abc|def');
    });

    it('extracts a solo data table element', () => {
      const dtObj = { raw: () => [['abc']] };
      const parsed = utilities.parseStepArg(dtObj);
      expect(parsed).to.equal('abc');
    });

    it('passes through an unrecognized object', () => {
      const dtObj = { whatever: [['abc', 'def']] };
      const parsed = utilities.parseStepArg(dtObj);
      expect(parsed).to.equal(dtObj);
    });

    it('fills solo data table template element with universe values', () => {
      const dtObj = { raw: () => [['abc {{my.template.key}} def']] };
      set('my.template.key', 'myTemplateVal');
      const parsed = utilities.parseStepArg(dtObj);
      expect(parsed).to.equal('abc myTemplateVal def');
    });
  });
});
