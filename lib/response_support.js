const _ = require('lodash');
const { expect } = require('chai');
const ldMatchPattern = require('lodash-match-pattern');

const { get } = require('./util/universe').namespaceFactory('_cucapi');

const jsonParseOrNull = (body) => {
  try {
    return JSON.parse(body);
  } catch (err) {
    return null;
  }
};

module.exports = {
  statusCode(targetCode) {
    return get('request.responsePromise').then(
      ({ statusCode }) => expect(statusCode).to.equal(_.toInteger(targetCode))
    );
  },

  matchPattern(targetPattern) {
    return get('request.responsePromise')
    .then(
      ({ body }) => {
        const responseBody = (typeof body === 'object') ? body : jsonParseOrNull(body);
        const check = ldMatchPattern(responseBody, targetPattern);
        if (check) throw new Error(check);
      }
    );
  },
};
