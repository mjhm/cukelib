/**
 * requestSupport
 * @module requestSupport
 */
// @flow
const _ = require('lodash');
const yaml = require('js-yaml');
const handlebars = require('handlebars');
const requestPromise = require('request-promise');
const { parseStepArg } = require('./utilities');
const { get, set, unset,
  log, log3, initializeWith } = require('./universe').namespaceFactory('_cukelib');

const requestCommon = (routeStr, options) => {
  // combine options
  const requestOptions = _.defaults({}, options, get('_request.defaultOptions'));
  // construct URL
  const url = handlebars.compile(`${requestOptions.host}/${routeStr.replace(/^\//, '')}`)(get());
  requestOptions.url = url;
  delete requestOptions.host;
  // get cookie jar
  if (requestOptions.jar) {
    requestOptions.jar = get('_requestCookieJar') ||
      set('_requestCookieJar', requestPromise.jar());
  }
  // send request, log everything, capture response
  set('_requestOptions', requestOptions);
  log3('log3', 'requestOptions', requestOptions);
  const responsePromise = requestPromise(requestOptions);
  set('_requestResponsePromise', responsePromise);
  return responsePromise.then((result) => {
    log('response headers', result.headers);
    log('response body', result.body);
    unset('_requestResponsePromise');
    set('_request.response', result);
    return responsePromise;
  })
  .catch((err) => {
    log('err', err);
    return responsePromise;
  });
};

const parseYamlBody = (bodyStr) => {
  if (_.isPlainObject(bodyStr)) return bodyStr;
  if (!_.isString(bodyStr)) {
    throw new Error(`expected a string, but got ${bodyStr}`);
  }
  try {
    return yaml.safeLoad(bodyStr);
  } catch (err) {
    err.message += ' Error parsing:\n' + bodyStr; // eslint-disable-line prefer-template
    throw err;
  }
};


module.exports = {

  /**
   * Initializes the "request" defaults. Should be called in a context which
   * contains the CucumberJS methods (`Given`, `Then`, `Before`, etc.)
   *
   * @example
   * requestSupport.initialize.call(this, options);
   *
   * @param {object} [options={}] merged with
   *   Merged with [standard defaults](request_support.js.html#sunlight-1-line-67)
   *   to set request defaultOptions
   *
   * @returns undefined
   */
  initialize(options: Object = {}) {
    initializeWith.call(this, {
      _request: {
        defaultOptions: _.defaults({}, options, {
          host: 'http://localhost:3000',
          method: 'GET',
          simple: false,
          body: {},
          resolveWithFullResponse: true,
          json: true,
          jar: true,
        }),
      },
    });
  },


  /**
   * requestGET - Description
   *
   * @param {string}   routeStr     Description
   * @param {object} [options={}] Description
   *
   * @returns {type} Description
   */
  requestGET(routeStr: string, options: Object = {}) {
    return requestCommon(
      routeStr,
      _.assign({ method: 'GET' }, options)
    );
  },

  requestPUT(routeStr: string, bodyStr: string|Object, options: Object = {}) {
    const done = (typeof bodyStr === 'function') ? bodyStr : null;
    const responsePromise = requestCommon(
      routeStr,
      _.assign({ method: 'PUT', body: done ? {} : parseYamlBody(parseStepArg(bodyStr)) }, options)
    );
    if (done) {
      responsePromise.asCallback(done);
      return null;
    }
    return responsePromise;
  },

  requestDELETE(routeStr: string, options: Object = {}) {
    return requestCommon(
      routeStr,
      _.assign({ method: 'DELETE' }, options)
    );
  },

  /**
   * Executes POST request to given `routeStr`
   *
   * `bodyStr`
   *  - as a string will be interpreted as JSON and passed to the request.
   *  - as an object with a `raw` property it is interpreted as a single tow cucumber table.
   * The table contents are merged, interpreted as JSON and passed to the request.
   *  - as a plainObject it is passsed directly to the request.
   *  - as a function it is assumed to be a `done` callback and an empty body is sent to the request
   *
   * @param {string}   routeStr
   * @param {string|object|function}   bodyStr
   * @param {object} [options={}] Overides to the request defaults.
   *
   * @returns {Promise|null} Response promise from `request` or `null` for callback style calls.
   */
  requestPOST(routeStr: string, bodyStr: string|Object, options: Object = {}) {
    const done = (typeof bodyStr === 'function') ? bodyStr : null;
    const responsePromise = requestCommon(
      routeStr,
      _.assign({ method: 'POST', body: done ? {} : parseYamlBody(parseStepArg(bodyStr)) }, options)
    );
    if (done) {
      responsePromise.asCallback(done);
      return null;
    }
    return responsePromise;
  },
};
