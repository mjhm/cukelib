const _ = require('lodash');
const handlebars = require('handlebars');
const requestPromise = require('request-promise');

const { get, set, log, initializeWith } = require('./universe').namespaceFactory('_cucapi');

const requestCommon = (routeStr, options) => {
  const combinedOptions = _.defaults(options, get('request.defaultOptions'));
  const url = handlebars.compile(`${combinedOptions.host}routeStr`)(get());
  const requestOptions = _.defaults({ url }, _.omit(combinedOptions, 'host'));
  set('request.requestOptions', requestOptions);

  const responsePromise = requestPromise(requestOptions);
  set('request.responsePromise', responsePromise);
  responsePromise.then((result) => {
    log('request headers', result.headers);
    log('request body', result.body);
  });
  return responsePromise;
};

const parseJsonBody = (bodyStr) => {
  if (!_.isString(bodyStr)) {
    throw new Error(`expected a string, but got ${bodyStr}`);
  }
  try {
    return JSON.parse(bodyStr);
  } catch (err) {
    err.message += ' Error parsing:\n' + bodyStr; // eslint-disable-line prefer-template
    throw err;
  }
};


module.exports = {
  initialize(options) {
    initializeWith({
      request: {
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

  requestGET(routeStr, options = {}) {
    return requestCommon(
      routeStr,
      _.assign({ method: 'GET' }, options)
    );
  },

  requestPUT(routeStr, bodyStr, options = {}) {
    return requestCommon(
      routeStr,
      _.assign({ method: 'PUT', body: parseJsonBody(bodyStr) }, options)
    );
  },

  requestDELETE(routeStr, options = {}) {
    return requestCommon(
      routeStr,
      _.assign({ method: 'DELETE' }, options)
    );
  },

  requestPOST(routeStr, bodyStr, options = {}) {
    return requestCommon(
      routeStr,
      _.assign({ method: 'POST', body: parseJsonBody(bodyStr) }, options)
    );
  },


};
