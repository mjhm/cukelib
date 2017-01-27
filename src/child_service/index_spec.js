/* eslint-env mocha */
/* eslint no-unused-expressions: "off" */
/* eslint import/no-extraneous-dependencies: "off" */
/* eslint no-underscore-dangle: "off" */

const rewire = require('rewire');
const { expect } = require('chai');
const EventEmitter = require('events');

const childService = rewire('./');

const promiseToResolveOnMatch = childService.__get__('promiseToResolveOnMatch');

describe('child_service', () => {
  beforeEach(() => {
    this.mockStream = new EventEmitter();
  });
  describe('promiseToResolveOnMatch', () => {
    it('resolves when the stream data matches', () => {
      const testPromise = promiseToResolveOnMatch(this.mockStream, /a test string/);
      expect(testPromise.isPending()).to.be.true;
      this.mockStream.emit('data', 'not test string');
      expect(testPromise.isPending()).to.be.true;
      this.mockStream.emit('data', 'a test string');
      expect(testPromise.isFulfilled()).to.be.true;
    });
  });
});
