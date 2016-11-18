const handlebars = require('handlebars');
const requestPromise = require('request-promise');

const { get, set } = require('./util/universe').namespaceFactory('_cucapi');

module.exports = {
  requestInit(config) {
    const { host } = config;
    set('request', { host });
  },

  requestGET(routeStr) {
    const route = handlebars.compile(routeStr)(this);

    const requestOptions = {
      url: `http://${get('request.host')}${route}`,
      method: 'GET',
      simple: false,
      body: { a: 1, b: 2 },
      resolveWithFullResponse: true,
      json: true,
    };
    set('request.requestOptions', requestOptions);

    const reqPromise = requestPromise(requestOptions);
    set('request.requestPromise', reqPromise);
    reqPromise.then((result) => {
      // eslint-disable-next-line no-console
      console.log('request headers', result.headers);
      // eslint-disable-next-line no-console
      console.log('request headers', result.body);
    });
    return reqPromise;
  },

  resetRequest() {
    set('request', {});
  },
};
