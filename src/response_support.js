// @flow
const _ = require('lodash');
//  $FlowFixMe
const { Cookie } = require('tough-cookie');
const { expect, AssertionError } = require('chai');
const ldMatchPattern = require('lodash-match-pattern');
const { parseStepArg } = require('./utilities');
const { get, initializeWith } = require('./universe').namespaceFactory('_cukelib');

const jsonParseOrNull = (body) => {
  try {
    return JSON.parse(body);
  } catch (err) {
    return null;
  }
};

const responseSupport = {
  initialize() {
    return initializeWith.call(this);
  },

  statusCode(targetCode: string) {
    expect(get('_request.response.statusCode')).to.equal(_.toInteger(targetCode));
  },

  matchPattern(targetPatternStr: string|Object) {
    const targetPattern = parseStepArg(targetPatternStr);
    const body = get('_request.response.body');
    const responseBody = (typeof body === 'object') ? body : jsonParseOrNull(body);
    const check = ldMatchPattern(responseBody, targetPattern);
    if (check) throw new AssertionError(check);
  },

  matchText(targetTextStr: string) {
    const targetText = parseStepArg(targetTextStr);
    const body = get('_request.response.body');
    const reMatch = targetText.match(/^\/(.*)\/([gimuy]*)$/);
    if (reMatch) {
      const re = new RegExp(reMatch[1], reMatch[2]);
      if (!re.test(body)) {
        throw new AssertionError(`expected ${body} to match regex ${targetText}`);
      }
    } else {
      expect(body).to.equal(targetText);
    }
  },

  headersMatchPattern(targetPatternStr: string|Object) {
    const targetPattern = parseStepArg(targetPatternStr);
    const headers = get('_request.response.headers');
    const check = ldMatchPattern(headers, targetPattern);
    if (check) throw new AssertionError(check);
  },

  getCookies() {
    const headers = get('_request.response.headers');
    const setCookie = headers['set-cookie'] || [];
    const cookiesArray = (setCookie instanceof Array) ? setCookie : [setCookie];
    return cookiesArray.map((cookie) => Cookie.parse(cookie).toJSON());
  },

  getCookie(key: string) {
    const found = _.find(responseSupport.getCookies(), { key });
    return found ? _.omit(found, 'key') : null;
  },

  cookiesMatchPattern(targetPatternStr: string|Object) {
    const targetPattern = parseStepArg(targetPatternStr);
    const check = ldMatchPattern(responseSupport.getCookies(), targetPattern);
    if (check) throw new AssertionError(check);
  },

  cookieMatchPattern(key: string, targetPatternStr: string|Object) {
    const targetPattern = parseStepArg(targetPatternStr);
    const check = ldMatchPattern(responseSupport.getCookie(key), targetPattern);
    if (check) throw new AssertionError(check);
  },
};

module.exports = responseSupport;
