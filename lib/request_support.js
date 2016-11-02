const _ = require('lodash');
const handlebars = require('handlebars');
const request = require('request-promise');

module.exports = {
  requestGET(routeStr) {
    const route = handlebars.compile(routeStr)(this.World);
    console.log(route);

    this._cucapi.request.requestOptions = {
      url: `${this._cucapi.request.serverHost}/${route}`,
      method: 'GET',
      simple: false,
      resolveWithFullResponse: true,
      json: true,
    };
    this._cucapi.request.requestPromise = request(this._cucapi.request.requestOptions);
  },

  resetRequest() {
    this._cucapi.request = {};
  },
};
