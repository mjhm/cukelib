// @flow
const _ = require('lodash');
const { expect, AssertionError } = require('chai');
const ldMatchPattern = require('lodash-match-pattern');
const { parseStepArg } = require('./utilities');
const { get, initializeWith } = require('./universe').namespaceFactory('_cukeserv');

const jsonParseOrNull = (body) => {
  try {
    return JSON.parse(body);
  } catch (err) {
    return null;
  }
};

module.exports = {
  initialize() {
    return initializeWith.call(this);
  },

  statusCode(targetCode: string) {
    return get('_request.responsePromise').then(
      ({ statusCode }) => expect(statusCode).to.equal(_.toInteger(targetCode))
    );
  },

  matchPattern(targetPatternStr: string|Object) {
    const targetPattern = parseStepArg(targetPatternStr);
    return get('_request.responsePromise')
    .then(
      ({ body }) => {
        const responseBody = (typeof body === 'object') ? body : jsonParseOrNull(body);
        const check = ldMatchPattern(responseBody, targetPattern);
        if (check) throw new AssertionError(check);
      }
    );
  },
};
