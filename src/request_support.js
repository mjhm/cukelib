// @flow
const _ = require('lodash');
const yaml = require('js-yaml');
const handlebars = require('handlebars');
const requestPromise = require('request-promise');
const { parseStepArg } = require('./utilities');
const { get, set, log, log3, initializeWith } = require('./universe').namespaceFactory('_cukeserv');

const requestCommon = (routeStr, options) => {
  const combinedOptions = _.defaults(options, get('_request.defaultOptions'));
  const url = handlebars.compile(`${combinedOptions.host}/${routeStr}`)(get());
  const requestOptions = _.defaults({ url }, _.omit(combinedOptions, 'host'));
  set('_request.requestOptions', requestOptions);
  log3('log3', 'requestOptions', requestOptions);
  const responsePromise = requestPromise(requestOptions);
  set('_request.responsePromise', responsePromise);
  responsePromise.then((result) => {
    log('request headers', result.headers);
    log('request body', result.body);
  })
  .catch((err) => {
    log('err', err);
  });
  return responsePromise;
};

const parseYamlBody = (bodyStr) => {
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
        }),
      },
    });
  },

  requestGET(routeStr: string, options: Object = {}) {
    return requestCommon(
      routeStr,
      _.assign({ method: 'GET' }, options)
    );
  },

  requestPUT(routeStr: string, bodyStr: string|Object, options: Object = {}) {
    return requestCommon(
      routeStr,
      _.assign({ method: 'PUT', body: parseYamlBody(parseStepArg(bodyStr)) }, options)
    );
  },

  requestDELETE(routeStr: string, options: Object = {}) {
    return requestCommon(
      routeStr,
      _.assign({ method: 'DELETE' }, options)
    );
  },

  requestPOST(routeStr: string, bodyStr: string|Object, options: Object = {}) {
    return requestCommon(
      routeStr,
      _.assign({ method: 'POST', body: parseYamlBody(parseStepArg(bodyStr)) }, options)
    );
  },
};
