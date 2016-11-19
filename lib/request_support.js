const _ = require('lodash');
const handlebars = require('handlebars');
const requestPromise = require('request-promise');

const { get, set } = require('./util/universe').namespaceFactory('_cucapi');

const requestCommon = (routeStr, options) => {
  const route = handlebars.compile(routeStr)(get());
  const requestOptions = _.defaults(options,
    {
      url: `http://${get('request.host')}${route}`,
      method: 'GET',
      simple: false,
      body: {},
      resolveWithFullResponse: true,
      json: true,
    }
  );
  set('request.requestOptions', requestOptions);

  const responsePromise = requestPromise(requestOptions);
  set('request.responsePromise', responsePromise);
  responsePromise.then((result) => {
    // eslint-disable-next-line no-console
    console.log('request headers', result.headers);
    // eslint-disable-next-line no-console
    console.log('request body', result.body);
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
  requestInit(config) {
    const { host } = config;
    set('request', { host });
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
